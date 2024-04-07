import { createColorSchemePlugin } from "@bob-obringer/tw-color-schemes";

export const colorSchemePlugin = createColorSchemePlugin(
  {
    background: {
      default: "#888888",
      primary: "#333333",
      secondary: "#444444",
    },
    text: {
      default: "#ffffff",
      primary: "#000000",
      secondary: "#888888",
      tertiary: "#aaaaaa",
      disabled: "#dddddd",
    },
  },
  {
    schemes: {
      light: {
        background: {
          default: "#ffffff",
          primary: "#f9f9f9",
        },
        text: {
          default: "#000000",
          primary: "#000000",
          secondary: "#444444",
          tertiary: "#666666",
          disabled: "#888888",
        },
      },
    },
  },
);
