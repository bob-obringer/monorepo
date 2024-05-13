import { z } from "zod";

const envSchema = z.object({
  aws: z.object({
    bucketName: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
  }),
  anthropic: z.object({
    apiKey: z.string(),
  }),
  openAI: z.object({
    apiKey: z.string(),
  }),
  voyager: z.object({
    apiKey: z.string(),
  }),
});

export const env = envSchema.parse({
  aws: {
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  openAI: {
    apiKey: process.env.OPEN_AI_API_KEY,
  },
  voyager: {
    apiKey: process.env.VOYAGER_API_KEY,
  },
});
