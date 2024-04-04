import { TSESLint } from "@typescript-eslint/utils";

const nextJsDefaultExports = [
  /page\.tsx$/,
  /layout\.tsx$/,
  /error\.tsx$/,
  /loading\.tsx$/,
  /not-found\.tsx$/,
  /pages\/api\//,
  /manifest\.ts/,
];

const rule: TSESLint.RuleModule<"preferNamedExports"> = {
  defaultOptions: [],
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow the use of default exports other than the app router conventions",
    },
    schema: [],
    messages: {
      preferNamedExports: "Prefer named exports",
    },
  },

  create(context) {
    const fn = context.getFilename() || "";

    return {
      ExportDefaultDeclaration(node) {
        if (nextJsDefaultExports.some((f) => fn.match(f))) return;

        const { declaration } = node;
        const isIdentifier =
          declaration.type === "Identifier" && declaration.name === "App";

        if (!isIdentifier) {
          context.report({
            node,
            messageId: "preferNamedExports",
          });
        }
      },
    };
  },
};

module.exports = rule;
