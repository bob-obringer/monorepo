export type ComponentsColorScheme = {
  background: {
    DEFAULT: string;
    primary: string;
    secondary: string;
    tertiary: string;
    positive: string;
    positiveSecondary: string;
    negative: string;
    negativeSecondary: string;
    warning: string;
    warningSecondary: string;
    transparent: string;
    contrast: string;
  };
  text: {
    DEFAULT: string;
    primary: string;
    secondary: string;
    tertiary: string;
    positive: string;
    positiveSecondary: string;
    negative: string;
    negativeSecondary: string;
    warning: string;
    warningSecondary: string;
    link: string;
    linkHover: string;
    disabled: string;
  };
  border: {
    DEFAULT: string;
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };
};

export type ComponentsFontFamilies = {
  body: string | Array<string>;
  display: string | Array<string>;
  mono: string | Array<string>;
};

export type ComponentsFontWeights = {
  normal: string;
  medium: string;
  bold: string;
};

export type ComponentsFontSizes = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  "3xl": string;
};
