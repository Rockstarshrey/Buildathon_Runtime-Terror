import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    location: { type: String, required: true },
    content: { type: String, required: true },
    contentHindi: { type: String, default: "" },
    category: {
      type: String,
      enum: ["question", "tip", "news", "weather"],
      required: true,
    },
    likes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const CommunityPost =
  mongoose.models["CommunityPost"] ||
  mongoose.model("CommunityPost", communityPostSchema);
