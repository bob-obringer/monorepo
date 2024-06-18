import { colorSchemePlugin, themeConfig, themePlugin } from "./dev/theme";

/** @type {import('tailwindcss').Config} */
export default {
  ...themeConfig,
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [colorSchemePlugin, themePlugin],
};
