import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res) => {
  const { text, lang } = req.query as { text?: string; lang?: string };

  if (!text || typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "text query param is required" });
    return;
  }

  if (lang !== "kn") {
    res.status(400).json({ error: "Only lang=kn (Kannada) is supported on this endpoint" });
    return;
  }

  const safe = text.trim().slice(0, 200);

  try {
    const url = new URL("https://translate.google.com/translate_tts");
    url.searchParams.set("ie", "UTF-8");
    url.searchParams.set("q", safe);
    url.searchParams.set("tl", "kn");
    url.searchParams.set("client", "tw-ob");
    url.searchParams.set("ttsspeed", "0.72");

    const upstream = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
        Accept: "audio/mpeg, audio/*",
      },
    });

    if (!upstream.ok) {
      throw new Error(`Google TTS returned ${upstream.status}`);
    }

    const audio = await upstream.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(audio));
  } catch (err) {
    logger.error({ err }, "Kannada TTS proxy failed");
    res.status(502).json({ error: "TTS generation failed" });
  }
});

export default router;
