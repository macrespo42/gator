import { readConfig } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

type UserCommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export function isLoggedIn(handler: UserCommandHandler): CommandHandler {
  const userName = readConfig().currentUserName;
  if (!userName) {
    throw new Error(`User ${userName} not found`);
  }

  return handler;
}

export async function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const command = registry[cmdName];
  if (command) {
    await command(cmdName, ...args);
  }
}
