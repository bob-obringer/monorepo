"use client";

import { HTMLAttributeAnchorTarget } from "react";
import { cx, Text } from "@bob-obringer/components";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

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
      className={cx(
        "bg-color-transparent group w-full min-w-40 rounded transition-colors md:min-w-0",
        isSelected ? "bg-color-primary" : "hover:bg-color-secondary",
      )}
    >
      <NextLink href={url} target={target} className="block p-2">
        <Text
          as="div"
          variant="body-medium"
          className={cx(
            "line-clamp-1 transition-colors",
            isSelected ? "text-color-primary" : "text-color-secondary",
            "group-hover:text-color-primary",
          )}
        >
          {title}
        </Text>
        <Text
          as="div"
          variant="body-small"
          className={cx(
            "line-clamp-1 transition-colors",
            isSelected ? "text-color-secondary" : "text-color-tertiary",
            "group-hover:text-color-secondary",
          )}
        >
          {subtitle}
        </Text>
      </NextLink>
    </li>
  );
}
