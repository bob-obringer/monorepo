import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "@/config/server";
import { createOpenAI } from "@ai-sdk/openai";

export const anthropic = createAnthropic({
  apiKey: env.anthropic.apiKey,
  headers: {
    "anthropic-beta": "tools-2024-05-16",
  },
});

export const openAI = createOpenAI({
  apiKey: env.openAI.apiKey,
});

export const models = {
  gpt35Turbo: openAI("gpt-3.5-turbo"),
  gpt4o: openAI("gpt-4o"),
  anthropicHaiku: anthropic("claude-3-haiku-20240307"),
  anthropicSonnet: anthropic("claude-3-sonnet-20240229"),
  anthropicOpus: anthropic("claude-3-opus-20240229"),
};

export type Models = (typeof models)[keyof typeof models];
