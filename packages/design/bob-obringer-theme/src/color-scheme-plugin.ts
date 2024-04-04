import { createColorSchemePlugin } from "@bob-obringer/tw-color-schemes";

export const coreColorScheme = {
  background: {
    default: "#888888",
    primary: "#333333",
  },
};

export const colorSchemePlugin = createColorSchemePlugin({
  core: coreColorScheme,
});
