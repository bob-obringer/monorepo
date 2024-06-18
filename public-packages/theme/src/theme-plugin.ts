import plugin from "tailwindcss/plugin";
import { themeConfig } from "./theme-config";
import { typography } from "./components/typography";

export const themePlugin = plugin.withOptions(
  function () {
    return function ({ addUtilities }) {
      addUtilities({
        ...typography,
      });
    };
  },
  () => themeConfig,
);
