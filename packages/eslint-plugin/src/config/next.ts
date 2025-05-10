import { Linter } from "eslint";
import { react as bobReactRecommended } from "./react.js";
import { FlatCompat } from "@eslint/eslintrc";
// @ts-expect-error next plugin is not typed
import nextPlugin from "@next/eslint-plugin-next";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

// Get Next.js configs
const [nextjsCoreWebVitals, nextjsTypescript] = compat.extends(
  "next/core-web-vitals",
  "next/typescript",
) as [Linter.Config, Linter.Config];

// Base configuration for all files
const next: Linter.Config = {
  ...nextjsCoreWebVitals,
  ...nextjsTypescript,
  ...bobReactRecommended,
  plugins: {
    "@next/next": nextPlugin,
    ...nextjsCoreWebVitals.plugins,
    ...nextjsTypescript.plugins,
    ...bobReactRecommended.plugins,
  },
  rules: {
    ...nextjsCoreWebVitals.rules,
    ...nextjsTypescript.rules,
    ...bobReactRecommended.rules,
    "@bob-obringer/next-prefer-named-exports": "error",
    "@next/next/no-img-element": "error",
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-sync-scripts": "error",
    "@next/next/no-script-component-in-head": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            // Target same-directory relative imports
            group: ["./"],
            message:
              "Relative imports not allowed, use absolute imports instead.",
          },
          {
            // Target parent-directory relative imports
            group: ["../"],
            message:
              "Relative imports not allowed, use absolute imports instead.",
          },
        ],
        paths: [
          {
            name: "react",
            importNames: ["default"],
            message: "No need to import React directly.",
          },
          {
            name: "next/router",
            message: "Use `next/navigation` instead.",
          },
        ],
      },
    ],
  },
};

export { next };
