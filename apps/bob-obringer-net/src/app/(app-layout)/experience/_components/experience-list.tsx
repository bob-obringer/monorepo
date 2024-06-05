"use client";

import { cx, Text } from "@bob-obringer/design-system";
import { ReactNode } from "react";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ResumeCompany } from "@/features/sanity-io/queries/resume-company";

export function ExperienceList({
  resumeCompanies,
}: {
  resumeCompanies: ResumeCompany[];
}) {
  const segments = useSelectedLayoutSegments();
  const selectedCompany = segments[0];

  return (
    <>
      <ul className="border-b-color-tertiary mb-1.5 border-b py-1.5">
        <ExperienceListItem />
      </ul>
      <ul
        className={cx(
          "flex md:space-y-1 md:px-0",
          selectedCompany && "flex-row space-x-1 md:flex-col md:space-x-0",
          !selectedCompany && "flex-col",
        )}
      >
        {resumeCompanies.map((company) => (
          <ExperienceListItem key={company._id} company={company} />
        ))}
      </ul>
    </>
  );
}

function ExperienceListItem({ company }: { company?: ResumeCompany } = {}) {
  const segments = useSelectedLayoutSegments();
  const slug = segments[0];

  const isSelected = slug === company?.slug;

  return (
    <li
      className={cx(
        "min-w-36 p-2",
        isSelected
          ? "rounded bg-[#112840] outline outline-1 -outline-offset-1 outline-[#154467] transition-colors"
          : "",
      )}
    >
      <ExperienceItemLink
        href={company ? `/experience/${company.slug}` : "/experience"}
      >
        <Text as="div" variant="body-medium" className="line-clamp-1">
          {company?.name ?? "Bob Obringer"}
        </Text>
        <Text
          as="div"
          variant="body-small"
          color="secondary"
          className="line-clamp-1"
        >
          {company?.position ?? "Product Engineer"}
        </Text>
      </ExperienceItemLink>
    </li>
  );
}

function ExperienceItemLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <NextLink
      href={href}
      className="text-color-link hover:text-color-link-hover transition-colors duration-300 ease-in-out"
    >
      {children}
    </NextLink>
  );
}