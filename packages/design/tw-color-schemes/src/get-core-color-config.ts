import type {
  BaseColorScheme,
  ColorVariants,
  ColorSchemeCore,
  ColorSchemeComponentsReturnType,
} from "./types";
import { toKebabCase } from "./utilities";

type ThemeCoreColors = {
  [coreColorName: string]: {
    [coreColorVariant: string]: string;
  };
};

/**
 * This function defines the full set of core colors for the scheme.
 *
 * The example below defines classes for `bg`, `bg-secondary`, `bg-tertiary`,
 * `border`, and `border-tertiary`.
 *
 * @example
 *   {
 *     "backgroundColor": {
 *       "DEFAULT": "rgb(var(--twcs-color-background-default) / <alpha-value>)",
 *       "secondary": "rgb(var(--twcs-color-background-secondary) / <alpha-value>)",
 *       "tertiary": "rgb(var(--twcs-color-background-tertiary) / <alpha-value>)",
 *     },
 *     "borderColor": {
 *       "DEFAULT": "rgb(var(--twcs-color-border-default) / <alpha-value>)",
 *       "secondary": "rgb(var(--twcs-color-border-tertiary) / <alpha-value>)"
 *     }
 *   }
 *
 * @param options - The options for retrieving the core colors.
 * @param options.baseScheme - The base color schemes.
 * @param options.namespace - The namespace for the colors.
 * @return The core colors.
 */
export function getCoreColorConfig<
  T extends ColorSchemeCore,
  U extends ColorSchemeComponentsReturnType,
>({
  baseScheme,
  namespace,
}: {
  baseScheme: BaseColorScheme<T, U>;
  namespace: string;
}): ThemeCoreColors {
  return Object.entries(baseScheme.core).reduce(
    (coreColorAccum, [coreColorName, colorVariants]) => ({
      ...coreColorAccum,
      [`${coreColorName}Color`]: getCoreColorVariants({
        coreColorName,
        colorVariants,
        namespace,
      }),
    }),
    {},
  );
}

function getCoreColorVariants({
  colorVariants,
  namespace,
  coreColorName,
}: {
  colorVariants: ColorVariants;
  namespace: string;
  coreColorName: string;
}) {
  return Object.entries(colorVariants).reduce(
    (acc, [variantName, variantValue]) => {
      let alpha = "<alpha-value>";
      if (variantValue.startsWith("rgba(")) {
        alpha =
          variantValue
            ?.replace("rgba(", "")
            ?.replace(")", "")
            ?.split(",")[3]
            ?.trim() ?? alpha;
      }
      return {
        ...acc,
        [variantName === "default" ? "DEFAULT" : toKebabCase(variantName)]:
          `rgb(var(--${namespace}-${coreColorName}-${toKebabCase(
            variantName,
          )}) / ${alpha})`,
      };
    },
    {},
  );
}
