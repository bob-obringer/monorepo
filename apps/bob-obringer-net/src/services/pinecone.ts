import { PineconeService } from "@bob-obringer/pinecone";
import { env } from "@/config/server";
import { VoyageAiEmbedding } from "@bob-obringer/vector-embedding";

export const pinecone = new PineconeService({
  apiKey: env.pinecone.apiKey,
  env: env.name,
  embeddingService: new VoyageAiEmbedding({ apiKey: env.voyager.apiKey }),
});
