import { printFeed, createFeed, getFeeds } from "./lib/db/queries/feeds";
import { getUserByName } from "./lib/db/queries/users";
import { createFeedFollows } from "./lib/db/queries/feedFollows";
import { readConfig } from "./config";

export async function handleAddFeed(_: string, ...args: string[]) {
  if (args.length < 2) {
    throw new Error("A name and url of the feed are expected");
  }
  const [name, url] = args;
  const feed = await createFeed(name, url);
  const currentUser = await getUserByName(readConfig().currentUserName);
  await createFeedFollows(currentUser.name, url);
  printFeed(feed, currentUser);
}

export async function handleFeeds(_: string) {
  const feeds = await getFeeds();
  for (let i = 0; i < feeds.length; i++) {
    const curr = feeds[i];
    console.log(`Name: ${curr.name}`);
    console.log(`Url: ${curr.url}`);
    console.log(`User: ${curr.userName}`);
  }
}
