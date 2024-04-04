import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export const themeConfig = {
  theme: {
    colors: {},
    fontFamily: {
      "family-body": ["var(--font-body)", ...fontFamily.sans],
      "family-expanded": ["var(--font-expanded)", ...fontFamily.sans],
      "family-mono": ["var(--font-mono)", ...fontFamily.mono],
    },
    fontWeight: {
      "weight-normal": "400",
      "weight-medium": "500",
      "weight-bold": "700",
    },
  },
} satisfies Partial<Config>;
