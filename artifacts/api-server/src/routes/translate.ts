import { Router } from "express";
import OpenAI from "openai";

const router: Router = Router();

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", kn: "Kannada",
  ta: "Tamil", te: "Telugu", mr: "Marathi",
  bn: "Bengali", pa: "Punjabi", gu: "Gujarati",
};

const translateCache = new Map<string, string>();

function getOpenAI(): OpenAI | null {
  const ownKey = process.env["OPENAI_API_KEY"];
  if (ownKey) return new OpenAI({ apiKey: ownKey });
  const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];
  if (baseURL && apiKey) return new OpenAI({ baseURL, apiKey });
  return null;
}

router.post("/", async (req, res) => {
  try {
    const { texts, targetLang } = req.body as { texts: string[]; targetLang: string };

    if (!Array.isArray(texts) || !targetLang) {
      return res.status(400).json({ error: "texts (array) and targetLang are required" });
    }

    if (targetLang === "en" || texts.length === 0) {
      return res.json({ translations: texts });
    }

    const langName = LANG_NAMES[targetLang] ?? targetLang;

    const results: string[] = new Array(texts.length).fill("");
    const toTranslate: { index: number; text: string }[] = [];

    for (let i = 0; i < texts.length; i++) {
      const key = `${targetLang}:${texts[i]}`;
      if (translateCache.has(key)) {
        results[i] = translateCache.get(key)!;
      } else {
        toTranslate.push({ index: i, text: texts[i] });
      }
    }

    if (toTranslate.length === 0) {
      return res.json({ translations: results });
    }

    const openai = getOpenAI();
    if (!openai) {
      return res.json({ translations: texts });
    }

    const numberedTexts = toTranslate.map((t, i) => `${i + 1}. ${t.text}`).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: `You are a professional agricultural translator for Indian farmers. Translate the numbered texts to ${langName}.
Rules:
- Return ONLY numbered translations in format "1. <translation>"
- Keep numbers, units (₹, kg, quintal, hectare), proper nouns, scheme names, and brand names as-is
- Do not add explanations or extra content
- Each output line must start with the number followed by a period`,
        },
        { role: "user", content: numberedTexts },
      ],
      temperature: 0.1,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const lines = raw.split("\n").map(l => l.trim()).filter(l => l);

    for (let i = 0; i < toTranslate.length; i++) {
      const line = lines[i] ?? "";
      const match = line.match(/^\d+\.\s*(.+)$/s);
      const translation = match ? match[1].trim() : toTranslate[i].text;
      results[toTranslate[i].index] = translation;
      translateCache.set(`${targetLang}:${texts[toTranslate[i].index]}`, translation);
    }

    return res.json({ translations: results });
  } catch (err) {
    console.error("[translate]", err);
    return res.json({ translations: req.body?.texts ?? [] });
  }
});

export default router;
