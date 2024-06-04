import { defineArrayMember, defineType } from "sanity";

export const resumeCompany = defineType({
  name: "resumeCompany",
  title: "Resume Company",
  type: "document",
  orderings: [
    {
      title: "Start Date",
      name: "startDate",
      by: [
        {
          field: "startDate",
          direction: "desc",
        },
      ],
    },
  ],
  fields: [
    {
      name: "slug",
      title: "Slug",
      type: "string",
    },
    {
      name: "name",
      title: "name",
      type: "string",
    },
    {
      name: "position",
      title: "Position",
      type: "string",
    },
    {
      name: "isConsultant",
      title: "Consultant",
      type: "boolean",
    },
    {
      name: "industry",
      title: "Industry",
      type: "reference",
      to: [
        {
          type: "resumeIndustry",
        },
      ],
    },
    {
      name: "size",
      title: "Size",
      type: "number",
    },
    {
      name: "startDate",
      title: "Start Date",
      type: "date",
    },
    {
      name: "endDate",
      title: "End Date",
      type: "date",
    },
    {
      name: "summary",
      title: "Summary",
      type: "text",
    },
    {
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [
        defineArrayMember({
          type: "resumeCompanyHighlight",
        }),
      ],
    },
  ],
});
