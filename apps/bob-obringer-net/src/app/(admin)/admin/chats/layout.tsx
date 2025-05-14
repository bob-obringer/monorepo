import { ReactNode } from "react";
import { supabaseServerClient } from "@/integrations/supabase/server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { H2, P, Div } from "@bob-obringer/design-system";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ChatArchivesLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id?: string };
}) {
  // Fetch chats from Supabase
  const { data: chats, error } = await supabaseServerClient
    .from("chats")
    .select("id, title, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching chats:", error);
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left sidebar - fixed width with scrollable chat list */}
      <div className="border-border flex h-full w-80 flex-shrink-0 flex-col border-r">
        {/* Fixed header */}
        <div className="border-border bg-bg-alternate sticky top-0 z-10 flex h-[72px] flex-shrink-0 items-center p-4 shadow-sm">
          <H2 variant="title">Chat Archives</H2>
        </div>

        {/* Scrollable chat list */}
        <div className="bg-bg-alternate flex-1 overflow-y-auto">
          {error && (
            <div className="bg-destructive/10 text-destructive m-3 rounded-md p-3 text-sm">
              Error: {error.message}
            </div>
          )}

          {!chats || chats.length === 0 ? (
            <Div color="subtle" className="p-4 text-sm">
              No chats found
            </Div>
          ) : (
            <div className="space-y-1 p-3">
              {chats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/admin/chats/${chat.id}`}
                  className={`hover:bg-accent block rounded-md p-3 text-sm ${
                    params.id === chat.id ? "bg-accent" : ""
                  }`}
                >
                  <Div className="truncate font-medium">
                    {chat.title || `Chat ${chat.id.substring(0, 8)}...`}
                  </Div>
                  <P variant="caption" className="mt-1">
                    Updated{" "}
                    {formatDistanceToNow(new Date(chat.updated_at), {
                      addSuffix: true,
                    })}
                  </P>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right content area - scrollable content */}
      <div className="bg-background h-full flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
