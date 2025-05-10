# TypeScript Configuration

This library is a collection of TypeScript configuration files.

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

- `tsconfig.app.json`
- `tsconfig.app.dom.json`
- `tsconfig.base.json`
- `tsconfig.library.json`
- `tsconfig.library.dom.json`

To use a configuration, extend your `tsconfig.json` file like so:

```json
{
  "extends": "@bob-obringer/tsconfig/tsconfig.library.json",
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

## Development and Debug Configurations

In addition to each of the standard configurations, there are `dev` and
`debug` versions which include additional settings for development and debugging:

### Usage

```json
{
  "extends": "@bob-obringer/tsconfig/debug/tsconfig.app.dom.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
}
```
