#!/usr/bin/env node
import { Command } from "commander";
import { generateChangeset } from "./generate-changeset";

const program = new Command();

program
  .option("-i, --id <type>", "An optional id for the changeset")
  .action((options) => {
    generateChangeset(options).catch((error) => {
      console.error("An error occurred:", error);
      process.exit(1);
    });
  });

program.parse(process.argv);
