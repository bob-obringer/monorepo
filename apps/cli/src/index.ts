import { Command } from "commander";

const program = new Command();

program.version("0.0.1").description("CLI for managing collections");

const chroma = program.command("chroma");

chroma.action(() => {
  console.log("not implemented");
});

program.parse(process.argv);
