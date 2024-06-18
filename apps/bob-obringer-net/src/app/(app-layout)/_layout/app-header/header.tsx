"use client";

import { cx } from "@bob-obringer/components";
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
        "bg-color-primary border-color-tertiary border-opacity-1 border-b transition-all duration-300",
        "mb-5 flex h-28 flex-col items-center justify-end px-5 pb-5",
        isHome && !isOpen ? "h-[40svh] border-opacity-0" : "",
      )}
    >
      {children}
    </header>
  );
}
