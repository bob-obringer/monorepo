import { env } from "@/config/server";
import { VercelBlob } from "@bob-obringer/vercel-storage";

export const vercelBlob = new VercelBlob({
  token: env.vercel.blobReadWriteToken,
});
