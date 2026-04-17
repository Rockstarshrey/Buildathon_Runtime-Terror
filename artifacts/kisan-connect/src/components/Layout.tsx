import { Link, useLocation } from "wouter";
import {
  Home,
  MessageSquare,
  TrendingUp,
  FileText,
  Bot,
  Tractor,
  Menu,
  X,
  Globe,
  ChevronDown,
  Newspaper,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang, type Lang } from "@/lib/i18n";

const NAV_LINKS = [
  { href: "/", key: "nav.home", icon: Home },
  { href: "/prices", key: "nav.mandi_prices", icon: TrendingUp },
  { href: "/schemes", key: "nav.schemes", icon: FileText },
  { href: "/community", key: "nav.community", icon: MessageSquare },
  { href: "/ai-assistant", key: "nav.ai_assistant", icon: Bot },
  { href: "/agrinews", key: "nav.agrinews", icon: Newspaper },
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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 text-sm font-semibold"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{current.native}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-2 w-40 bg-white rounded-2xl shadow-xl border border-border/60 overflow-hidden z-50"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/60 ${
                  lang === l.code ? "bg-primary/10 text-primary font-bold" : "text-foreground font-medium"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.native}</span>
                {lang === l.code && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 overflow-hidden rounded-2xl bg-white shadow-lg shadow-primary/20 group-hover:shadow-primary/35 transition-all duration-300 border border-primary/10 flex items-center justify-center p-1">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo-wheat.png`}
                  alt="KisanConnect Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-tight text-foreground">
                  Kisan<span className="text-primary">Connect</span>
                </span>
                <span className="text-xs font-medium text-muted-foreground -mt-1">किसान कनेक्ट</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive =
                  location === link.href ||
                  (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm
                      ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    <link.icon className="w-4 h-4 shrink-0" />
                    <span>{t(link.key)}</span>
                  </Link>
                );
              })}

              {/* AgriGo — external link */}
              <a
                href="https://web-app-builder-shreyaspiano.replit.app"
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer font-semibold text-sm"
              >
                <Tractor className="w-4 h-4 shrink-0" />
                <span>{t("nav.agrigo")}</span>
              </a>

              {/* Language Switcher */}
              <div className="ml-2 border-l border-border/50 pl-3">
                <LangSwitcher />
              </div>
            </nav>

            {/* Mobile: lang switcher + menu toggle */}
            <div className="lg:hidden flex items-center gap-2">
              <LangSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground hover:bg-muted rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-20 z-40 bg-white border-b border-border shadow-2xl"
          >
            <div className="p-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                      ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted font-medium"}`}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{t(link.key)}</span>
                  </Link>
                );
              })}

              {/* AgriGo — external link (mobile) */}
              <a
                href="https://web-app-builder-shreyaspiano.replit.app"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted font-medium transition-colors cursor-pointer"
              >
                <Tractor className="w-5 h-5 text-muted-foreground" />
                <span>{t("nav.agrigo")}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">{children}</main>

      {/* Footer — hidden on AI Assistant page */}
      {location !== "/ai-assistant" && (
        <footer className="bg-white border-t border-border mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
            <p className="font-medium text-sm">
              © {new Date().getFullYear()} KisanConnect. {t("footer.copy")}
            </p>
            <p className="text-xs mt-1">{t("footer.copy_hi")}</p>
          </div>
        </footer>
      )}
    </div>
  );
}
