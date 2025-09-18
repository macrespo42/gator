import { db } from "..";
import { feeds, users, type Feed, type User } from "../../../schema";
import { readConfig } from "src/config";
import { getUserByName } from "./users";
import { eq } from "drizzle-orm";

export async function createFeed(name: string, url: string) {
  const currentUser = readConfig().currentUserName;
  const userId = (await getUserByName(currentUser)).id;
  const [result] = await db
    .insert(feeds)
    .values({ name: name, url: url, userId: userId })
    .returning();
  return result;
}

export async function getFeeds() {
  const result = await db
    .select({ url: feeds.url, name: feeds.name, userName: users.name })
    .from(feeds)
    .leftJoin(users, eq(feeds.userId, users.id));
  return result;
}

export function printFeed(feed: Feed, user: User) {
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`createdAt: ${feed.createdAt}`);
  console.log(`updatedAt: ${feed.updatedAt}`);
  console.log(`Created by: ${user.name}`);
}
