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
    apiKey: "",
  },
  openAI: {
    apiKey: "",
  },
});
