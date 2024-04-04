import plugin from "tailwindcss/plugin";
import type {
  ColorSchemeCore,
  BaseColorScheme,
  AdditionalSchemesByName,
  ColorSchemeComponentsReturnType,
} from "./types";
import { getCoreColorConfig } from "./get-core-color-config";
import { getCoreColorsByScheme } from "./get-core-colors-by-scheme";
import { getCoreColorCssVariables } from "./get-core-color-css-variables";

export function createColorSchemePlugin<
  T extends ColorSchemeCore,
  U extends ColorSchemeComponentsReturnType,
>(
  baseScheme: BaseColorScheme<T, U>,
  additionalSchemes?: AdditionalSchemesByName<T, U>,
  { namespace = "twcs" }: { namespace?: string } = {},
) {
  const coreColorConfig = getCoreColorConfig({ baseScheme, namespace });

  const coreColorsByScheme = getCoreColorsByScheme({
    baseScheme,
    additionalSchemes,
  });

  const coreColorCssVariableClasses = getCoreColorCssVariables({
    coreColorsByScheme,
    namespace,
  });

  return plugin.withOptions(
    /*
      Create CSS Variables and add them to the base
     */
    function () {
      return function ({ addBase }) {
        addBase([coreColorCssVariableClasses]);
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
          extend: { ...coreColorConfig },
        },
      };
    },
  );
}
