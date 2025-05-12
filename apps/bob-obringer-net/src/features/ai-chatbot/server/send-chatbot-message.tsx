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
// Import Supabase helper functions for chat archiving
import { createSupabaseChat, addSupabaseMessage } from "@/integrations/supabase/helpers";

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
    const aiState = context.aiState.get();
    
    // Create the updated state with the new message
    const updatedState = {
      ...aiState,
      messages: [
        ...aiState.messages,
        { id: messageId, role: "user" as const, content: message },
      ],
    };
    
    // Update the AI state
    context.aiState.update(updatedState);

    // --- Supabase Integration Start (User Message) ---
  
    // Check if this is a new chat or an existing one
    let currentChatId = aiState.supabaseChatId;
  
    if (!currentChatId) {
      // First message in this session, create the chat record
      try {
        const newChatId = await createSupabaseChat(); // Optional: pass a title if available
        if (newChatId) {
          currentChatId = newChatId;
          // IMPORTANT: Update the AI state immediately
          updatedState.supabaseChatId = newChatId;
          context.aiState.update(updatedState);
        
          // Now add the first user message
          await addSupabaseMessage(currentChatId, 'user', message)
            .catch(e => console.error("Fire-and-forget Supabase user message error:", e)); // Log errors but don't block
        } else {
          console.error("Failed to create Supabase chat, cannot archive first message.");
        }
      } catch (e) {
        console.error("Error in Supabase chat creation:", e);
        // Continue with the chat even if archiving fails
      }
    } else {
      // Existing chat, just add the user message
      addSupabaseMessage(currentChatId, 'user', message)
        .catch(e => console.error("Fire-and-forget Supabase user message error:", e)); // Log errors but don't block
    }
  
    // --- Supabase Integration End (User Message) ---

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
    // The existing chatTextRenderer already handles updating the UI stream and capturing the final text
    // We'll modify the endResponse function in getMessageContext.tsx to archive the assistant's response
    await streamUI({
      //model: models[chatbotConfig.model ?? "anthropicHaiku"],
      model: models.xAIGrok3,
      system: systemPrompt,
      messages: updatedState.messages,
      temperature: 0.7, //chatbotConfig.temperature,
      initial: <>Thinking...</>,
      text: async (result) => {
        // Use the existing chatTextRenderer
        const renderedResult = await chatTextRenderer(context)(result);
        
        // When the text is complete, archive the assistant's response
        if (result.done) {
          // --- Supabase Integration for Assistant Message ---
          const currentState = context.aiState.get();
          const currentChatId = currentState.supabaseChatId;
          
          if (currentChatId && typeof result.content === 'string') {
            // Archive the assistant's response in Supabase
            addSupabaseMessage(currentChatId, 'assistant', result.content)
              .catch(e => console.error("Fire-and-forget Supabase assistant message error:", e));
          } else if (!currentChatId) {
            console.error("Cannot archive assistant message: Supabase chat ID is missing.");
          }
          // --- End Supabase Integration ---
        }
        
        return renderedResult;
      },
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
