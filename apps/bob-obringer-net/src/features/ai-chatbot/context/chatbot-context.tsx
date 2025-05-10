import { ReactNode } from "react";
import { ChatbotInnerContextProvider } from "@/features/ai-chatbot/context/chatbot-inner-context";
import {
  ChatbotActions,
  ChatbotUIState,
  ChatbotAIState,
} from "@/features/ai-chatbot/types";
import { generateId } from "ai";
import { sendChatbotMessage } from "@/features/ai-chatbot/server/send-chatbot-message";
import { createAI } from "ai/rsc";

/**
 * ChatbotContextProvider wraps Vercel's Context Provider around our own AI context provider
 * Vercel's ai context provider is programatically generated and cannot run in
 * a "use client" context, so this wrapper cleans that all up for us
 *
 * This allows our inner context to know the state of the vercel ai context,
 * and simplifies consumption of both AI contexts in our apps.
 * @param children
 * @constructor
 */
export function ChatbotContextProvider({ children }: { children: ReactNode }) {
  return (
    <ChatbotAIContextProvider>
      <ChatbotInnerContextProvider>{children}</ChatbotInnerContextProvider>
    </ChatbotAIContextProvider>
  );
}

const ChatbotAIContextProvider = createAI<
  ChatbotAIState,
  ChatbotUIState,
  ChatbotActions
>({
  initialAIState: {
    id: generateId(),
    messages: [],
  },
  initialUIState: [],
  actions: { sendChatbotMessage },
});

export type ChatbotAIContext = typeof ChatbotAIContextProvider;
