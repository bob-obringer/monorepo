#!/usr/bin/env node

import { Command } from "commander";
import { generateChangeset } from "./generate-changeset.js";

const program = new Command();

program
  .option("-p, --production-branch <branch>", "Production branch")
  .option("-i, --integration-branch <branch>", "Integration branch")
  .action((options) => {
    const { production, integration } = options;
    generateChangeset({
      productionBranch: production,
      integrationBranch: integration,
    }).catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
  });

program.parse(process.argv);
