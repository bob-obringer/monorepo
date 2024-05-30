import { ResumeCompany } from "@/features/sanity-io/queries/resume-company";
import { ResumeSkill } from "@/features/sanity-io/queries/resume-skills";
import { pinecone } from "@/services/pinecone";

export function getSystemPrompt({
  systemPromptInstructions,
  formattedSkills,
  formattedJobs,
  bio,
  highlights,
}: {
  systemPromptInstructions?: string | null;
  formattedSkills?: string | null;
  formattedJobs?: string | null;
  bio?: string | null;
  highlights?: string | null;
}) {
  return `
${systemPromptInstructions}

Skills:
${formattedSkills}

Career History:
${formattedJobs}

Career Highlights:
${highlights}

Biography:
${bio}  

FINAL INSTRUCTIONS:
When returning markdown, do not wrap with any html or other content that specifically marks
it as markdown. Just return the markdown
`;
}
// leave final instructions here, as they are low level instructions related to how our code
// processes the response.
//
// Ultimately, we should strip out any html or other content that marks it as markdown
// but for now, lets just hope the llm listens to us

export function getFormattedJobs(resumeCompanies: ResumeCompany[]) {
  return resumeCompanies
    .map(({ startDate, endDate, industry, name, position, size }) => {
      const start = startDate?.substring(0, 4);
      const end = endDate?.substring(0, 4);
      const endText = endDate ? end : "today";
      const startEnd =
        start === end ? `In ${start}` : `From ${start} to ${endText}`;

      return `${startEnd}, Bob worked in the ${industry?.name} industry at ${name}, with approximately ${size} employees, as a ${position}.`;
    })
    .join("\n");
}

export function getFormattedSkills(resumeSkills: Array<ResumeSkill>) {
  const skillsByCategory: Record<string, string[]> = {};
  for (const skill of resumeSkills) {
    const category = skill.category?.name ?? "Uncategorized";
    if (!skillsByCategory[category]) {
      skillsByCategory[category] = [];
    }
    skillsByCategory[category]?.push(skill.name ?? "");
  }
  return Object.entries(skillsByCategory)
    .map(([category, skills]) => {
      return `In skills category "${category}", Bob has experience with "${skills.join('", "')}"`;
    })
    .join("\n");
}

export async function getRelevantCompanyHighlights(
  resumeCompanies: ResumeCompany[],
  message: string,
) {
  const res = await pinecone.query("resume-company-highlights", message);
  if (res.isErr()) {
    return null;
  }

  return res.value.matches
    .map(({ id }) => {
      const idParts = id.split(":");
      const companyId = idParts[1];
      const highlightsKey = idParts[3];

      const company = resumeCompanies.find(({ _id }) => _id === companyId);
      const highlight = company?.highlights?.find(
        ({ _key }) => _key === highlightsKey,
      );
      const skills = (highlight?.skills ?? [])
        .map(({ name }) => name)
        .join(", ");
      return `At ${company?.name} Bob worked on "${highlight?.text}" using ${skills}`;
    })
    .join("\n\n");
}
