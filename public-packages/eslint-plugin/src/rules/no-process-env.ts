import { TSESLint } from "@typescript-eslint/utils";
import path from "path";

const rule: TSESLint.RuleModule<"unexpectedProcessEnv", [string]> = {
  defaultOptions: ["config"],
  meta: {
    type: "suggestion",
    docs: {
      description: `Disallow the use of \`process.env\` outside of a config file. 
      Using \`process.env\` directly in your code can lead to hard-to-debug problems 
      and is considered bad practice. It's recommended to use a configuration file or 
      environment variables file to manage your application's configuration, which 
      allows for better security, scalability, and manageability.`,
    },
    schema: [
      {
        type: "string",
      },
    ],
    messages: {
      unexpectedProcessEnv: "Unexpected use of process.env.",
    },
  },

  create(context) {
    const [configFolderPattern = "config"] = context.options;
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
          const filename = context.filename;
          if (!filename.includes(path.sep + configFolderPattern + path.sep)) {
            context.report({ node, messageId: "unexpectedProcessEnv" });
          }
        }
      },
    };
  },
};

module.exports = rule;
