import { db } from "..";
import { feedFollows, posts, feeds } from "../../../schema";
import { desc, eq } from "drizzle-orm";

export async function createPost(
  title: string,
  url: string,
  description: string,
  feedId: string,
  publishedAt: Date,
) {
  const [result] = await db
    .insert(posts)
    .values({ title, url, description, feedId, publishedAt })
    .returning();
  return result;
}

export async function getPostForUser(userId: string, postReturned = 2) {
  const result = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feedFollows.feedId, posts.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(postReturned);
  return result;
}
