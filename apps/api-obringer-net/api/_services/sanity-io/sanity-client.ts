import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "gkf7pxwm",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-05-15",
});
