import { ChromaClient } from "chromadb";
import { VoyagerEmbeddingFunction } from "@bob-obringer/chroma-voyager";
import { env } from "./config";

const embeddingFunction = new VoyagerEmbeddingFunction({
  apiKey: env.voyager.apiKey,
  model: "voyage-large-2",
});

const client = new ChromaClient({
  path: "https://monorepo-production-33c8.up.railway.app:8000",
});

type CollectionName = "resume-company-highlights";

export async function getCollection(name: CollectionName) {
  return await client.getOrCreateCollection({ name, embeddingFunction });
}

export async function deleteCollection(name: CollectionName) {
  return await client.deleteCollection({ name });
}
