import { z } from "zod";

const envSchema = z.object({
  name: z.enum(["development", "production", "preview"]),
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
  pinecone: z.object({
    apiKey: z.string(),
  }),
  sanity: z.object({
    projectId: z.string(),
    dataset: z.string(),
    webhookSecret: z.string(),
  }),
});

const name = process.env.VERCEL_ENV || "development";

export const env = envSchema.parse({
  name,
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
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
  },
  sanity: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: name === "production" ? "production" : "development",
    webhookSecret: process.env.SANITY_WEBHOOK_SECRET,
  },
});
