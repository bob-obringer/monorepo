export const next = {
  extends: ["next/core-web-vitals", "plugin:@bob-obringer/recommended"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@bob-obringer/next-prefer-named-exports": "error",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [".*"],
            message:
              "Relative imports not allowed, use absolute imports instead. ",
          },
        ],
        paths: [
          {
            name: "react",
            importNames: ["default"],
            message: "No need to import React directly. ",
          },
          {
            name: "next/router",
            message: "Use `next/navigation` instead. ",
          },
        ],
      },
    ],
  },
};
