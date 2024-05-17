import { ResumeCompany } from "@/services/sanity-io/resume-company-helpers";
import type { EmbeddableRecord } from "@bob-obringer/ai-pinecone";
import { getIndustryById } from "@/services/sanity-io/resume-industries-helpers";
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

    properties.push({
      id: `ResumeCompany:${company._id}:Highlight:${highlight._key}`,
      text,
    });
  }

  await pinecone.upsert("resume-company-highlights", properties);
}
