import { ReactNode } from "react";
import { ChatbotInnerContextProvider } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { ChatbotVercelAIContextProvider } from "@/features/ai-chatbot/context/chatbot-vercel-ai-context";

/**
 * AIContext wraps Vercel's Context Provider around our own AI context provider
 * Vercel's ai context provider is programatically generated and cannot run in
 * a "use client" context, so we wrap it as a server component, and include our
 * own context (with "use client") inside of it.
 *
 * This allows our inner context to know the state of the vercel ai context,
 * and simplifies consumption of the AI context in our apps.
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
