import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const sessionCache = new Map<string, string[]>();

function makeCacheKey(lang: string, texts: string[]): string {
  return `${lang}::${texts.slice(0, 5).join("|")}::${texts.length}`;
}

export function useTranslate(texts: string[]): {
  translated: string[];
  isTranslating: boolean;
} {
  const { lang } = useLang();
  const [translated, setTranslated] = useState<string[]>(texts);
  const [isTranslating, setIsTranslating] = useState(false);

  const textsFingerprint = texts.join("||");

  useEffect(() => {
    if (lang === "en") {
      setTranslated(texts);
      return;
    }

    if (texts.length === 0) return;

    const key = makeCacheKey(lang, texts);
    if (sessionCache.has(key)) {
      setTranslated(sessionCache.get(key)!);
      return;
    }

    const nonEmpty = texts
      .map((text, index) => ({ text, index }))
      .filter(({ text }) => text.trim().length > 0);

    if (nonEmpty.length === 0) {
      setTranslated(texts);
      return;
    }

    setIsTranslating(true);

    fetch(`${BASE}/api/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texts: nonEmpty.map((t) => t.text),
        targetLang: lang,
      }),
    })
      .then((r) => r.json())
      .then((data: { translations: string[] }) => {
        const result = [...texts];
        nonEmpty.forEach(({ index }, i) => {
          result[index] = data.translations[i] ?? texts[index];
        });
        sessionCache.set(key, result);
        setTranslated(result);
      })
      .catch(() => setTranslated(texts))
      .finally(() => setIsTranslating(false));
  }, [lang, textsFingerprint]);

  return { translated, isTranslating };
}
