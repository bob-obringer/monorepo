import { createClient } from "@sanity/client";
import { env } from "@/config/server";

export const sanityClient = createClient({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
  useCdn: false,
  apiVersion: "2024-05-15",
});
