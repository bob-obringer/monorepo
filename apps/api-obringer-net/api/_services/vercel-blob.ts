import { env } from "../config.js";
import { VercelBlob } from "@bob-obringer/vercel-data";

export const vercelBlob = new VercelBlob({
  token: env.vercelBlobReadWriteToken,
});
