import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import en from "../locales/en.json";

export type Lang = "en" | "hi" | "kn";

type Translations = Record<string, string>;

interface I18nContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  ready: boolean;
}

const ctx = createContext<I18nContext>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  ready: true,
});

const cache: Partial<Record<Lang, Translations>> = { en: en as Translations };

async function loadTranslations(lang: Lang): Promise<Translations> {
  if (cache[lang]) return cache[lang]!;
  const mod =
    lang === "hi"
      ? await import("../locales/hi.json")
      : await import("../locales/kn.json");
  cache[lang] = mod.default as Translations;
  return cache[lang]!;
}

function detectBrowserLang(): Lang {
  const nav = (navigator.language ?? "").toLowerCase();
  if (nav.startsWith("kn")) return "kn";
  if (nav.startsWith("hi")) return "hi";
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

  useEffect(() => {
    setReady(false);
    loadTranslations(lang).then((data) => {
      setTranslations(data);
      setReady(true);
    });
  }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === "kn") {
      document.body.style.fontFamily =
        "'Noto Sans Kannada', 'Hind Kannada', sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }
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

  return <ctx.Provider value={{ lang, setLang, t, ready }}>{children}</ctx.Provider>;
}

export const useLang = () => useContext(ctx);
