import { db } from "..";
import { feeds, users, type Feed, type User } from "../../../schema";
import { readConfig } from "src/config";
import { getUserByName } from "./users";
import { eq, sql } from "drizzle-orm";

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

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function markFeedFetched(id: string) {
  const now = new Date();
  const [result] = await db
    .update(feeds)
    .set({ updatedAt: now, lastFetchedAt: now })
    .where(eq(feeds.id, id));
  return result;
}

export async function getNextFeedToFetch() {
  const [result] = await db.execute(
    sql`SELECT * FROM feeds ORDER BY last_fetched_at ASC NULLS FIRST`,
  );
  return result;
}

export function printFeed(feed: Feed, user: User) {
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`createdAt: ${feed.createdAt}`);
  console.log(`updatedAt: ${feed.updatedAt}`);
  console.log(`Created by: ${user.name}`);
}
