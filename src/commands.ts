type CommandHandler = (cmdName: string, ...args: string[]) => void;
export type CommandsRegistry = Record<string, CommandHandler>;

import { setUser } from "./config";

export function handlerLogin(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("A user is expected as argument");
  }
  setUser(args[0]);
  console.log(`User ${args[0]} has been set`);
}

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const command = registry[cmdName];
  if (command) {
    command(cmdName, ...args);
  }
}
