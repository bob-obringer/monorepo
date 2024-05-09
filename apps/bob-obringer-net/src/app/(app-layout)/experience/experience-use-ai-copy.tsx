"use client";

import { Text } from "@bob-obringer/design-system";
import { useSelectedLayoutSegments } from "next/navigation";

export function ExperienceUseAiCopy() {
  const segments = useSelectedLayoutSegments();
  if (segments.length > 0) return null;

  return (
    <Text
      as="div"
      variant="body-medium"
      color="tertiary"
      className="pb-4 pt-2 text-center"
    >
      <i>
        {`You can press an experience item below, but it's more`}
        <br />
        {`fun to `}
        <span className="text-color-secondary">
          learn about Bob using the AI assistant below
        </span>{" "}
      </i>
    </Text>
  );
}
