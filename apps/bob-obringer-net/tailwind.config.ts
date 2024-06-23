import type { Config } from "tailwindcss";
import { createTheme } from "@bob-obringer/components/theme";

import reactAria from "tailwindcss-react-aria-components";
import { fontFamily } from "tailwindcss/defaultTheme";

const theme = createTheme({
  fontFamily: {
    body: ["var(--font-body)", ...fontFamily.sans].join(", "),
    display: ["var(--font-display)", ...fontFamily.sans].join(", "),
    mono: ["var(--font-mono)", ...fontFamily.mono].join(", "),
  },
});

// eslint-disable-next-line @bob-obringer/next-prefer-named-exports
export default {
  content: [
    "./node_modules/@bob-obringer/components/dist/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [...theme, reactAria],
} satisfies Config;
