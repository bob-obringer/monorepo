import { z } from "zod";

const envSchema = z.object({
  name: z.enum(["development", "production", "preview"]),
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
  vercel: z.object({
    blobReadWriteToken: z.string(),
    kvUrl: z.string(),
    kvRestApiReadOnlyToken: z.string(),
    kvRestApiToken: z.string(),
    kvRestApiUrl: z.string(),
  }),
});

const name = process.env.VERCEL_ENV || "development";

export const env = envSchema.parse({
  name,
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
  vercel: {
    blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
    kvUrl: process.env.KV_URL,
    kvRestApiReadOnlyToken: process.env.KV_REST_API_READ_ONLY_TOKEN,
    kvRestApiToken: process.env.KV_REST_API_TOKEN,
    kvRestApiUrl: process.env.KV_REST_API_URL,
  },
});
