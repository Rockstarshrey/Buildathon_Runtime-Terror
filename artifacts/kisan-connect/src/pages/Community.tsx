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
  X,
  Loader2
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useGetCommunityPosts, useCreateCommunityPost, getGetCommunityPostsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const postSchema = z.object({
  author: z.string().min(2, "Name is too short"),
  location: z.string().min(2, "Location is required"),
  content: z.string().min(10, "Post content must be at least 10 characters"),
  category: z.enum(["question", "tip", "news", "weather"]),
});

type PostFormData = z.infer<typeof postSchema>;

const categoryMeta = {
  question: { icon: HelpCircle, color: "text-blue-600 bg-blue-50 border-blue-200", label: "Question", hi: "सवाल" },
  tip: { icon: Lightbulb, color: "text-amber-600 bg-amber-50 border-amber-200", label: "Farming Tip", hi: "सुझाव" },
  news: { icon: Newspaper, color: "text-purple-600 bg-purple-50 border-purple-200", label: "News", hi: "समाचार" },
  weather: { icon: Sun, color: "text-sky-600 bg-sky-50 border-sky-200", label: "Weather", hi: "मौसम" },
};

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
            {posts?.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-border/60 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-emerald-100 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
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
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${categoryMeta[post.category].color}`}>
                      {(() => {
                        const Icon = categoryMeta[post.category].icon;
                        return <Icon className="w-3.5 h-3.5" />;
                      })()}
                      <span>{categoryMeta[post.category].label}</span>
                    </div>
                  )}
                </div>

                <div className="pl-15 space-y-3">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  {post.contentHindi && (
                    <p className="text-muted-foreground font-medium leading-relaxed bg-muted/50 p-4 rounded-2xl border border-border/50 text-[15px]">
                      {post.contentHindi}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border/50">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors group">
                      <Heart className="w-5 h-5 group-hover:fill-rose-500 transition-all" />
                      <span className="font-semibold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquarePlus className="w-5 h-5" />
                      <span className="font-semibold text-sm">Reply / जवाब दें</span>
                    </button>
                  </div>
                </div>
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
        toast({
          title: "Post Created Successfully",
          description: "Your message has been shared with the community.",
        });
        onSuccess();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Failed to post",
          description: "Something went wrong. Please try again.",
        });
      }
    }
  });

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      author: "",
      location: "",
      content: "",
      category: "question"
    }
  });

  const onSubmit = (data: PostFormData) => {
    mutate({ data });
  };

  return (
    <div className="bg-white">
      <DialogHeader className="p-6 bg-gradient-to-br from-green-50 to-white border-b border-border">
        <DialogTitle className="text-2xl font-display text-foreground">Create Post / नई पोस्ट</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Name (नाम)</label>
            <Input 
              {...form.register("author")} 
              placeholder="Ramesh Kumar" 
              className="bg-muted/30"
            />
            {form.formState.errors.author && <p className="text-xs text-destructive">{form.formState.errors.author.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Location (स्थान)</label>
            <Input 
              {...form.register("location")} 
              placeholder="Punjab" 
              className="bg-muted/30"
            />
            {form.formState.errors.location && <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Category (श्रेणी)</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(categoryMeta) as [z.infer<typeof postSchema>["category"], typeof categoryMeta[keyof typeof categoryMeta]][]).map(([key, meta]) => {
              const Icon = meta.icon;
              const isSelected = form.watch("category") === key;
              return (
                <div
                  key={key}
                  onClick={() => form.setValue("category", key)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${isSelected ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30 text-muted-foreground"}
                  `}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <span className="font-semibold text-sm">{meta.label}</span>
                  <span className="text-[10px] opacity-70">{meta.hi}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Message (संदेश)</label>
          <Textarea 
            {...form.register("content")} 
            placeholder="Write your question, tip, or update here..."
            className="min-h-[120px] resize-none bg-muted/30 rounded-xl"
          />
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
