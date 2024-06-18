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
      "weight-bold": "600",
    },
    fontSize: {
      "size-xs": "12px",
      "size-sm": "14px",
      "size-md": "16px",
      "size-lg": "22px",
      "size-xl": "32px",
      "size-2xl": "48px",
      "size-3xl": "64px",
    },
  },
} satisfies Partial<Config>;
