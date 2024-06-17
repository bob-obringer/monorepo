#!/usr/bin/env node
import React from "react";
import { program } from "commander";
import Interactive from "./commands/interactive.js";
import { renderApp } from "./app/render-app.js";

program.action(() => {
  renderApp(<Interactive />);
});

program.parse(process.argv);
