// import {
//   createStreamableUI,
//   createStreamableValue,
//   getMutableAIState,
// } from "ai/rsc";
// import { ChatbotAIContext } from "@/features/ai-chatbot/context/chatbot-context";
// import { SendChatbotMessageActionStatus } from "@/features/ai-chatbot/types";
// import { ReactNode } from "react";
// import { generateId } from "ai";
// import { MessageContext } from "@/features/ai-chatbot/server/types";

// export function getMessageContext(): MessageContext {
//   // The AI state used to store messages to include with the chat
//   const aiState = getMutableAIState<ChatbotAIContext>();
//   if (aiState.get().messages.length === 0) {
//     aiState.update({
//       id: `${Date.now()}:${generateId()}`,
//       messages: [],
//       supabaseChatId: null, // Initialize Supabase chat ID to null for new chats
//     });
//   }

//   // the stream from the `streamUI` call comes back too quickly with some models
//   // and can cause a recursion error on the client.  Instead, we create a separate
//   // stream that we can add to at our own pace
//   const isStreamActive = createStreamableValue(true);
//   const uiStream = createStreamableUI(<>Thinking...</>);
//   const uiStreamStatus =
//     createStreamableValue<SendChatbotMessageActionStatus>("retrieving");
//   const toolStream = createStreamableUI();

//   // Server-side state tracking
//   let uiStreamStatusComplete = false;
//   let toolIsActive = false;

//   function startTool() {
//     toolIsActive = true;
//   }

//   async function endToolResponse({
//     aiContent,
//     uiContent,
//   }: {
//     aiContent: string;
//     uiContent: ReactNode;
//   }) {
//     toolStream.done(uiContent);
//     toolIsActive = false;

//     aiState.done({
//       ...aiState.get(),
//       messages: [
//         ...aiState.get().messages,
//         { id: generateId(), role: "assistant", content: aiContent },
//       ],
//     });

//     // Check if both conditions are met to end the stream
//     if (uiStreamStatusComplete) {
//       isStreamActive.done(false);
//     }

//     return null;
//   }

//   async function endTextResponse({
//     aiContent,
//     uiContent,
//     status = "success",
//   }: {
//     aiContent: string;
//     uiContent: ReactNode;
//     status: SendChatbotMessageActionStatus;
//   }) {
//     uiStreamStatus.done(status);
//     uiStream.done(uiContent);

//     // Update server-side tracking state
//     if (status === "success" || status === "error") {
//       uiStreamStatusComplete = true;
//     }

//     aiState.done({
//       ...aiState.get(),
//       messages: [
//         ...aiState.get().messages,
//         { id: generateId(), role: "assistant", content: aiContent },
//       ],
//     });

//     // Check if both conditions are met to end the stream
//     if (!toolIsActive) {
//       toolStream.done(null);
//       isStreamActive.done(true);
//     }

//     return null;
//   }

//   return {
//     aiState,
//     uiStream,
//     toolStream,
//     uiStreamStatus,
//     startTool,
//     endToolResponse,
//     endTextResponse,
//     chunkCount: 0,
//     id: generateId(),
//     isStreamActive,
//   };
// }
