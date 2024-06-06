import { Text } from "@bob-obringer/design-system";
import {
  getResumeCompany,
  ResumeCompany,
} from "@/features/sanity-io/queries/resume-company";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CompanySkills } from "@/app/(app-layout)/experience/_components/experience-skills";
import { ExperiencePageBody } from "@/app/(app-layout)/experience/_layout/experience-page-body";

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const company = await getResumeCompany({ slug });
  if (!company) return notFound();

  return {
    title: `${company.name} - Bob Obringer`,
    description: `Bob's experience at ${company.name}`,
  };
}

export default async function ResumePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const company = await getResumeCompany({ slug });
  if (!company) return notFound();

  return (
    <ExperiencePageBody
      title={company.name ?? ""}
      subtitle={company.position ?? ""}
      body={
        <ul className="flex-[2] space-y-5">
          {company.highlights?.map((highlight) => (
            <Text
              key={highlight.text}
              as="li"
              variant="body-large"
              className="text-pretty"
            >
              {highlight.text}
            </Text>
          ))}
        </ul>
      }
      sidebar={
        <>
          <CompanySkills company={company} />
          <hr className="border-color-tertiary my-4" />
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
        <Text variant="body-medium" color="secondary">
          {startDate}
          {endDate !== startDate ? ` to ${endDate}` : ""}
        </Text>
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
      <Text as="h4" variant="label-small" color="tertiary">
        {title}
      </Text>
      {children && (
        <Text variant="body-medium" color="secondary">
          {children}
        </Text>
      )}
    </div>
  );
}
