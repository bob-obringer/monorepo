import { TSESLint } from "@typescript-eslint/utils";

const rule: TSESLint.RuleModule<"unexpectedProcessEnv"> = {
  defaultOptions: [],
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow the use of `process.env`",
    },
    schema: [],
    messages: {
      unexpectedProcessEnv: "Unexpected use of process.env.",
    },
  },

  create(context) {
    return {
      MemberExpression(node) {
        const { object, property, computed } = node;
        const isIdentifier =
          object.type === "Identifier" && property.type === "Identifier";

        if (
          isIdentifier &&
          object?.name === "process" &&
          !computed &&
          property?.name === "env"
        ) {
          context.report({ node, messageId: "unexpectedProcessEnv" });
        }
      },
    };
  },
};

module.exports = rule;
