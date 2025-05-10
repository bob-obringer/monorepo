import { Linter, ESLint } from "eslint";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
// @ts-expect-error eslint-plugin-import is not typed
import importPlugin from "eslint-plugin-import";

const recommended: Linter.Config = {
  // Apply to all TS/TSX files in the project
  files: ["**/*.{ts,tsx}"],
  ignores: ["node_modules/**/*", ".next/**/*"],
  plugins: {
    "@typescript-eslint": tsPlugin as unknown as ESLint.Plugin,
    "unused-imports": unusedImports,
    import: importPlugin,
  },
  languageOptions: {
    parser: tsParser,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        modules: true,
      },
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  rules: {
    // Base recommended rules
    ...js.configs.recommended.rules,
    ...tsPlugin.configs.recommended?.rules,

    // TypeScript rules
    "@typescript-eslint/no-unused-vars": "off",
    "no-undef": "off",

    // Import rules
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["./..*"],
            message: "Path's beginning with `./..` are not allowed.",
          },
        ],
      },
    ],

    // Unused imports rules
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // Custom rules
    "@bob-obringer/no-process-env": "error",
  },
};

export { recommended };
