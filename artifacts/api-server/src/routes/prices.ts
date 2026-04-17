import { Router, type IRouter } from "express";
import { MandiPrice } from "../models/MandiPrice";

const router: IRouter = Router();

const DATAGOV_API_KEY = process.env.DATAGOV_API_KEY;
const DATAGOV_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const HINDI_MAP: Record<string, string> = {
  Tomato: "टमाटर",
  Potato: "आलू",
  Onion: "प्याज",
  Rice: "चावल",
  Wheat: "गेहूं",
  Maize: "मक्का",
  "Black pepper": "काली मिर्च",
  "Black Gram(Urd Beans)(Whole)": "उड़द दाल",
  "Sunflower/Sunflower Seed": "सूरजमुखी",
  Sugarcane: "गन्ना",
  Cotton: "कपास",
  Groundnut: "मूंगफली",
  Brinjal: "बैंगन",
  Cabbage: "पत्तागोभी",
  Cauliflower: "फूलगोभी",
  Banana: "केला",
  Mango: "आम",
  Pomegranate: "अनार",
  Grapes: "अंगूर",
  Apple: "सेब",
  Garlic: "लहसुन",
  Ginger: "अदरक",
  Turmeric: "हल्दी",
  "Green Chilli": "हरी मिर्च",
  Soyabean: "सोयाबीन",
  Jowar: "ज्वार",
  Bajra: "बाजरा",
  "Arhar(Tur)": "अरहर",
  "Moong(Green Gram)": "मूंग",
  "Lentil(Masur)(Whole)": "मसूर",
};

function cropHindi(commodity: string): string {
  for (const [key, value] of Object.entries(HINDI_MAP)) {
    if (commodity.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return commodity;
}

function trendFromPrices(min: number, max: number, modal: number): string {
  const spread = max - min;
  const ratio = spread / (modal || 1);
  if (ratio > 0.3) return "up";
  if (ratio < 0.1) return "down";
  return "stable";
}

async function fetchLivePrices() {
  if (!DATAGOV_API_KEY) return null;

  const params = new URLSearchParams({
    "api-key": DATAGOV_API_KEY,
    format: "json",
    limit: "100",
    offset: "0",
  });

  const resp = await fetch(`${DATAGOV_URL}?${params.toString()}`);
  if (!resp.ok) return null;

  const data = (await resp.json()) as { records?: any[] };
  if (!data.records || data.records.length === 0) return null;

  return data.records.map((r: any, idx: number) => ({
    id: `live-${idx}`,
    crop: r.commodity ?? "",
    cropHindi: cropHindi(r.commodity ?? ""),
    market: `${r.market}, ${r.district}`,
    state: r.state ?? "",
    minPrice: Number(r.min_price) || 0,
    maxPrice: Number(r.max_price) || 0,
    modalPrice: Number(r.modal_price) || 0,
    unit: "quintal",
    date: r.arrival_date ?? "",
    trend: trendFromPrices(
      Number(r.min_price),
      Number(r.max_price),
      Number(r.modal_price),
    ),
  }));
}

router.get("/", async (_req, res) => {
  try {
    const live = await fetchLivePrices();
    if (live) {
      res.json(live);
      return;
    }
  } catch {
    // fall through to seed data
  }

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
