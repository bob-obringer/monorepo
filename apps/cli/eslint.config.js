import bobObringerPlugin from "@bob-obringer/eslint-plugin";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    plugins: { "@bob-obringer": bobObringerPlugin },
  },
  bobObringerPlugin.configs.react,
];

export default config;
