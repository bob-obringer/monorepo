# eslint-plugin

This is a custom ESLint plugin that provides my opinionated rules and
configurations for TypeScript, React, and Next.js projects.

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

- `recommended`: A base configuration that enforces my opinionated practices.
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

---

### no-process-env

_Enabled by default in the `recommended` configuration._

Disallows the use of `process.env` outside of a config file.

- It prevents `process.env` from being scattered throughout the codebase, which can make it difficult to manage and maintain.
- Having a centralized config allows you to provide both compile time and run time typesafety for your environment variables.
- Centralizing config makes it easy to see all the environment variables in one place, understand how they are used, and avoid accidental duplication.
- By prohibiting `process.env` outside the config folder, this rule nudges developers towards the best practice and keeps the codebase clean.

**Usage:**

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

_Enabled by default in the `next` configuration._

Usage:

```json
{
  "rules": {
    "@bob-obringer/next-prefer-named-exports": "error"
  }
}
```

---

## Configurations

These configurations begin with sane defaults provided by recommended ESLint and Typescript rules, and then add my opinionated rules on top of them.

### Recommended

Extends:

- `eslint:recommended`
- `@typescript-eslint`
- `prettier`

Rules:

- Disallows unused imports (`unused-imports/no-unused-imports`)
- Disallows unused variables (`@typescript-eslint-no-unused-vars`)
- Disallows duplicate imports from the same module (`import/no-duplicates`)
- Requires a newline after imports (`import/newline-after-import`)
- Prevents the use of `process.env` outside of a config file (`@bob-obringer/no-process-env`)

### React

Extends:

- `@bob-obringer/recommended`
- `react/recommended`

Rules:

- Disables requiring `React` to be in scope (`react/react-in-jsx-scope`)
- Disallows the default React import, and that begin with `./..`

### NextJS

Extends:

- `@bob-obringer/recommended`
- `next/core-web-vitals`

Rules:

- Disallows default exports (`@bob-obringer/next-prefer-named-exports`)
- Disallows the default React import (`no-restricted-imports`)
- Disallows imports that begin with `./..` (`no-restricted-imports`)
- Disallows the use of `next/router` (`no-restricted-imports`)

## TODO:

ESLint 9 is here, including a new config system. Most of the ecosystem has not caught up yet, including our dependencies. Once our dependencies are ready, we'll bump this to 9 and upgrade to the new config system. If they drag, we'll create our own version of the old rules.

## Package Bumping

bump4
