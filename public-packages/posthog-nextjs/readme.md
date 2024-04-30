# @bob-obringer/posthog-nextjs

This package is a wrapper around the [PostHog](https://posthog.com/) analytics library for the Next.js App Router.

It simplifies posthog setup and enables event tracking.

## Installation

```bash
pnpm install @bob-obringer/posthog-nextjs
```

```bash
npm install @bob-obringer/posthog-nextjs
```

```bash
yarn add @bob-obringer/posthog-nextjs
```

## Usage

The package provides a `PosthogProvider` component that should be
wrapped around your NextJS application (generally with other providers)

```tsx
import { type ReactNode } from 'react';
import { PosthogProvider } from '@bob-obringer/posthog-nextjs'
import { env } from '@/config/client';

export default function RootLayout({ children }: { children: ReactNode }) {
return (
  <html>
    <body>
      <PosthogProvider
        token={env.posthog.apiKey}
        host={env.posthog.host}
        >
        {children}
      </PosthogProvider>
    </body>
  </html>

)
```

## TODO:

This is very crude for now. It just removes some setup boilerplate for new projects. I will be adding more features as I need them.
