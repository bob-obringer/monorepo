export const react = {
  extends: ["plugin:@bob-obringer/recommended", "plugin:react/recommended"],
  plugins: ["react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["./..*"],
            message: "Path's beginning with `./..` are not allowed.",
          },
        ],
        paths: [
          {
            name: "react",
            importNames: ["default"],
            message: "No need to import React directly. ",
          },
        ],
      },
    ],
  },
};
