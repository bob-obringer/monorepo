import { defineType } from "sanity";

export const resumeCompanyHighlight = defineType({
  name: "resumeCompanyHighlight",
  title: "Resume Company Highlight",
  type: "object",
  fields: [
    {
      name: "text",
      title: "Highlight Text",
      type: "text",
    },
    {
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "resumeSkill" }],
        },
      ],
    },
  ],
});
