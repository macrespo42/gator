import { fetchFeed } from "./rss";

export async function handleAgg(_: string) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
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
