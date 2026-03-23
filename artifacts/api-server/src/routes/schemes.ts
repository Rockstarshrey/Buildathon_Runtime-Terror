import { Router, type IRouter } from "express";
import { GovernmentScheme } from "../models/GovernmentScheme";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const schemes = await GovernmentScheme.find().lean();
  const formatted = schemes.map((s: any) => ({
    id: s._id.toString(),
    name: s.name,
    nameHindi: s.nameHindi,
    description: s.description,
    descriptionHindi: s.descriptionHindi,
    benefit: s.benefit,
    eligibility: s.eligibility,
    applyLink: s.applyLink ?? "",
    category: s.category,
    icon: s.icon,
  }));
  res.json(formatted);
});

export default router;
