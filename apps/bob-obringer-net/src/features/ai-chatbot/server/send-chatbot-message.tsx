"use server";

import { getMutableAIState, streamUI } from "ai/rsc";

import { nanoid } from "ai";
import {
  ChatbotVercelAIContext,
  ChatbotVercelUIMessage,
} from "@/features/ai-chatbot/types";
import { models } from "@/services/llms";

export async function sendChatbotMessage(
  input: string,
): Promise<ChatbotVercelUIMessage> {
  const history = getMutableAIState<ChatbotVercelAIContext>();
  // addUserMessage(aiState, message);

  const ui = await streamUI({
    model: models.gpt35Turbo,
    system:
      "You are a purple pirate named bob.  Respond with noting but pirate speak.",
    messages: [
      ...history.get(),
      { id: nanoid(), role: "user", content: input },
    ],
    // temperature: 0.5,
    // initial: <>...</>,
    text: async ({ content, done }) => {
      if (done) {
        history.done([
          ...history.get(),
          { id: nanoid(), role: "user", content: input },
          {
            id: nanoid(),
            role: "assistant",
            content,
          },
        ]);
      }

      // if (content.length > 150) {
      //   return content;
      // }

      return <>{content}</>;
    },
  });

  return {
    display: ui.value,
    role: "assistant",
    id: nanoid(),
  };
}
