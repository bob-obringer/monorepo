// "use server";

// import "server-only";
// import { streamUI } from "ai/rsc";
// import { getSystemPrompt } from "@/app/api/chat/_/chatbot-system-prompt";
// import {
//   SendChatbotMessageActionResponse,
//   SendChatbotMessageProps,
// } from "@/features/ai-chatbot/types";
// import { models } from "@/integrations/llms";
// import { resumeTool } from "@/features/ai-chatbot/tools/resume-tool";
// import { contactTool } from "@/features/ai-chatbot/tools/contact-tool";
// import { getMessageContext } from "@/features/ai-chatbot/server/get-message-context";
// import { addSupabaseMessage } from "@/integrations/supabase/helpers";
// import { isRateLimited } from "@/app/api/chat/_/enforce-rate-limit";
// import {
//   addUserMessageToAiState,
//   updateArchivedChatTitle,
// } from "@/features/ai-chatbot/server/helpers";
// import {
//   addMessageToArchive,
//   createChatArchive,
// } from "@/app/api/chat/_/chat-archive";
// import { Markdown } from "@/features/markdown/markdown";

// /**
//  * Server action to send the chatbot message
//  * @param message The user message to send
//  * @param messageId The id of the user message (already created on client)
//  */
// export async function sendChatbotMessage({
//   message,
//   messageId,
// }: SendChatbotMessageProps): Promise<SendChatbotMessageActionResponse> {
//   const context = getMessageContext();

//   // Rate Limit
//   const isLimited = await isRateLimited({ context });
//   if (isLimited) return isLimited;

//   // If we catch an error, we'll abort the stream
//   const abortController = new AbortController();

//   try {
//     let aiState = context.aiState.get();

//     // Update archive
//     if (!aiState.supabaseChatId) {
//       aiState.supabaseChatId = await createChatArchive(context);
//     }
//     await addMessageToArchive(aiState.supabaseChatId, "user", message);

//     // Update AI state
//     aiState = addUserMessageToAiState(context, messageId, message);

//     // Update archived chat title
//     await updateArchivedChatTitle(context);

//     const systemPrompt = await getSystemPrompt();
//     context.uiStreamStatus.update("generating");

//     /*
//       We create the UI stream here but we don't use the response directly.

//       Some models (gpt4o) can return very long streams with many small chunks that
//       the client hits a recurrsion limit.  Instead, we send the results of the `text`
//       and `tools` functions to our own stream that we can update at our own pace.
//      */
//     // The existing chatTextRenderer already handles updating the UI stream and capturing the final text
//     // We'll modify the endResponse function in getMessageContext.tsx to archive the assistant's response
//     await streamUI({
//       //model: models[chatbotConfig.model ?? "anthropicHaiku"],
//       model: models.xAIGrok3,
//       system: systemPrompt,
//       messages: aiState.messages,
//       temperature: 0.7, //chatbotConfig.temperature,
//       initial: <>Thinking...</>,
//       text: async (result) => {
//         context.chunkCount = context.chunkCount + 1;
//         if (context.chunkCount % 3 === 0) {
//           context.uiStream.update(<Markdown markdown={result.content} />);
//         }

//         // When the text is complete, archive the assistant's response
//         if (result.done) {
//           context.endTextResponse({
//             aiContent: result.content,
//             uiContent: <Markdown markdown={result.content} />,
//             status: "success",
//           });

//           const currentState = context.aiState.get();
//           const currentChatId = currentState.supabaseChatId;

//           if (currentChatId && typeof result.content === "string") {
//             addSupabaseMessage(
//               currentChatId,
//               "assistant",
//               result.content,
//             ).catch(() => {});
//           }
//         }

//         return null;
//       },
//       tools: {
//         resume: resumeTool(context),
//         contact: contactTool(context),
//       },
//       abortSignal: abortController.signal,
//     });
//   } catch (e) {
//     console.error(e);
//     abortController.abort();
//     context.endTextResponse({
//       aiContent: "[Responded with an error]",
//       uiContent: <>{`An error occurred. Please try again.`}</>,
//       status: "error",
//     });
//   }

//   return {
//     // isStreamActive: context.isStreamActive.value,
//     status: context.uiStreamStatus.value,
//     ui: <>{context.uiStream.value}</>,
//     id: context.id,
//   };
// }
