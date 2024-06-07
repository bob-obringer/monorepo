"use server";

import "server-only";

import {
  getResumeCompanies,
  ResumeCompany,
} from "@/features/sanity-io/queries/resume-company";
import { getDocument } from "@/services/sanity-io-client";
import { createStreamableValue, getMutableAIState, streamUI } from "ai/rsc";
import { getSystemPrompt } from "@/features/ai-chatbot/server/chatbot-system-prompt";
import { nanoid } from "ai";
import {
  SendChatbotMessageActionResponse,
  SendChatbotMessageActionStatus,
  SendChatbotMessageProps,
} from "@/features/ai-chatbot/types";
import { ChatbotAIContext } from "@/features/ai-chatbot/context/chatbot-context";
import {
  getResumeSkills,
  ResumeSkill,
} from "@/features/sanity-io/queries/resume-skills";
import { AboutBob, ChatbotConfig } from "@bob-obringer/sanity-io-types";
import { models } from "@/services/llms";
import { rateLimit } from "@/features/ai-chatbot/server/rate-limit";
import { resumeTool } from "@/features/ai-chatbot/tools/resume";
import { contactTool } from "@/features/ai-chatbot/tools/contact";
import { Markdown } from "@/features/markdown/markdown";
import { vercelBlob } from "@/services/vercel-blob";
import { unstable_after as after } from "next/server";

export async function sendChatbotMessage({
  message,
  messageId,
}: SendChatbotMessageProps): Promise<SendChatbotMessageActionResponse | null> {
  const statusStream =
    createStreamableValue<SendChatbotMessageActionStatus>("retrieving");

  // Rate Limit
  const { success } = await rateLimit();
  if (!success) {
    statusStream.done("success");
    return {
      status: statusStream.value,
      ui: <>{`You're sending messages too quickly.  Please slow down.`}</>,
      id: nanoid(),
    };
  }

  const aiState = getMutableAIState<ChatbotAIContext>();

  // When we end the response, we need to close all streams
  async function endStreams(
    content: string,
    status: SendChatbotMessageActionStatus = "success",
  ) {
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        { id: nanoid(), role: "assistant", content: content },
      ],
    });
    console.log("Uploading to chatbot");
    after(async () => {
      await vercelBlob.upload(
        `chatbot/${aiState.get().id}.json`,
        JSON.stringify(aiState.get().messages, null, 2),
      );
    });
    statusStream.done(status);
  }

  const abortController = new AbortController();
  try {
    // Add user message to ai state
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        { id: messageId, role: "user", content: message },
      ],
    });

    // grab content from cms to construct our system prompt
    const [aboutBob, chatbotConfig, skills, companies] = (await Promise.all([
      getDocument("aboutBob"),
      getDocument("chatbotConfig"),
      getResumeSkills(),
      getResumeCompanies(),
    ])) as [AboutBob, ChatbotConfig, Array<ResumeSkill>, Array<ResumeCompany>];

    // construct this from our system prompt
    const systemPrompt = getSystemPrompt({
      systemPromptInstructions: chatbotConfig.systemPromptInstructions,
      skills,
      companies,
      bio: aboutBob.bio,
    });

    statusStream.update("generating");

    // create ui stream
    const ui = await streamUI({
      model: models[chatbotConfig.model ?? "gpt35Turbo"],
      system: systemPrompt,
      messages: aiState.get().messages,
      temperature: 0.5,
      initial: <>Thinking...</>,
      text: async ({ content, done }) => {
        if (done) endStreams(content);
        return <Markdown markdown={content} />;
      },
      tools: {
        resume: resumeTool({ endStreams }),
        contact: contactTool({ endStreams }),
      },
      abortSignal: abortController.signal,
    });

    return {
      status: statusStream.value,
      ui: <>{ui.value}</>,
      id: nanoid(),
    };
  } catch (e) {
    console.error(e);
    endStreams("[Responded with an error]", "error");
    abortController.abort();
    return {
      status: statusStream.value,
      ui: <>An error occurred. Please try again.</>,
      id: nanoid(),
    };
  }
}
