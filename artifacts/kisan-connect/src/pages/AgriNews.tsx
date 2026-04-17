import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Newspaper,
  Search,
  ExternalLink,
  RefreshCw,
  Clock,
  AlertCircle,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/lib/i18n";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface Article {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  author: string | null;
}

interface NewsResponse {
  articles: Article[];
  cached?: boolean;
  stale?: boolean;
  error?: string;
}

const CATEGORIES = ["All", "Policy", "Market", "Weather", "Technology", "Organic", "Export"];

function detectCategory(article: Article): string {
  const text = `${article.title} ${article.description ?? ""}`.toLowerCase();
  if (/policy|msp|government|scheme|budget|subsidy|minister|law|regulation/.test(text)) return "Policy";
  if (/market|price|mandi|export|trade|rate|cost/.test(text)) return "Market";
  if (/weather|monsoon|rain|drought|flood|climate/.test(text)) return "Weather";
  if (/technology|drone|satellite|ai|digital|app|tech/.test(text)) return "Technology";
  if (/organic|natural|sustainable|eco/.test(text)) return "Organic";
  if (/export|import|international|global/.test(text)) return "Export";
  return "General";
}

const CAT_COLORS: Record<string, string> = {
  Policy: "bg-blue-100 text-blue-700",
  Market: "bg-amber-100 text-amber-700",
  Weather: "bg-sky-100 text-sky-700",
  Technology: "bg-purple-100 text-purple-700",
  Organic: "bg-green-100 text-green-700",
  Export: "bg-rose-100 text-rose-700",
  General: "bg-gray-100 text-gray-600",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = Math.floor((now - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const cat = detectCategory(article);
  const catColor = CAT_COLORS[cat] ?? CAT_COLORS.General;

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-44 bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
        {article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${catColor}`}>
            {cat.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow">
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/70 truncate">{article.source.name}</span>
          <span>·</span>
          <Clock className="w-3 h-3 shrink-0" />
          <span className="shrink-0">{timeAgo(article.publishedAt)}</span>
        </div>

        <h3 className="font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {article.description}
          </p>
        )}

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate max-w-[60%]">
            {article.author ? `By ${article.author.split(",")[0]}` : "Staff Reporter"}
          </span>
          <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
            Read more <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export default function AgriNews() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data, isLoading, isError, refetch, isFetching } = useQuery<NewsResponse>({
    queryKey: ["agrinews"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/news`);
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    const articles = data?.articles ?? [];
    return articles.filter((a) => {
      const matchCat = activeCategory === "All" || detectCategory(a) === activeCategory;
      const matchSearch =
        !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [data?.articles, activeCategory, search]);

  return (
    <div className="min-h-full pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-b border-border/50 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
              <Rss className="w-4 h-4" />
              {t("agrinews.live_badge", "Live Updates")}
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-foreground mb-3">
              AgriNews
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t("agrinews.subtitle", "Real-time agriculture news from across India and the world")}
            </p>

            {data && (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                {data.stale ? (
                  <span className="text-amber-600">Using cached results</span>
                ) : (
                  <span className="text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Live
                  </span>
                )}
                <span>·</span>
                <span>{data.articles.length} articles loaded</span>
              </div>
            )}
          </motion.div>

          {/* Search + Refresh */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 max-w-xl mx-auto flex gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("agrinews.search_placeholder", "Search news…")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl border-border/60 bg-white"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl shrink-0"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 flex flex-wrap gap-2 justify-center"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : cat === "All"
                    ? "bg-gray-300 text-foreground border-transparent hover:border-gray-400"
                    : `${CAT_COLORS[cat] ?? "bg-gray-100 text-gray-600"} border-transparent hover:border-current/20`
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Error state */}
        {isError && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Failed to load news</h3>
            <p className="text-muted-foreground mb-4 text-sm">Please check your connection and try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Results count */}
        {!isLoading && !isError && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> articles found
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Articles grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article, i) => (
              <ArticleCard key={article.url} article={article} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Newspaper className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-1">No articles found</h3>
            <p className="text-muted-foreground text-sm">Try a different search or category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
