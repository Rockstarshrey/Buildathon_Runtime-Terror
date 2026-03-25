import { useState, useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MapPin,
  MessageSquarePlus,
  Sun,
  Newspaper,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Users,
  Sparkles,
  Share2,
  Bookmark,
  Search,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  useGetCommunityPosts,
  useCreateCommunityPost,
  getGetCommunityPostsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BASE_URL = import.meta.env.BASE_URL ?? "/";

const postSchema = z.object({
  author: z.string().min(2, "Name is too short"),
  location: z.string().min(2, "Location is required"),
  content: z.string().min(10, "Post content must be at least 10 characters"),
  category: z.enum(["question", "tip", "news", "weather"]),
});
type PostFormData = z.infer<typeof postSchema>;

const replySchema = z.object({
  author: z.string().min(1, "Enter your name"),
  content: z.string().min(1, "Reply cannot be empty"),
});
type ReplyFormData = z.infer<typeof replySchema>;

const categoryMeta = {
  question: {
    icon: HelpCircle,
    label: "Question", hi: "सवाल",
    gradient: "from-blue-500 to-indigo-600",
    light: "bg-blue-50 text-blue-700 border-blue-200",
    ring: "ring-blue-400",
    dot: "bg-blue-500",
  },
  tip: {
    icon: Lightbulb,
    label: "Farming Tip", hi: "सुझाव",
    gradient: "from-amber-400 to-orange-500",
    light: "bg-amber-50 text-amber-700 border-amber-200",
    ring: "ring-amber-400",
    dot: "bg-amber-500",
  },
  news: {
    icon: Newspaper,
    label: "News", hi: "समाचार",
    gradient: "from-violet-500 to-purple-600",
    light: "bg-violet-50 text-violet-700 border-violet-200",
    ring: "ring-violet-400",
    dot: "bg-violet-500",
  },
  weather: {
    icon: Sun,
    label: "Weather", hi: "मौसम",
    gradient: "from-sky-400 to-cyan-500",
    light: "bg-sky-50 text-sky-700 border-sky-200",
    ring: "ring-sky-400",
    dot: "bg-sky-500",
  },
};

// Avatar gradient per initial
function avatarGradient(name: string) {
  const c = name.charCodeAt(0) % 6;
  return [
    "from-emerald-400 to-green-600",
    "from-blue-400 to-indigo-600",
    "from-violet-400 to-purple-600",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-600",
    "from-teal-400 to-cyan-600",
  ][c];
}

type Reply = { id: string; author: string; content: string; timestamp: string };
type Post = {
  id: string; author: string; location: string;
  content: string; contentHindi?: string;
  category: keyof typeof categoryMeta;
  timestamp: string; likes: number; replies?: Reply[];
};

function useApiBase() {
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${base}/api`;
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post: initialPost, index }: { post: Post; index: number }) {
  const apiBase = useApiBase();
  const [post, setPost] = useState<Post>(initialPost);
  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyPending, setReplyPending] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const { toast } = useToast();

  const replyForm = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: { author: "", content: "" },
  });

  const handleLike = async () => {
    if (liked || likePending) return;
    setLikePending(true);
    setLiked(true);
    setPost((p) => ({ ...p, likes: p.likes + 1 }));
    try {
      const res = await fetch(`${apiBase}/community/posts/${post.id}/like`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      setPost(await res.json());
    } catch {
      setLiked(false);
      setPost((p) => ({ ...p, likes: p.likes - 1 }));
      toast({ variant: "destructive", title: "Could not like post" });
    } finally { setLikePending(false); }
  };

  const handleReply = async (data: ReplyFormData) => {
    setReplyPending(true);
    try {
      const res = await fetch(`${apiBase}/community/posts/${post.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setPost(await res.json());
      replyForm.reset();
      setShowReplyForm(false);
      setShowReplies(true);
      toast({ title: "Reply posted!" });
    } catch {
      toast({ variant: "destructive", title: "Failed to reply" });
    } finally { setReplyPending(false); }
  };

  const replies = post.replies ?? [];
  const replyCount = replies.length;
  const meta = categoryMeta[post.category];
  const Icon = meta.icon;
  const grad = avatarGradient(post.author);
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl shadow-md shadow-black/5 border border-border/40 overflow-hidden hover:shadow-lg hover:shadow-black/8 transition-shadow duration-300"
    >
      {/* Top gradient accent bar per category */}
      <div className={`h-1 bg-gradient-to-r ${meta.gradient}`} />

      <div className="p-5">
        {/* ── Header row ─────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar with story-ring */}
            <div className={`p-0.5 rounded-full bg-gradient-to-br ${meta.gradient} shrink-0`}>
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-lg border-2 border-white`}>
                {post.author.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-foreground leading-tight">{post.author}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{post.location}</span>
                <span className="text-border">·</span>
                <span title={format(new Date(post.timestamp), "PPpp")}>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Category badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 ${meta.light}`}>
            <Icon className="w-3.5 h-3.5" />
            {meta.label}
          </div>
        </div>

        {/* ── Content ────────────────────────────────── */}
        <p className="text-foreground leading-relaxed whitespace-pre-wrap text-[15px] mb-3">
          {post.content}
        </p>
        {post.contentHindi && (
          <div className={`rounded-2xl px-4 py-3 bg-gradient-to-r ${meta.gradient} bg-opacity-5 border border-border/40 mb-3`}
            style={{ background: "linear-gradient(to right, rgba(22,163,74,0.04), rgba(16,185,129,0.04))" }}>
            <p className="text-muted-foreground text-[14px] leading-relaxed font-medium">
              🇮🇳 {post.contentHindi}
            </p>
          </div>
        )}

        {/* ── Like / replies counts ───────────────────── */}
        {(post.likes > 0 || replyCount > 0) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground py-2 border-b border-border/40 mb-3">
            <div className="flex items-center gap-1.5">
              {post.likes > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-4.5 h-4.5 rounded-full bg-rose-500 flex items-center justify-center text-white text-[9px] font-bold p-0.5">❤</span>
                  <span className="font-semibold text-foreground">{post.likes}</span>
                </span>
              )}
            </div>
            {replyCount > 0 && (
              <button onClick={() => setShowReplies(v => !v)} className="hover:text-primary hover:underline transition-colors">
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        )}

        {/* ── Action bar ─────────────────────────────── */}
        <div className="flex items-center gap-1">
          {/* Like */}
          <motion.button
            onClick={handleLike}
            disabled={liked || likePending}
            whileTap={{ scale: liked ? 1 : 0.85 }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
              liked
                ? "text-rose-500 bg-rose-50"
                : "text-muted-foreground hover:text-rose-500 hover:bg-rose-50"
            }`}
          >
            <motion.div animate={liked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
              <Heart className={`w-5 h-5 ${liked ? "fill-rose-500" : ""}`} />
            </motion.div>
            <span>Like{liked ? "d" : ""}</span>
          </motion.button>

          {/* Comment */}
          <button
            onClick={() => { setShowReplyForm(v => !v); if (!showReplyForm) setShowReplies(true); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
              showReplyForm ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-primary hover:bg-primary/8"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Comment</span>
          </button>

          {/* Share */}
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(v => !v)}
            className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ${
              bookmarked ? "text-amber-500 bg-amber-50" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50"
            }`}
          >
            <Bookmark className={`w-4.5 h-4.5 ${bookmarked ? "fill-amber-500" : ""}`} />
          </button>
        </div>

        {/* ── Reply input ─────────────────────────────── */}
        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={replyForm.handleSubmit(handleReply)} className="mt-4 space-y-2.5">
                <Input
                  {...replyForm.register("author")}
                  placeholder="Your name (आपका नाम)"
                  className="bg-muted/40 border-border/60 rounded-xl text-sm h-9"
                />
                {replyForm.formState.errors.author && (
                  <p className="text-xs text-destructive">{replyForm.formState.errors.author.message}</p>
                )}
                <div className="flex gap-2 items-end">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shrink-0 mb-0.5`}>
                    {(replyForm.watch("author") || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex items-end gap-2 bg-muted/40 rounded-2xl pl-4 pr-2 py-2 border border-border/50 focus-within:border-primary/40 transition-colors">
                    <Textarea
                      {...replyForm.register("content")}
                      placeholder="Write a reply… (जवाब लिखें)"
                      className="min-h-[40px] max-h-[100px] resize-none bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm p-0 flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={replyPending}
                      size="icon"
                      className="rounded-xl h-8 w-8 bg-primary hover:bg-primary/90 shrink-0"
                    >
                      {replyPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                </div>
                {replyForm.formState.errors.content && (
                  <p className="text-xs text-destructive ml-10">{replyForm.formState.errors.content.message}</p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Replies thread ──────────────────────────── */}
        <AnimatePresence>
          {showReplies && replyCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3 pl-2">
                {replies.map((reply, ri) => (
                  <motion.div
                    key={reply.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ri * 0.06 }}
                    className="flex gap-2.5"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient(reply.author)} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {reply.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-sm text-foreground">{reply.author}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{reply.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {replyCount > 0 && (
                  <button
                    onClick={() => setShowReplies(false)}
                    className="ml-10 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <ChevronUp className="w-3.5 h-3.5" /> Hide replies
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Community() {
  const { data: rawPosts, isLoading } = useGetCommunityPosts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const posts = rawPosts as Post[] | undefined;

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts.filter(p => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (search && !p.content.toLowerCase().includes(search.toLowerCase()) &&
          !p.author.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [posts, activeCategory, search]);

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 via-green-50/20 to-white">

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-900 via-emerald-800 to-teal-800 pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-teal-300/10 blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-4 tracking-widest uppercase">
              <Users className="w-3.5 h-3.5" />
              Farmer Community
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight">
              Community Feed
            </h1>
            <p className="text-emerald-300 font-semibold text-lg mt-1">किसान समुदाय चर्चा</p>
            <p className="text-emerald-100/70 text-sm mt-2 max-w-lg">
              Ask questions, share tips, and stay updated with fellow farmers across India.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                { label: `${posts?.length ?? "–"} Posts`, sub: "shared" },
                { label: "500+ Farmers", sub: "connected" },
                { label: "4 Categories", sub: "to explore" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-2xl px-4 py-2 border border-white/10">
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{s.label}</p>
                    <p className="text-white/50 text-[11px]">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-12">

        {/* ── "What's on your mind?" compose bar ────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-lg shadow-black/8 border border-border/40 p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-emerald-100 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex-1 text-left px-5 py-3 bg-muted/50 rounded-2xl text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors border border-border/40 hover:border-primary/30">
                  What's happening on your farm? / आपके खेत में क्या हो रहा है?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
                <NewPostForm onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl shadow-md shadow-primary/25 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 border-0 h-11 px-5 shrink-0 gap-2">
                  <MessageSquarePlus className="w-4.5 h-4.5" />
                  <span className="hidden sm:inline">Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
                <NewPostForm onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick category shortcuts */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground font-medium mr-1">Post as:</span>
            {Object.entries(categoryMeta).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <button key={key} onClick={() => setIsDialogOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all hover:shadow-sm ${meta.light}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {meta.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Category filter tabs ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2.5 mb-5 overflow-x-auto pb-1 no-scrollbar"
        >
          {[{ key: "all", label: "All Posts", hi: "सभी" },
            ...Object.entries(categoryMeta).map(([key, m]) => ({ key, label: m.label, hi: m.hi }))
          ].map(({ key, label, hi }) => {
            const isActive = activeCategory === key;
            const meta = key !== "all" ? categoryMeta[key as keyof typeof categoryMeta] : null;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? meta
                      ? `bg-gradient-to-r ${meta.gradient} text-white shadow-md`
                      : "bg-gradient-to-r from-primary to-emerald-500 text-white shadow-md"
                    : "bg-white text-muted-foreground border border-border/60 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {meta && <meta.icon className="w-3.5 h-3.5" />}
                {label}
                {key !== "all" && posts && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-muted"}`}>
                    {posts.filter(p => p.category === key).length}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* ── Search bar ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts… / पोस्ट खोजें"
            className="pl-10 pr-10 h-11 bg-white rounded-2xl border-border/60 shadow-sm text-sm focus-visible:ring-primary/20 focus-visible:border-primary/50"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* ── Posts ────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium text-sm">Loading community…</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
              <MessageCircle className="w-9 h-9 opacity-40" />
            </div>
            <p className="font-bold text-foreground text-lg">No posts found</p>
            <p className="text-sm">कोई पोस्ट नहीं मिली</p>
            <Button variant="outline" size="sm" onClick={() => { setActiveCategory("all"); setSearch(""); }}
              className="mt-2 rounded-xl">Clear filters</Button>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-5">
              {filtered.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ─── New Post Form Dialog ─────────────────────────────────────────────────────
function NewPostForm({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useCreateCommunityPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCommunityPostsQueryKey() });
        toast({ title: "Posted!", description: "Your message is now live on the feed." });
        onSuccess();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to post", description: "Please try again." });
      },
    },
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { author: "", location: "", content: "", category: "question" },
  });

  const selectedCategory = form.watch("category");

  return (
    <div className="bg-white">
      <DialogHeader className="p-6 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-800 border-b border-border">
        <DialogTitle className="text-2xl font-display text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-300" />
          Share with the Community
        </DialogTitle>
        <p className="text-emerald-200 text-sm font-medium mt-1">किसान समुदाय के साथ साझा करें</p>
      </DialogHeader>

      <form onSubmit={form.handleSubmit((data) => mutate({ data }))} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Name / नाम</label>
            <Input {...form.register("author")} placeholder="Ramesh Kumar" className="bg-muted/30 rounded-xl" />
            {form.formState.errors.author && <p className="text-xs text-destructive">{form.formState.errors.author.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Location / स्थान</label>
            <Input {...form.register("location")} placeholder="Punjab, India" className="bg-muted/30 rounded-xl" />
            {form.formState.errors.location && <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category / श्रेणी</label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(categoryMeta) as [PostFormData["category"], typeof categoryMeta[keyof typeof categoryMeta]][]).map(([key, meta]) => {
              const Icon = meta.icon;
              const isSelected = selectedCategory === key;
              return (
                <div
                  key={key}
                  onClick={() => form.setValue("category", key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${meta.gradient} text-white border-transparent shadow-lg`
                      : "border-border hover:border-primary/30 text-muted-foreground bg-muted/30"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span className="font-bold text-xs text-center leading-tight">{meta.label}</span>
                  <span className="text-[9px] opacity-70 mt-0.5">{meta.hi}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Message / संदेश</label>
          <Textarea
            {...form.register("content")}
            placeholder="Write your question, tip, news, or weather update here… (अपना सवाल, सुझाव, या अपडेट यहाँ लिखें)"
            className="min-h-[120px] resize-none bg-muted/30 rounded-2xl text-sm"
          />
          {form.formState.errors.content && <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onSuccess} className="rounded-xl">Cancel</Button>
          <Button
            type="submit"
            disabled={isPending}
            className={`px-8 rounded-2xl shadow-lg bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 border-0 font-bold`}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Share Post
          </Button>
        </div>
      </form>
    </div>
  );
}
