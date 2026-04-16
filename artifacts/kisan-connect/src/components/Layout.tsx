import { Link, useLocation } from "wouter";
import {
  Home,
  MessageSquare,
  TrendingUp,
  FileText,
  Bot,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang, type Lang } from "@/lib/i18n";

const BOTTOM_NAV = [
  { href: "/", key: "nav.home", icon: Home, label: "Home" },
  { href: "/prices", key: "nav.mandi_prices", icon: TrendingUp, label: "Market" },
  { href: "/ai-assistant", key: "nav.ai_assistant", icon: Bot, label: "AI Chat", center: true },
  { href: "/community", key: "nav.community", icon: MessageSquare, label: "Community" },
  { href: "/schemes", key: "nav.schemes", icon: FileText, label: "Schemes" },
];

const TOP_NAV = [
  { href: "/", key: "nav.home", icon: Home },
  { href: "/prices", key: "nav.mandi_prices", icon: TrendingUp },
  { href: "/schemes", key: "nav.schemes", icon: FileText },
  { href: "/community", key: "nav.community", icon: MessageSquare },
  { href: "/ai-assistant", key: "nav.ai_assistant", icon: Bot },
];

const LANGUAGES: { code: Lang; native: string; flag: string }[] = [
  { code: "en", native: "English", flag: "🇬🇧" },
  { code: "hi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", native: "ಕನ್ನಡ", flag: "🇮🇳" },
];

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/8 transition-all duration-200 text-sm font-semibold"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-border/60 overflow-hidden z-50"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors hover:bg-muted/60 ${
                  lang === l.code ? "bg-primary/8 text-primary font-bold" : "text-foreground font-medium"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.native}</span>
                {lang === l.code && <span className="ml-auto w-2 h-2 rounded-full bg-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  const [location] = useLocation();

  const isAI = location === "/ai-assistant";

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Top Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/60 shadow-sm shadow-black/4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 overflow-hidden p-1">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo-wheat.png`}
                  alt="KisanConnect Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-foreground leading-tight">
                  Kisan<span className="text-primary">Connect</span>
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">किसान कनेक्ट</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {TOP_NAV.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-200 font-semibold text-sm
                      ${isActive
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/8"}`}
                  >
                    <link.icon className="w-4 h-4 shrink-0" />
                    <span>{t(link.key)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <LangSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className={`flex-1 flex flex-col relative ${isAI ? "pb-0" : "pb-20 lg:pb-0"}`}>
        {children}
      </main>

      {/* ── Footer (desktop only, not on AI page) ─────────── */}
      {!isAI && (
        <footer className="hidden lg:block bg-white border-t border-border mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
            <p className="font-medium text-sm">
              © {new Date().getFullYear()} KisanConnect. {t("footer.copy")}
            </p>
            <p className="text-xs mt-1 opacity-70">{t("footer.copy_hi")}</p>
          </div>
        </footer>
      )}

      {/* ── Bottom Navigation (mobile only) ────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/60 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="flex items-end justify-around px-2 pt-2 pb-safe-or-2" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}>
          {BOTTOM_NAV.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            if (item.center) {
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center -mt-5">
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-br from-primary to-secondary scale-105"
                        : "bg-gradient-to-br from-primary to-secondary"
                    }`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className={`text-[10px] font-semibold mt-1.5 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            }
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-1 px-3">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <item.icon
                    className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                </motion.div>
                <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {t(item.key)}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-tab-indicator"
                    className="absolute top-0 w-8 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
