import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { crossDatasetDuplicator } from "@sanity/cross-dataset-duplicator";
import { schemaTypes } from "./schema";
import { structure } from "./structure/desk-structure";
import { env } from "./env";
import { markdownSchema } from "sanity-plugin-markdown";

function createDuplicator() {
  return crossDatasetDuplicator({
    types: ["homepage", "resumeCompany", "obringerAssistant"],
    tool: true,
    follow: [],
  });
}

export default defineConfig([
  {
    name: "production",
    basePath: "/production",
    title: "Production",
    dataset: "production",
    plugins: [
      structureTool({ structure }),
      visionTool(),
      markdownSchema(),
      createDuplicator(),
    ],
    projectId: env.projectId,
    schema: { types: schemaTypes },
  },
  {
    name: "development",
    basePath: "/development",
    title: "Development",
    dataset: "development",
    plugins: [structureTool({ structure }), markdownSchema(), visionTool()],
    projectId: env.projectId,
    schema: { types: schemaTypes },
  },
]);
