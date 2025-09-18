import {
  handleAddFeed,
  handleAgg,
  handleReset,
  handleLogin,
  handleFeeds,
  handleRegister,
  handleUsers,
  runCommand,
  type CommandsRegistry,
  handleFollow,
  handleFollowing,
  registerCommand,
  isLoggedIn,
  handleUnfollow,
} from "./commands.js";
import { argv, exit } from "node:process";

async function main() {
  let registry: CommandsRegistry = {};

  registerCommand(registry, "login", handleLogin);
  registerCommand(registry, "register", handleRegister);
  registerCommand(registry, "reset", handleReset);
  registerCommand(registry, "users", handleUsers);
  registerCommand(registry, "agg", handleAgg);
  registerCommand(registry, "addfeed", isLoggedIn(handleAddFeed));
  registerCommand(registry, "feeds", handleFeeds);
  registerCommand(registry, "follow", isLoggedIn(handleFollow));
  registerCommand(registry, "following", isLoggedIn(handleFollowing));
  registerCommand(registry, "unfollow", isLoggedIn(handleUnfollow));

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
