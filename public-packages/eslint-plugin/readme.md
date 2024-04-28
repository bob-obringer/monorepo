# eslint-plugin

This is a custom ESLint plugin that provides configurations and rules for TypeScript, React, and Next.js projects.

## Installation

```bash
pnpm i -D @bob-obringer/eslint-plugin
```

```bash
npm i --save-dev @bob-obringer/eslint-plugin
```

```bash
yarn add --dev @bob-obringer/eslint-plugin
```

## Usage

This plugin provides three configurations:

- `recommended`: A base configuration that enforces good practices (and then my opinions).
- `react`: Extends `recommended` with rules tailored for React projects.
- `next`: Extends `recommended` with rules tailored for Next.js projects.

To use a configuration, extend your `.eslintrc` file like so:

```json
{
  "plugins": ["@bob-obringer"],
  "extends": ["plugin:@bob-obringer/react"]
}
```

Replace `recommended` with `react` or `next` for React and Next.js projects, respectively.

## Rules

This plugin adds some rules:

---

### no-process-env

Disallows the use of `process.env` outside of a config file. This is enabled by default in the `recommended` configuration.

Usage:

```json
{
  "rules": {
    "@bob-obringer/no-process-env": ["error", "config"]
  }
}
```

The second argument is a optional string that specifies folders which may contain process.env references. The default is `config`.

---

### next-prefer-named-exports

Suggests preferring named exports over default exports in TypeScript files, with exceptions for certain Next.js conventions. This is enabled by default in the `next` configuration.

Usage:

```json
{
  "rules": {
    "@bob-obringer/next-prefer-named-exports": "error"
  }
}
```
