import { db } from "..";
import { feeds, type Feed, type User } from "../../../schema";
import { readConfig } from "src/config";
import { getUserByName } from "./users";

export async function createFeed(name: string, url: string) {
  const currentUser = readConfig().currentUserName;
  const userId = (await getUserByName(currentUser)).id;
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, user_id: userId })
    .returning();
  return result;
}

export function printFeed(feed: Feed, user: User) {
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`createdAt: ${feed.createdAt}`);
  console.log(`updatedAt: ${feed.updatedAt}`);
  console.log(`Created by: ${user.name}`);
}
