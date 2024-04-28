# Tailwind CSS Color Schemes

This package helps manage multiple color schemes for tailwind.

Pass it a color scheme definition, and it gives you a `colorSchemePlugin`
to include in your tailwind configuration.

## Installation

```
pnpm add -D @bob-obringer/tw-color-schemes
```

```
npm install --save-dev @bob-obringer/tw-color-schemes
```

```
yarn add --dev @bob-obringer/tw-color-schemes
```

## Features

- Create as many color schemes as you want
- Allows components to reference a single semantic color name instead of managing all modes
- Removes the need for additional `dark:` or `light:` class names on each of your components
- Allows nesting color schemes within a single page using a class name to switch schemes
- Supports multiple color formats (hex, rgb, tailwind rgb tokens)
- Typesafe, ensuring all color schemes include all required color entries

## Usage

**my-color-scheme.ts**

```typescript
import { createColorSchemePlugin } from "@bob-obringer/tw-color-schemes";
import { primitive, awesome } from "someones/awesome/colors";

const colorSchemePlugin = createColorSchemePlugin(
  {
    background: {
      default: primitive["Flat Grays"]["00"].value,
      primary: primitive["Flat Grays"]["00"].value,
      secondary: primitive["Flat Grays"]["01"].value,
    },
    text: {
      default: primitive["Flat Grays"]["00"].value,
      primary: primitive["Flat Grays"]["00"].value,
      secondary: primitive["Transparent Grays"]["08"].value,
    },
    border: {
      default: primitive["Transparent Grays"]["09"].value,
      primary: primitive["Transparent Grays"]["09"].value,
      secondary: primitive["Transparent Grays"]["05"].value,
    },
  },
  {
    awesome: {
      background: {
        default: awesome["Flat Grays"]["00"].value,
        primary: awesome["Flat Grays"]["00"].value,
        secondary: awesome["Flat Grays"]["01"].value,
      },
      text: {
        default: awesome["Flat Grays"]["00"].value,
        primary: awesome["Flat Grays"]["00"].value,
        secondary: awesome["Transparent Grays"]["08"].value,
      },
      border: {
        default: awesome["Transparent Grays"]["09"].value,
        primary: awesome["Transparent Grays"]["09"].value,
        secondary: awesome["Transparent Grays"]["05"].value,
      },
    },
  },
);
```

**tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";
import { colors, colorSchemePlugin } from "./my-color-scheme.ts";

export const config: Config = {
  ...
  plugins: [colorSchemePlugin]
};

export default config;
```

**Root.tsx**

```tsx
export default function Root() {
  return (
    <body className="awesome-color-scheme">
      ...
      <div className="text-color-primary">I'm awesome text 😀</div>
      <div className="light-color-scheme">
        <div className="text-color-primary">I'm less awesome text 😔</div>
      </div>
      ...
    </body>
  );
}
```
