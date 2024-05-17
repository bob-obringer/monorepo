import { StreamingTextResponse, streamText, CoreMessage } from "ai";
import { defaultModel } from "@/services/llms";
import { getDocument } from "@/services/sanity-io/get-document";
import { pinecone } from "@/services/pinecone";
import {
  getResumeCompanies,
  ResumeCompany,
} from "@/services/sanity-io/resume-company-helpers";
import {
  getResumeSkills,
  ResumeSkill,
} from "@/services/sanity-io/resume-skills-helpers";

const model = defaultModel;

export async function POST(req: Request) {
  const json = await req.json();
  const messages = json.messages as CoreMessage[];

  const skills = await getResumeSkills();
  const resumeCompanies = await getResumeCompanies();

  const jobs = getAllJobs(resumeCompanies);
  const formattedSkills = getFormattedSkills(skills);

  const highlights = await getRelevantCompanyHighlights(
    resumeCompanies,
    messages,
  );

  const obringerAssistant = await getDocument("obringerAssistant");
  const homepage = await getDocument("homepage");
  const system = `
${obringerAssistant.systemPrompt}

Skills:
${formattedSkills}

Career History:
${jobs}

Career Highlights:
${highlights}

Biography:
${homepage.bio}  
  `;

  console.log(system);

  const result = await streamText({
    system,
    messages,
    model,
    temperature: 0.2,
  });
  return new StreamingTextResponse(result.toAIStream());
}

function getAllJobs(resumeCompanies: ResumeCompany[]) {
  return resumeCompanies
    .map(({ startDate, endDate, industry, name, position }) => {
      const start = startDate?.substring(0, 4);
      const end = endDate?.substring(0, 4);
      const endText = endDate ? end : "today";
      const startEnd =
        start === end ? `In ${start}` : `From ${start} to ${endText}`;

      return `${startEnd}, Bob worked in the ${industry?.name} industry at ${name} as a ${position}.`;
    })
    .join("\n");
}

function getFormattedSkills(resumeSkills: ResumeSkill[]) {
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

async function getRelevantCompanyHighlights(
  resumeCompanies: ResumeCompany[],
  messages: CoreMessage[],
) {
  const userMessages = messages.filter((message) => message.role === "user");
  const latestMessage = userMessages.slice(-1).reverse();
  if (!latestMessage) {
    return null;
  }

  const res = await pinecone.query(
    "resume-company-highlights",
    String(latestMessage.map(({ content }) => content).join("\n")),
  );
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
