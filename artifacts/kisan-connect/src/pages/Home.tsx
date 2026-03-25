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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const QUICK_CARDS = [
  {
    href: "/prices",
    icon: TrendingUp,
    title: "Mandi Prices",
    titleHi: "मंडी भाव",
    desc: "Live crop rates updated daily across major markets",
    stat: "10 markets",
    statLabel: "tracked live",
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
    icon: ShieldCheck,
    title: "Govt Schemes",
    titleHi: "सरकारी योजनाएं",
    desc: "Discover subsidies, loans and insurance for your farm",
    stat: "₹6,000+",
    statLabel: "avg benefit/year",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    glow: "shadow-blue-400/40",
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
    icon: MessageSquare,
    title: "Community",
    titleHi: "किसान समुदाय",
    desc: "Share tips, ask questions, connect with local farmers",
    stat: "500+",
    statLabel: "farmers online",
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
];

const FORECAST = [
  { day: "Today", icon: CloudSun, hi: 32, lo: 21, color: "text-amber-500" },
  { day: "Tomorrow", icon: Cloud, hi: 29, lo: 19, color: "text-slate-400" },
  { day: "Thu", icon: CloudRain, hi: 25, lo: 18, color: "text-sky-500" },
  { day: "Fri", icon: Sun, hi: 33, lo: 22, color: "text-amber-400" },
];

const NEWS = [
  {
    title: "Monsoon expected to arrive early in Central India",
    hi: "मध्य भारत में मानसून जल्दी आने की संभावना",
    date: "2 hours ago",
    tag: "Weather",
    tagColor: "bg-sky-100 text-sky-700",
  },
  {
    title: "New MSP announced for Rabi crops 2024-25",
    hi: "रबी फसलों 2024-25 के लिए नया एमएसपी घोषित",
    date: "5 hours ago",
    tag: "Policy",
    tagColor: "bg-green-100 text-green-700",
  },
  {
    title: "Govt increases subsidy on organic fertilizers by 15%",
    hi: "सरकार ने जैविक खाद पर सब्सिडी 15% बढ़ाई",
    date: "1 day ago",
    tag: "Subsidy",
    tagColor: "bg-amber-100 text-amber-700",
  },
];

export default function Home() {
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
                Empowering Farmers • किसानों का सशक्तिकरण
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              Smart farming,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-100">
                better futures.
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-green-50 mb-8 font-medium max-w-xl drop-shadow">
              Get live mandi prices, connect with fellow farmers, and receive AI-driven crop advice in your language.
              <br />
              <span className="opacity-80 text-base mt-2 block">
                लाइव मंडी भाव प्राप्त करें, साथी किसानों से जुड़ें, और अपनी भाषा में फसल सलाह प्राप्त करें।
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-xl bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 text-white shadow-lg shadow-primary/30 border-0 h-14 px-8 text-lg group">
                <Link href="/prices">
                  Check Prices / भाव देखें
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 h-14 px-8 text-lg border-2">
                <Link href="/ai-assistant">Ask AI / एआई से पूछें</Link>
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
            {/* Background image — paddy field blended into gradient */}
            <img
              src="https://images.unsplash.com/photo-1612758373188-2d59b2717542?q=80&w=2070&auto=format&fit=crop"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.18] mix-blend-luminosity pointer-events-none select-none"
            />
            {/* Gradient overlay to keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-emerald-700/40 to-transparent pointer-events-none" />

            {/* Decorative circles */}
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
                    AI POWERED
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-white leading-tight">
                    KisanMitra AI — Your Crop Advisor
                  </h2>
                  <p className="text-emerald-100 mt-1 font-medium">
                    Ask in English or Hindi. Get expert farming advice instantly.
                    <span className="block opacity-80 text-sm mt-0.5">हिंदी या अंग्रेजी में पूछें। तुरंत विशेषज्ञ सलाह पाएं।</span>
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-xl bg-white text-primary hover:bg-white/90 font-bold h-13 px-7 shrink-0 shadow-lg">
                <Link href="/ai-assistant">
                  Ask KisanMitra
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
          <motion.div {...fadeUp(0.1)} className="relative overflow-hidden rounded-3xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600" />
            {/* Decorative clouds */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute top-16 -left-6 w-28 h-28 rounded-full bg-white/8" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-700/40 to-transparent" />

            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-white">Local Weather</h3>
                  <p className="text-sky-200 text-sm font-medium">स्थानीय मौसम</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <CloudSun className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-end gap-3 mt-6 mb-2">
                <span className="text-6xl font-display font-bold text-white leading-none">28°</span>
                <div className="pb-1">
                  <p className="text-white font-semibold text-lg">Partly Cloudy</p>
                  <p className="text-sky-200 text-sm">H: 32° L: 21°</p>
                </div>
              </div>

              <div className="flex gap-4 mt-4 mb-5">
                <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                  <Droplets className="w-4 h-4 text-sky-200" />
                  <span className="text-white text-sm font-semibold">65%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-1.5">
                  <Wind className="w-4 h-4 text-sky-200" />
                  <span className="text-white text-sm font-semibold">12 km/h</span>
                </div>
              </div>

              {/* 4-day forecast */}
              <div className="grid grid-cols-4 gap-1 pt-4 border-t border-white/20">
                {FORECAST.map((f) => (
                  <div key={f.day} className="flex flex-col items-center gap-1 py-2 rounded-xl bg-white/10 backdrop-blur-sm">
                    <span className="text-sky-200 text-[10px] font-bold uppercase">{f.day}</span>
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
            <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">Agriculture News</h3>
                  <p className="text-primary text-sm font-medium">कृषि समाचार</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-xl font-semibold text-sm">
                View All <ArrowRight className="ml-1 w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-border/40 flex-1">
              {NEWS.map((news, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="group px-6 py-5 hover:bg-muted/40 transition-colors cursor-pointer flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-muted/60 flex items-center justify-center mt-0.5 group-hover:bg-primary/10 transition-colors">
                    <span className="text-lg font-bold text-muted-foreground/60 group-hover:text-primary transition-colors">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${news.tagColor}`}>
                        {news.tag}
                      </span>
                      <span className="text-xs text-muted-foreground">{news.date}</span>
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {news.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{news.hi}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-all group-hover:translate-x-0.5 mt-1 shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

function QuickCard({ card, delay }: { card: typeof QUICK_CARDS[0]; delay: number }) {
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
        <div
          className={`relative w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
        >
          {/* Glow ring */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm scale-110`} />
          <card.icon className={`w-8 h-8 ${card.iconColor} relative z-10`} />
        </div>

        {/* Text */}
        <h3 className={`font-bold text-xl text-foreground leading-tight group-hover:${card.accent} transition-colors`}>
          {card.title}
        </h3>
        <p className={`text-sm font-semibold ${card.accent} mb-3`}>{card.titleHi}</p>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">{card.desc}</p>

        {/* Bottom stat */}
        <div className={`mt-5 pt-4 border-t border-black/5 flex items-baseline gap-1.5`}>
          <span className={`text-2xl font-display font-bold ${card.accent}`}>{card.stat}</span>
          <span className="text-xs text-muted-foreground font-medium">{card.statLabel}</span>
        </div>
      </motion.div>
    </Link>
  );
}
