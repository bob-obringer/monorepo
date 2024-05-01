import { exec } from "child_process";
import { promisify } from "util";
import commitParser, { type Commit } from "conventional-commits-parser";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const execAsync = promisify(exec);

type UpgradeType = "breaking" | "major" | "minor" | "patch" | "none";

const upgradeTypeMap: Record<string, UpgradeType> = {
  feat: "minor",
  fix: "patch",
  docs: "none",
  refactor: "patch",
  perf: "patch",
  test: "none",
  ci: "none",
  chore: "none",
};

const priority = ["patch", "minor", "major"];

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

export async function generateChangeset({
  id,
}: {
  id?: string;
} = {}): Promise<void> {
  const commits = await getCommitsSinceMaster();
  const commitsWithPackages = await getCommitsWithPackages(commits);
  const packageUpgrades = getPackageUpgrades(commitsWithPackages);
  const releaseNotes = generateReleaseNotes(commitsWithPackages);
  await createChangesets(packageUpgrades, releaseNotes, id);
}

function getPackageUpgrades(commits: CommitInfoWithPackages[]) {
  const packageUpgradeTypes: Record<string, UpgradeType> = {};

  for (const commit of commits) {
    for (const packageName of commit.changedPackages) {
      const upgradeType = commit.upgradeType;
      if (upgradeType === null) continue;

      const currentUpgradeType = packageUpgradeTypes[packageName];

      if (currentUpgradeType) {
        const currentPriority = priority.indexOf(currentUpgradeType);
        const newPriority = priority.indexOf(upgradeType);

        if (newPriority > currentPriority) {
          packageUpgradeTypes[packageName] = upgradeType;
        }
      } else {
        packageUpgradeTypes[packageName] = upgradeType;
      }
    }
  }

  return packageUpgradeTypes;
}

async function getCommitsSinceMaster(): Promise<CommitInfo[]> {
  await execAsync("git checkout main");
  await execAsync("git fetch");
  await execAsync("git checkout develop");
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
    `git show --name-only --pretty=format: ${commitSha}`,
  );
  const changedFiles = stdout.trim().split("\n");
  const changedPackages = new Set<string>();
  const processedPackages = new Set<string>();

  for (const file of changedFiles) {
    const parts = file.split("/");

    for (let i = 0; i < parts.length; i++) {
      const packagePath = parts.slice(0, i + 1).join("/");
      const packageJsonPath = `${packagePath}/package.json`;

      try {
        const { stdout } = await execAsync(
          `git show ${commitSha}:${packageJsonPath}`,
        );
        const packageJson = JSON.parse(stdout);
        changedPackages.add(packageJson.name);
        processedPackages.add(packagePath);
        break;
      } catch (_) {
        // execAsync throws if package.json doesn't exist
      }
    }
  }

  return Array.from(changedPackages);
}

// https://github.com/changesets/changesets/issues/862
function generateReleaseNotes(commits: CommitInfoWithPackages[]): string {
  const releaseNotes = {
    breaking: [] as Array<string>,
    feat: [] as Array<string>,
    fix: [] as Array<string>,
    other: [] as Array<string>,
  };

  for (const commit of commits) {
    const {
      isBreakingChange,
      parsedMessage: { type, subject, scope },
    } = commit;

    if (!subject) continue;

    const scopeString = scope ? `${scope}: ` : "";
    const changeItem = `- ${scopeString}${subject}`;

    if (isBreakingChange) {
      releaseNotes.breaking.push(changeItem);
    } else if (type === "feat") {
      releaseNotes.feat.push(changeItem);
    } else if (type === "fix") {
      releaseNotes.fix.push(changeItem);
    } else {
      releaseNotes.other.push(changeItem);
    }
  }

  let releaseNotesString = "";

  if (releaseNotes.breaking.length > 0) {
    releaseNotesString += "## Breaking Changes\n";
    releaseNotesString += releaseNotes.breaking.join("\n");
    releaseNotesString += "\n\n";
  }

  if (releaseNotes.feat.length > 0) {
    releaseNotesString += "## New Features\n";
    releaseNotesString += releaseNotes.feat.join("\n");
    releaseNotesString += "\n\n";
  }

  if (releaseNotes.fix.length > 0) {
    releaseNotesString += "## Bug Fixes\n";
    releaseNotesString += releaseNotes.fix.join("\n");
    releaseNotesString += "\n\n";
  }

  if (releaseNotes.other.length > 0) {
    releaseNotesString += "## Other Changes\n";
    releaseNotesString += releaseNotes.other.join("\n");
    releaseNotesString += "\n\n";
  }

  return releaseNotesString.trim();
}

async function createChangesets(
  packageUpgrades: Record<string, UpgradeType>,
  releaseNotes: string,
  id?: string,
): Promise<void> {
  const changesetDir = join(process.cwd(), ".changeset");
  const changesetID = id ?? Date.now().toString();
  const changesetFile = join(changesetDir, `${changesetID}-changeset.md`);

  const headerContent = Object.entries(packageUpgrades)
    .filter(([_, upgradeType]) => upgradeType !== "none")
    .map(([packageName, upgradeType]) => `"${packageName}": ${upgradeType}`)
    .join("\n");

  const changesetContent = `---
${headerContent}
---

${releaseNotes}
`;

  try {
    await mkdir(changesetDir, { recursive: true });
    await writeFile(changesetFile, changesetContent, "utf8");
    console.log(`Created changeset: ${changesetFile}`);
  } catch (error) {
    console.error("Error creating changeset:", error);
  }
}
