import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectToMongoDB() {
  if (isConnected) return;

  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is required but not set.");
  }

  await mongoose.connect(uri, { dbName: "kisanconnect" });
  isConnected = true;
  logger.info("Connected to MongoDB Atlas");
}

export default mongoose;
