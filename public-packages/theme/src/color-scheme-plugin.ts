import { createColorSchemePlugin } from "@bob-obringer/tw-color-schemes";
import {
  mauveDark,
  skyDark,
  rubyDark,
  grassDark,
  orangeDark,
} from "@radix-ui/colors";

// todo: handle radix alpha colors (like #FFFFFF88)
export const colorSchemePlugin = createColorSchemePlugin({
  background: {
    default: mauveDark.mauve1,
    primary: mauveDark.mauve1,
    secondary: mauveDark.mauve2,
    tertiary: mauveDark.mauve3,
    alt: skyDark.sky1,
    altSecondary: skyDark.sky2,
    transparent: "rgba(0, 0, 0, 0.0)",
    // Buttons
    button: mauveDark.mauve12,
    buttonHover: mauveDark.mauve11,
    buttonSecondary: mauveDark.mauve2,
    buttonSecondaryHover: mauveDark.mauve1,
    buttonNegative: rubyDark.ruby2,
    buttonNegativeHover: rubyDark.ruby1,
    buttonPositive: grassDark.grass2,
    buttonPositiveHover: grassDark.grass1,
    buttonWarning: orangeDark.orange2,
    buttonWarningHover: orangeDark.orange1,
    buttonDisabled: "rgba(255, 255, 255, 0.05)",
  },
  text: {
    default: mauveDark.mauve12,
    primary: mauveDark.mauve12,
    secondary: mauveDark.mauve11,
    tertiary: mauveDark.mauve10,
    positive: grassDark.grass11,
    negative: orangeDark.orange11,
    warning: rubyDark.ruby11,
    link: skyDark.sky9,
    linkHover: skyDark.sky10,
    disabled: "rgba(255, 255, 255, 0.19)",
    // Buttons
    button: mauveDark.mauve1,
    buttonSecondary: mauveDark.mauve9,
  },
  border: {
    default: mauveDark.mauve2,
    primary: mauveDark.mauve2,
    secondary: mauveDark.mauve3,
    tertiary: mauveDark.mauve4,
    disabled: mauveDark.mauve9,
    // Buttons
    button: mauveDark.mauve4,
    buttonHover: mauveDark.mauve5,
    buttonSecondary: mauveDark.mauve3,
    buttonSecondaryHover: mauveDark.mauve4,
    buttonNegative: rubyDark.ruby8,
    buttonNegativeHover: rubyDark.ruby9,
    buttonPositive: grassDark.grass8,
    buttonPositiveHover: grassDark.grass9,
    buttonWarning: orangeDark.orange8,
    buttonWarningHover: orangeDark.orange9,
    buttonDisabled: "rgba(255, 255, 255, 0.05)",
  },
});
