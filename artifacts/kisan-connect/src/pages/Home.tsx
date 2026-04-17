import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sprout,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Bot,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import WeatherCard from "@/components/WeatherCard";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const QUICK_CARDS = [
  {
    href: "/prices",
    translKey: "mandi",
    icon: TrendingUp,
    stat: "10 markets",
    gradient: "from-amber-400 via-orange-400 to-rose-400",
    glow: "shadow-amber-400/40",
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
    glow: "shadow-blue-400/40",
    bg: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-600",
    accent: "text-blue-600",
    tag: "14 SCHEMES",
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
    glow: "shadow-purple-400/40",
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
    href: "/agrinews",
    translKey: "agrinews",
    icon: Rss,
    stat: "30+",
    gradient: "from-teal-500 via-cyan-500 to-sky-500",
    glow: "shadow-teal-400/40",
    bg: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-600",
    accent: "text-teal-600",
    tag: "LIVE NEWS",
    tagColor: "bg-teal-100 text-teal-700",
    decorShape: "M120,0 L0,0 L0,80 Q60,110 120,80 Z",
    shapeColor: "fill-teal-400/10",
  },
];



export default function Home() {
  const { t } = useLang();

  return (
    <div className="flex flex-col min-h-full">

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="relative pt-12 pb-32 lg:pt-20 lg:pb-44 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-farm.png`}
            alt="Lush green farm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-green-900/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp(0)} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-white mb-6">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-semibold tracking-wide">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              {t("hero.h1_1")}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-100">
                {t("hero.h1_2")}
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-green-50 mb-8 font-medium max-w-xl drop-shadow">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-xl bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 text-white shadow-lg shadow-primary/30 border-0 h-14 px-8 text-lg group">
                <Link href="/prices">
                  {t("hero.btn_prices")}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 h-14 px-8 text-lg border-2">
                <Link href="/ai-assistant">{t("hero.btn_ai")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Quick Access Cards ───────────────────────────── */}
      <section className="relative z-20 -mt-20 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {QUICK_CARDS.map((card, i) => (
              <QuickCard key={card.href} card={card} delay={0.08 * i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Assistant Banner ──────────────────────────── */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp(0.1)}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-emerald-600 to-teal-600 p-8 shadow-2xl shadow-primary/25"
          >
            <img
              src="https://images.unsplash.com/photo-1612758373188-2d59b2717542?q=80&w=2070&auto=format&fit=crop"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.18] mix-blend-luminosity pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-emerald-700/40 to-transparent pointer-events-none" />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute top-4 right-1/3 w-32 h-32 rounded-full bg-emerald-400/20 blur-2xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    {t("banner.ai_powered")}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-white leading-tight">
                    {t("banner.title")}
                  </h2>
                  <p className="text-emerald-100 mt-1 font-medium">
                    {t("banner.desc")}
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-xl bg-white text-primary hover:bg-white/90 font-bold h-13 px-7 shrink-0 shadow-lg">
                <Link href="/ai-assistant">
                  {t("banner.ask_btn")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Weather ──────────────────────────────────────── */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0.1)} className="max-w-sm">
            <WeatherCard />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function QuickCard({
  card,
  delay,
}: {
  card: (typeof QUICK_CARDS)[0];
  delay: number;
}) {
  const { t } = useLang();
  return (
    <Link href={card.href}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={`group relative h-full bg-gradient-to-br ${card.bg} rounded-3xl p-6 border border-white shadow-xl ${card.glow} shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col`}
      >
        {/* Gradient top stripe */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${card.gradient}`} />

        {/* Decorative SVG shape */}
        <svg
          className="absolute -bottom-2 -right-2 w-32 h-20 opacity-60"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={card.decorShape} className={card.shapeColor} />
        </svg>

        {/* Tag */}
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
        <h3 className={`font-bold text-xl text-foreground leading-tight group-hover:${card.accent} transition-colors`}>
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
