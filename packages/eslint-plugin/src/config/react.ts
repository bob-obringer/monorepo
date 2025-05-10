import { type Linter } from "eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { recommended as bobRecommended } from "./recommended.js";

const react: Linter.Config = {
  ...bobRecommended,
  plugins: {
    ...bobRecommended.plugins,
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
  },
  languageOptions: {
    ...bobRecommended.languageOptions,
    parserOptions: {
      ...bobRecommended.languageOptions?.parserOptions,
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    ...bobRecommended.settings,
    react: {
      version: "detect",
      runtime: "automatic",
    },
  },
  rules: {
    ...bobRecommended.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactHooksPlugin.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
  },
};

export { react };
