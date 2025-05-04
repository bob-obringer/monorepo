import plugin from "tailwindcss/plugin.js";
import type { AdditionalSchemesByName, ColorScheme } from "./types.js";
import { getColorConfig } from "./get-color-config.js";
import { getColorsByScheme } from "./get-colors-by-scheme.js";
import { getColorCssVariables } from "./get-color-css-variables.js";

export type CreateColorSchemePluginOptions = {
  schemes?: AdditionalSchemesByName<ColorScheme>;
  namespace?: string;
};

export function createColorSchemePlugin<T extends ColorScheme>(
  baseScheme: T,
  { schemes = {}, namespace = "twcs" }: CreateColorSchemePluginOptions = {},
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
      return function ({ addComponents, addBase }) {
        Object.entries(cssVariableClasses).forEach(([selector, variables]) => {
          if (selector.startsWith(":root")) {
            addBase({
              [selector]: variables,
            });
          } else {
            addComponents({
              [selector]: variables,
            });
          }
        });
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
