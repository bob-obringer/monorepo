import type { CSSProperties } from "react";

export type ColorVariants = {
  default: string;
  [variantName: string]: string;
};

export type ColorSchemeCore = {
  accent?: ColorVariants;
  border?: ColorVariants;
  background?: ColorVariants;
  boxShadow?: ColorVariants;
  caret?: ColorVariants;
  divide?: ColorVariants;
  outline?: ColorVariants;
  placeholder?: ColorVariants;
  ring?: ColorVariants;
  ringOffset?: ColorVariants;
  text?: ColorVariants;
  textDecoration?: ColorVariants;
};

export type DeepSubset<T> = {
  [K in keyof T]?: T[K] extends object ? DeepSubset<T[K]> : T[K];
};

type CSSPropertiesObject = {
  [key in keyof CSSProperties]: string;
};

export type RecursiveCSSProperties = CSSPropertiesObject & {
  [key: string]:
    | CSSPropertiesObject[keyof CSSPropertiesObject]
    | RecursiveCSSProperties;
};

export type ColorSchemeComponentsReturnType = {
  [className: string]: RecursiveCSSProperties;
};

export type BaseColorScheme<
  Core extends ColorSchemeCore,
  Components extends ColorSchemeComponentsReturnType,
> = {
  core: Core;
  components?: (core: Core) => Components;
};

export type AdditionalColorScheme<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BaseScheme extends BaseColorScheme<any, any>,
> = {
  [K in keyof BaseScheme]?: BaseScheme[K] extends object
    ? DeepSubset<BaseScheme[K]>
    : BaseScheme[K];
};

export type AdditionalSchemesByName<
  Core extends ColorSchemeCore,
  Components extends ColorSchemeComponentsReturnType,
> = {
  [schemeName: string]: AdditionalColorScheme<
    BaseColorScheme<Core, Components>
  >;
};

export type CoreColorsByScheme<
  Core extends ColorSchemeCore,
  Components extends ColorSchemeComponentsReturnType,
> = {
  [colorSchemeName: string]: BaseColorScheme<Core, Components>["core"];
};
