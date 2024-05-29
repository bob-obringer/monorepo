"use server";

import "server-only";

import {
  getResumeCompanies,
  ResumeCompany,
} from "@/features/sanity-io/queries/resume-company";
import { getDocument } from "@/services/sanity-io/get-document";
import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import {
  getFormattedJobs,
  getFormattedSkills,
  getRelevantCompanyHighlights,
  getSystemPrompt,
} from "@/features/ai-chatbot/server/chatbot-system-prompt";
import { Models, models } from "@/services/llms";
import { nanoid } from "ai";
import {
  MessageRole,
  MessageStatus,
  SendChatbotMessageResponse,
} from "@/features/ai-chatbot/types";
import { parseMarkdown } from "@/helpers/markdown/parse-markdown";
import { ResumeCard, ResumeLinkCard } from "@/features/resume/resume-card";
import { z } from "zod";
import { ContactCard } from "@/features/contacts/contact-card";
import { getAllContactInfo } from "@/features/sanity-io/queries/contact-info";
import { ChatbotAIContext } from "@/features/ai-chatbot/context/chatbot-context";

export async function sendChatbotMessage(
  message: string,
): Promise<SendChatbotMessageResponse | null> {
  const aiState = getMutableAIState<ChatbotAIContext>();

  function addMessageToAiState(
    role: MessageRole,
    content: string,
    done: boolean,
  ) {
    aiState[done ? "done" : "update"]({
      ...aiState.get(),
      messages: [...aiState.get().messages, { id: nanoid(), role, content }],
    });
  }

  addMessageToAiState("user", message, false);

  let promptJobs: string | null = null;
  let promptSkills: string | null = null;
  let promptBio: string | null = null;
  let resumeCompanies: Array<ResumeCompany> = [];
  let promptInstructions: string | null = null;
  let model: Models = models.gpt35Turbo;

  const messageStatus = createStreamableValue<MessageStatus>("retrieving");

  const promises: Array<Promise<void>> = [];

  function endResponse(content: string) {
    addMessageToAiState("assistant", content, true);
    messageStatus.done("done");
  }

  try {
    if (!promptBio) {
      promises.push(
        getDocument("homepage").then((homepage) => {
          promptBio = homepage?.bio ?? "";
        }),
      );
    }

    if (!promptInstructions) {
      promises.push(
        getDocument("obringerAssistant").then((a) => {
          promptInstructions = a?.systemPrompt ?? "";
          model = models[a?.model ?? "gpt35Turbo"];
        }),
      );
    }

    if (!promptSkills) {
      promises.push(
        getFormattedSkills().then((skills) => {
          promptSkills = skills;
        }),
      );
    }

    if (!promptJobs || !resumeCompanies) {
      promises.push(
        getResumeCompanies().then((companies) => {
          resumeCompanies = companies;
          promptJobs = getFormattedJobs(resumeCompanies);
        }),
      );
    }

    await Promise.all(promises);

    const highlights = await getRelevantCompanyHighlights(
      resumeCompanies,
      message,
    );

    const systemPrompt = await getSystemPrompt({
      promptInstructions,
      promptSkills,
      promptJobs,
      promptBio,
      highlights,
    });

    messageStatus.update("generating");

    const ui = await streamUI({
      model,
      system: systemPrompt,
      messages: aiState.get().messages,
      temperature: 0.5,
      initial: <>...</>,
      text: async ({ content, done }) => {
        if (done) endResponse(content);
        return await parseMarkdown(content);
      },
      tools: {
        resume: {
          description: `If user wants to download Bob's resume or get a pdf, run this tool.
          If they just want to view bob's background, don't run the tool.`,
          parameters: z.object({}),
          generate: async function () {
            endResponse("[Showing Resume Tool]");
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

            messageStatus.update("generating");

            const specificContactInfo = contactInfo.find(
              (c) =>
                c.contactMethod?.toLowerCase() === contactMethod.toLowerCase(),
            );

            if (specificContactInfo) {
              endResponse(
                `[Showing Contact Tool with ${specificContactInfo} contact info]`,
              );
              return <ContactCard contactInfo={specificContactInfo} />;
            }

            endResponse("[Showing Contact Tool with all contact info]");

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

    return {
      messageStatus: messageStatus.value,
      message: {
        display: ui.value,
        role: "assistant",
        id: nanoid(),
      },
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
