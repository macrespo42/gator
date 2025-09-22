import { fetchFeed } from "./rss";
import { getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";

async function scrapeFeed() {
  const nextFeed = await getNextFeedToFetch();
  const id = nextFeed["id"] as string;
  const url = nextFeed["url"] as string;
  await markFeedFetched(id);
  const feed = await fetchFeed(url);
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

export function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) return;

  if (match.length !== 3) return;

  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return;
  }
}

export async function handleAgg(_: string, ...args: string[]) {
  if (!args.length) {
    throw new Error("Time between request argument is required");
  }
  const interval = parseDuration(args[0]);
  setInterval(() => {
    scrapeFeed().catch((e) => {
      if (e instanceof Error) {
        console.error(`Error: ${e.message}`);
      } else {
        console.error("Error: Unknown error happend when scraping feed");
      }
    });
  }, interval);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}
