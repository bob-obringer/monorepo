"use client";

import { cn } from "@/helpers/cn";
import { H1, H2 } from "@bob-obringer/design-system";
import { AboutBob } from "@bob-obringer/sanity-io-types";
import { useSelectedLayoutSegments } from "next/navigation";
import { useBobsChatbot } from "@/features/ai-chatbot/context/chat-context";

const titles: Record<string, string> = {
  experience: "Experience",
  stack: "Stack",
  contact: "Contact",
  projects: "Projects",
};

export function Header({
  className,
  aboutBob,
}: {
  className?: string;
  aboutBob: AboutBob | null;
}) {
  const { isOpen } = useBobsChatbot();
  const segments = useSelectedLayoutSegments();
  const segment = segments[0] ?? "";
  const isHome = segments.length === 0;

  return (
    <header
      className={cn(
        className,
        "bg-background border-b transition-all duration-300",
        "mb-5 flex h-28 flex-col items-center justify-center px-5",
        isHome && !isOpen
          ? "border-text-subtle/0 h-[40svh] justify-end pb-5"
          : "border-text-subtle/20",
      )}
    >
      <H2
        className="font-display"
        variant={isHome ? "display" : "heading-2"}
        as={isHome ? "h1" : undefined}
        margin={false}
      >
        {aboutBob?.name}
      </H2>
      <H1 className="font-display -mt-1" margin={false}>
        {titles[segment] ?? null}
      </H1>
    </header>
  );
}
