import { Router, type IRouter } from "express";
import { CommunityPost } from "../models/CommunityPost";
import { CreateCommunityPostBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatPost(p: any) {
  return {
    id: p._id.toString(),
    author: p.author,
    location: p.location,
    content: p.content,
    contentHindi: p.contentHindi ?? "",
    category: p.category,
    timestamp: p.timestamp instanceof Date ? p.timestamp.toISOString() : p.timestamp,
    likes: p.likes,
    replies: (p.replies ?? []).map((r: any) => ({
      id: r._id?.toString() ?? "",
      author: r.author,
      content: r.content,
      timestamp: r.timestamp instanceof Date ? r.timestamp.toISOString() : r.timestamp,
    })),
  };
}

router.get("/posts", async (_req, res) => {
  const posts = await CommunityPost.find().sort({ timestamp: -1 }).lean();
  res.json(posts.map(formatPost));
});

router.post("/posts", async (req, res) => {
  const body = CreateCommunityPostBody.parse(req.body);
  const post = await CommunityPost.create({
    author: body.author,
    location: body.location,
    content: body.content,
    category: body.category,
    contentHindi: "",
    likes: 0,
    timestamp: new Date(),
    replies: [],
  });
  res.status(201).json(formatPost(post));
});

router.patch("/posts/:id/like", async (req, res) => {
  const post = await CommunityPost.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  ).lean();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(formatPost(post));
});

router.post("/posts/:id/replies", async (req, res) => {
  const { author, content } = req.body ?? {};
  if (!author || !content) {
    res.status(400).json({ error: "author and content are required" });
    return;
  }
  const post = await CommunityPost.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        replies: {
          author: String(author).trim(),
          content: String(content).trim(),
          timestamp: new Date(),
        },
      },
    },
    { new: true }
  ).lean();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(formatPost(post));
});

export default router;
