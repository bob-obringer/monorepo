import { MessageContext } from "@/features/ai-chatbot/server/types";
import { geolocation } from "@vercel/functions";
import { headers } from "next/headers";
import { models } from "@/integrations/llms";
import { supabaseServerClient } from "@/integrations/supabase/server";
import { generateText } from "ai";

export async function getLocation() {
  const headersList = await headers();
  const geoData = geolocation({ headers: headersList });
  return geoData.city
    ? `${geoData.city}${geoData.region ? `, ${geoData.region}` : ""}${geoData.country ? `, ${geoData.country}` : ""}`
    : geoData.country;
}

export function addUserMessageToAiState(
  context: MessageContext,
  messageId: string,
  message: string,
) {
  const aiState = context.aiState.get();
  const updatedState = {
    ...aiState,
    messages: [
      ...aiState.messages,
      { id: messageId, role: "user" as const, content: message },
    ],
  };
  context.aiState.update(updatedState);
  return context.aiState.get();
}

export async function getChatTitle(context: MessageContext) {
  const aiState = context.aiState.get();
  const userMessages = aiState.messages
    .filter(({ role }) => role === "user")
    .map(({ content }) => content);
  let title: string = "Unknown Chat";
  try {
    const titleResult = await generateText({
      model: models.anthropicHaiku,
      system:
        "You are a helpful assistant that creates concise, descriptive titles for chat conversations. Create a title that captures the essence of the conversation in 5-7 words. The title should be specific to the content, not generic like 'Chat about technology'.",
      messages: [
        {
          role: "user",
          content: `Create a short, descriptive title for this chat conversation. Here are the user's messages:\n${userMessages.join("\n")}`,
        },
      ],
      temperature: 0.3,
    });
    title = titleResult.text;

    // Remove quotes if the model included them
    title = title.replace(/^["'`]+|["'`]+$/g, "").trim();
  } catch (llmError) {
    // title = userMessages
    console.error("Error generating title with LLM:", llmError);
    // Fall back to simple title generation
    // const firstTitle = typeof userMessages[0]
    // title = createFallbackTitle(
    //   (userMessages[0].content as Array<TextPart>)[0].text,
    // );
  }

  return title;
}

export async function updateArchivedChatTitle(context: MessageContext) {
  const aiState = context.aiState.get();
  if (!aiState.supabaseChatId) return;
  const title = await getChatTitle(context);
  await supabaseServerClient
    .from("chats")
    .update({ title })
    .eq("id", aiState.supabaseChatId);
}

/**
 * Creates a simple title from a message without using an LLM
 * @param message The message to create a title from
 * @returns A simple title based on the message content
 */
function createFallbackTitle(message: string): string {
  // Look for question marks to identify questions
  if (message.includes("?")) {
    // If it's a question, use the question as the title (truncated if needed)
    const questionParts = message.split("?");
    const firstQuestion = questionParts[0] + "?";
    return firstQuestion.length > 50
      ? `${firstQuestion.substring(0, 47)}...`
      : firstQuestion;
  } else {
    // If not a question, try to extract the first sentence or use the first 50 chars
    const sentenceEnd = Math.min(
      message.indexOf(".") > 0 ? message.indexOf(".") : Infinity,
      message.indexOf("!") > 0 ? message.indexOf("!") : Infinity,
      50,
    );

    if (sentenceEnd === Infinity) {
      // No sentence breaks found within limit, just use first 50 chars
      return message.length > 50 ? `${message.substring(0, 47)}...` : message;
    } else {
      // Use the first sentence
      return message.substring(0, sentenceEnd + 1);
    }
  }
}
