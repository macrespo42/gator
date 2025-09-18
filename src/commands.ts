import { setUser } from "./config";
import {
  createUser,
  getUserByName,
  deleteAllUsers,
} from "./lib/db/queries/users";

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandsRegistry = Record<string, CommandHandler>;

export async function handlerLogin(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("A user is expected as argument");
  }
  const exist = await getUserByName(args[0]);
  if (!exist) {
    throw new Error("User doesn't exist");
  }
  setUser(args[0]);
  console.log(`User ${args[0]} has been set`);
}

export async function handlerRegister(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("A user is expected as argument");
  }
  const alreadyExist = await getUserByName(args[0]);
  if (alreadyExist) {
    throw new Error(`User ${args[0]} already exist`);
  }
  await createUser(args[0]);
  setUser(args[0]);
  console.log(`User ${args[0]} has successfully been created`);
}

export async function handleReset(_: string) {
  await deleteAllUsers();
  console.log("All users successfully deleted");
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
