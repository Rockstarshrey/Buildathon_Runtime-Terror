import mongoose from "mongoose";

const governmentSchemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameHindi: { type: String, required: true },
    description: { type: String, required: true },
    descriptionHindi: { type: String, required: true },
    benefit: { type: String, required: true },
    eligibility: { type: String, required: true },
    applyLink: { type: String, default: "" },
    category: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { versionKey: false }
);

export const GovernmentScheme =
  mongoose.models["GovernmentScheme"] ||
  mongoose.model("GovernmentScheme", governmentSchemeSchema);
