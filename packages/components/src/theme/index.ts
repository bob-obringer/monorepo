import { createTheme, type ComponentsThemeConfig } from "./create-theme";
import { type Config } from "tailwindcss";

const componentsContent =
  "./node_modules/@bob-obringer/components/dist/components/**/*.{js,ts,jsx,tsx,mdx}";

function createTailwindConfig({
  contentFolders,
  theme,
}: {
  contentFolders: Array<string>;
  theme: ComponentsThemeConfig;
}): Config {
  return {
    content: [
      componentsContent,
      ...contentFolders.map((folder) => `./${folder}/**/*.{js,ts,jsx,tsx,mdx}`),
    ],
    plugins: createTheme(theme),
  };
}

export { createTheme, componentsContent, createTailwindConfig };
