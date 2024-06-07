import { env } from "../config.js";
import { VercelBlob } from "@bob-obringer/vercel-storage";

export const vercelBlob = new VercelBlob({
  token: env.vercelBlobReadWriteToken,
});
