import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "@/config/server";
import { createOpenAI } from "@ai-sdk/openai";

export const anthropic = createAnthropic({
  apiKey: env.anthropic.apiKey,
  headers: {
    "anthropic-beta": "tools-2024-05-16",
  },
});

export const haiku = anthropic("claude-3-haiku-20240307");
export const sonnet = anthropic("claude-3-sonnet-20240229");
export const opus = anthropic("claude-3-opus-20240229");

export const openAI = createOpenAI({
  apiKey: env.openAI.apiKey,
});

export const gpt35Turbo = openAI("gpt-3.5-turbo");
export const gpt4o = openAI("gpt-4o");
// do not use
// export const gpt4 = openAI("gpt-4");
// export const gpt4Turbo = openAI("gpt-4-turbo");

export const defaultModel = sonnet;
