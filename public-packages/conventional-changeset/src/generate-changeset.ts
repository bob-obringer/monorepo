import { exec } from "child_process";
import { promisify } from "util";
import commitParser, { type Commit } from "conventional-commits-parser";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const execAsync = promisify(exec);

type UpgradeType = "breaking" | "major" | "minor" | "patch" | "none";

type CommitInfo = {
  sha: string;
  message: string;
  parsedMessage: Commit;
  isBreakingChange: boolean;
  upgradeType: UpgradeType;
};

type CommitInfoWithPackages = CommitInfo & {
  changedPackages: string[];
};

const upgradeTypeMap: Record<string, UpgradeType> = {
  feat: "minor",
  patch: "patch",
  fix: "patch",
  docs: "none",
  refactor: "patch",
  perf: "patch",
  test: "none",
  ci: "none",
  chore: "none",
};

export async function generateChangeset(): Promise<void> {
  const commits = await getCommitsSinceMain();
  const commitsWithPackages = await getCommitsWithPackages(commits);
  await createChangesets(commitsWithPackages);
}

async function getCommitsSinceMain(): Promise<CommitInfo[]> {
  const { stdout } = await execAsync('git log --format="%H %B" main..develop');
  return stdout
    .trim()
    .split("\n")
    .filter((commit) => commit.trim().match(/^[0-9a-f]{40}/))
    .map((c) => {
      const commit = c.trim();
      const sha = commit.substring(0, 40);
      const message = commit.substring(40).trim();
      const parsedMessage = commitParser.sync(message);
      const { type, body, footer } = parsedMessage;
      const isBreakingChange =
        body?.includes("BREAKING CHANGE") ??
        footer?.includes("BREAKING CHANGE") ??
        false;
      const upgradeType = isBreakingChange
        ? "major"
        : upgradeTypeMap[type ?? ""] || "patch";
      return { sha, message, upgradeType, isBreakingChange, parsedMessage };
    });
}

async function getCommitsWithPackages(commits: CommitInfo[]) {
  const commitInfo: CommitInfoWithPackages[] = [];
  for (const commit of commits) {
    const changedPackages = await getChangedPackages(commit.sha);
    if (changedPackages.length > 0) {
      commitInfo.push({ ...commit, changedPackages });
    }
  }
  return commitInfo;
}

async function getChangedPackages(commitSha: string): Promise<string[]> {
  const { stdout } = await execAsync(
    `git diff --name-only --diff-filter=d ${commitSha}^ ${commitSha}`,
  );
  const changedFiles = stdout.trim().split("\n");
  const changedPackages = new Set<string>();

  for (const filePath of changedFiles) {
    if (filePath.endsWith("package.json")) {
      const packagePath = filePath.substring(0, filePath.lastIndexOf("/"));
      try {
        const { stdout } = await execAsync(`git show ${commitSha}:${filePath}`);
        const packageJson = JSON.parse(stdout);
        changedPackages.add(packageJson.name);
      } catch (error) {
        console.error(
          `Error reading package.json at ${packagePath} in commit ${commitSha}:`,
          error,
        );
      }
    }
  }

  return Array.from(changedPackages);
}

// async function getChangedPackages(commitSha: string): Promise<string[]> {
//   const { stdout } = await execAsync(
//     `git show --name-only --pretty=format: ${commitSha}`,
//   );
//   const changedFiles = stdout.trim().split("\n");
//   const changedPackages = new Set<string>();
//   const processedPackages = new Set<string>();
//
//   for (const changedFilePath of changedFiles) {
//     const changedFilePathParts = changedFilePath.split("/");
//
//     for (let i = 0; i < changedFilePathParts.length; i++) {
//       const changedPackagePath = changedFilePathParts.slice(0, i + 1).join("/");
//       if (processedPackages.has(changedPackagePath)) break;
//
//       try {
//         const { stdout } = await execAsync(
//           `git show ${commitSha}:${changedPackagePath}/package.json`,
//         );
//         const packageJson = JSON.parse(stdout);
//         changedPackages.add(packageJson.name);
//         processedPackages.add(packagePath);
//         break;
//       } catch (_) {
//         // execAsync throws if package.json doesn't exist
//       }
//     }
//   }
//
//   return Array.from(changedPackages);
// }

// https://github.com/changesets/changesets/issues/862

async function createChangesets(
  commitsWithPackages: CommitInfoWithPackages[],
): Promise<void> {
  const changesetDir = join(process.cwd(), ".changeset");

  for (const commit of commitsWithPackages) {
    const {
      sha,
      upgradeType,
      parsedMessage: { subject, body, footer },
    } = commit;

    const packageUpgrades: Record<string, UpgradeType> = {};
    for (const packageName of commit.changedPackages) {
      packageUpgrades[packageName] = upgradeType;
    }

    const headerContent = Object.entries(packageUpgrades)
      .filter(([_, upgradeType]) => upgradeType !== "none")
      .map(([packageName, upgradeType]) => `"${packageName}": ${upgradeType}`)
      .join("\n");

    const message = [subject, body, footer].filter(Boolean).join("\n\n");

    const changesetContent = `---
${headerContent}
---
${message}
`;

    const changesetFile = join(changesetDir, `${sha}.md`);

    try {
      await mkdir(changesetDir, { recursive: true });
      await writeFile(changesetFile, changesetContent, "utf8");
      console.log(`Created changeset: ${changesetFile}`);
    } catch (error) {
      console.error(`Error creating changeset for commit ${sha}:`, error);
    }
  }
}
