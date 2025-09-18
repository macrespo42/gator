import { readConfig } from "./config";
import {
  createFeedFollows,
  deleteFeedFollows,
  getFeedFollowsForUser,
} from "./lib/db/queries/feedFollows";
import { getFeedByUrl } from "./lib/db/queries/feeds";
import { getUserByName } from "./lib/db/queries/users";

export async function handleFollow(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("A feed URL is expected as argument");
  }
  const [url] = args;
  const currentUser = readConfig().currentUserName;
  const follow = await createFeedFollows(currentUser, url);
  if (!follow) {
    throw new Error("The feed you try to follow does not exist");
  }
  console.log(`Following: ${follow.feedName}, created by ${follow.userName}`);
}

export async function handleFollowing(_: string) {
  const currentUser = readConfig().currentUserName;
  const feeds = await getFeedFollowsForUser(currentUser);
  for (const feed of feeds) {
    console.log(`- ${feed.feedName}`);
  }
}

export async function handleUnfollow(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("A feed URL is expected");
  }
  const currentUserName = readConfig().currentUserName;
  const [url] = args;

  const feed = await getFeedByUrl(url);
  const user = await getUserByName(currentUserName);
  await deleteFeedFollows(user.id, feed.id);
}
