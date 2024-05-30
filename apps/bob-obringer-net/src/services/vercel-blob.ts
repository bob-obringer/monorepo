import { env } from "@/config/server";
import { VercelBlob } from "@bob-obringer/vercel-data";

export const vercelBlob = new VercelBlob({
  token: env.vercel.blobReadWriteToken,
});
