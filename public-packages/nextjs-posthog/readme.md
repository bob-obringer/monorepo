# NextJS Posthog Wrapper

This package is a wrapper around the [Posthog](https://posthog.com/) analytics library for the Next.js App Router.

It simplifies posthog setup and enables event tracking.

## Installation

```bash
pnpm install @bob-obringer/nextjs-posthog
```

```bash
npm install @bob-obringer/nextjs-posthog
```

```bash
yarn add @bob-obringer/nextjs-posthog
```

## Usage

The package provides a `PosthogProvider` component that should be
wrapped around your NextJS application (generally with other providers)

```tsx
import { type ReactNode } from "react";
import { PosthogProvider } from "@bob-obringer/nextjs-posthog";
import { env } from "@/config/client";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <PosthogProvider
          token={env.posthog.apiKey}
          host={env.posthog.host}
          enabled={env.posthog.enabled}
          capturePageView={true}
          capturePageLeave={false}
        >
          {children}
        </PosthogProvider>
      </body>
    </html>
  );
}
```
