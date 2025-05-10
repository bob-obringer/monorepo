"use client";

import { HTMLAttributeAnchorTarget } from "react";
import { cn } from "@/helpers/cn";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { Div } from "@bob-obringer/design-system";

export function ExperienceNavListItem({
  url,
  slug,
  title,
  subtitle,
  target,
}: {
  url: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  target?: HTMLAttributeAnchorTarget;
}) {
  const segments = useSelectedLayoutSegments();
  const isSelected = (segments[0] ?? "") === slug;

  return (
    <li
      className={cn(
        "group w-full min-w-40 rounded-lg bg-transparent transition-colors lg:min-w-0",
        isSelected ? "bg-bg-highlight" : "hover:bg-foreground/5",
      )}
    >
      <NextLink href={url} target={target} className="group block p-2">
        <Div
          color={isSelected ? "bright" : "subtle"}
          semibold
          className="group-hover:text-foreground line-clamp-1 transition-colors"
        >
          {title}
        </Div>
        <Div
          color={isSelected ? "bright" : "subtle"}
          variant="body-small"
          className="group-hover:text-foreground line-clamp-1 transition-colors"
        >
          {subtitle}
        </Div>
      </NextLink>
    </li>
  );
}
