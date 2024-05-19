import { resumeSkillCategory } from "./resume/resume-skill-category";
import { resumeCompanyHighlight } from "./resume/resume-company-highlight";
import { resumeCompany } from "./resume/resume-company";
import { resumeSkill } from "./resume/resume-skill";
import { resumeIndustry } from "./resume/resume-industry";
import { obringerAssistant } from "./ai/obringer-assistant";
import { homepage } from "./homepage";

export const schemaTypes = [
  resumeSkillCategory,
  resumeSkill,
  resumeCompanyHighlight,
  resumeCompany,
  resumeIndustry,
  obringerAssistant,
  homepage,
];