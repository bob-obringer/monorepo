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

- `tsconfig.base.json`
- `tsconfig.library-base.json`
- `node-app/tsconfig.json`
- `nextjs-app/tsconfig.json`
- `isomorphic-library/tsconfig.json`
- `frontend-library/tsconfig.json`
- `backend-library/tsconfig.json`

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

NextJS requires some additional configuration. To use the `nextjs-app`
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

## Development and Debug Configurations

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
