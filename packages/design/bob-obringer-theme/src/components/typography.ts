import { themeConfig } from "../theme-config";
import defaultConfig from "tailwindcss/defaultConfig";
import resolveConfig from "tailwindcss/resolveConfig";

const {
  theme: { letterSpacing, lineHeight },
} = resolveConfig(defaultConfig);

const {
  theme: {
    fontWeight: {
      ["weight-normal"]: weightNormal,
      ["weight-medium"]: weightMedium,
      ["weight-bold"]: weightBold,
    },
    fontFamily: {
      "family-body": bodyArray,
      "family-expanded": expandedArray,
      "family-mono": monoArray,
    },
    fontSize: {
      ["size-xs"]: sizeXS,
      ["size-sm"]: sizeSM,
      ["size-md"]: sizeMD,
      ["size-lg"]: sizeLG,
      ["size-xl"]: sizeXL,
      ["size-2xl"]: size2XL,
      ["size-3xl"]: size3XL,
    },
  },
} = themeConfig;

const fontFamilyExpanded = expandedArray.join(", ");
const fontFamilyMono = monoArray.join(", ");
const fontFamilyBody = bodyArray.join(", ");

const displayBase = {
  "line-height": lineHeight.none,
  "font-family": fontFamilyExpanded,
  "font-weight": weightBold,
};
const display = {
  ".typography-display-large": { ...displayBase, "font-size": size3XL },
  ".typography-display-medium": { ...displayBase, "font-size": size2XL },
  ".typography-display-small": { ...displayBase, "font-size": sizeXL },
};

const headingBase = {
  "line-height": lineHeight.none,
  "font-family": fontFamilyExpanded,
  "font-weight": weightBold,
};
const heading = {
  ".typography-headline-large": { ...headingBase, "font-size": sizeXL },
  ".typography-headline-medium": { ...headingBase, "font-size": sizeLG },
  ".typography-headline-small": { ...headingBase, "font-size": sizeMD },
};

const titleBase = {
  "line-height": lineHeight.tight,
  "font-family": fontFamilyBody,
  "font-weight": weightMedium,
};
const title = {
  ".typography-title-large": { ...titleBase, "font-size": sizeLG },
  ".typography-title-medium": { ...titleBase, "font-size": sizeMD },
  ".typography-title-small": { ...titleBase, "font-size": sizeSM },
};

const labelBase = {
  "line-height": lineHeight.none,
  "font-family": fontFamilyBody,
  "letter-spacing": letterSpacing.wide,
};

const label = {
  ".typography-label-large": {
    ...labelBase,
    "font-size": sizeMD,
  },
  ".typography-label-medium": {
    ...labelBase,
    "font-size": sizeSM,
  },
  ".typography-label-small": {
    ...labelBase,
    "text-transform": "uppercase",
    "font-size": sizeXS,
  },
};

const labelMonoBase = {
  "line-height": lineHeight.none,
  "font-family": fontFamilyMono,
  "letter-spacing": letterSpacing.wide,
};

const labelMono = {
  ".typography-label-mono-large": {
    ...labelMonoBase,
    "font-size": sizeMD,
  },
  ".typography-label-mono-medium": {
    ...labelMonoBase,
    "font-size": sizeSM,
  },
  ".typography-label-mono-small": {
    ...labelMonoBase,
    "text-transform": "uppercase",
    "font-size": sizeXS,
  },
};

const bodyBase = {
  "line-height": lineHeight.normal,
  "font-family": fontFamilyBody,
  "font-weight": weightNormal,
};

const body = {
  ".typography-body-large": {
    ...bodyBase,
    "font-size": sizeMD,
  },
  ".typography-body-medium": {
    ...bodyBase,
    "font-size": sizeSM,
  },
  ".typography-body-small": {
    ...bodyBase,
    "font-size": sizeXS,
  },
};

export const typography = {
  ...display,
  ...heading,
  ...title,
  ...label,
  ...labelMono,
  ...body,
};
