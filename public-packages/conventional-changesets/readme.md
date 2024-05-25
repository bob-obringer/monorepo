# conventional-changeset

This package helps to automate the process of independently bumping semantic versions of multiple packages within a monorepo.

It generates markdown files which can be consumed by the [changesets](https://github.com/changesets/changesets) tool. Once the files have been created, `changesets` can be used to automate the version bumping process.

## Features

### Automated Changeset Creation

conventional-changesets eliminates the manual effort required to create changesets for each version bump commit. It automatically analyzes the commit messages and generates changeset files in markdown format.

### Conventional Commit Support

By following a conventional commit format, conventional-changesets can accurately determine the type of changes made in each commit, such as features, bug fixes, or breaking changes.

### Upgrade Type Detection

conventional-changesets intelligently detects the appropriate upgrade type (major, minor, or patch) based on the commit type and the presence of breaking changes. This ensures that the generated changesets accurately reflect the impact of each commit on the project's version.

### Multi-Package Support

conventional-changesets was designed for monorepos containing multiple publishable packages. It identifies the specific packages affected by each commit, allowing granular control over the versioning and release process of individual packages within a monorepo setup.

## How it works

- First we collect all the commits between our main and development branches.
- Parse each commit message using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to determine the type of change, and we identify which packages were updated in that commit.
- Generate a `changesets` markdown file for each commit, listing each package that was updated, the type of semantic version bump required, and the commit message to use as the changelog.

## Installation

```bash
pnpm install @bob-obringer/conventional-changesets
```

```bash
npm install @bob-obringer/conventional-changesets
```

```bash
yarn add @bob-obringer/conventional-changesets
```

## Usage

This is intended to be run as part of a CI/CD pipeline, but can be run locally or via a script.

This package provides both a CLI and a programmatic interface which take two optional parameters, `productionBranch` and `integrationBranch`. The default values are `main` and `develop` respectively.

The output is a collection of changeset markdown files sent to a `.changeset` folder in the root of the repository.

For an example of how it's used, see the [`.github/workflows/get-changesets.yml`](./.github/workflows/get-changesets.yml) file in this repository.

### CLI

```bash
npx conventional-changeset -p main -i develop
```

### Typescript

```typescript
import { generateChangesets } from "@bob-obringer/conventional-changesets";

function generateChangesetsAndDoOtherThings() {
  generateChangesets({
    productionBranch: "main",
    integrationBranch: "develop",
  });
}
```

## Then What?

Once you have the generated changesets files, you can use the `changeset` CLI to consume them. The CLI will automate the following tasks:

- Read the changesets files to bump the version for all updated packages
- Update the changelog for impacted packages
- Create a PR into your production branch

Once the PR is approved and merged, `changeset` can be run again to automates another set of tasks:

- Determines which packages have upgraded versions compared to the latest published version
- Deploys each of the packages to npm
- Tags the release version for each package in github

Taking this a step further, you can easily integrate this with your CI/CD pipeline.

## Conventional Commit / Semantic Version Mapping

There's currently a hardcoded mapping between conventional commit type and semantic version bump type:

```javascript
levels = {
  patch: "patch",
  fix: "patch",
  perf: "patch",
  refactor: "patch",
  feat: "minor",
  docs: null,
  test: null,
  ci: null,
  chore: null,
};
```

## Example

Our example assumes a monorepo with 4 packages, `A`, `B`, `C`, and `D`, all at version `0.0.1`

**New commits**
We have a pull request from our integration branch to our production branch that includes the following commits:

| Commit | Changed Packages | Commit Message                            |
| :----: | :--------------: | :---------------------------------------- |
|   1    |       `A`        | `fix: sint occaecat mollit proident`      |
|   2    |       `B`        | `fix: ad duis quis duis`                  |
|   3    |     `A`, `C`     | `feat: sunt lorem ex voluptate`           |
|   4    |     `C`, `D`     | `docs: non nisi officia ipsum`            |
|   5    |       `C`        | `feat: aliqua est BREAKING CHANGE: lorem` |

**New published versions after production release**

After running `conventional-changesets`, releasing to production, and bumping and publishsing with `changeset`, the packages will have the following versions:

| Package | Version | Why                                                                |
| :-----: | :-----: | :----------------------------------------------------------------- |
|   `A`   | `0.1.0` | `fix` and `feat` commits, largest bump being `feat` (`minor` bump) |
|   `B`   | `0.0.2` | `fix` commit (`patch` bump)                                        |
|   `C`   | `1.0.0` | `feat` and `docs` commit, but with breaking changes (`major`)      |
|   `D`   | `0.0.1` | `docs` commit (no version bump)                                    |

## Motivation

Over the past few years, monorepo tooling (like [Turborepo](https://turbo.build/repo) and [nx](https://nx.dev/)) have made it feasable to use monorepos for anything beyond the most basic project.

For my own personal needs, one of the remaining holes was the ability to smartly bump versions and publish in a low friction way. `changesets` solved the smart bumping and publishing part, but it still requires a manual process. I wanted to just use conventional commits and have the rest of the process automated.

When I went looking for a solution, I found that [I wasn't the only one](https://github.com/changesets/changesets/issues/862).

So I built this package, wired it up to github actions, and stopped worrying about bumping versions and deploying.

Hopefully someday this process could be built directly into our monorepo tools, but for now this solves my existing needs.

## TODO:

- **Make it Robust**: This isn't the most robust package, but it gets the job done.
- **Customizable Configuration**: Provide a flexible configuration system that allows you to define the mapping between conventional commit types and upgrade types.
