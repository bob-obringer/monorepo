#!/usr/bin/env node
import { generateChangeset } from "./generate-changeset";

generateChangeset().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
