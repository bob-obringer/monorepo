import {
  ResumeCompany,
  ResumeCompanyHighlight,
} from "@bob-obringer/bob-obringer-net-cms/types";
import { getResumeSkills } from "@/services/sanity";
import { getCollection } from "@/services/chroma";

type ResJson = Record<string, unknown>;

export async function POST(req: Request) {
  const res = await req.json();

  try {
    if (isResumeCompany(res)) await handleResumeCompany(res);
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.log(e as Error);
    return new Response("Error", { status: 500 });
  }
}

async function handleResumeCompany(company: ResumeCompany) {
  const textsToEmbed = [];

  for (const highlight of company.highlights ?? []) {
    const skillsMap = await getHighlightSkillsByCategoryText(highlight);
    const textToEmbed = `
Company: ${company.name}
Years: ${company.startDate} to ${company.endDate ?? ""}
Highlight: ${highlight.text}
Skills: ${JSON.stringify(Object.fromEntries(skillsMap))}
`;
    textsToEmbed.push({ highlight, textToEmbed });
  }

  const textToEmbed = textsToEmbed.map(({ textToEmbed }) => textToEmbed);

  const chromaCollection = await getCollection("resume-company-highlights");

  await chromaCollection.upsert({
    documents: textToEmbed,
    ids: textsToEmbed.map(({ highlight }) => highlight._key),
  });
}

type SkillsById = Map<
  string,
  {
    name: string | null;
    category: string | null | undefined;
  }
>;

let _skillsById: SkillsById;

async function getSkillsById(): Promise<SkillsById> {
  if (!_skillsById) {
    const skills = await getResumeSkills();
    _skillsById = new Map(
      skills.map(({ _id, name, category }) => [
        _id,
        { name, category: category?.name },
      ]),
    );
  }
  return _skillsById;
}

async function getHighlightSkillsByCategoryText(
  highlight: ResumeCompanyHighlight,
) {
  const skillsById = await getSkillsById();

  const highlightSkillsByCategory = new Map<string, string[]>();
  for (const skill of highlight.skills ?? []) {
    const s = skillsById.get(skill._ref);
    if (!s) continue;
    const category = s.category ?? "Uncategorized";
    if (!highlightSkillsByCategory.has(category)) {
      highlightSkillsByCategory.set(category, []);
    }
    highlightSkillsByCategory.get(category)?.push(s.name ?? "");
  }

  return highlightSkillsByCategory;
}

function isResumeCompany(res: ResJson): res is ResumeCompany {
  return res._type === "resumeCompany";
}
