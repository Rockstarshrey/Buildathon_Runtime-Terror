import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectToMongoDB() {
  if (isConnected) return;

  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    logger.warn(
      "MONGODB_URI environment variable is not set. Database features will be unavailable.",
    );
    return;
  }

  await mongoose.connect(uri, { dbName: "kisanconnect" });
  isConnected = true;
  logger.info("Connected to MongoDB Atlas");
}

export function isMongoConnected() {
  return isConnected;
}

export default mongoose;
