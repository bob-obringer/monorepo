#!/usr/bin/env node
import { Command } from "commander";
import { generateChangeset } from "./generate-changeset";

const program = new Command();

program.action(() => {
  generateChangeset().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
  });
});

program.parse(process.argv);
