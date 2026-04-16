import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Bot,
  MessageSquare,
  ShieldCheck,
  CloudSun,
  Wind,
  Droplets,
  Search,
  ArrowRight,
  Sun,
  Cloud,
  CloudRain,
  Newspaper,
  Tractor,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const FEATURE_CARDS = [
  {
    href: "/prices",
    icon: TrendingUp,
    label: "Market Prices",
    labelHi: "मंडी भाव",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    cardBg: "from-emerald-50 to-green-50",
    border: "border-emerald-200/60",
    tag: "LIVE",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    href: "/ai-assistant",
    icon: Bot,
    label: "KisanMitra AI",
    labelHi: "AI सहायक",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    cardBg: "from-blue-50 to-sky-50",
    border: "border-blue-200/60",
    tag: "AI",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    href: "/community",
    icon: MessageSquare,
    label: "Community",
    labelHi: "समुदाय",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
    cardBg: "from-violet-50 to-purple-50",
    border: "border-violet-200/60",
    tag: "500+",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    href: "/schemes",
    icon: ShieldCheck,
    label: "Gov't Schemes",
    labelHi: "सरकारी योजनाएं",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
    cardBg: "from-amber-50 to-orange-50",
    border: "border-amber-200/60",
    tag: "₹6000+",
    tagColor: "bg-amber-100 text-amber-700",
  },
];

const FORECAST = [
  { day: "Today", icon: CloudSun, hi: 32, lo: 21, color: "text-amber-500" },
  { day: "Tmrw", icon: Cloud, hi: 29, lo: 19, color: "text-slate-400" },
  { day: "Thu", icon: CloudRain, hi: 25, lo: 18, color: "text-sky-500" },
  { day: "Fri", icon: Sun, hi: 33, lo: 22, color: "text-amber-400" },
];

const NEWS_ITEMS = [
  { titleKey: "news.item1.title", tagKey: "news.item1.tag", date: "2h ago", tagColor: "bg-sky-100 text-sky-700" },
  { titleKey: "news.item2.title", tagKey: "news.item2.tag", date: "5h ago", tagColor: "bg-green-100 text-green-700" },
  { titleKey: "news.item3.title", tagKey: "news.item3.tag", date: "1d ago", tagColor: "bg-amber-100 text-amber-700" },
];

export default function Home() {
  const { t } = useLang();

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Hero / Greeting ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#43A047] pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background farm image */}
        <img
          src={`${import.meta.env.BASE_URL}images/hero-farm.png`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-15 mix-blend-luminosity pointer-events-none select-none"
        />
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)}>
            <p className="text-emerald-200 text-sm font-medium mb-1">🌾 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">
              {getGreeting()}, Farmer! 👋
            </h1>
            <p className="text-emerald-100/80 text-base font-medium mb-6">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div {...fadeUp(0.08)} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search crops, schemes, advice..."
              className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white text-foreground text-base font-medium placeholder:text-muted-foreground shadow-lg shadow-black/10 border-0 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* ── Weather Card (overlapping hero) ─────────────── */}
        <motion.div
          {...fadeUp(0.1)}
          className="relative -mt-10 mb-6 overflow-hidden rounded-3xl shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600" />
          <img
            src="https://images.unsplash.com/photo-1510987836583-e3fb9586c7b3?q=80&w=800&auto=format&fit=crop"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen pointer-events-none select-none"
          />
          <div className="relative z-10 p-5">
            <div className="flex items-start justify-between gap-4">
              {/* Left: main temp */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CloudSun className="w-5 h-5 text-amber-200" />
                  <span className="text-sky-100 text-sm font-semibold">{t("weather.title")} · Bengaluru</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-6xl font-display font-bold text-white leading-none">28°</span>
                  <div className="pb-1">
                    <p className="text-white font-semibold text-base">{t("weather.partly_cloudy")}</p>
                    <p className="text-sky-200 text-sm">H: 32° · L: 21°</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <span className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5 text-white text-sm font-semibold">
                    <Droplets className="w-4 h-4 text-sky-200" /> 65%
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5 text-white text-sm font-semibold">
                    <Wind className="w-4 h-4 text-sky-200" /> 12 km/h
                  </span>
                </div>
              </div>

              {/* Right: 4-day forecast */}
              <div className="flex flex-col gap-2 shrink-0">
                {FORECAST.map((f) => (
                  <div key={f.day} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                    <span className="text-sky-200 text-xs font-bold w-8">{f.day}</span>
                    <f.icon className={`w-4 h-4 shrink-0 ${f.color}`} />
                    <span className="text-white text-xs font-bold">{f.hi}°</span>
                    <span className="text-sky-300 text-xs">{f.lo}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Feature Grid ────────────────────────────────── */}
        <section className="mb-8">
          <h2 className="text-lg font-display font-bold text-foreground mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            {FEATURE_CARDS.map((card, i) => (
              <Link key={card.href} href={card.href}>
                <motion.div
                  {...fadeUp(0.05 * i)}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative overflow-hidden rounded-3xl border ${card.border} bg-gradient-to-br ${card.cardBg} p-5 cursor-pointer shadow-sm hover:shadow-lg hover:shadow-black/8 transition-shadow duration-300`}
                >
                  {/* Tag */}
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${card.tagColor}`}>
                    {card.tag}
                  </span>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  {/* Labels */}
                  <p className="font-display font-bold text-base text-foreground leading-tight">{card.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.labelHi}</p>

                  {/* Arrow */}
                  <ArrowRight className={`absolute bottom-4 right-4 w-4 h-4 ${card.iconColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`} />
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── AgriGo Banner ──────────────────────────────── */}
        <section className="mb-8">
          <motion.div
            {...fadeUp(0.15)}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2E7D32] via-[#388E3C] to-[#43A047] p-6 shadow-xl shadow-primary/20"
          >
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <Tractor className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-200 mb-0.5 uppercase tracking-wider">AgriGo Marketplace</p>
                  <h3 className="text-xl font-display font-bold text-white">Sell & Buy Farm Products</h3>
                  <p className="text-emerald-100/80 text-sm mt-0.5">Connect directly with buyers nationwide</p>
                </div>
              </div>
              <a
                href="https://web-app-builder-shreyaspiano.replit.app"
                className="shrink-0 flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-2xl shadow-md hover:bg-white/90 transition-all"
              >
                Explore <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── News Section ───────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary" /> {t("news.title")}
            </h2>
            <button className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
              {t("news.view_all")} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden divide-y divide-border/40">
            {NEWS_ITEMS.map((news, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="group flex items-start gap-4 px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="shrink-0 w-9 h-9 rounded-2xl bg-muted/60 flex items-center justify-center mt-0.5 group-hover:bg-primary/10 transition-colors">
                  <span className="text-sm font-bold text-muted-foreground/60 group-hover:text-primary transition-colors">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${news.tagColor}`}>{t(news.tagKey)}</span>
                    <span className="text-xs text-muted-foreground">{news.date}</span>
                  </div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                    {t(news.titleKey)}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-all group-hover:translate-x-0.5 mt-2 shrink-0" />
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
