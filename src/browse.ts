import { getPostForUser } from "./lib/db/queries/posts";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export async function handleBrowse(_: string, ...args: string[]) {
  const limit = Number(args[0]) ?? 2;
  const { currentUserName } = readConfig();

  const user = await getUserByName(currentUserName);

  const posts = await getPostForUser(user.id, limit);
  for (const post of posts) {
    console.log(post.title);
    console.log(post.description);
    console.log(
      `published at: ${post.publishedAt} from ${post.feedName} | ${post.url}`,
    );
  }
}
