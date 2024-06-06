"use client";

import { cx, Text } from "@bob-obringer/design-system";
import { PageTitle } from "@/app/(app-layout)/_layout/page-title";
import { useSelectedLayoutSegments } from "next/navigation";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";

export function AppHeader({ className }: { className?: string }) {
  const { isOpen } = useChatbot();
  const segments = useSelectedLayoutSegments();
  const isHome = segments.length === 0;

  return (
    <header
      className={cx(
        className,
        "flex h-28 flex-col items-center justify-end px-5 pb-5 transition-all duration-300",
        isHome && !isOpen ? "z-20 h-[40svh]" : "",
      )}
    >
      <Text as="h2" variant="display-medium">
        Bob Obringer
      </Text>
      <Text as="h1" variant="headline-large" color="secondary">
        <PageTitle />
      </Text>
    </header>
  );
}
