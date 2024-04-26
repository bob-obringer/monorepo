import {
  colorSchemePlugin,
  themeConfig,
  themePlugin,
} from "@bob-obringer/theme";

/** @type {import('tailwindcss').Config} */
export default {
  ...themeConfig,
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [colorSchemePlugin, themePlugin],
};
