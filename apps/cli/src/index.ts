import { Command } from "commander";
import { deleteCollection, getCollection } from "./chroma";

const program = new Command();

program.version("0.0.1").description("CLI for managing collections");

const chroma = program.command("chroma");

chroma
  .command("create <collection>")
  .description("Create a new collection")
  .action(async (collection) => {
    await getCollection(collection);
    console.log(`Collection ${collection} created successfully.`);
  });

chroma
  .command("delete <collection>")
  .description("Delete a collection")
  .action(async (collection) => {
    await deleteCollection(collection);
    console.log(`Collection ${collection} deleted successfully.`);
  });

chroma
  .command("peek <collection>")
  .description("Peek into a collection")
  .option("-l, --limit <number>", "Limit the number of results", "10")
  .action(async (collection, options) => {
    const c = await getCollection(collection);
    const r = await c.peek({ limit: parseInt(options.limit) });
    console.log(r);
  });

chroma
  .command("query <collection> <text>")
  .description("Query a document")
  .action(async (collection, text) => {
    const c = await getCollection(collection);
    const results = await c.query({
      queryTexts: [text], // Chroma will embed this for you
      nResults: 1, // how many results to return
    });
    console.log(results);
  });

program.parse(process.argv);
