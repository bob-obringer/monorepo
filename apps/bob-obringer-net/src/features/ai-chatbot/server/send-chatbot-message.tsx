"use server";

import "server-only";

import {
  getResumeCompanies,
  ResumeCompany,
} from "@/features/sanity-io/queries/resume-company";
import { getDocument } from "@/services/sanity-io/get-document";
import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import { addUserMessage } from "@/features/ai-chatbot/server/chatbot-ai-state-helpers";
import {
  getFormattedJobs,
  getFormattedSkills,
  getRelevantCompanyHighlights,
  getSystemPrompt,
} from "@/features/ai-chatbot/server/chatbot-system-prompt";
import { Models, models } from "@/services/llms";
import { nanoid } from "ai";
import {
  ChatbotVercelAIContext,
  RagStatus,
  SendChatbotMessageResponse,
} from "@/features/ai-chatbot/types";
import { parseMarkdown } from "@/helpers/markdown/parse-markdown";
import { z } from "zod";
import { ResumeCard, ResumeLinkCard } from "@/features/resume/resume-card";
import { getAllContactInfo } from "@/features/sanity-io/queries/contact-info";
import { ContactCard } from "@/features/contacts/contact-card";

export async function sendChatbotMessage(
  message: string,
): Promise<SendChatbotMessageResponse | null> {
  console.log("starting");
  console.time("sendChatbotMessage");

  const aiState = getMutableAIState<ChatbotVercelAIContext>();
  console.timeLog("sendChatbotMessage", "got aiState");
  addUserMessage(aiState, message);
  console.timeLog("sendChatbotMessage", "added user message");

  let promptJobs: string | null = null;
  let promptSkills: string | null = null;
  let promptBio: string | null = null;
  let resumeCompanies: Array<ResumeCompany> = [];
  let promptInstructions: string | null = null;
  let model: Models = models.gpt35Turbo;

  // let {
  //   promptJobs,
  //   promptSkills,
  //   promptBio,
  //   resumeCompanies,
  //   promptInstructions,
  // } = {}; //aiState.get().context || {};

  const streamEventCount = createStreamableValue(0);
  const ragStatus = createStreamableValue<RagStatus>("retrieving");

  console.timeLog("sendChatbotMessage", "created streamable values");

  const promises: Array<Promise<void>> = [];

  function closeAIState(content: string) {
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: "assistant",
          content,
        },
      ],
      // context: {
      //   promptBio,
      //   promptInstructions,
      //   promptSkills,
      //   promptJobs,
      //   resumeCompanies,
      // },
    });
  }

  try {
    if (!promptBio) {
      console.timeLog("sendChatbotMessage", "getting bio");
      promises.push(
        getDocument("homepage").then((homepage) => {
          console.timeLog("sendChatbotMessage", "got bio");
          promptBio = homepage?.bio ?? "";
        }),
      );
    }

    if (!promptInstructions) {
      console.timeLog("sendChatbotMessage", "getting instructions");
      promises.push(
        getDocument("obringerAssistant").then((a) => {
          console.timeLog("sendChatbotMessage", "got instructions");
          promptInstructions = a?.systemPrompt ?? "";
          model = models[a?.model ?? "gpt35Turbo"];
        }),
      );
    }

    if (!promptSkills) {
      console.timeLog("sendChatbotMessage", "getting skills");
      promises.push(
        getFormattedSkills().then((skills) => {
          console.timeLog("sendChatbotMessage", "got skills");
          promptSkills = skills;
        }),
      );
    }

    if (!promptJobs || !resumeCompanies) {
      console.timeLog("sendChatbotMessage", "getting companies");
      promises.push(
        getResumeCompanies().then((companies) => {
          console.timeLog("sendChatbotMessage", "got companies");
          resumeCompanies = companies;
          promptJobs = getFormattedJobs(resumeCompanies);
        }),
      );
    }

    console.timeLog("sendChatbotMessage", "awaiting promises");
    await Promise.all(promises);
    console.timeLog("sendChatbotMessage", "promises done");
    ragStatus.update("generating");

    console.timeLog("sendChatbotMessage", "getting highlights");
    const highlights = await getRelevantCompanyHighlights(
      resumeCompanies,
      message,
    );
    console.timeLog("sendChatbotMessage", "got highlights");

    console.timeLog("sendChatbotMessage", "getting system prompt");
    const systemPrompt = await getSystemPrompt({
      promptInstructions,
      promptSkills,
      promptJobs,
      promptBio,
      highlights,
    });
    console.timeLog("sendChatbotMessage", "got system prompt");

    let streamEvents = 0;
    console.timeLog("sendChatbotMessage", "streaming UI");
    const ui = await streamUI({
      model,
      system: systemPrompt,
      messages: aiState.get().messages,
      temperature: 0.3,
      initial: <>Loading</>,
      text: async ({ content, done }) => {
        console.timeLog("sendChatbotMessage", "streaming UI text");
        streamEventCount.update((streamEvents += 1));
        console.timeLog("sendChatbotMessage", "streamed UI text");

        if (done) {
          console.timeLog("sendChatbotMessage", "done");
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content,
              },
            ],
            // context: {
            //   promptBio,
            //   promptInstructions,
            //   promptSkills,
            //   promptJobs,
            //   resumeCompanies,
            // },
          });
          console.timeLog("sendChatbotMessage", "aiState done");
          ragStatus.done("done");
          console.timeLog("sendChatbotMessage", "ragStatus done");
          streamEventCount.done((streamEvents += 1));

          console.timeEnd("sendChatbotMessage");
        }

        return await parseMarkdown(content);
      },
      tools: {
        resume: {
          description: `If user wants to download Bob's resume or get a pdf, run this tool.
          If they just want to view bob's background, don't run the tool.`,
          parameters: z.object({}),
          generate: async function () {
            ragStatus.done("done");
            closeAIState("[Showing Resume Tool]");
            return (
              <div className="justify-middle flex flex-col gap-4 align-middle md:flex-row">
                <ResumeCard />
                <ResumeLinkCard />
              </div>
            );
          },
        },
        contact: {
          description:
            "If the user wants to communicate with bob, run this tool",
          parameters: z.object({
            contactMethod: z.string().describe(
              `If you can infer that the user is looking for x, linkedin, email, or phone,
              set the contactMethod parameter to the exact value we're looking for.  Remember, Twitter is X.
              If you can't tell exactly how they want to communicate with us, run the tool and set
              the contactMethod to indicate all methods.`,
            ),
          }),
          generate: async function* ({ contactMethod }) {
            yield <div>Looking up contact info</div>;

            const contactInfo = await getAllContactInfo();

            ragStatus.update("generating");
            streamEventCount.update((streamEvents += 1));

            const specificContactInfo = contactInfo.find(
              (c) =>
                c.contactMethod?.toLowerCase() === contactMethod.toLowerCase(),
            );

            if (specificContactInfo) {
              ragStatus.done("done");
              streamEventCount.done((streamEvents += 1));
              closeAIState(
                `[Showing Contact Tool with ${specificContactInfo} contact info]`,
              );
              return <ContactCard contactInfo={specificContactInfo} />;
            }

            ragStatus.done("done");
            streamEventCount.done((streamEvents += 1));
            closeAIState("[Showing Contact Tool with all contact info]");

            return (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                {contactInfo.map((contact) => (
                  <ContactCard key={contact._id} contactInfo={contact} />
                ))}
              </div>
            );
          },
        },
      },
    });

    console.timeLog("sendChatbotMessage", "returning");
    return {
      ragStatus: ragStatus.value,
      streamEventCount: streamEventCount.value,
      message: {
        ui: ui.value,
        role: "assistant",
        id: nanoid(),
      },
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
