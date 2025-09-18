import {
  handleAddFeed,
  handleAgg,
  handleReset,
  handlerLogin,
  handleFeeds,
  handlerRegister,
  handleUsers,
  runCommand,
  type CommandsRegistry,
  handleFollow,
  handleFollowing,
  registerCommand,
} from "./commands.js";
import { argv, exit } from "node:process";

async function main() {
  let registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handleReset);
  registerCommand(registry, "users", handleUsers);
  registerCommand(registry, "agg", handleAgg);
  registerCommand(registry, "addfeed", handleAddFeed);
  registerCommand(registry, "feeds", handleFeeds);
  registerCommand(registry, "follow", handleFollow);
  registerCommand(registry, "following", handleFollowing);

  const commandsArgument = argv.slice(2);
  if (!commandsArgument.length) {
    console.error("A command and arguments are expected");
    exit(1);
  }
  const commandName = commandsArgument.shift() ?? "";
  try {
    await runCommand(registry, commandName, ...commandsArgument);
    exit(0);
  } catch (err: any) {
    const msg = err?.message ?? "Unknown error";
    console.error(`Error: ${msg}`);
    exit(1);
  }
}

await main();
