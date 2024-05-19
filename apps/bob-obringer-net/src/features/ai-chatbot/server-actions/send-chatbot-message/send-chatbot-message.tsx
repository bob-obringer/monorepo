"use server";

import "server-only";

import { getResumeCompanies } from "@/services/sanity-io/resume-company-helpers";
import { getDocument } from "@/services/sanity-io/get-document";
import {
  createStreamableValue,
  getMutableAIState,
  StreamableValue,
} from "ai/rsc";
import { addUserMessage } from "@/features/ai-chatbot/server-actions/send-chatbot-message/chatbot-ai-state-helpers";
import {
  getFormattedJobs,
  getFormattedSkills,
  getRelevantCompanyHighlights,
  getSystemPrompt,
} from "@/features/ai-chatbot/server-actions/send-chatbot-message/chatbot-system-prompt";
import { ChatbotVercelAIContext } from "@/features/ai-chatbot/context/chatbot-vercel-ai-context";
import { defaultModel } from "@/services/llms";
import { nanoid, streamText } from "ai";

export async function sendChatbotMessage(message: string): Promise<{
  responseMessageText: StreamableValue<string>;
  bioStatus: StreamableValue<boolean>;
  instructionsStatus: StreamableValue<boolean>;
  skillsStatus: StreamableValue<boolean>;
  jobsStatus: StreamableValue<boolean>;
  relevantHighlightsStatus: StreamableValue<boolean>;
  isLoading: StreamableValue<boolean>;
}> {
  const aiState = getMutableAIState<ChatbotVercelAIContext>();
  addUserMessage(aiState, message);

  let {
    promptJobs,
    promptSkills,
    promptBio,
    resumeCompanies,
    promptInstructions,
  } = aiState.get().context || {};

  const isLoading = createStreamableValue(Boolean(true));
  const responseMessageText = createStreamableValue("");
  const bioStatus = createStreamableValue(Boolean(false));
  const instructionsStatus = createStreamableValue(Boolean(promptInstructions));
  const skillsStatus = createStreamableValue(Boolean(promptSkills));
  const jobsStatus = createStreamableValue(Boolean(promptJobs));
  const relevantHighlightsStatus = createStreamableValue(Boolean(false));

  const promises: Array<Promise<void>> = [];

  try {
    if (!promptBio) {
      promises.push(
        getDocument("homepage").then((homepage) => {
          promptBio = homepage.bio ?? "";
          bioStatus.done(true);
        }),
      );
    } else {
      bioStatus.done(true);
    }

    if (!promptInstructions) {
      promises.push(
        // todo: change this label to include "config"
        getDocument("obringerAssistant").then(({ systemPrompt }) => {
          // todo: this config should be called instructions
          promptInstructions = systemPrompt ?? "";
          instructionsStatus.done(true);
        }),
      );
    } else {
      instructionsStatus.done(true);
    }

    if (!promptSkills) {
      promises.push(
        getFormattedSkills().then((skills) => {
          promptSkills = skills;
          skillsStatus.done(true);
        }),
      );
    } else {
      skillsStatus.done(true);
    }

    if (!promptJobs || !resumeCompanies) {
      promises.push(
        getResumeCompanies().then((companies) => {
          resumeCompanies = companies;
          promptJobs = getFormattedJobs(resumeCompanies);
          jobsStatus.done(true);
        }),
      );
    } else {
      jobsStatus.done(true);
    }

    Promise.all(promises).then(async () => {
      const highlights = await getRelevantCompanyHighlights(
        resumeCompanies,
        message,
      );

      relevantHighlightsStatus.done(true);
      const systemPrompt = await getSystemPrompt({
        promptInstructions,
        promptSkills,
        promptJobs,
        promptBio,
        highlights,
      });

      const result = await streamText({
        model: defaultModel,
        system: systemPrompt,
        messages: aiState.get().messages,
      });

      let responseText = "";
      for await (const textPart of result.textStream) {
        responseText += textPart;
        responseMessageText.update(responseText);
      }
      responseMessageText.done(responseText);
      isLoading.done(false);

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: "assistant",
            content: responseText,
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
    });
  } catch (e) {
    // todo: clean up on error
  }
  return {
    responseMessageText: responseMessageText.value,
    bioStatus: bioStatus.value,
    instructionsStatus: instructionsStatus.value,
    skillsStatus: skillsStatus.value,
    jobsStatus: jobsStatus.value,
    relevantHighlightsStatus: relevantHighlightsStatus.value,
    isLoading: isLoading.value,
  };
}

export type SendChatbotMessageResponse = Awaited<
  ReturnType<typeof sendChatbotMessage>
>;
