/* eslint-disable @bob-obringer/no-process-env */
import { z } from "zod";

const envSchema = z.object({
  projectId: z.string(),
  dataset: z.string(),
});

export const env = envSchema.parse({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
});
