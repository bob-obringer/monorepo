import { ResumeCompany } from "@/features/sanity-io/queries/resume-company";
import type { EmbeddableRecord } from "@bob-obringer/ai-pinecone";
import { getIndustryById } from "@/features/sanity-io/queries/resume-industries";
import { pinecone } from "@/services/pinecone";

export async function handleResumeCompanyCreateOrUpdate(
  company: ResumeCompany,
) {
  const properties: Array<EmbeddableRecord> = [];

  for (const highlight of company.highlights ?? []) {
    const industry =
      (await getIndustryById(company.industry?.name ?? "")) ?? "";

    const start = company.startDate?.substring(0, 4);
    const end = company.endDate?.substring(0, 4);
    const endText = company.endDate ? `to ${end}` : "today";
    const startEnd =
      start === end ? `In ${start}` : `From ${start} to ${endText}`;
    const skills = highlight.skills?.map((skill) => skill.name).join('", "');
    const text = `${startEnd} at ${company.name} in the ${industry} industry, Bob worked on "${highlight.text}" using "${skills}"`;

    // todo: this id is way too specific, centralize creation and consumption
    properties.push({
      id: `ResumeCompany:${company._id}:Highlight:${highlight._key}`,
      text,
    });
  }

  await pinecone.upsert("resume-company-highlights", properties);
}
