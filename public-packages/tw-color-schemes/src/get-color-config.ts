import type { ColorVariants, ColorScheme } from "./types";
import { toKebabCase } from "./utilities";

type ThemeColors = {
  [colorName: string]: {
    [colorVariant: string]: string;
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
export function getColorConfig<T extends ColorScheme>({
  baseScheme,
  namespace,
}: {
  baseScheme: T;
  namespace: string;
}): ThemeColors {
  return Object.entries(baseScheme).reduce(
    (colorAccum, [colorName, colorVariants]) => ({
      ...colorAccum,
      [`${colorName}Color`]: getColorVariants({
        colorName,
        colorVariants,
        namespace,
      }),
    }),
    {},
  );
}

function getColorVariants({
  colorVariants,
  namespace,
  colorName,
}: {
  colorVariants: ColorVariants;
  namespace: string;
  colorName: string;
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
      const variant = toKebabCase(variantName);
      return {
        ...acc,
        [variant === "default" ? "DEFAULT" : `color-${variant}`]:
          `rgb(var(--${namespace}-${colorName}-${variant}) / ${alpha})`,
      };
    },
    {},
  );
}
