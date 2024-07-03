import { createColorSchemePlugin } from "@bob-obringer/tw-color-schemes";
import type { CustomThemeConfig } from "tailwindcss/types/config";
import plugin from "tailwindcss/plugin";
import type {
  ComponentsFontFamilies,
  ComponentsFontSizes,
  ComponentsFontWeights,
  ComponentsColorScheme,
} from "./types";
import {
  defaultDarkMode,
  defaultLightMode,
  defaultFontFamilies,
  defaultFontSizes,
  defaultFontWeights,
} from "./theme-defaults";
import { typography } from "./components/typography";
import reactAria from "tailwindcss-react-aria-components";

export type ComponentsThemeConfig = {
  colors?: Record<string, unknown>;
  colorModes?: Record<string, ComponentsColorScheme>;
  fontFamily?: ComponentsFontFamilies;
  fontWeight?: ComponentsFontWeights;
  fontSize?: ComponentsFontSizes;
};

export function createTheme(themeConfig: ComponentsThemeConfig = {}) {
  const colorSchemePlugin = createColorSchemePlugin(
    themeConfig.colors ?? defaultDarkMode,
    {
      schemes: themeConfig.colorModes ?? {
        light: defaultLightMode,
      },
    },
  );

  const fontFamily = themeConfig.fontFamily ?? defaultFontFamilies;
  const fontWeight = themeConfig.fontWeight ?? defaultFontWeights;
  const fontSize = themeConfig.fontSize ?? defaultFontSizes;

  // apply user-defined theme values, or use defaults
  const tailwindThemeConfig: Partial<CustomThemeConfig> = {
    colors: {},
    fontFamily: prefixKeys("family", fontFamily),
    fontWeight: prefixKeys("weight", fontWeight),
    fontSize: prefixKeys("size", fontSize),
  };

  const themePlugin = plugin(
    function ({ addComponents, theme }) {
      // this is getting called twice with a function one time
      // I have no idea why, this stops the problem
      if (!addComponents) return;

      const typographyComponent = typography({
        fontFamily: theme("fontFamily"),
        fontSize: theme("fontSize"),
        fontWeight: theme("fontWeight"),
      });
      addComponents(typographyComponent);
    },
    {
      theme: tailwindThemeConfig,
    },
  );

  return [themePlugin, colorSchemePlugin, reactAria];
}

function prefixKeys<T extends Record<string, unknown>>(
  prefix: string,
  obj: T,
): T {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[`${prefix}-${key}`] = obj[key];
      return acc;
    },
    {} as Record<string, unknown>,
  ) as T;
}
