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
      name: "isFeatured",
      title: "Is Featured",
      type: "boolean",
    },
    {
      name: "orderRank",
      type: "string",
      hidden: true,
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      isFeatured: "isFeatured",
    },
    prepare({ title, subtitle, isFeatured }) {
      return {
        title,
        subtitle,
        media: <span>{isFeatured ? "✅" : "🎫"}</span>,
      };
    },
  },
});
