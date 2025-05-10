import type { Preview, ReactRenderer } from "@storybook/react";
import "../src/styles/default-theme/light-color-mode.css";
import "../src/styles/default-theme/dark-color-mode.css";
import "../src/styles/tailwind-config.css";

import { withThemeByClassName } from "@storybook/addon-themes";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        // color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: {
        light: "light-color-mode default-theme",
        dark: "dark-color-mode default-theme",
      },
      defaultTheme: "dark",
    }),
  ],
};

export default preview;
