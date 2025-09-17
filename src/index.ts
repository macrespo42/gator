import { handlerLogin, runCommand, type CommandsRegistry } from "./commands.js";
import { argv, exit } from "node:process";

function main() {
  let registry: CommandsRegistry = {
    login: handlerLogin,
  };
  const commandsArgument = argv.slice(2);
  if (!commandsArgument.length) {
    console.error("A command and arguments are expected");
    exit(1);
  }
  const commandName = commandsArgument.shift() ?? "";
  try {
    runCommand(registry, commandName, ...commandsArgument);
  } catch (err: any) {
    const msg = err?.message ?? "Unknown error";
    console.error(`Error: ${msg}`);
    exit(1);
  }
}

main();
