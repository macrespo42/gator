import { db } from "..";
import { feedFollows, users, feeds } from "../../../schema";
import { eq } from "drizzle-orm";

export async function createFeedFollows(userName: string, feedUrl: string) {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.name, userName));

  const [feed] = await db
    .select({ id: feeds.id })
    .from(feeds)
    .where(eq(feeds.url, feedUrl));

  console.log(`DEBUG: USER: ${JSON.stringify(user)}`);
  console.log(`DEBUG: FEED: ${JSON.stringify(feed)}`);

  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ userId: user.id, feedId: feed.id })
    .returning();

  console.log(`DEBUG: newFeedFollow: ${JSON.stringify(newFeedFollow)}`);

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

  console.log(`DEBUG: result: ${JSON.stringify(result)}`);
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
