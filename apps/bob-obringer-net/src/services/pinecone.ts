import { PineconeService } from "@bob-obringer/ai-pinecone";
import { env } from "@/config/server";
import { VoyageAiEmbedding } from "@bob-obringer/ai-embedding";

export const pinecone = new PineconeService({
  apiKey: env.pinecone.apiKey,
  env: env.name,
  embeddingService: new VoyageAiEmbedding({ apiKey: env.voyager.apiKey }),
});
