import type { Rule } from "eslint";
import path from "node:path";

export const noProcessEnvRule: Rule.RuleModule = {
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
        description: "The name of the config folder",
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
        const { object, property } = node;

        if (
          object.type === "Identifier" &&
          property.type === "Identifier" &&
          object.name === "process" &&
          !node.computed &&
          property.name === "env"
        ) {
          const filename = context.filename;
          const isConfigFolder = filename.includes(path.sep + configFolderPattern + path.sep);
          const isNextConfig = filename.includes("next.config");

          if (!isConfigFolder && !isNextConfig) {
            context.report({
              node,
              messageId: "unexpectedProcessEnv",
            });
          }
        }
      },
    };
  },
};
