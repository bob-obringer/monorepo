import { getMutableAIState } from "ai/rsc";
import { nanoid } from "ai";
import { ChatbotVercelAIStateContext } from "@/features/ai-chatbot/types";

type MutableAIState = ReturnType<typeof getMutableAIState>;

export function addUserMessage(aiState: MutableAIState, message: string) {
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: message,
      },
    ],
  });
}

export function updateContext(
  aiState: MutableAIState,
  context: Partial<ChatbotVercelAIStateContext>,
) {
  aiState.update({
    ...aiState.get(),
    context: {
      ...aiState.get().context,
      ...context,
    },
  });
}
