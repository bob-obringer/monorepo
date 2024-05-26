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
  const segment = segments[0];

  // don't display the header on the homepage
  if (!segment) {
    return null;
  }

  return (
    <header
      className={cx(
        className,
        "flex h-28 flex-col items-center justify-center px-5",
      )}
    >
      <Text as="h2" variant="display-medium">
        Bob Obringer
      </Text>
      <Text as="h1" variant="headline-large" color="secondary">
        {titles[segment] ?? ""}
      </Text>
    </header>
  );
}
