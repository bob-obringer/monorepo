import plugin from "tailwindcss/plugin";
import type { AdditionalSchemesByName, ColorScheme } from "./types";
import { getColorConfig } from "./get-color-config";
import { getColorsByScheme } from "./get-colors-by-scheme";
import { getColorCssVariables } from "./get-color-css-variables";

export function createColorSchemePlugin<T extends ColorScheme>(
  baseScheme: T,
  {
    schemes = {},
    namespace = "twcs",
  }: {
    schemes?: AdditionalSchemesByName<T>;
    namespace?: string;
  } = {},
) {
  const baseColorConfig = getColorConfig({ baseScheme, namespace });

  const colorsByScheme = getColorsByScheme({
    baseScheme,
    schemes,
  });

  const cssVariableClasses = getColorCssVariables({
    colorsByScheme,
    namespace,
  });

  return plugin.withOptions(
    /*
      Create CSS Variables and add them to the base
     */
    function () {
      return function ({ addBase }) {
        addBase([cssVariableClasses]);
      };
    },
    /*
      Get the core colors and add them to the theme, pointing to the
      css variables created above
     */
    function () {
      return {
        // todo: allow direct customization of theme
        theme: {
          extend: { ...baseColorConfig },
        },
      };
    },
  );
}

export type ColorSchemePlugin = ReturnType<typeof createColorSchemePlugin>;
