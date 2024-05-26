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
    {
      name: "model",
      title: "LLM Model",
      type: "string",
      // options: {
      //   list: [
      //     { title: "Article", value: "article" },
      //     { title: "Video", value: "video" },
      //     { title: "Podcast", value: "podcast" },
      //   ],
      // },
      options: {
        list: [
          "gpt35Turbo",
          "gpt4o",
          "anthropicHaiku",
          "anthropicSonnet",
          "anthropicOpus",
        ],
      },
    },
  ],
});
