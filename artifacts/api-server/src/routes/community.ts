import { Router, type IRouter } from "express";
import { CommunityPost } from "../models/CommunityPost";
import { CreateCommunityPostBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/posts", async (_req, res) => {
  const posts = await CommunityPost.find().sort({ timestamp: -1 }).lean();
  const formatted = posts.map((p: any) => ({
    id: p._id.toString(),
    author: p.author,
    location: p.location,
    content: p.content,
    contentHindi: p.contentHindi ?? "",
    category: p.category,
    timestamp: p.timestamp instanceof Date ? p.timestamp.toISOString() : p.timestamp,
    likes: p.likes,
  }));
  res.json(formatted);
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
  });
  res.status(201).json({
    id: post._id.toString(),
    author: post.author,
    location: post.location,
    content: post.content,
    contentHindi: post.contentHindi,
    category: post.category,
    timestamp: post.timestamp.toISOString(),
    likes: post.likes,
  });
});

export default router;
