import { createTheme } from "./src/theme";

export const theme = createTheme();

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [...theme],
};
