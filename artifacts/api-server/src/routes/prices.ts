import { Router, type IRouter } from "express";
import { MandiPrice } from "../models/MandiPrice";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const prices = await MandiPrice.find().lean();
  const formatted = prices.map((p: any) => ({
    id: p._id.toString(),
    crop: p.crop,
    cropHindi: p.cropHindi,
    market: p.market,
    state: p.state,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice,
    modalPrice: p.modalPrice,
    unit: p.unit,
    date: p.date,
    trend: p.trend,
  }));
  res.json(formatted);
});

export default router;
