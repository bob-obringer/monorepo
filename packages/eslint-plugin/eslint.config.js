import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import bobObringerPlugin from "./dist/index.js"; 
import eslintConfigPrettier from "eslint-config-prettier"; 
// @ts-expect-error eslint-plugin-import is not typed
import importPlugin from "eslint-plugin-import";
import unusedImportsPlugin from "eslint-plugin-unused-imports";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@bob-obringer": bobObringerPlugin, 
      import: importPlugin, 
      "unused-imports": unusedImportsPlugin, 
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        URL: "readonly",
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...bobObringerPlugin.configs.recommended.rules, 
    },
  },
  eslintConfigPrettier, 
];
