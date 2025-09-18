import {
  handleReset,
  handlerLogin,
  handlerRegister,
  handleUsers,
  runCommand,
  type CommandsRegistry,
} from "./commands.js";
import { argv, exit } from "node:process";

async function main() {
  let registry: CommandsRegistry = {
    login: handlerLogin,
    register: handlerRegister,
    reset: handleReset,
    users: handleUsers,
  };
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
