/**
 * Supabase Helper Functions for AI Chatbot
 *
 * These functions provide an interface for interacting with the Supabase
 * database to archive chat conversations.
 */
import { supabaseServerClient } from "./server";

/**
 * Creates a new chat record in the database
 *
 * @param title Optional title for the chat
 * @param location Optional location information for the chat
 * @returns The UUID of the created chat, or null if creation failed
 */
export async function createSupabaseChat(
  id: string,
  title?: string,
  location?: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabaseServerClient
      .from("chats")
      .upsert({ id, title, location }, { onConflict: 'id' })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating chat in Supabase:", error);
      return null;
    }

    return data.id;
  } catch (e) {
    console.error("Exception in createSupabaseChat:", e);
    return null;
  }
}

/**
 * Sender role type for messages
 */
export type SenderRole = "user" | "assistant" | "system";

/**
 * Adds a message to an existing chat
 *
 * @param chatId The UUID of the chat to add the message to
 * @param role The role of the message sender (user, assistant, or system)
 * @param content The content of the message
 * @returns True if the message was added successfully, false otherwise
 */
export async function addSupabaseMessage(
  chatId: string,
  role: SenderRole,
  content: string,
): Promise<boolean> {
  if (!chatId) {
    console.error("Cannot add message: Missing chat ID");
    return false;
  }

  try {
    const { error } = await supabaseServerClient.from("messages").insert({
      chat_id: chatId,
      role,
      content,
    });

    if (error) {
      console.error("Error adding message to Supabase:", error);
      return false;
    }

    // Note: We no longer generate titles here automatically
    // Title generation is now handled directly in the server action using Haiku

    return true;
  } catch (e) {
    console.error("Exception in addSupabaseMessage:", e);
    return false;
  }
}
