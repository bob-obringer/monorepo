import { ResumeCompany } from "@/features/sanity-io/queries/resume-company";
import { ResumeSkill } from "@/features/sanity-io/queries/resume-skills";

export function getSystemPrompt({
  systemPromptInstructions,
  skills,
  companies,
  bio,
}: {
  systemPromptInstructions?: string | null;
  skills: Array<ResumeSkill>;
  companies: Array<ResumeCompany>;
  bio?: string | null;
}) {
  return `
${systemPromptInstructions}

Biography:
${bio}

Skills:
${getFormattedSkills(skills)}

Career History:
${getFormattedJobs(companies)}
`;
}

export function getFormattedJobs(resumeCompanies: ResumeCompany[]) {
  return resumeCompanies
    .map(
      ({
        startDate,
        endDate,
        industry,
        name,
        position,
        size,
        highlights,
        isConsultant,
        summary,
      }) => {
        const start = startDate?.substring(0, 4);
        const end = endDate?.substring(0, 4);
        const endText = endDate ? end : "today";
        const startEnd =
          start === end ? `In ${start}` : `From ${start} to ${endText}`;
        const employeeTypeText = isConsultant ? "a consultant" : "an employee";
        const summaryText = summary
          ? `\nBob's thoughts about his time there: ${summary}`
          : "";
        const highlightText = highlights
          ?.map(
            ({
              text,
              additionalInformation,
              additionalInformationForChatbot,
            }) => {
              // todo: we should pull additional in from vector db instead
              //  of shoving everything into the context
              const additionalInfo = additionalInformation
                ? `\n${additionalInformation}`
                : "";
              const additionalInfoForChatbot = additionalInformationForChatbot
                ? `\n${additionalInformationForChatbot}`
                : "";

              return `- ${text}${additionalInfo}${additionalInfoForChatbot}`;
            },
          )
          .join("\n");

        return `
${startEnd}, Bob worked as ${employeeTypeText} in the ${industry?.name} industry at ${name}, 
with approximately ${size} employees, as a ${position}.
${summaryText}

He worked on the following projects:
${highlightText}`;
      },
    )
    .join("\n\n");
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

/*
  For now we're just putting our whole resume in the prompt.
  Doing rag on this makes more sense when we have more writings to index
*/

// export async function getRelevantCompanyHighlights(
//   resumeCompanies: ResumeCompany[],
//   message: string,
// ) {
//   const res = await pinecone.query("resume-company-highlights", message);
//   if (res.isErr()) {
//     return null;
//   }
//
//   return res.value.matches
//     .map(({ id }) => {
//       const idParts = id.split(":");
//       const companyId = idParts[1];
//       const highlightsKey = idParts[3];
//
//       const company = resumeCompanies.find(({ _id }) => _id === companyId);
//       const highlight = company?.highlights?.find(
//         ({ _key }) => _key === highlightsKey,
//       );
//       const skills = (highlight?.skills ?? [])
//         .map(({ name }) => name)
//         .join(", ");
//       return `At ${company?.name} Bob worked on "${highlight?.text}" using ${skills}`;
//     })
//     .join("\n\n");
// }
