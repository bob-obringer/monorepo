import {
  getResumeCompany,
  ResumeCompany,
} from "@/integrations/sanity-io/queries/resume-company";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CompanySkills } from "@/app/(public)/experience/_components/experience-skills";
import { ExperiencePageBody } from "@/app/(public)/experience/_layout/experience-page-body";
import { H4, Span, Typography } from "@bob-obringer/design-system";
import { NextPageProps } from "@/integrations/nextjs/types";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: NextPageProps<{ slug: string }>) {
  const { slug } = await params;
  const company = await getResumeCompany({ slug });
  if (!company) return notFound();

  return {
    title: `${company.name} - Bob Obringer`,
    description: `Bob's experience at ${company.name}`,
  };
}

export default async function ResumePage({
  params,
}: NextPageProps<{ slug: string }>) {
  const { slug } = await params;
  const company = await getResumeCompany({ slug });
  if (!company) return notFound();

  return (
    <ExperiencePageBody
      title={company.name ?? ""}
      subtitle={company.position ?? ""}
      body={
        <ul className="flex-[2] space-y-5">
          {company.highlights?.map((highlight) => (
            <Typography
              key={highlight.text}
              as="li"
              variant="body-large"
              pretty
            >
              {highlight.text}
            </Typography>
          ))}
        </ul>
      }
      sidebar={
        <>
          <CompanySkills company={company} />
          <hr className="border-foreground/20 my-4" />
          <div className="flex flex-col space-y-5">
            <CompanyMeta company={company} />
          </div>
        </>
      }
    />
  );
}

function CompanyMeta({ company }: { company: ResumeCompany }) {
  const startDate = company.startDate?.substring(0, 4);
  const endDate = company.endDate?.substring(0, 4) ?? "Today";

  return (
    <>
      <CategorizedGroup title="Industry">
        {company.industry?.name}
      </CategorizedGroup>
      <CategorizedGroup title="Size">
        {Number(company.size).toLocaleString()}
      </CategorizedGroup>
      <CategorizedGroup
        title={`${company.isConsultant ? "Consultant" : "Employee"} ${startDate === endDate ? "In" : "From"}`}
      >
        <Span color="subtle">
          {startDate}
          {endDate !== startDate ? ` to ${endDate}` : ""}
        </Span>
      </CategorizedGroup>
    </>
  );
}

function CategorizedGroup({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <H4 variant="label" color="faint">
        {title}
      </H4>
      {children && <Span color="subtle">{children}</Span>}
    </div>
  );
}
