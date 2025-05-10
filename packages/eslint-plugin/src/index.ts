import type { ESLint } from "eslint";
import { recommended } from "./config/recommended.js";
import { react } from "./config/react.js";
import { next } from "./config/next.js";
import fs from "fs";
import { noProcessEnvRule } from "./rules/no-process-env.js";
import { nextJsPreferNamedExportsRule } from "./rules/next-js-prefer-named-exports.js";

const pkg = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));

const plugin: ESLint.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    "no-process-env": noProcessEnvRule,
    "next-prefer-named-exports": nextJsPreferNamedExportsRule,
  },
  configs: {
    recommended,
    react,
    next,
  },
};

export default plugin;
