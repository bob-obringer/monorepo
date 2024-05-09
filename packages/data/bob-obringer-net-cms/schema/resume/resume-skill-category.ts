import { defineType } from "sanity";

export const resumeSkillCategory = defineType({
  title: "Resume Skill Category",
  name: "resumeSkillCategory",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "orderRank",
      type: "string",
      hidden: true,
    },
  ],
});
