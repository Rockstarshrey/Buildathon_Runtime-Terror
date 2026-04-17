import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import en from "../locales/en.json";

export type Lang = "en" | "hi" | "kn" | "ta" | "te" | "mr" | "bn" | "pa" | "gu";

type Translations = Record<string, string>;

interface I18nContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  ready: boolean;
  isTranslating: boolean;
}

const ctx = createContext<I18nContext>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  ready: true,
  isTranslating: false,
});

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STATIC_LANGS: Lang[] = ["en", "hi", "kn"];

const memCache: Partial<Record<Lang, Translations>> = {
  en: en as Translations,
};

async function loadStaticTranslations(lang: "hi" | "kn"): Promise<Translations> {
  if (memCache[lang]) return memCache[lang]!;
  const mod =
    lang === "hi"
      ? await import("../locales/hi.json")
      : await import("../locales/kn.json");
  memCache[lang] = mod.default as Translations;
  return memCache[lang]!;
}

async function loadAITranslations(lang: Lang): Promise<Translations> {
  const lsKey = `kisan_ai_translations_${lang}`;
  const cached = localStorage.getItem(lsKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as Translations;
      memCache[lang] = parsed;
      return parsed;
    } catch {
      localStorage.removeItem(lsKey);
    }
  }

  const enTranslations = en as Translations;
  const keys = Object.keys(enTranslations);
  const values = keys.map((k) => enTranslations[k]);

  const res = await fetch(`${BASE}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts: values, targetLang: lang }),
  });

  if (!res.ok) throw new Error("Translation API error");

  const data = (await res.json()) as { translations: string[] };
  const result: Translations = {};
  keys.forEach((key, i) => {
    result[key] = data.translations[i] ?? enTranslations[key];
  });

  localStorage.setItem(lsKey, JSON.stringify(result));
  memCache[lang] = result;
  return result;
}

function detectBrowserLang(): Lang {
  const nav = (navigator.language ?? "").toLowerCase();
  if (nav.startsWith("kn")) return "kn";
  if (nav.startsWith("hi")) return "hi";
  if (nav.startsWith("ta")) return "ta";
  if (nav.startsWith("te")) return "te";
  if (nav.startsWith("mr")) return "mr";
  if (nav.startsWith("bn")) return "bn";
  if (nav.startsWith("pa")) return "pa";
  if (nav.startsWith("gu")) return "gu";
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("kisan_lang") as Lang | null;
    return stored ?? detectBrowserLang();
  });
  const [translations, setTranslations] = useState<Translations>(
    lang === "en" ? (en as Translations) : {}
  );
  const [ready, setReady] = useState(lang === "en");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (lang === "en") {
      setTranslations(en as Translations);
      setReady(true);
      setIsTranslating(false);
      return;
    }

    if (memCache[lang]) {
      setTranslations(memCache[lang]!);
      setReady(true);
      return;
    }

    setReady(false);
    setIsTranslating(true);

    const load = STATIC_LANGS.includes(lang)
      ? loadStaticTranslations(lang as "hi" | "kn")
      : loadAITranslations(lang);

    load
      .then((data) => {
        setTranslations(data);
        setReady(true);
      })
      .catch(() => {
        setTranslations(en as Translations);
        setReady(true);
      })
      .finally(() => setIsTranslating(false));
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    const fontMap: Partial<Record<Lang, string>> = {
      kn: "'Noto Sans Kannada', 'Hind Kannada', sans-serif",
      ta: "'Noto Sans Tamil', sans-serif",
      te: "'Noto Sans Telugu', sans-serif",
      bn: "'Noto Sans Bengali', sans-serif",
      pa: "'Noto Sans Gurmukhi', sans-serif",
      gu: "'Noto Sans Gujarati', sans-serif",
    };
    document.body.style.fontFamily = fontMap[lang] ?? "";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    localStorage.setItem("kisan_lang", l);
    setLangState(l);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return translations[key] ?? (en as Translations)[key] ?? fallback ?? key;
    },
    [translations]
  );

  return (
    <ctx.Provider value={{ lang, setLang, t, ready, isTranslating }}>
      {children}
    </ctx.Provider>
  );
}

export const useLang = () => useContext(ctx);
