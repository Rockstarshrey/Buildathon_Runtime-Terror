import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CloudSun,
  ArrowRight,
  MessageSquare,
  Wind,
  Droplets,
  Lightbulb,
  ShoppingCart,
  Sprout,
  MapPin,
  ChevronRight,
  Flame,
  Package,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

/* ── helpers ─────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const TIPS = [
  "Water your crops early in the morning to reduce evaporation loss by up to 30%.",
  "Test your soil pH before planting — optimal range is 6.0–7.0 for most crops.",
  "Crop rotation helps prevent pests and improves soil fertility naturally.",
  "Apply organic mulch around plants to retain moisture and control weeds.",
];
const TODAY_TIP = TIPS[new Date().getDay() % TIPS.length];

/* ── Quick Actions ───────────────────────────────────────── */
const ACTIONS = [
  {
    label: "Sell Crops",
    labelHi: "फसल बेचें",
    icon: Sprout,
    href: "https://web-app-builder-shreyaspiano.replit.app",
    external: true,
    iconBg: "#E8F5E9",
    iconColor: "#2E7D32",
    border: "#A5D6A7",
  },
  {
    label: "Buy Inputs",
    labelHi: "उत्पाद खरीदें",
    icon: ShoppingCart,
    href: "https://web-app-builder-shreyaspiano.replit.app",
    external: true,
    iconBg: "#FFF9C4",
    iconColor: "#F9A825",
    border: "#FFE082",
  },
  {
    label: "Market Prices",
    labelHi: "बाज़ार भाव",
    icon: TrendingUp,
    href: "/prices",
    external: false,
    iconBg: "#E3F2FD",
    iconColor: "#1565C0",
    border: "#90CAF9",
  },
  {
    label: "Community",
    labelHi: "समुदाय",
    icon: MessageSquare,
    href: "/community",
    external: false,
    iconBg: "#F3E5F5",
    iconColor: "#6A1B9A",
    border: "#CE93D8",
  },
];

/* ── Trending Crops ──────────────────────────────────────── */
const TRENDING = [
  { crop: "Tomato", emoji: "🍅", price: "₹42/kg", change: "+12%", hot: true, status: "high" },
  { crop: "Onion",  emoji: "🧅", price: "₹28/kg", change: "+5%",  hot: true, status: "medium" },
  { crop: "Wheat",  emoji: "🌾", price: "₹22/kg", change: "-2%",  hot: false, status: "low" },
  { crop: "Potato", emoji: "🥔", price: "₹18/kg", change: "+3%",  hot: false, status: "medium" },
];

const STATUS_COLOR: Record<string, string> = {
  high:   "#2E7D32",
  medium: "#F9A825",
  low:    "#C62828",
};

/* ── Animation helpers ───────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLang();

  return (
    <div style={{ background: "#F9FBE7", minHeight: "100%" }} className="flex flex-col">
      <div className="max-w-2xl lg:max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* ── Greeting ────────────────────────────────────── */}
        <motion.div {...fadeUp(0)}>
          <p className="text-sm font-semibold" style={{ color: "#81C784" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mt-0.5" style={{ color: "#263238" }}>
            {getGreeting()}, Farmer 🌿
          </h1>
          <p className="text-sm mt-1 font-medium" style={{ color: "#546E7A" }}>
            {t("hero.subtitle")}
          </p>
        </motion.div>

        {/* ── Weather + Advisory Card ──────────────────────── */}
        <motion.div
          {...fadeUp(0.06)}
          className="rounded-3xl overflow-hidden shadow-lg"
          style={{ border: "1.5px solid #A5D6A7" }}
        >
          {/* Top: Weather strip */}
          <div
            className="relative px-5 py-4 flex items-center justify-between overflow-hidden"
            style={{ background: "linear-gradient(135deg, #2E7D32 0%, #388E3C 60%, #43A047 100%)" }}
          >
            {/* Decorative circle */}
            <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-10 bg-white pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="text-5xl font-display font-extrabold text-white leading-none drop-shadow">28°</div>
              <div>
                <p className="text-white font-semibold text-base leading-tight">Partly Cloudy</p>
                <p className="text-green-200 text-sm">Bengaluru · H 32° L 21°</p>
                <div className="flex gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-green-100 text-xs font-medium">
                    <Droplets className="w-3.5 h-3.5" /> 65%
                  </span>
                  <span className="flex items-center gap-1 text-green-100 text-xs font-medium">
                    <Wind className="w-3.5 h-3.5" /> 12 km/h
                  </span>
                </div>
              </div>
            </div>

            <CloudSun className="w-14 h-14 text-white/70" strokeWidth={1.2} />
          </div>

          {/* Bottom: Crop Advisory */}
          <div className="px-5 py-4 flex items-start gap-3" style={{ background: "#FFFFFF" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: "#E8F5E9" }}
            >
              <Sprout className="w-5 h-5" style={{ color: "#2E7D32" }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "#2E7D32" }}>
                Today's Crop Advisory
              </p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "#37474F" }}>
                Ideal day for irrigation. Avoid fertilizers before expected rain Thursday.
                Consider harvesting mature tomatoes before humidity rises.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions ────────────────────────────────── */}
        <motion.div {...fadeUp(0.1)}>
          <h2 className="text-base font-bold mb-3" style={{ color: "#263238" }}>Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {ACTIONS.map((a, i) => {
              const content = (
                <motion.div
                  whileHover={{ y: -3, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-3 rounded-2xl p-5 cursor-pointer transition-shadow duration-200"
                  style={{
                    background: "#FFFFFF",
                    border: `1.5px solid ${a.border}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: a.iconBg }}
                  >
                    <a.icon className="w-7 h-7" style={{ color: a.iconColor }} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm leading-tight" style={{ color: "#263238" }}>{a.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#78909C" }}>{a.labelHi}</p>
                  </div>
                </motion.div>
              );

              return a.external ? (
                <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <Link key={a.label} href={a.href}>
                  {content}
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* ── Daily Farming Tip ────────────────────────────── */}
        <motion.div
          {...fadeUp(0.14)}
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{
            background: "linear-gradient(135deg, #FFF9C4 0%, #FFF8E1 100%)",
            border: "1.5px solid #FFE082",
            boxShadow: "0 2px 12px rgba(251,192,45,0.12)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "#FFF176" }}
          >
            <Lightbulb className="w-5 h-5" style={{ color: "#F9A825" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#F9A825" }}>
              💡 Daily Tip
            </p>
            <p className="text-sm font-medium leading-relaxed" style={{ color: "#37474F" }}>
              {TODAY_TIP}
            </p>
          </div>
        </motion.div>

        {/* ── KisanMitra AI Banner ─────────────────────────── */}
        <motion.div
          {...fadeUp(0.17)}
          className="rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid #A5D6A7", boxShadow: "0 2px 16px rgba(46,125,50,0.10)" }}
        >
          <Link href="/ai-assistant">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-4 px-5 py-4 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "#2E7D32" }}
              >
                <span className="text-2xl">🤖</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#1B5E20" }}>Ask KisanMitra AI</p>
                <p className="text-xs mt-0.5 font-medium" style={{ color: "#388E3C" }}>
                  Get crop advice in Hindi, Kannada or English
                </p>
              </div>
              <div
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs shrink-0"
                style={{ background: "#FBC02D", color: "#1B5E20" }}
              >
                Ask Now <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* ── What's Trending Nearby ────────────────────────── */}
        <motion.div {...fadeUp(0.2)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" style={{ color: "#FBC02D" }} />
              <h2 className="text-base font-bold" style={{ color: "#263238" }}>Trending Nearby</h2>
            </div>
            <Link href="/prices">
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#2E7D32" }}>
                View all <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {TRENDING.map((item, i) => (
              <motion.div
                key={item.crop}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2, transition: { duration: 0.18 } }}
                className="rounded-2xl p-4 cursor-pointer"
                style={{
                  background: "#FFFFFF",
                  border: "1.5px solid #DCEDC8",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl leading-none">{item.emoji}</span>
                  {item.hot && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#FFF9C4", color: "#F57F17" }}
                    >
                      🔥 HOT
                    </span>
                  )}
                </div>
                <p className="font-bold text-sm" style={{ color: "#263238" }}>{item.crop}</p>
                <p className="font-extrabold text-base mt-0.5" style={{ color: STATUS_COLOR[item.status] }}>
                  {item.price}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: STATUS_COLOR[item.status] }}
                  />
                  <span className="text-xs font-semibold" style={{ color: STATUS_COLOR[item.status] }}>
                    {item.change} today
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Sell Your Crops CTA ───────────────────────────── */}
        <motion.div {...fadeUp(0.25)}>
          <a
            href="https://web-app-builder-shreyaspiano.replit.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-3xl overflow-hidden px-6 py-6 flex items-center justify-between gap-4 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)",
                boxShadow: "0 6px 24px rgba(46,125,50,0.25)",
              }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-8 right-16 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-green-200" />
                  <span className="text-green-200 text-xs font-bold uppercase tracking-wider">AgriGo Marketplace</span>
                </div>
                <h3 className="text-white text-xl font-display font-bold leading-tight">
                  Ready to sell your harvest?
                </h3>
                <p className="text-green-100/80 text-sm mt-1">
                  Connect directly with buyers across India
                </p>
              </div>

              <div
                className="relative z-10 shrink-0 flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap shadow-lg"
                style={{ background: "#FBC02D", color: "#1B5E20" }}
              >
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </a>
        </motion.div>

        {/* ── Today's News ─────────────────────────────────── */}
        <motion.div {...fadeUp(0.28)} className="pb-4">
          <h2 className="text-base font-bold mb-3" style={{ color: "#263238" }}>
            🗞️ Agriculture News
          </h2>
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#FFFFFF", border: "1.5px solid #DCEDC8", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
          >
            {[
              { titleKey: "news.item1.title", tagKey: "news.item1.tag", date: "2h", dot: "#1565C0" },
              { titleKey: "news.item2.title", tagKey: "news.item2.tag", date: "5h", dot: "#2E7D32" },
              { titleKey: "news.item3.title", tagKey: "news.item3.tag", date: "1d", dot: "#F9A825" },
            ].map((news, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="group flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-green-50/60 transition-colors"
                style={{ borderBottom: i < 2 ? "1px solid #F0F4C3" : "none" }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: news.dot }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug group-hover:text-green-800 transition-colors" style={{ color: "#263238" }}>
                    {t(news.titleKey)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#90A4AE" }}>{news.date} ago</p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: "#2E7D32" }} />
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
