import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Patterns migrated from .eslintignore
const ignorePatterns = [
  "**/node_modules/**",
  "**/.pnp/**",
  "**/.pnp.js",
  "**/coverage/**",
  "**/.next/**",
  "**/out/**",
  "**/build/**",
  "**/dist/**",
  "**/.DS_Store",
  "**/*.pem",
  "**/declarations.d.ts",
  "**/.eslintcache",
  "**/npm-debug.log*",
  "**/yarn-debug.log*",
  "**/yarn-error.log*",
  "**/.env.local",
  "**/.env.development.local",
  "**/.env.test.local",
  "**/.env.production.local",
  "**/.vercel",
  "**/CHANGELOG.md",
  "**/sanity-types.ts"
];

const eslintConfig = [
  {
    // Global ignore patterns
    ignores: ignorePatterns,
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
