import type { Config } from "tailwindcss";
import {
  themeConfig,
  themePlugin,
  colorSchemePlugin,
} from "@bob-obringer/theme";
import reactAria from "tailwindcss-react-aria-components";

// eslint-disable-next-line @bob-obringer/next-prefer-named-exports
export default {
  ...themeConfig,
  content: [
    "./node_modules/@bob-obringer/components/dist/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [themePlugin, colorSchemePlugin, reactAria],
} satisfies Config;
