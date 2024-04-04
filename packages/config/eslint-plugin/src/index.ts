import { recommended } from "./config/recommended";
import { react } from "./config/react";
import { next } from "./config/next";

module.exports = {
  rules: {
    "no-process-env": require("./rules/no-process-env"),
    "next-prefer-named-exports": require("./rules/next-prefer-named-exports"),
  },
  configs: {
    recommended,
    react,
    next,
  },
};
