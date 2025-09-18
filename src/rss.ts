import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  try {
    const response = await fetch(feedURL, {
      headers: {
        "User-Agent": "Gator",
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const feed = await response.text();
    const parser = new XMLParser();
    const xmlParsed = parser.parse(feed);
    const { channel } = xmlParsed.rss;
    if (!channel) {
      throw new Error("No channel found");
    }
    const { title, link, description } = channel;
    if (!title || !link || !description) {
      throw new Error("Incomplete channel");
    }
    if (!Array.isArray(channel.item)) {
      channel.item = [];
    }
    const item: RSSItem[] = [];
    for (let i = 0; i < channel.item.length; i++) {
      const curr = channel.item[i];
      if (curr.title && curr.link && curr.description && curr.pubDate) {
        item.push(curr);
      }
    }
    return {
      channel: {
        title,
        link,
        description,
        item,
      },
    } as RSSFeed;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error happend");
    }
  }
}
