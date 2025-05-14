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

export async function getChatTitle(userMessages: Array<string>) {
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
    console.error("Error generating title with LLM:", llmError);
  }

  return title;
}

export async function updateArchivedChatTitle(
  chatId: string,
  userMessages: Array<string>,
) {
  const title = await getChatTitle(userMessages);
  await supabaseServerClient.from("chats").update({ title }).eq("id", chatId);
}
