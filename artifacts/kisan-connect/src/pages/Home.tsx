import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sprout,
  CloudSun,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Wind,
  Droplets,
  Sun,
  Cloud,
  CloudRain,
  Newspaper,
  Bot,
  Users,
  BarChart3,
  Leaf,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.7, delay },
});

const QUICK_CARDS = [
  {
    href: "/prices",
    translKey: "mandi",
    icon: TrendingUp,
    stat: "10 markets",
    gradient: "from-amber-400 via-orange-400 to-rose-400",
    glow: "shadow-amber-400/30",
    bg: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-400/15",
    iconColor: "text-amber-600",
    accent: "text-amber-600",
    tag: "LIVE",
    tagColor: "bg-amber-100 text-amber-700",
    decorShape: "M0,0 L120,0 L120,80 Q60,110 0,80 Z",
    shapeColor: "fill-amber-400/10",
  },
  {
    href: "/schemes",
    translKey: "schemes",
    icon: ShieldCheck,
    stat: "₹6,000+",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    glow: "shadow-blue-400/30",
    bg: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-600",
    accent: "text-blue-600",
    tag: "6 SCHEMES",
    tagColor: "bg-blue-100 text-blue-700",
    decorShape: "M120,0 L0,0 L0,80 Q60,110 120,80 Z",
    shapeColor: "fill-blue-400/10",
  },
  {
    href: "/community",
    translKey: "community",
    icon: MessageSquare,
    stat: "500+",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "shadow-purple-400/30",
    bg: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-600",
    accent: "text-violet-600",
    tag: "ACTIVE",
    tagColor: "bg-violet-100 text-violet-700",
    decorShape: "M0,0 L120,0 L120,80 Q60,110 0,80 Z",
    shapeColor: "fill-violet-400/10",
  },
  {
    href: "/ai-assistant",
    translKey: "ai",
    icon: Bot,
    stat: "3 languages",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    glow: "shadow-emerald-400/30",
    bg: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-700",
    accent: "text-emerald-700",
    tag: "AI POWERED",
    tagColor: "bg-emerald-100 text-emerald-700",
    decorShape: "M120,0 L0,0 L0,80 Q60,110 120,80 Z",
    shapeColor: "fill-emerald-400/10",
  },
];

const STATS = [
  { icon: Users, value: "2M+", label: "Farmers" },
  { icon: BarChart3, value: "10+", label: "Markets" },
  { icon: Leaf, value: "25+", label: "Crops" },
  { icon: Star, value: "4.8", label: "Rating" },
];

const FORECAST_KEYS = [
  { dayKey: "weather.today", icon: CloudSun, hi: 32, lo: 21, color: "text-amber-500" },
  { dayKey: "weather.tomorrow", icon: Cloud, hi: 29, lo: 19, color: "text-slate-400" },
  { dayKey: "weather.thu", icon: CloudRain, hi: 25, lo: 18, color: "text-sky-500" },
  { dayKey: "weather.fri", icon: Sun, hi: 33, lo: 22, color: "text-amber-400" },
];

const NEWS_KEYS = [
  { titleKey: "news.item1.title", tagKey: "news.item1.tag", date: "2h", tagColor: "bg-sky-100 text-sky-700" },
  { titleKey: "news.item2.title", tagKey: "news.item2.tag", date: "5h", tagColor: "bg-green-100 text-green-700" },
  { titleKey: "news.item3.title", tagKey: "news.item3.tag", date: "1d", tagColor: "bg-amber-100 text-amber-700" },
];

export default function Home() {
  const { t } = useLang();

  return (
    <div className="flex flex-col min-h-full">

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="relative pt-14 pb-36 lg:pt-24 lg:pb-52 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-farm.png`}
            alt="Lush green farm"
            className="w-full h-full object-cover scale-105"
            style={{ filter: "brightness(0.55) saturate(1.1)" }}
          />
          {/* Deep dark green gradient left → transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/75 to-green-800/20" />
          {/* Bottom fade into page background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-green-400/8 blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp(0)} className="max-w-2xl">

            {/* Badge */}
            <motion.div {...fadeIn(0.1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-semibold tracking-wide">{t("hero.badge")}</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-[1.08] mb-6 drop-shadow-2xl">
              {t("hero.h1_1")}<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #6EE7B7 0%, #34D399 40%, #A7F3D0 100%)" }}
              >
                {t("hero.h1_2")}
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-green-100/85 mb-10 font-medium max-w-xl leading-relaxed drop-shadow">
              {t("hero.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-2xl h-14 px-8 text-lg font-bold group border-0 shadow-xl shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #16a34a 0%, #059669 50%, #047857 100%)",
                }}
              >
                <Link href="/prices">
                  {t("hero.btn_prices")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/50 h-14 px-8 text-lg font-semibold border-2 transition-all duration-300"
              >
                <Link href="/ai-assistant">{t("hero.btn_ai")}</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center gap-5 mt-10">
              <div className="flex items-center gap-1.5 text-green-200/70 text-sm font-medium">
                <span className="text-emerald-400">✓</span> Free for all farmers
              </div>
              <div className="flex items-center gap-1.5 text-green-200/70 text-sm font-medium">
                <span className="text-emerald-400">✓</span> 3 languages supported
              </div>
              <div className="flex items-center gap-1.5 text-green-200/70 text-sm font-medium">
                <span className="text-emerald-400">✓</span> Live mandi data
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats Strip ─────────────────────────────────── */}
      <div className="relative z-20 -mt-10 mb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0.15)}
            className="rounded-3xl overflow-hidden shadow-2xl shadow-black/15"
            style={{
              background: "linear-gradient(135deg, #14532d 0%, #166534 40%, #15803d 100%)",
            }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 divide-y lg:divide-y-0">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center gap-1 py-5 px-4"
                >
                  <s.icon className="w-5 h-5 text-emerald-300 mb-1" />
                  <span className="text-2xl font-display font-extrabold text-white">{s.value}</span>
                  <span className="text-xs font-semibold text-green-200/70 uppercase tracking-wider">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Quick Access Cards ───────────────────────────── */}
      <section className="relative z-10 pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0.1)} className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Quick Access</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Everything you need, right here</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {QUICK_CARDS.map((card, i) => (
              <QuickCard key={card.href} card={card} delay={0.08 * i} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Assistant Banner ──────────────────────────── */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0.1)}
            className="relative overflow-hidden rounded-3xl p-8 shadow-2xl shadow-green-950/30"
            style={{
              background: "linear-gradient(135deg, #052e16 0%, #14532d 35%, #166534 65%, #15803d 100%)",
            }}
          >
            {/* Subtle farm texture */}
            <img
              src="https://images.unsplash.com/photo-1612758373188-2d59b2717542?q=80&w=2070&auto=format&fit=crop"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.12] mix-blend-luminosity pointer-events-none select-none"
            />

            {/* Glow accents */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-8 w-64 h-64 rounded-full bg-green-400/8 blur-3xl pointer-events-none" />

            {/* Top grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                {/* AI icon with ring */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-emerald-400/30 blur-md scale-110" />
                  <div className="relative w-16 h-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3 tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {t("banner.ai_powered")}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-white leading-tight">
                    {t("banner.title")}
                  </h2>
                  <p className="text-emerald-100/80 mt-1.5 font-medium max-w-lg">
                    {t("banner.desc")}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {["English", "हिन्दी", "ಕನ್ನಡ"].map((lang) => (
                      <span key={lang} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-semibold">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-white text-green-900 hover:bg-white/90 font-bold h-13 px-8 shrink-0 shadow-xl shadow-black/20 transition-all duration-300 hover:scale-[1.03]"
              >
                <Link href="/ai-assistant">
                  {t("banner.ask_btn")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Weather + News ───────────────────────────────── */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Weather Card */}
          <motion.div {...fadeUp(0.1)} className="relative overflow-hidden rounded-3xl shadow-2xl shadow-sky-900/20">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700" />
            <img
              src="https://images.unsplash.com/photo-1510987836583-e3fb9586c7b3?q=80&w=2070&auto=format&fit=crop"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-35 mix-blend-screen pointer-events-none select-none"
            />
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/8 pointer-events-none" />
            <div className="absolute top-20 -left-8 w-36 h-36 rounded-full bg-white/6 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-blue-800/50 to-transparent pointer-events-none" />

            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white">{t("weather.title")}</h3>
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur border border-white/15 flex items-center justify-center">
                  <CloudSun className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex items-end gap-3 mb-4">
                <span className="text-7xl font-display font-bold text-white leading-none drop-shadow-lg">28°</span>
                <div className="pb-1">
                  <p className="text-white font-semibold text-lg">{t("weather.partly_cloudy")}</p>
                  <p className="text-sky-200 text-sm">H: 32° · L: 21°</p>
                </div>
              </div>

              <div className="flex gap-3 mb-5">
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                  <Droplets className="w-4 h-4 text-sky-200" />
                  <span className="text-white text-sm font-semibold">65%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-white/10">
                  <Wind className="w-4 h-4 text-sky-200" />
                  <span className="text-white text-sm font-semibold">12 km/h</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-4 border-t border-white/15">
                {FORECAST_KEYS.map((f) => (
                  <div key={f.dayKey} className="flex flex-col items-center gap-1 py-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/8">
                    <span className="text-sky-200 text-[10px] font-bold uppercase tracking-wide">{t(f.dayKey)}</span>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                    <span className="text-white font-bold text-xs">{f.hi}°</span>
                    <span className="text-sky-300 text-[10px]">{f.lo}°</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* News Card */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-border/50 flex flex-col overflow-hidden">
            <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-green-950 to-green-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight">{t("news.title")}</h3>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-emerald-300 hover:text-white hover:bg-white/10 rounded-xl font-semibold text-sm">
                {t("news.view_all")} <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-border/40 flex-1">
              {NEWS_KEYS.map((news, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="group px-6 py-5 hover:bg-muted/40 transition-colors cursor-pointer flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-muted/60 flex items-center justify-center mt-0.5 group-hover:bg-green-950 transition-colors duration-200">
                    <span className="text-base font-bold text-muted-foreground/60 group-hover:text-white transition-colors duration-200">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${news.tagColor}`}>
                        {t(news.tagKey)}
                      </span>
                      <span className="text-xs text-muted-foreground">{news.date}</span>
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-green-900 transition-colors leading-snug">
                      {t(news.titleKey)}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-green-800 transition-all group-hover:translate-x-0.5 mt-1 shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

function QuickCard({
  card,
  delay,
  t,
}: {
  card: (typeof QUICK_CARDS)[0];
  delay: number;
  t: (key: string) => string;
}) {
  return (
    <Link href={card.href}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={`group relative h-full bg-gradient-to-br ${card.bg} rounded-3xl p-6 border border-white shadow-lg ${card.glow} hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col`}
      >
        {/* Gradient top stripe */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${card.gradient}`} />

        {/* Decorative SVG */}
        <svg
          className="absolute -bottom-2 -right-2 w-32 h-20 opacity-60"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={card.decorShape} className={card.shapeColor} />
        </svg>

        {/* Tag + arrow */}
        <div className="flex items-center justify-between mb-5">
          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${card.tagColor}`}>
            {card.tag}
          </span>
          <ArrowRight className={`w-4 h-4 ${card.accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`} />
        </div>

        {/* Icon */}
        <div className={`relative w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm scale-110`} />
          <card.icon className={`w-8 h-8 ${card.iconColor} relative z-10`} />
        </div>

        {/* Text */}
        <h3 className="font-bold text-xl text-foreground leading-tight">
          {t(`card.${card.translKey}.title`)}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-2">
          {t(`card.${card.translKey}.desc`)}
        </p>

        {/* Bottom stat */}
        <div className="mt-5 pt-4 border-t border-black/5 flex items-baseline gap-1.5">
          <span className={`text-2xl font-display font-bold ${card.accent}`}>{card.stat}</span>
          <span className="text-xs text-muted-foreground font-medium">
            {t(`card.${card.translKey}.stat_label`)}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
