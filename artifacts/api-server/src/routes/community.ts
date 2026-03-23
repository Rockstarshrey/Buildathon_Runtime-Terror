import { Router, type IRouter } from "express";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { GetCommunityPostsResponse, CreateCommunityPostBody } from "@workspace/api-zod";

const DATA_FILE = resolve(process.cwd(), "src/data/community-posts.json");

function readPosts() {
  const raw = readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

function writePosts(posts: unknown[]) {
  writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
}

const router: IRouter = Router();

router.get("/posts", (_req, res) => {
  const posts = readPosts();
  const data = GetCommunityPostsResponse.parse(posts);
  res.json(data);
});

router.post("/posts", (req, res) => {
  const body = CreateCommunityPostBody.parse(req.body);
  const posts = readPosts();
  const newPost = {
    id: String(Date.now()),
    author: body.author,
    location: body.location,
    content: body.content,
    contentHindi: "",
    category: body.category,
    timestamp: new Date().toISOString(),
    likes: 0,
  };
  posts.unshift(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

export default router;
