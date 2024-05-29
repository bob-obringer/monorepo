import { getMutableAIState } from "ai/rsc";
import { nanoid } from "ai";

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
