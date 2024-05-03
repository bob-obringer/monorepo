import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  // parserPreset: "conventional-changelog-atom",
  // formatter: "@commitlint/format",
  // rules: {
  //   "type-enum": [RuleConfigSeverity.Error, "always", ["foo"]],
  // },
};

export default Configuration;
