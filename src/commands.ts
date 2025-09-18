import { readConfig, setUser } from "./config";
import { createFeed, printFeed } from "./lib/db/queries/feeds";
import {
  createUser,
  getUserByName,
  deleteAllUsers,
  getUsers,
} from "./lib/db/queries/users";
import { fetchFeed } from "./rss";

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

export async function handleUsers(_: string) {
  const users = await getUsers();
  const currentUser = readConfig().currentUserName;
  for (let i = 0; i < users.length; i++) {
    console.log(
      `* ${users[i].name} ${users[i].name === currentUser ? "(current)" : ""}`,
    );
  }
}

export async function handleAgg(_: string) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  const channel = feed?.channel;
  console.log(`Title: ${channel?.title}`);
  console.log(`Link: ${channel?.link}`);
  console.log(`Description: ${channel?.description}`);
  if (channel?.item.length) {
    for (let i = 0; i < channel?.item.length; i++) {
      console.log(
        `- title: '${channel.item[i].title}' - Description: '${channel.item[i].description}'`,
      );
    }
  }
}

export async function handleAddFeed(_: string, ...args: string[]) {
  if (args.length < 2) {
    throw new Error("A name and url of the feed are expected");
  }
  const [name, url] = args;
  const feed = await createFeed(name, url);
  const currentUser = await getUserByName(readConfig().currentUserName);
  printFeed(feed, currentUser);
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
