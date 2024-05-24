"use server";

import "server-only";

import { getResumeCompanies } from "@/features/sanity-io/queries/resume-company";
import { getDocument } from "@/services/sanity-io/get-document";
import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import { addUserMessage } from "@/features/ai-chatbot/server-actions/send-chatbot-message/chatbot-ai-state-helpers";
import {
  getFormattedJobs,
  getFormattedSkills,
  getRelevantCompanyHighlights,
  getSystemPrompt,
} from "@/features/ai-chatbot/server-actions/send-chatbot-message/chatbot-system-prompt";
import { defaultModel } from "@/services/llms";
import { nanoid } from "ai";
import {
  ChatbotVercelAIContext,
  RagStatus,
  SendChatbotMessageResponse,
} from "@/features/ai-chatbot";
import { z } from "zod";
import { parseMarkdown } from "@/helpers/markdown/parse-markdown";
import { getAllContactInfo } from "@/features/sanity-io/queries/contact-info";
import { ContactCard } from "@/features/contacts/contact-card";
import { ResumeCard, ResumeLinkCard } from "@/features/resume/resume-card";

export async function sendChatbotMessage(
  message: string,
): Promise<SendChatbotMessageResponse | null> {
  const aiState = getMutableAIState<ChatbotVercelAIContext>();
  addUserMessage(aiState, message);

  let {
    promptJobs,
    promptSkills,
    promptBio,
    resumeCompanies,
    promptInstructions,
  } = aiState.get().context || {};

  const streamEventCount = createStreamableValue(0);
  const ragStatus = createStreamableValue<RagStatus>("retrieving");

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
      context: {
        promptBio,
        promptInstructions,
        promptSkills,
        promptJobs,
        resumeCompanies,
      },
    });
  }

  try {
    if (!promptBio) {
      promises.push(
        getDocument("homepage").then((homepage) => {
          promptBio = homepage.bio ?? "";
        }),
      );
    }

    if (!promptInstructions) {
      promises.push(
        getDocument("obringerAssistant").then(({ systemPrompt }) => {
          promptInstructions = systemPrompt ?? "";
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
    ragStatus.update("generating");

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

    let streamEvents = 0;
    const ui = await streamUI({
      model: defaultModel,
      system: systemPrompt,
      messages: aiState.get().messages,
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
      text: async ({ content, done }) => {
        streamEventCount.update((streamEvents += 1));

        if (done) {
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
            context: {
              promptBio,
              promptInstructions,
              promptSkills,
              promptJobs,
              resumeCompanies,
            },
          });

          ragStatus.done("done");
          streamEventCount.done((streamEvents += 1));
        }

        return await parseMarkdown(content);
      },
    });

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
