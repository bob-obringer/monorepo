import { defineType } from "sanity";

export const aboutBob = defineType({
  name: "aboutBob",
  title: "About Bob",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
    },
  ],
});
