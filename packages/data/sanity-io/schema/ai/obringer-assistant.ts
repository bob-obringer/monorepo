import { defineType } from "sanity";

export const obringerAssistant = defineType({
  name: "obringerAssistant",
  title: "Obringer Assistant",
  type: "document",
  fields: [
    {
      name: "systemPrompt",
      title: "System Prompt",
      type: "text",
    },
  ],
});
