export type ColorVariants = {
  DEFAULT: string;
  [variantName: string]: string;
};

export type ColorScheme = {
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

export type AdditionalColorScheme<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  BaseScheme extends ColorScheme,
> = {
  [K in keyof BaseScheme]?: BaseScheme[K] extends object
    ? DeepSubset<BaseScheme[K]>
    : BaseScheme[K];
};

export type AdditionalSchemesByName<BaseScheme extends ColorScheme> = {
  [schemeName: string]: AdditionalColorScheme<BaseScheme>;
};

export type ColorsByScheme<BaseScheme extends ColorScheme> = {
  [colorSchemeName: string]: BaseScheme;
};
