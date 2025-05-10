import type { Rule } from "eslint";

const nextJsDefaultExports = [
  /page\.tsx$/,
  /layout\.tsx$/,
  /error\.tsx$/,
  /loading\.tsx$/,
  /not-found\.tsx$/,
  /pages\/api\//,
  /manifest\.ts/,
  /opengraph-image\.tsx$/,
  /twitter-image\.tsx$/,
  /sitemap\.ts$/,
  /robots\.ts$/,
  /tailwind\.config\.ts$/,
  /next\.config\.ts$/,
];

export const nextJsPreferNamedExportsRule: Rule.RuleModule = {
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
    const filename = context.filename;

    return {
      ExportDefaultDeclaration(node) {
        // if the file is a nextjs default export, ignore
        if (nextJsDefaultExports.some((pattern) => filename.match(pattern))) {
          return;
        }

        // Report any default export if the filename didn't match the exception list
        context.report({
          node,
          messageId: "preferNamedExports",
        });
      },
    };
  },
};
