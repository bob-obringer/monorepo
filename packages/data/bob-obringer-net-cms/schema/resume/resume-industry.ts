import { defineType } from "sanity";

export const resumeIndustry = defineType({
  name: "resumeIndustry",
  title: "Industry",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
  ],
});
