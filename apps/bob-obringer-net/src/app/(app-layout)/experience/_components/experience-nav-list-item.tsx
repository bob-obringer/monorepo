"use client";

import { HTMLAttributeAnchorTarget } from "react";
import { cx, Text } from "@bob-obringer/design-system";
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
        "w-full min-w-40 rounded transition-colors md:min-w-0",
        isSelected
          ? "bg-[#112840] outline outline-1 -outline-offset-1 outline-[#154467]"
          : "hover:bg-[#112840] hover:bg-opacity-25 hover:outline hover:outline-1 hover:-outline-offset-1 hover:outline-[#154467]",
      )}
    >
      <NextLink
        href={url}
        target={target}
        className="text-color-link hover:text-color-link-hover block p-2 transition-colors duration-300 ease-in-out"
      >
        <Text as="div" variant="body-medium" className="line-clamp-1">
          {title}
        </Text>
        <Text
          as="div"
          variant="body-small"
          color="secondary"
          className="line-clamp-1"
        >
          {subtitle}
        </Text>
      </NextLink>
    </li>
  );
}
