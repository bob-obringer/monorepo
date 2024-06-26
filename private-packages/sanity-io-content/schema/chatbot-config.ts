import { defineType } from "sanity";

export const chatbotConfig = defineType({
  name: "chatbotConfig",
  title: "Chatbot Config",
  type: "document",
  fields: [
    {
      name: "systemPromptInstructions",
      title: "System Prompt Instructions",
      type: "text",
    },
    {
      name: "inputFieldPlaceholder",
      title: "Input Field Placeholder",
      type: "string",
    },
    {
      name: "model",
      title: "LLM Model",
      type: "string",
      options: {
        list: [
          { title: "GPT-3.5 Turbo", value: "gpt35Turbo" },
          { title: "GPT-4o", value: "gpt4o" },
          { title: "Anthropic Haiku", value: "anthropicHaiku" },
          { title: "Anthropic Sonnet", value: "anthropicSonnet" },
        ],
      },
    },
    {
      name: "temperature",
      title: "Temperature",
      type: "number",
    },
    {
      name: "suggestedQuestions",
      title: "Suggested Questions",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
});
