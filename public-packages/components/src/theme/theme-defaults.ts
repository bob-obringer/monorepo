import type {
  ComponentsFontFamilies,
  ComponentsColorScheme,
  ComponentsFontSizes,
  ComponentsFontWeights,
} from "./types";
import colorPalette from "./color-palette.json";

export const defaultFontFamilies: ComponentsFontFamilies = {
  body: "sans-serif",
  display: "sans-serif",
  mono: "monospace",
};

export const defaultFontWeights: ComponentsFontWeights = {
  normal: "300",
  medium: "500",
  bold: "600",
};

export const defaultFontSizes: ComponentsFontSizes = {
  xs: "75%",
  sm: "88%",
  md: "100%",
  lg: "141%",
  xl: "200%",
  "2xl": "283%",
  "3xl": "400%",
};

export const defaultDarkMode: ComponentsColorScheme = {
  background: {
    DEFAULT: colorPalette["blue-100"].darkest,
    primary: colorPalette["blue-100"].darkest,
    secondary: colorPalette["blue-200"].darkest,
    tertiary: colorPalette["blue-300"].darkest,
    positive: colorPalette["green-400"].darkest,
    positiveSecondary: colorPalette["green-500"].darkest,
    negative: colorPalette["red-500"].darkest,
    negativeSecondary: colorPalette["red-600"].darkest,
    warning: colorPalette["gray-500"].darkest,
    warningSecondary: colorPalette["gray-600"].darkest,
    transparent: colorPalette["transparent-white-100"],
    contrast: colorPalette["white"],
  },
  text: {
    DEFAULT: colorPalette["gray-900"].darkest,
    primary: colorPalette["gray-900"].darkest,
    secondary: colorPalette["gray-700"].darkest,
    tertiary: colorPalette["gray-600"].darkest,
    positive: colorPalette["green-1100"].darkest,
    positiveSecondary: colorPalette["green-1200"].darkest,
    negative: colorPalette["red-1100"].darkest,
    negativeSecondary: colorPalette["red-1200"].darkest,
    warning: colorPalette["yellow-1100"].darkest,
    warningSecondary: colorPalette["yellow-1200"].darkest,
    link: colorPalette["blue-800"].darkest,
    linkHover: colorPalette["blue-900"].darkest,
    disabled: colorPalette["white"],
  },
  border: {
    DEFAULT: colorPalette["blue-300"].darkest,
    primary: colorPalette["blue-300"].darkest,
    secondary: colorPalette["blue-400"].darkest,
    tertiary: colorPalette["blue-500"].darkest,
    disabled: colorPalette["transparent-white-500"],
  },
};

export const defaultLightMode: ComponentsColorScheme = {
  background: {
    DEFAULT: colorPalette["gray-300"].light,
    primary: colorPalette["gray-300"].light,
    secondary: colorPalette["gray-200"].light,
    tertiary: colorPalette["gray-100"].light,
    positive: colorPalette["green-200"].light,
    positiveSecondary: colorPalette["green-300"].light,
    negative: colorPalette["red-500"].light,
    negativeSecondary: colorPalette["red-600"].light,
    warning: colorPalette["gray-500"].light,
    warningSecondary: colorPalette["gray-600"].light,
    transparent: colorPalette["transparent-black-100"],
    contrast: colorPalette["black"],
  },
  text: {
    DEFAULT: colorPalette["gray-900"].light,
    primary: colorPalette["gray-900"].light,
    secondary: colorPalette["gray-700"].light,
    tertiary: colorPalette["gray-600"].light,
    positive: colorPalette["green-700"].light,
    positiveSecondary: colorPalette["green-800"].light,
    negative: colorPalette["red-500"].light,
    negativeSecondary: colorPalette["red-600"].light,
    warning: colorPalette["gray-500"].light,
    warningSecondary: colorPalette["gray-600"].light,
    link: colorPalette["blue-800"].light,
    linkHover: colorPalette["blue-600"].light,
    disabled: colorPalette["transparent-white-500"],
  },
  border: {
    DEFAULT: colorPalette["gray-100"].light,
    primary: colorPalette["gray-100"].light,
    secondary: colorPalette["gray-200"].light,
    tertiary: colorPalette["gray-300"].light,
    disabled: colorPalette["transparent-white-500"],
  },
};
