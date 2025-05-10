import { secrets } from "@/app-core/config/secrets";
import { VercelBlob } from "@bob-obringer/vercel-storage";

export const vercelBlob = new VercelBlob({
  token: secrets.vercel.blobReadWriteToken,
});
