import { resumeSkillCategory } from "./resume/resume-skill-category";
import { resumeCompanyHighlight } from "./resume/resume-company-highlight";
import { resumeCompany } from "./resume/resume-company";
import { resumeSkill } from "./resume/resume-skill";
import { resumeIndustry } from "./resume/resume-industry";
import { chatbotConfig } from "./chatbot-config";
import { homepage } from "./homepage";
import { contactInfo } from "./contact-info";

export const schemaTypes = [
  resumeSkillCategory,
  resumeSkill,
  resumeCompanyHighlight,
  resumeCompany,
  resumeIndustry,
  chatbotConfig,
  homepage,
  contactInfo,
];
