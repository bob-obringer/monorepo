import { defineType } from "sanity";

export const contentPage = defineType({
  name: "contentPage",
  title: "Content Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },
    {
      name: "slug",
      title: "slug",
      type: "string",
    },
    {
      name: "content",
      title: "Content",
      type: "markdown",
    },
  ],
});
