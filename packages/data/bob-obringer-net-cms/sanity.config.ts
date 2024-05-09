import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schema";
import { structure } from "./structure/desk-structure";

export default defineConfig({
  name: "default",
  title: "bob-obringer-net",

  projectId: "gkf7pxwm",
  dataset: "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
