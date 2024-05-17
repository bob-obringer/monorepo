import { ResumeCompanyHighlight } from "@bob-obringer/sanity-io";
import groq from "groq";
import { sanityClient } from "@/services/sanity-io/sanity-client";

/*
  Get Skills By Id
 */
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

/*
  Get Highlight Skills By Category Text
 */
export async function getHighlightSkillsByCategoryText(
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

/*
  Get Resume Skill
 */
export type ResumeSkill = {
  _id: string;
  name: string | null;
  category: {
    name: string | null;
  } | null;
};

const resumeSkillQuery = groq`*[_type == "resumeSkill"]{
  _id,
  name,
  category->{
    name
  }
}`;

export async function getResumeSkills() {
  return await sanityClient.fetch<Array<ResumeSkill>>(resumeSkillQuery);
}
