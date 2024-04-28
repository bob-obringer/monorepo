# @bob-obringer/tsconfig

## Description

This library is a collection of TypeScript configuration packages.

It is designed to provide a set of modern and strict base configurations for
different types of TypeScript projects.

## Installation

```bash
pnpm i -D @bob-obringer/tsconfig
```

```bash
npm i --save-dev @bob-obringer/tsconfig
```

```bash
yarn add --dev @bob-obringer/tsconfig
```

## Usage

The library includes several TypeScript configurations for different types of projects:

- `tsconfig.base.json`: The base configuration for all TypeScript projects.
- `tsconfig.library-base.json`: The base configuration for library projects.
- `node-app/tsconfig.json`: The configuration for Node.js applications.
- `nextjs-app/tsconfig.json`: The configuration for Next.js applications.
- `isomorphic-library/tsconfig.json`: The configuration for isomorphic libraries.
- `frontend-library/tsconfig.json`: The configuration for frontend libraries.
- `backend-library/tsconfig.json`: The configuration for backend libraries.

To use a configuration, extend your `tsconfig.json` file like so:

```json
{
  "extends": "@bob-obringer/tsconfig/isomorphic-library/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```

Extend whichever configuration is appropriate for your project

Unfortunately, typescript treats paths as relative to to the tsconfig file that
defines the paths, so they must be included in each individual package.

## NextJS

NextJS is opinionated about the tsconfig file it uses. To use the `nextjs-app`
configuration, use the following configuration:

```json
{
  "extends": ["@bob-obringer/tsconfig/nextjs-app/tsconfig.json"],
  "compilerOptions": {
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Additional configurations

In addition to each of the standard configurations, there are `dev` and
`debug` versions which include additional settings for development and debugging:

### Usage

```json
{
  "extends": "@bob-obringer/tsconfig/isomorphic-library/tsconfig.dev.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```
