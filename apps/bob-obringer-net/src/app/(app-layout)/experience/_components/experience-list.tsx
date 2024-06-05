"use client";

import { cx, Text } from "@bob-obringer/design-system";
import { HTMLAttributeAnchorTarget } from "react";
import NextLink from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { ResumeCompany } from "@/features/sanity-io/queries/resume-company";

export function ExperienceList({
  resumeCompanies,
}: {
  resumeCompanies: ResumeCompany[];
}) {
  const segments = useSelectedLayoutSegments();
  const selectedSlug = segments[0];

  return (
    <div className="flex flex-row md:flex-col">
      <ul className="border-color-tertiary mr-1.5 border-r px-1.5 md:mb-1.5 md:mr-0 md:border-b md:border-r-0 md:px-0 md:py-1.5">
        <ExperienceItem
          url={"/experience"}
          isSelected={!selectedSlug}
          title={"Bob Obringer"}
          subtitle={"Product Engineer"}
        />
      </ul>
      <ul
        className={cx(
          "flex md:space-y-1 md:px-0",
          "flex-row space-x-1 md:flex-col md:space-x-0",
        )}
      >
        {resumeCompanies.map((company) => (
          <CompanyListItem key={company._id} company={company} />
        ))}
      </ul>
      <ul className="border-color-tertiary ml-1.5 border-l px-1.5 md:ml-0 md:mt-1.5 md:border-l-0 md:border-t md:px-0 md:py-1.5">
        <ExperienceItem
          url={"https://api.obringer.net/resume"}
          isSelected={false}
          title={"Resume / CV"}
          subtitle={"Download PDF"}
          target={"_blank"}
        />
      </ul>
    </div>
  );
}

function CompanyListItem({ company }: { company: ResumeCompany }) {
  const segments = useSelectedLayoutSegments();
  const slug = segments[0];
  const isSelected = slug === company?.slug;
  return (
    <ExperienceItem
      isSelected={isSelected}
      title={company.name}
      subtitle={company.position}
      url={`/experience/${company.slug}`}
    />
  );
}

function ExperienceItem({
  url,
  isSelected,
  title,
  subtitle,
  target,
}: {
  url: string;
  isSelected: boolean;
  title?: string;
  subtitle?: string;
  target?: HTMLAttributeAnchorTarget;
}) {
  return (
    <li
      className={cx(
        "min-w-40 md:min-w-0",
        isSelected
          ? "rounded bg-[#112840] outline outline-1 -outline-offset-1 outline-[#154467] transition-colors"
          : "",
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
