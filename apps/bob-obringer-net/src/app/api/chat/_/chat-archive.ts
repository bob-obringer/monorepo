import {
  addSupabaseMessage,
  createSupabaseChat,
  SenderRole,
} from "@/integrations/supabase/helpers";
import { getLocation, updateArchivedChatTitle } from "@/app/api/chat/_/helpers";

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

export async function archiveChat({
  chatId,
  isFirstMessage,
  userMessage,
  assistantMessage,
  userMessages,
}: {
  chatId: string;
  isFirstMessage: boolean;
  userMessage: string;
  assistantMessage: string;
  userMessages: Array<string>;
}) {
  try {
    console.log(userMessages);
    if (isFirstMessage) {
      const location = await getLocation();
      await createSupabaseChat(chatId, undefined, location);
    }
    await addSupabaseMessage(chatId, "user", userMessage);
    await addSupabaseMessage(chatId, "assistant", assistantMessage);
    await updateArchivedChatTitle(chatId, userMessages);
  } catch (e) {
    console.error("Error in archiveChat:", e);
  }
}
