"use client";
import { cx, Text } from "@bob-obringer/design-system";
import { useSelectedLayoutSegments } from "next/navigation";

const titles: Record<string, string> = {
  experience: "Experience",
  stack: "Stack",
  contact: "Contact",
};

export function AppHeader({ className }: { className?: string }) {
  const segments = useSelectedLayoutSegments();

  // don't display the header on the homepage
  if (segments.length === 0) {
    return null;
  }

  return (
    <header
      className={cx(
        className,
        "flex h-24 flex-col items-center justify-center px-5",
      )}
    >
      <Text as="h2" variant="display-small">
        Bob Obringer
      </Text>
      <Text as="h1" variant="title-expanded-medium" color="secondary">
        {titles[segments[0]] ?? ""}
      </Text>
    </header>
  );
}
