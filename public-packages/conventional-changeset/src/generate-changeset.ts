import { exec } from "child_process";
import { promisify } from "util";
import parser from "conventional-commits-parser";

const execAsync = promisify(exec);

const priority = ["patch", "minor", "major"];

type Commit = {
  sha: string;
  message: string;
  upgradeType: "major" | "minor" | "patch";
};

type CommitWithPackages = Commit & {
  changedPackages: string[];
};

async function main(): Promise<void> {
  const commits = await getCommitsSinceMaster();
  const commitsWithPackages = await getCommitsWithPackages(commits);
  const packageUpgrades = getPackageUpgrades(commitsWithPackages);
  const releaseNotes = generateReleaseNotes(commitsWithPackages);
}

main().catch(console.error);

function getPackageUpgrades(commits: CommitWithPackages[]) {
  const packageUpgradeTypes: Record<string, "major" | "minor" | "patch"> = {};

  for (const commit of commits) {
    for (const packageName of commit.changedPackages) {
      const upgradeType = commit.upgradeType;
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

async function getCommitsSinceMaster(): Promise<Commit[]> {
  const { stdout } = await execAsync('git log --format="%H %B" main..HEAD');
  return stdout
    .trim()
    .split("\n")
    .filter((commit) => commit.trim().match(/^[0-9a-f]{40}/))
    .map((c) => {
      const commit = c.trim();
      const sha = commit.substring(0, 40);
      const message = commit.substring(40).trim();
      const upgradeType = getUpgradeType(message);
      return { sha, message, upgradeType };
    });
}

async function getCommitsWithPackages(commits: Commit[]) {
  const commitInfo: CommitWithPackages[] = [];
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

function getUpgradeType(commitMessage: string): "major" | "minor" | "patch" {
  // todo: we can get a ton of useful info here from pull requests
  const { type } = parser.sync(commitMessage);

  if (type === "feat") {
    return "minor";
  } else if (type === "fix") {
    return "patch";
  } else {
    return "patch";
  }
}

// https://github.com/changesets/changesets/issues/862
function generateReleaseNotes(commits: CommitWithPackages[]): string {
  const releaseNotes: Record<"feat" | "fix" | "other", string[]> = {
    feat: [],
    fix: [],
    other: [],
  };

  for (const commit of commits) {
    const { type, subject } = parser.sync(commit.message);

    if (type === "feat") {
      releaseNotes.feat.push(`- ${subject}`);
    } else if (type === "fix") {
      releaseNotes.fix.push(`- ${subject}`);
    } else {
      releaseNotes.other.push(`- ${subject}`);
    }
  }

  let releaseNotesString = "";

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
