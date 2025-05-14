import { createAnthropic } from "@ai-sdk/anthropic";
import { secrets } from "@/app-core/config/secrets";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const anthropic = createAnthropic({
  apiKey: secrets.anthropic.apiKey,
});

export const openAI = createOpenAI({
  apiKey: secrets.openAI.apiKey,
});

export const xai = createXai({
  apiKey: secrets.xAI.apiKey,
});

export const google = createGoogleGenerativeAI({
  apiKey: secrets.googleAI.apiKey,
});

export const models = {
  gpt35Turbo: openAI("gpt-3.5-turbo"),
  gpt4o: openAI("gpt-4o"),
  anthropicHaiku: anthropic("claude-3-5-haiku-latest"),
  anthropicSonnet: anthropic("claude-3-7-sonnet-latest"),
  xAIGrok3: xai("grok-3"),
  xAIGrok3Mini: xai("grok-3-mini-fast"),
  googleGemini: google("gemini-2.0-flash-exp"),
};

export type Models = (typeof models)[keyof typeof models];
