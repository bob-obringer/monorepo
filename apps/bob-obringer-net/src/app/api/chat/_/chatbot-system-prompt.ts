import { ResumeCompany } from "@/integrations/sanity-io/queries/resume-company";
import { ResumeSkill } from "@/integrations/sanity-io/queries/resume-skills";
import { getDocument } from "@/services/sanity-io-client";
import { getResumeSkills } from "@/integrations/sanity-io/queries/resume-skills";
import { getResumeCompanies } from "@/integrations/sanity-io/queries/resume-company";
import { AboutBob, ChatbotConfig } from "@bob-obringer/sanity-io-types";

export async function getSystemPrompt() {
  // grab everything from the cms
  const [aboutBob, chatbotConfig, skills, companies] = (await Promise.all([
    getDocument("aboutBob"),
    getDocument("chatbotConfig"),
    getResumeSkills(),
    getResumeCompanies(),
  ])) as [AboutBob, ChatbotConfig, Array<ResumeSkill>, Array<ResumeCompany>];

  const systemPromptInstructions = chatbotConfig.systemPromptInstructions ?? "";
  const bio = aboutBob.bio ?? "";

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
