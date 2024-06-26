#!/usr/bin/env tsx

import { Command } from "commander";
import { generateChangeset } from "../src";

const program = new Command();

program
  .option("-p, --production-branch <branch>", "Production branch")
  .option("-i, --integration-branch <branch>", "Integration branch")
  .option("-f, --package-folders <paths>", "Package folders", (value) => {
    return value.split(",");
  })
  .action((options) => {
    const { productionBranch, integrationBranch, packageFolders } = options;
    generateChangeset({
      productionBranch,
      integrationBranch,
      packageFolders,
    }).catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
  });

program.parse(process.argv);
