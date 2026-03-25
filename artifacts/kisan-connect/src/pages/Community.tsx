import { useState } from "react";
import { format } from "date-fns";
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
  question: { icon: HelpCircle, color: "text-blue-600 bg-blue-50 border-blue-200", label: "Question", hi: "सवाल" },
  tip: { icon: Lightbulb, color: "text-amber-600 bg-amber-50 border-amber-200", label: "Farming Tip", hi: "सुझाव" },
  news: { icon: Newspaper, color: "text-purple-600 bg-purple-50 border-purple-200", label: "News", hi: "समाचार" },
  weather: { icon: Sun, color: "text-sky-600 bg-sky-50 border-sky-200", label: "Weather", hi: "मौसम" },
};

type Reply = { id: string; author: string; content: string; timestamp: string };

type Post = {
  id: string;
  author: string;
  location: string;
  content: string;
  contentHindi?: string;
  category: keyof typeof categoryMeta;
  timestamp: string;
  likes: number;
  replies?: Reply[];
};

function useApiBase() {
  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${base}/api`;
}

function PostCard({ post: initialPost }: { post: Post }) {
  const apiBase = useApiBase();
  const [post, setPost] = useState<Post>(initialPost);
  const [liked, setLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyPending, setReplyPending] = useState(false);
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
      const updated = await res.json();
      setPost(updated);
    } catch {
      setLiked(false);
      setPost((p) => ({ ...p, likes: p.likes - 1 }));
      toast({ variant: "destructive", title: "Could not like post", description: "Please try again." });
    } finally {
      setLikePending(false);
    }
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
      const updated = await res.json();
      setPost(updated);
      replyForm.reset();
      setShowReplyForm(false);
      setShowReplies(true);
      toast({ title: "Reply posted!", description: "Your reply has been added." });
    } catch {
      toast({ variant: "destructive", title: "Failed to reply", description: "Please try again." });
    } finally {
      setReplyPending(false);
    }
  };

  const replies = post.replies ?? [];
  const replyCount = replies.length;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/60 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-emerald-100 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 shrink-0">
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-foreground">{post.author}</h3>
            <div className="flex items-center text-xs text-muted-foreground font-medium mt-0.5">
              <MapPin className="w-3 h-3 mr-1" />
              {post.location}
              <span className="mx-2">•</span>
              {format(new Date(post.timestamp), "MMM d, h:mm a")}
            </div>
          </div>
        </div>

        {categoryMeta[post.category] && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 ${categoryMeta[post.category].color}`}>
            {(() => { const Icon = categoryMeta[post.category].icon; return <Icon className="w-3.5 h-3.5" />; })()}
            <span>{categoryMeta[post.category].label}</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
        {post.contentHindi && (
          <p className="text-muted-foreground font-medium leading-relaxed bg-muted/50 p-4 rounded-2xl border border-border/50 text-[15px]">
            {post.contentHindi}
          </p>
        )}

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
          <button
            onClick={handleLike}
            disabled={liked || likePending}
            className={`flex items-center gap-2 transition-all group ${liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"}`}
          >
            <Heart className={`w-5 h-5 transition-all ${liked ? "fill-rose-500 scale-110" : "group-hover:fill-rose-500"}`} />
            <span className="font-semibold">{post.likes}</span>
          </button>

          <button
            onClick={() => setShowReplyForm((v) => !v)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">
              Reply / जवाब दें
              {replyCount > 0 && <span className="ml-1 text-primary">({replyCount})</span>}
            </span>
          </button>

          {replyCount > 0 && (
            <button
              onClick={() => setShowReplies((v) => !v)}
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showReplies ? "Hide" : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showReplyForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form
                onSubmit={replyForm.handleSubmit(handleReply)}
                className="mt-3 bg-muted/40 rounded-2xl p-4 space-y-3 border border-border/50"
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Write a Reply / जवाब लिखें</p>
                <Input
                  {...replyForm.register("author")}
                  placeholder="Your name (आपका नाम)"
                  className="bg-white text-sm"
                />
                {replyForm.formState.errors.author && (
                  <p className="text-xs text-destructive">{replyForm.formState.errors.author.message}</p>
                )}
                <div className="flex gap-2">
                  <Textarea
                    {...replyForm.register("content")}
                    placeholder="Write your reply here..."
                    className="min-h-[70px] resize-none bg-white text-sm rounded-xl flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={replyPending}
                    size="icon"
                    className="self-end rounded-xl h-10 w-10 bg-primary hover:bg-primary/90 shrink-0"
                  >
                    {replyPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
                {replyForm.formState.errors.content && (
                  <p className="text-xs text-destructive">{replyForm.formState.errors.content.message}</p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showReplies && replyCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-3 pl-4 border-l-2 border-primary/20">
                {replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-emerald-50 flex items-center justify-center text-primary font-bold text-sm border border-primary/15 shrink-0">
                      {reply.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 bg-muted/30 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">{reply.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(reply.timestamp), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Community() {
  const { data: posts, isLoading } = useGetCommunityPosts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Community Feed</h1>
          <p className="text-primary font-medium mt-1">किसान समुदाय चर्चा</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 h-12 px-6">
              <MessageSquarePlus className="w-5 h-5 mr-2" />
              New Post / नई पोस्ट
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
            <NewPostForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p>Loading community posts...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {(posts as Post[] | undefined)?.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function NewPostForm({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useCreateCommunityPost({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCommunityPostsQueryKey() });
        toast({ title: "Post Created!", description: "Your message has been shared with the community." });
        onSuccess();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Failed to post", description: "Something went wrong. Please try again." });
      },
    },
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { author: "", location: "", content: "", category: "question" },
  });

  return (
    <div className="bg-white">
      <DialogHeader className="p-6 bg-gradient-to-br from-green-50 to-white border-b border-border">
        <DialogTitle className="text-2xl font-display text-foreground">Create Post / नई पोस्ट</DialogTitle>
      </DialogHeader>

      <form onSubmit={form.handleSubmit((data) => mutate({ data }))} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Name (नाम)</label>
            <Input {...form.register("author")} placeholder="Ramesh Kumar" className="bg-muted/30" />
            {form.formState.errors.author && <p className="text-xs text-destructive">{form.formState.errors.author.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Location (स्थान)</label>
            <Input {...form.register("location")} placeholder="Punjab" className="bg-muted/30" />
            {form.formState.errors.location && <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Category (श्रेणी)</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(categoryMeta) as [PostFormData["category"], typeof categoryMeta[keyof typeof categoryMeta]][]).map(([key, meta]) => {
              const Icon = meta.icon;
              const isSelected = form.watch("category") === key;
              return (
                <div
                  key={key}
                  onClick={() => form.setValue("category", key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30 text-muted-foreground"}`}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="font-semibold text-sm">{meta.label}</span>
                  <span className="text-[10px] opacity-70">{meta.hi}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Message (संदेश)</label>
          <Textarea {...form.register("content")} placeholder="Write your question, tip, or update here..." className="min-h-[120px] resize-none bg-muted/30 rounded-xl" />
          {form.formState.errors.content && <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>}
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onSuccess}>Cancel</Button>
          <Button type="submit" disabled={isPending} className="px-8 rounded-full shadow-lg shadow-primary/20">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Message"}
          </Button>
        </div>
      </form>
    </div>
  );
}
