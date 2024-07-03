import type { Config } from "tailwindcss";
import { createTheme, componentsContent } from "@bob-obringer/components/theme";

// eslint-disable-next-line @bob-obringer/next-prefer-named-exports
export default {
  content: [componentsContent, "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: createTheme(),
} satisfies Config;
