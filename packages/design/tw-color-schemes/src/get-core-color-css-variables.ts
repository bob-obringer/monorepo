import type {
  BaseColorScheme,
  ColorSchemeComponentsReturnType,
  ColorSchemeCore,
  CoreColorsByScheme,
} from "./types";
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
 * @param params.coreColorsByScheme - The core colors for the color schemes to create CSS variable classes for.
 * @returns An object containing the CSS variable classes for each color scheme.
 */
export function getCoreColorCssVariables<
  T extends ColorSchemeCore,
  U extends ColorSchemeComponentsReturnType,
>({
  coreColorsByScheme,
  namespace,
}: {
  namespace: string;
  coreColorsByScheme: CoreColorsByScheme<T, U>;
}): VariablesBySchemeSelector {
  return Object.entries(coreColorsByScheme).reduce(
    (acc, [schemeName, coreColors]) => ({
      ...acc,
      [getSelector(schemeName)]: createCssVariablesForScheme({
        coreColors,
        namespace,
      }),
    }),
    {} as VariablesBySchemeSelector,
  );
}

function createCssVariablesForScheme<
  C extends ColorSchemeCore,
  U extends ColorSchemeComponentsReturnType,
>({
  coreColors,
  namespace,
}: {
  namespace: string;
  coreColors: BaseColorScheme<C, U>["core"];
}): {
  [variableName: string]: string;
} {
  return Object.entries(coreColors).reduce((acc, [color, variants]) => {
    Object.entries(variants).forEach(([variant, value]) => {
      acc[`--${namespace}-${color}-${toKebabCase(variant)}`] =
        getColorValue(value);
    });
    return acc;
  }, {} as Variables);
}
