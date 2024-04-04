import {
  colorSchemePlugin,
  themePlugin,
  themeConfig,
} from "@bob-obringer/theme";

/** @type {import('tailwindcss').Config} */
export default {
  ...themeConfig,
  content: ["./**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [colorSchemePlugin, themePlugin],
};
