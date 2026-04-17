import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  author: string | null;
}

interface CachedNews {
  articles: Article[];
  fetchedAt: number;
}

let cache: CachedNews | null = null;
const CACHE_TTL_MS = 20 * 60 * 1000;

const FEEDS: { url: string; sourceName?: string; type: "gnews" | "rss" }[] = [
  {
    url: "https://news.google.com/rss/search?q=agriculture+india+farmer+crop&hl=en-IN&gl=IN&ceid=IN:en",
    type: "gnews",
  },
  {
    url: "https://www.thehindu.com/business/agri-business/feeder/default.rss",
    sourceName: "The Hindu",
    type: "rss",
  },
];

function extractCdata(text: string): string {
  const m = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1].trim() : text.replace(/<[^>]+>/g, "").trim();
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? extractCdata(m[1]).trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]+${attr}="([^"]+)"`, "i");
  return xml.match(re)?.[1] ?? "";
}

function extractImage(itemXml: string): string | null {
  return (
    extractAttr(itemXml, "media:content", "url") ||
    extractAttr(itemXml, "media:thumbnail", "url") ||
    extractAttr(itemXml, "enclosure", "url") ||
    null
  );
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(str: string): string {
  const once = decodeHtmlEntities(str);
  const noTags = once.replace(/<[^>]+>/g, " ");
  return decodeHtmlEntities(noTags).replace(/\s+/g, " ").trim();
}

function parseGNewsRSS(xml: string): Article[] {
  const items: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    let title = extractTag(itemXml, "title");
    const url = extractTag(itemXml, "link") || extractTag(itemXml, "guid");
    const pubDate = extractTag(itemXml, "pubDate");
    const sourceName =
      extractTag(itemXml, "source") || "Google News";
    const rawDescription = extractTag(itemXml, "description");

    if (!title || !url) continue;

    const titleSuffix = new RegExp(`\\s+-\\s+${sourceName}$`);
    title = title.replace(titleSuffix, "").trim();

    let description: string | null = rawDescription ? stripHtml(rawDescription) || null : null;
    if (description && sourceName) {
      description = description.replace(new RegExp(`\\s+${sourceName}\\s*$`, "i"), "").trim() || null;
    }
    if (description && title && description.slice(0, 60).toLowerCase() === title.slice(0, 60).toLowerCase()) {
      description = null;
    }

    let publishedAt = new Date().toISOString();
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d.getTime())) publishedAt = d.toISOString();
    }

    items.push({
      title,
      description,
      url,
      urlToImage: null,
      publishedAt,
      source: { name: sourceName },
      author: null,
    });
  }

  return items;
}

function parseRSS(xml: string, sourceName: string): Article[] {
  const items: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractTag(itemXml, "title");
    const link =
      extractTag(itemXml, "link") || extractTag(itemXml, "guid");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");
    const author =
      extractTag(itemXml, "dc:creator") ||
      extractTag(itemXml, "author") ||
      null;
    const urlToImage = extractImage(itemXml);

    if (!title || !link) continue;

    let publishedAt = new Date().toISOString();
    if (pubDate) {
      const d = new Date(pubDate);
      if (!isNaN(d.getTime())) publishedAt = d.toISOString();
    }

    items.push({
      title,
      description: description || null,
      url: link,
      urlToImage,
      publishedAt,
      source: { name: sourceName },
      author,
    });
  }

  return items;
}

async function fetchFeed(feed: (typeof FEEDS)[0]): Promise<Article[]> {
  try {
    const res = await fetch(feed.url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KisanConnect/1.0; +https://kisanconnect.in)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return [];
    const xml = await res.text();

    if (feed.type === "gnews") {
      return parseGNewsRSS(xml);
    }
    return parseRSS(xml, feed.sourceName ?? "News");
  } catch {
    return [];
  }
}

router.get("/", async (_req, res) => {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return res.json({ articles: cache.articles, cached: true });
  }

  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const all: Article[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }

  all.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const unique = all.filter(
    (a, i, arr) => arr.findIndex((b) => b.url === a.url) === i
  );

  if (unique.length === 0 && cache) {
    return res.json({ articles: cache.articles, cached: true, stale: true });
  }

  cache = { articles: unique, fetchedAt: Date.now() };
  return res.json({ articles: unique, cached: false });
});

export default router;
