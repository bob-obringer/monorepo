"use server";

import "server-only";

import { getResumeCompanies } from "@/services/sanity-io/resume-company-helpers";
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
import { parseMarkdown } from "@/features/markdown/parse-markdown";

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
        deploy: {
          description: "Display user contact information",
          parameters: z.object({
            communicationMethod: z
              .string()
              .describe(
                "Does the user want to communicate with bob in any way, including smoke signals or phone call?",
              ),
          }),
          generate: async function ({ communicationMethod }) {
            if (communicationMethod === "email") {
              ragStatus.done("done");
              return (
                <div>
                  You can send bob a message at{" "}
                  <a className="text-color-link" href="mailto:bob@obringer.net">
                    bob@obringer.net
                  </a>
                </div>
              );
            }

            if (communicationMethod === "phone call") {
              ragStatus.done("done");
              return (
                <div>
                  You can call bob at{" "}
                  <a className="text-color-link" href="tel:+1-917-656-1685">
                    +1-917-656-1685
                  </a>
                </div>
              );
            }

            return <div>Communication Method {communicationMethod}</div>;
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
