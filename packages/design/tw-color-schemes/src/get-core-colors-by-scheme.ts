import type {
  AdditionalColorScheme,
  BaseColorScheme,
  ColorSchemeComponentsReturnType,
  ColorSchemeCore,
  CoreColorsByScheme,
} from "./types";
import { BASE_SCHEMA_NAME, deepMerge } from "./utilities";

/**
 * This function returns the core colors
 *
 * {
 *   base: {
 *     background: {
 *       default: '#000000',
 *       secondary: '#000000',
 *       tertiary: '#000000',
 *       overlay: '#000000',
 *       positive: '#000000',
 *       warning: '#000000',
 *       negative: '#3300FF',
 *       imageOverlay: '#000000'
 *     },
 *     border: { default: '#FF00FF', tertiary: '#00FF00' }
 *   },
 *   red: {
 *     background: {
 *       default: '#ffff00',
 *       secondary: '#000000',
 *       tertiary: '#000000',
 *       overlay: '#000000',
 *       positive: '#000000',
 *       warning: '#000000',
 *       negative: '#ff88f0',
 *       imageOverlay: '#000000'
 *     },
 *     border: { default: '#FF00FF', tertiary: '#0000FF' }
 *   }
 * }
 * @param baseScheme
 * @param additionalSchemes
 */
export function getCoreColorsByScheme<
  T extends ColorSchemeCore,
  U extends ColorSchemeComponentsReturnType,
>({
  baseScheme,
  additionalSchemes,
}: {
  baseScheme: BaseColorScheme<T, U>;
  additionalSchemes?: Record<
    string,
    AdditionalColorScheme<BaseColorScheme<T, U>>
  >;
}): CoreColorsByScheme<T, U> {
  const coreAdditionalSchemes = additionalSchemes
    ? Object.entries(additionalSchemes).reduce(
        (accum, [schemeName, scheme]) => ({
          ...accum,
          [schemeName]: deepMerge(baseScheme.core, (scheme.core as T) ?? {}),
        }),
        {},
      )
    : {};

  return {
    [BASE_SCHEMA_NAME]: baseScheme.core,
    ...coreAdditionalSchemes,
  };
}
