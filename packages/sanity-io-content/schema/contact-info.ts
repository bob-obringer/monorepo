import { defineType } from "sanity";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact Info",
  type: "document",
  fields: [
    {
      name: "contactMethod",
      title: "Contact Method",
      type: "string",
      placeholder: "Email, Phone, etc.",
    },
    {
      name: "text",
      title: "Text",
      type: "string",
    },
    {
      name: "url",
      title: "URL",
      type: "string",
    },
    {
      name: "icon",
      title: "Icon",
      type: "string",
    },
    {
      name: "iconSubset",
      title: "Icon Subset",
      type: "string",
      options: {
        list: [
          { title: "Brands", value: "fab" },
          { title: "Solid", value: "fass" },
        ],
      },
    },
    {
      name: "orderRank",
      type: "string",
      hidden: true,
    },
  ],
});
