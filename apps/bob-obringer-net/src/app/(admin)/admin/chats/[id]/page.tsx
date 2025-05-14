import { supabaseServerClient } from "@/integrations/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { ChatMessage } from "../components/chat-message";
import { H1, P } from "@bob-obringer/design-system";
import { NextPageProps } from "@/integrations/nextjs/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatDetailPage(
  props: NextPageProps<{ id: string }>,
) {
  const { id } = await props.params;

  // Fetch chat details
  const { data: chat, error: chatError } = await supabaseServerClient
    .from("chats")
    .select("*")
    .eq("id", id)
    .single();

  if (chatError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive rounded-md p-4">
          Error loading chat: {chatError.message}
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="p-6">
        <div className="bg-warning/10 text-warning rounded-md p-4">
          Chat not found
        </div>
      </div>
    );
  }

  // Fetch messages for this chat
  const { data: messages, error: messagesError } = await supabaseServerClient
    .from("messages")
    .select("*")
    .eq("chat_id", id)
    .order("timestamp", { ascending: true });

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Fixed header with solid background */}
      <div className="bg-card border-border sticky top-0 z-20 flex h-[72px] flex-col justify-center border-b p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <H1 variant="title" className="mb-0">
              {chat.title || `Chat ${chat.id.substring(0, 8)}...`}
            </H1>
            <P variant="caption" color="subtle" className="mt-0">
              Created{" "}
              {formatDistanceToNow(new Date(chat.created_at), {
                addSuffix: true,
              })}
            </P>
          </div>
          {chat.location && (
            <P variant="caption" color="subtle" className="ml-4">
              <span className="font-medium">Location:</span> {chat.location}
            </P>
          )}
        </div>
      </div>

      {/* Messages content area - scrollable container */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messagesError && (
          <div className="bg-destructive/10 text-destructive mb-6 rounded-md p-4">
            Error loading messages: {messagesError.message}
          </div>
        )}

        {messagesError && messagesError.message.includes("does not exist") ? (
          <div className="bg-muted border-border rounded-lg border p-12 text-center">
            <P variant="lead" className="mb-2">
              Database schema issue
            </P>
            <P color="subtle" variant="body-small">
              There appears to be a mismatch in the database schema. Please
              check the console for details.
            </P>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="bg-muted border-border rounded-lg border p-12 text-center">
            <P variant="lead" className="mb-2">
              No messages found
            </P>
            <P color="subtle" variant="body-small">
              This chat doesn&apos;t contain any messages yet.
            </P>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
