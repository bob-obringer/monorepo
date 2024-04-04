import { themeConfig } from "../theme-config";

const {
  theme: { fontWeight, fontFamily },
} = themeConfig;
const expandedFontFamily = {
  "font-family": fontFamily["family-expanded"].join(", "),
};

const monoFontFamily = {
  "font-family": fontFamily["family-mono"].join(", "),
};

const mediumFontWeight = {
  "font-weight": fontWeight["weight-medium"],
};

const boldFontWeight = {
  "font-weight": fontWeight["weight-bold"],
};

const uppercase = {
  "text-transform": "uppercase",
};

const defaults = {
  "font-style": "normal",
  "font-family": fontFamily["family-body"].join(", "),
  "font-weight": fontWeight["weight-normal"],
};

function fontAndLineSize(fontSize: number, lineHeight: number) {
  return {
    "font-size": `${fontSize}px`,
    "line-height": `${lineHeight}px`,
  };
}

function letterSpacing(letterSpacing: number) {
  return {
    "letter-spacing": `${letterSpacing}px`,
  };
}

export const typography = {
  /*
      Display
     */
  ".typography-display-large": {
    ...defaults,
    ...mediumFontWeight,
    ...fontAndLineSize(57, 64),
  },
  ".typography-display-medium": {
    ...defaults,
    ...mediumFontWeight,
    ...fontAndLineSize(45, 52),
  },
  ".typography-display-small": {
    ...defaults,
    ...mediumFontWeight,
    ...fontAndLineSize(36, 44),
  },

  /*
      Headline
     */
  ".typography-headline-large": {
    ...defaults,
    ...fontAndLineSize(32, 40),
  },
  ".typography-headline-medium": {
    ...defaults,
    ...fontAndLineSize(28, 36),
  },
  ".typography-headline-small": {
    ...defaults,
    ...fontAndLineSize(24, 32),
  },

  /*
      Title Expanded
     */
  ".typography-title-expanded-large": {
    ...defaults,
    ...expandedFontFamily,
    ...boldFontWeight,
    ...fontAndLineSize(22, 28),
  },
  ".typography-title-expanded-medium": {
    ...defaults,
    ...expandedFontFamily,
    ...boldFontWeight,
    ...fontAndLineSize(16, 24),
  },
  ".typography-title-expanded-small": {
    ...defaults,
    ...expandedFontFamily,
    ...boldFontWeight,
    ...fontAndLineSize(14, 20),
  },

  /*
    Title
   */
  ".typography-title-large": {
    ...defaults,
    ...fontAndLineSize(22, 28),
  },
  ".typography-title-medium": {
    ...defaults,
    ...fontAndLineSize(16, 24),
  },
  ".typography-title-small": {
    ...defaults,
    ...fontAndLineSize(14, 20),
  },

  /*
      Label
     */
  ".typography-label-large": {
    ...defaults,
    ...fontAndLineSize(14, 20),
    ...letterSpacing(0.1),
  },
  ".typography-label-small": {
    ...defaults,
    ...uppercase,
    ...fontAndLineSize(12, 16),
    ...letterSpacing(0.5),
  },

  /*
      Label Mono
     */
  ".typography-label-mono-large": {
    ...defaults,
    ...monoFontFamily,
    ...fontAndLineSize(14, 20),
    ...letterSpacing(0.2),
  },
  ".typography-label-mono-small": {
    ...defaults,
    ...monoFontFamily,
    ...uppercase,
    ...fontAndLineSize(12, 16),
    ...letterSpacing(0.5),
  },

  /*
      Body
     */
  ".typography-body-large": {
    ...defaults,
    ...fontAndLineSize(16, 24),
  },
  ".typography-body-medium": {
    ...defaults,
    ...fontAndLineSize(14, 20),
  },
  ".typography-body-small": {
    ...defaults,
    ...fontAndLineSize(12, 16),
  },
};
