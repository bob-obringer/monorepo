"use server";

import "server-only";

import {
  getResumeCompanies,
  ResumeCompany,
} from "@/integrations/sanity-io/queries/resume-company";
import { getDocument } from "@/services/sanity-io-client";
import { streamUI } from "ai/rsc";
import { getSystemPrompt } from "@/features/ai-chatbot/server/chatbot-system-prompt";
import {
  SendChatbotMessageActionResponse,
  SendChatbotMessageProps,
} from "@/features/ai-chatbot/types";
import {
  getResumeSkills,
  ResumeSkill,
} from "@/integrations/sanity-io/queries/resume-skills";
import { AboutBob, ChatbotConfig } from "@bob-obringer/sanity-io-types";
import { models } from "@/integrations/llms";
import { rateLimit } from "@/features/ai-chatbot/server/rate-limit";
import { resumeTool } from "@/features/ai-chatbot/tools/resume-tool";
import { contactTool } from "@/features/ai-chatbot/tools/contact-tool";
import { getMessageContext } from "@/features/ai-chatbot/server/get-message-context";
import { chatTextRenderer } from "@/features/ai-chatbot/tools/chat-text-renderer";

/**
 * Server action to send the chatbot message
 * @param message The user message to send
 * @param messageId The id of the user message (already created on client)
 */
export async function sendChatbotMessage({
  message,
  messageId,
}: SendChatbotMessageProps): Promise<SendChatbotMessageActionResponse> {
  const context = getMessageContext();

  // Rate Limit
  const { success } = await rateLimit(25, "5m");
  if (!success) {
    context.endResponse({
      aiContent: "You're sending messages too quickly.  Please slow down.",
      uiContent: (
        <>{`You're sending messages too quickly.  Please slow down.`}</>
      ),
      status: "error",
    });
    return {
      status: context.statusStream.value,
      ui: <>{context.uiStream.value}</>,
      id: context.id,
    };
  }

  // If we catch an error, we'll abort the stream
  const abortController = new AbortController();

  try {
    // Add user message to ai state
    context.aiState.update({
      ...context.aiState.get(),
      messages: [
        ...context.aiState.get().messages,
        { id: messageId, role: "user", content: message },
      ],
    });

    // grab everything from the cms
    const [aboutBob, chatbotConfig, skills, companies] = (await Promise.all([
      getDocument("aboutBob"),
      getDocument("chatbotConfig"),
      getResumeSkills(),
      getResumeCompanies(),
    ])) as [AboutBob, ChatbotConfig, Array<ResumeSkill>, Array<ResumeCompany>];

    // construct our system prompt
    const systemPrompt = getSystemPrompt({
      systemPromptInstructions: chatbotConfig.systemPromptInstructions,
      skills,
      companies,
      bio: aboutBob.bio,
    });

    context.statusStream.update("generating");

    /*
      We create the UI stream here but we don't use the response directly.
      
      Some models (gpt4o) can return very long streams with many small chunks that
      the client hits a recurrsion limit.  Instead, we send the results of the `text`
      and `tools` functions to our own stream that we can update at our own pace.
     */
    await streamUI({
      //model: models[chatbotConfig.model ?? "anthropicHaiku"],
      model: models.xAIGrok3,
      system: systemPrompt,
      messages: context.aiState.get().messages,
      temperature: 0.7, //chatbotConfig.temperature,
      initial: <>Thinking...</>,
      text: chatTextRenderer(context),
      tools: {
        resume: resumeTool(context),
        contact: contactTool(context),
      },
      abortSignal: abortController.signal,
    });
  } catch (e) {
    console.error(e);
    abortController.abort();
    context.endResponse({
      aiContent: "[Responded with an error]",
      uiContent: "<>An error occurred. Please try again.</>",
      status: "error",
    });
  }

  return {
    status: context.statusStream.value,
    ui: <>{context.uiStream.value}</>,
    id: context.id,
  };
}
