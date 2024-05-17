import { defineType } from "sanity";

export const resumeSkill = defineType({
  name: "resumeSkill",
  title: "Resume Skill",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "resumeSkillCategory" }],
    },
    {
      name: "orderRank",
      type: "string",
      hidden: true,
    },
  ],
});
