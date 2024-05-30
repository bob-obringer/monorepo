/* eslint-disable @bob-obringer/no-process-env */
import { z } from "zod";

const configSchema = z.object({
  vercelBlobReadWriteToken: z.string(),
});

export const env = configSchema.parse({
  vercelBlobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
});
