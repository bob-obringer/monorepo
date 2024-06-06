import { createClient } from "@sanity/client";
import { env } from "@/config/server";
import groq from "groq";
import {
  Homepage,
  ChatbotConfig,
  AboutBob,
} from "@bob-obringer/sanity-io-types";
import { revalidateTag, unstable_cache } from "next/cache";

export const sanityIoClient = createClient({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
  useCdn: true,
  apiVersion: "2024-05-15",
});

type DocumentTypes = {
  homepage: Homepage;
  chatbotConfig: ChatbotConfig;
  aboutBob: AboutBob;
};

type DocumentId = keyof DocumentTypes;

export const documentQuery = groq`*[_id == $documentId]`;

export async function getDocument<K extends DocumentId>(
  documentId: K,
): Promise<DocumentTypes[K] | null> {
  return unstable_cache(
    async () => {
      const documents = await sanityIoClient.fetch<Array<DocumentTypes[K]>>(
        documentQuery,
        { documentId },
      );
      return documents[0] ?? null;
    },
    [`sanity:document:${documentId}`],
    { tags: [`sanity:document:${documentId}`] },
  )();
}

export function revalidateDocument(documentId: DocumentId) {
  revalidateTag(documentId);
}
