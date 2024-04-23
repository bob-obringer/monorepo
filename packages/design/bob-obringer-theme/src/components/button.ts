import { themeConfig } from "../theme-config";

const {
  theme: { fontWeight, fontFamily },
} = themeConfig;

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

export const button = {
  ".button-size-large": {
    height: "56px",
    padding: "0 20px",
    "font-family": fontFamily["family-body"].join(", "),
    "font-weight": fontWeight["weight-medium"],
    ...fontAndLineSize(16, 24),
  },
  ".button-size-medium": {
    height: "32px",
    padding: "0 16px",
    "font-family": fontFamily["family-mono"].join(", "),
    "text-transform": "uppercase",
    ...fontAndLineSize(12, 16),
    ...letterSpacing(0.5),
  },
  ".button-size-small": {
    height: "24px",
    padding: "0 8px",
    "font-family": fontFamily["family-mono"].join(", "),
    "text-transform": "uppercase",
    ...fontAndLineSize(10, 14),
    ...letterSpacing(0.75),
  },
};
