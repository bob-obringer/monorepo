"use client";

import { cx } from "@bob-obringer/design-system";
import { useSelectedLayoutSegments } from "next/navigation";
import { useChatbot } from "@/features/ai-chatbot/context/chatbot-inner-context";
import { ReactNode } from "react";

export function Header({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
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
      {children}
    </header>
  );
}
