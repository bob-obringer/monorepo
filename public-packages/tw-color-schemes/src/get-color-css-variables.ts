import type { ColorsByScheme, ColorScheme } from "./types";
import { getColorValue, getSelector, toKebabCase } from "./utilities";

type Variables = {
  [variableName: string]: string;
};

type VariablesBySchemeSelector = {
  [selector: string]: Variables;
};

/**
 * Creates CSS variable classes for different color schemes.
 *
 * {
 *   ':root, .base-color-scheme': {
 *     '--twcs-background-default': '0 0 0',
 *     '--twcs-background-secondary': '0 0 0',
 *     '--twcs-background-tertiary': '0 0 0',
 *     '--twcs-border-default': '255 0 255',
 *     '--twcs-border-tertiary': '0 255 0'
 *   },
 *   '.red-color-scheme': {
 *     '--twcs-background-default': '255 255 0',
 *     '--twcs-border-default': '255 0 255',
 *   }
 * }
 *
 * @param params - The parameters required for creating CSS variable classes.
 * @param params.namespace - The namespace for the CSS variable classes.
 * @param params.colorsByScheme - The core colors for the color schemes to create CSS variable classes for.
 * @returns An object containing the CSS variable classes for each color scheme.
 */
export function getColorCssVariables<T extends ColorScheme>({
  colorsByScheme,
  namespace,
}: {
  namespace: string;
  colorsByScheme: ColorsByScheme<T>;
}): VariablesBySchemeSelector {
  return Object.entries(colorsByScheme).reduce(
    (acc, [schemeName, colors]) => ({
      ...acc,
      [getSelector(schemeName)]: createCssVariablesForScheme({
        colors,
        namespace,
      }),
    }),
    {} as VariablesBySchemeSelector,
  );
}

function createCssVariablesForScheme<C extends ColorScheme>({
  colors,
  namespace,
}: {
  namespace: string;
  colors: C;
}): {
  [variableName: string]: string;
} {
  return Object.entries(colors).reduce((acc, [color, variants]) => {
    Object.entries(variants).forEach(([variant, value]) => {
      acc[`--${namespace}-${color}-${toKebabCase(variant)}`] =
        getColorValue(value);
    });
    return acc;
  }, {} as Variables);
}
