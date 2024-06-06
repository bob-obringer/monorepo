"use client";

import { useSelectedLayoutSegments } from "next/navigation";

const titles: Record<string, string> = {
  experience: "Experience",
  stack: "Stack",
  contact: "Contact",
};

export function PageTitle() {
  const segments = useSelectedLayoutSegments();
  const segment = segments[0] ?? "";

  return titles[segment] ?? null;
}
