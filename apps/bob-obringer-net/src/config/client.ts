import { z } from "zod";

const envSchema = z.object({
  name: z.enum(["development", "production", "preview"]),
  posthog: z.object({
    key: z.string(),
    host: z.string(),
  }),
});

const name = process.env.VERCEL_ENV || "development";

export const env = envSchema.parse({
  name,
  posthog: {
    key: "phc_Q9FWampESZp2IAfcP7EDGnUTbtNXArOBf9caHPxsuu9",
    host: "/posthog-ingest",
  },
});
