import { z } from "zod";

const envSchema = z.object({
  voyager: z.object({
    apiKey: z.string(),
  }),
  openAI: z.object({
    apiKey: z.string(),
  }),
});

export const env = envSchema.parse({
  voyager: {
    apiKey: "pa-WsdkaiKzTrrrYhndXThsP3EQfMSBV2HUBf1sUpOY6-o",
  },
  openAI: {
    apiKey: "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",
  },
});
