import { ReactNode } from "react";
import { ChatbotInnerContextProvider } from "@/features/ai-chatbot/client/chatbot-inner-context";
import { ChatbotVercelAIContextProvider } from "@/features/ai-chatbot/client/chatbot-vercel-ai-context";

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
    <ChatbotVercelAIContextProvider>
      <ChatbotInnerContextProvider>{children}</ChatbotInnerContextProvider>
    </ChatbotVercelAIContextProvider>
  );
}
