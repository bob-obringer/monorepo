import { Text } from "@bob-obringer/design-system";
import {
  getResumeCompany,
  ResumeCompany,
} from "@/features/sanity-io/queries/resume-company";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CompanySkills } from "@/app/(app-layout)/experience/_components/experience-skills";

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
    <main className="space-y-5 px-5 pb-8 md:pl-0">
      <div>
        <Text as="h3" variant="title-large">
          {company.name}
        </Text>
        <Text as="h4" variant="title-medium" color="secondary">
          {company.position}
        </Text>
      </div>

      <hr className="h-px border-0 bg-[#ffffff22]" />
      <div className="flex flex-1 flex-col space-y-10 md:flex-row md:space-x-10 md:space-y-0">
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
        <div className="flex flex-1 flex-col space-y-5">
          <CompanySkills company={company} />
          <hr className="h-px border-0 bg-[#ffffff22]" />
          <div className="flex flex-col space-y-5">
            <CompanyMeta company={company} />
          </div>
        </div>
      </div>
    </main>
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
