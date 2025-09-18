import { db } from "..";
import { feedFollows, users, feeds } from "../../../schema";
import { eq, and } from "drizzle-orm";

export async function createFeedFollows(userName: string, feedUrl: string) {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.name, userName));

  const [feed] = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(eq(feeds.url, feedUrl));

  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId: user.id, feedId: feed.id })
    .returning();

  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return result;
}

export async function getFeedFollowsForUser(userName: string) {
  const results = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .where(eq(users.name, userName));
  return results;
}

export async function deleteFeedFollows(userId: string, feedId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
  return result;
}
