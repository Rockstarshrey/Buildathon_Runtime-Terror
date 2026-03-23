import mongoose from "mongoose";

const mandiPriceSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true },
    cropHindi: { type: String, required: true },
    market: { type: String, required: true },
    state: { type: String, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    unit: { type: String, default: "quintal" },
    date: { type: String, required: true },
    trend: { type: String, enum: ["up", "down", "stable"], required: true },
  },
  { versionKey: false }
);

export const MandiPrice =
  mongoose.models["MandiPrice"] ||
  mongoose.model("MandiPrice", mandiPriceSchema);
