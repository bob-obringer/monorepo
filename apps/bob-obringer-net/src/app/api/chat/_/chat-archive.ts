import {
  addSupabaseMessage,
  createSupabaseChat,
  SenderRole,
} from "@/integrations/supabase/helpers";
// import { MessageContext } from "@/features/ai-chatbot/server/types";
import { getLocation } from "@/app/api/chat/_/helpers";

export async function createChatArchive(context: MessageContext) {
  let newChatId: string | null = null;
  try {
    const location = await getLocation();
    newChatId = await createSupabaseChat(undefined, location);
    if (newChatId) {
      const aiState = context.aiState.get();
      aiState.supabaseChatId = newChatId;
      context.aiState.update(aiState);
    } else {
      console.error(
        "Failed to create Supabase chat, cannot archive first message.",
      );
    }
  } catch (e) {
    console.error("Error in Supabase chat creation:", e);
  }
  return newChatId;
}

export async function addMessageToArchive(
  chatId: string | null,
  role: SenderRole,
  message: string,
) {
  if (!chatId) return;
  try {
    await addSupabaseMessage(chatId, role, message);
  } catch (e) {
    console.error("Error adding user message to Supabase:", e);
  }
}
