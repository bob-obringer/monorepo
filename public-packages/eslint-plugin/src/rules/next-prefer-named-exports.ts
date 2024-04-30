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
      description: `Prefer named exports over default exports in TypeScript files. Named exports
are more explicit and can help avoid confusion when importing modules or refactoring code.
This can make your code easier to read and maintain.
However, some Next.js conventions require default exports, and this rule allows for those
exceptions.`,
    },
    schema: [],
    messages: {
      preferNamedExports: "Prefer named exports",
    },
  },

  create(context) {
    const fn = context.filename || "";

    return {
      ExportDefaultDeclaration(node) {
        // if the file is a nextjs default export, ignore
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
