import {
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
} from "ai/rsc";
import { ChatbotAIContext } from "@/features/ai-chatbot/context/chatbot-context";
import { SendChatbotMessageActionStatus } from "@/features/ai-chatbot/types";
import { ReactNode } from "react";
import { nanoid } from "ai";
import { unstable_after as after } from "next/server";
import { vercelBlob } from "@/services/vercel-blob";
import { MessageContext } from "@/features/ai-chatbot/tools/types";

const initialUI = <>Thinking...</>;

export function getMessageContext(): MessageContext {
  // The AI state used to store messages to include with the chat
  const aiState = getMutableAIState<ChatbotAIContext>();
  if (aiState.get().messages.length === 0) {
    aiState.update({
      id: `${Date.now()}:${nanoid()}`,
      messages: [],
    });
  }

  // the stream from the `streamUI` call comes back too quickly with some models
  // and can cause a recursion error on the client.  Instead, we create a separate
  // stream that we can add to at our own pace
  const uiStream = createStreamableUI(initialUI);

  // a separate stream that lets the client know about the status of the request
  const statusStream =
    createStreamableValue<SendChatbotMessageActionStatus>("retrieving");

  // When we're done, close all streams with final content, and log the chat
  function endResponse({
    aiContent,
    uiContent,
    status,
  }: {
    aiContent: string;
    uiContent: ReactNode;
    status: SendChatbotMessageActionStatus;
  }) {
    statusStream.done(status);
    uiStream.done(uiContent);
    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        { id: nanoid(), role: "assistant", content: aiContent },
      ],
    });
    after(async () => {
      await vercelBlob.upload(
        `chatbot/${aiState.get().id}.json`,
        JSON.stringify(aiState.get().messages, null, 2),
      );
    });
    return null;
  }

  return {
    aiState,
    uiStream,
    statusStream,
    endResponse,
    chunkCount: 0,
    id: nanoid(),
  };
}
