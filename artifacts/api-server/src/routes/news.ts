import { Router, type IRouter } from "express";

const router: IRouter = Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_URL = "https://newsapi.org/v2/everything";

interface NewsAPIArticle {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { id: string | null; name: string };
  author: string | null;
  content: string | null;
}

interface CachedNews {
  articles: NewsAPIArticle[];
  fetchedAt: number;
}

let cache: CachedNews | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

router.get("/", async (req, res) => {
  if (!NEWS_API_KEY) {
    return res.status(503).json({
      error: "News API key not configured",
      articles: [],
    });
  }

  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return res.json({ articles: cache.articles, cached: true });
  }

  try {
    const params = new URLSearchParams({
      q: "agriculture india farmer crop",
      language: "en",
      sortBy: "publishedAt",
      pageSize: "30",
      apiKey: NEWS_API_KEY,
    });

    const response = await fetch(`${NEWS_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`NewsAPI responded with ${response.status}`);
    }

    const data = (await response.json()) as { articles: NewsAPIArticle[]; status: string; message?: string };

    if (data.status !== "ok") {
      throw new Error(data.message ?? "NewsAPI error");
    }

    const articles = (data.articles ?? []).filter(
      (a) => a.title && a.title !== "[Removed]" && a.url
    );

    cache = { articles, fetchedAt: Date.now() };
    return res.json({ articles, cached: false });
  } catch (err) {
    if (cache) {
      return res.json({ articles: cache.articles, cached: true, stale: true });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(502).json({ error: message, articles: [] });
  }
});

export default router;
