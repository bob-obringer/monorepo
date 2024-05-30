"use server";

import "server-only";

import {
  getResumeCompanies,
  ResumeCompany,
} from "@/features/sanity-io/queries/resume-company";
import { getDocument } from "@/services/sanity-io-client";
import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import {
  getFormattedJobs,
  getFormattedSkills,
  getRelevantCompanyHighlights,
  getSystemPrompt,
} from "@/features/ai-chatbot/server/chatbot-system-prompt";
import { nanoid } from "ai";
import {
  MessageStatus,
  SendChatbotMessageResponse,
} from "@/features/ai-chatbot/types";
import { parseMarkdown } from "@/helpers/markdown/parse-markdown";
import { ChatbotAIContext } from "@/features/ai-chatbot/context/chatbot-context";
import { cache } from "@/features/cache";
import {
  getResumeSkills,
  ResumeSkill,
} from "@/features/sanity-io/queries/resume-skills";
import { ChatbotConfig, Homepage } from "@bob-obringer/sanity-io-types";
import { models } from "@/services/llms";
import { rateLimit } from "@/features/ai-chatbot/server/rate-limit";
import { resumeTool } from "@/features/ai-chatbot/tools/resume";
import { contactTool } from "@/features/ai-chatbot/tools/contact";

export async function sendChatbotMessage(
  message: string,
): Promise<SendChatbotMessageResponse | null> {
  const messageStatus = createStreamableValue<MessageStatus>("retrieving");

  // Rate Limit
  const { success } = await rateLimit();
  if (!success) {
    messageStatus.done("done");
    return {
      messageStatus: messageStatus.value,
      ui: "You're sending messages too quickly.  Please slow down.",
    };
  }

  const aiState = getMutableAIState<ChatbotAIContext>();

  // When we end the response, we need to close all streams
  function endStreams(content: string) {
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        { id: nanoid(), role: "user", content: content },
      ],
    });
    messageStatus.done("done");
  }

  try {
    // Add user message to ai state
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        { id: nanoid(), role: "user", content: message },
      ],
    });

    // grab content from cms to construct our system prompt
    const [homepage, chatbotConfig, skills, companies] = (await Promise.all([
      getDocument("homepage"),
      getDocument("chatbotConfig"),
      cache(getResumeSkills, "sanity:skills"),
      cache(getResumeCompanies, "sanity:companies"),
    ])) as [Homepage, ChatbotConfig, Array<ResumeSkill>, Array<ResumeCompany>];

    // todo: just add this to the context, we don't need to rag companies
    const highlights = await getRelevantCompanyHighlights(companies, message);

    // construct this from our system prompt
    const systemPrompt = getSystemPrompt({
      systemPromptInstructions: chatbotConfig.systemPromptInstructions,
      formattedSkills: getFormattedSkills(skills),
      formattedJobs: getFormattedJobs(companies),
      bio: homepage.bio,
      highlights,
    });

    messageStatus.update("generating");

    // create ui stream
    const ui = await streamUI({
      model: models[chatbotConfig.model ?? "gpt35Turbo"],
      system: systemPrompt,
      messages: aiState.get().messages,
      temperature: 0.5,
      initial: <>Thinking...</>,
      text: async ({ content, done }) => {
        if (done) endStreams(content);
        const html = parseMarkdown(content);
        return <div>{html}</div>;
      },
      tools: {
        resume: resumeTool({ endStreams }),
        contact: contactTool({ endStreams }),
      },
    });

    return {
      messageStatus: messageStatus.value,
      ui: ui.value,
    };
  } catch (e) {
    messageStatus.done("done");
    return {
      messageStatus: messageStatus.value,
      ui: "An error occurred.  Please try again.",
    };
  }
}
