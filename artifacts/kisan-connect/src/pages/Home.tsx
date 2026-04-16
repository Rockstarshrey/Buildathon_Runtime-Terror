import { Link } from "wouter";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import {
  Wind,
  Droplets,
  Lightbulb,
  ShoppingCart,
  Sprout,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
  ArrowRight,
  Bell,
  CloudSun,
} from "lucide-react";
import { useLang } from "@/lib/i18n";

/* ─── helpers ────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/* ─── Data ───────────────────────────────────────────────── */
const ACTIONS = [
  {
    label: "Sell Crops",
    icon: "🌾",
    href: "https://web-app-builder-shreyaspiano.replit.app",
    external: true,
    grad: "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
    iconBg: "#2E7D32",
    shadow: "rgba(46,125,50,0.18)",
  },
  {
    label: "Buy Products",
    icon: "🛒",
    href: "https://web-app-builder-shreyaspiano.replit.app",
    external: true,
    grad: "linear-gradient(135deg,#FFF9C4,#FFF176)",
    iconBg: "#F9A825",
    shadow: "rgba(249,168,37,0.18)",
  },
  {
    label: "Market Prices",
    icon: "📊",
    href: "/prices",
    external: false,
    grad: "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
    iconBg: "#1565C0",
    shadow: "rgba(21,101,192,0.18)",
  },
  {
    label: "Community",
    icon: "🤝",
    href: "/community",
    external: false,
    grad: "linear-gradient(135deg,#F3E5F5,#E1BEE7)",
    iconBg: "#6A1B9A",
    shadow: "rgba(106,27,154,0.18)",
  },
];

const HOT_CROPS = [
  {
    name: "Tomato",
    nameHi: "टमाटर",
    price: "₹42/kg",
    change: "+12%",
    trend: "up",
    img: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=300&auto=format&fit=crop",
  },
  {
    name: "Onion",
    nameHi: "प्याज़",
    price: "₹28/kg",
    change: "+5%",
    trend: "up",
    img: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&auto=format&fit=crop",
  },
  {
    name: "Potato",
    nameHi: "आलू",
    price: "₹18/kg",
    change: "+3%",
    trend: "up",
    img: "https://images.unsplash.com/photo-1518977676405-d674f104c8f5?w=300&auto=format&fit=crop",
  },
  {
    name: "Wheat",
    nameHi: "गेहूँ",
    price: "₹22/kg",
    change: "-2%",
    trend: "down",
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop",
  },
  {
    name: "Maize",
    nameHi: "मक्का",
    price: "₹19/kg",
    change: "+6%",
    trend: "up",
    img: "https://images.unsplash.com/photo-1601593768799-76e0fc0efba6?w=300&auto=format&fit=crop",
  },
];

const TIPS = [
  "Water crops early morning — saves 30% water from evaporation.",
  "Test soil pH before planting. Ideal range: 6.0–7.0.",
  "Crop rotation prevents pests & improves soil fertility.",
  "Apply mulch around plants to retain moisture and suppress weeds.",
  "Use neem-based pesticides for safer, chemical-free pest control.",
  "Store seeds in cool, dry place to maintain 90%+ germination rate.",
  "Intercropping with legumes boosts soil nitrogen naturally.",
];
const TODAY_TIP = TIPS[new Date().getDay() % TIPS.length];

/* ─── Animated Sun ───────────────────────────────────────── */
function AnimatedWeatherIcon() {
  const controls = useAnimationControls();
  useEffect(() => {
    controls.start({
      rotate: [0, 15, -10, 8, 0],
      scale: [1, 1.08, 0.97, 1.04, 1],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
    });
  }, [controls]);
  return (
    <motion.div animate={controls}>
      <CloudSun className="w-16 h-16 text-white/80" strokeWidth={1.1} />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════ */
export default function Home() {
  const { t } = useLang();

  return (
    <div style={{ background: "#F9FBE7", minHeight: "100%" }} className="flex flex-col overflow-x-hidden">

      {/* ══ CURVED GRADIENT HEADER ══════════════════════════ */}
      <div
        className="relative pt-5 pb-10 px-5"
        style={{
          background: "linear-gradient(160deg, #1A5C20 0%, #2E7D32 45%, #43A047 100%)",
          borderRadius: "0 0 40px 40px",
          boxShadow: "0 12px 40px rgba(27,94,32,0.30)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-black/5 pointer-events-none" />

        {/* Top row: avatar + greeting + bell */}
        <div className="relative z-10 flex items-center justify-between mb-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
              style={{
                background: "linear-gradient(135deg,#A5D6A7,#66BB6A)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              👨‍🌾
            </div>
            <div>
              <p className="text-green-200 text-xs font-semibold">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
              </p>
              <h1 className="text-white text-xl font-display font-bold leading-tight">
                {getGreeting()}, Farmer 🌿
              </h1>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            <Bell className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* ── Weather Card (glassmorphism) ────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 rounded-3xl p-5 max-w-7xl mx-auto overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Left: temperature */}
            <div>
              <p className="text-green-100/80 text-xs font-semibold mb-1 flex items-center gap-1">
                📍 Bengaluru, Karnataka
              </p>
              <div className="flex items-end gap-3">
                <span className="text-6xl font-display font-extrabold text-white leading-none drop-shadow">28°</span>
                <div className="pb-1">
                  <p className="text-white font-bold text-base">Partly Cloudy</p>
                  <p className="text-green-100/70 text-sm">H 32° · L 21°</p>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold bg-white/10 rounded-xl px-3 py-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-200" /> 65%
                </span>
                <span className="flex items-center gap-1.5 text-white/80 text-xs font-semibold bg-white/10 rounded-xl px-3 py-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-200" /> 12 km/h
                </span>
              </div>
            </div>
            {/* Right: animated icon */}
            <AnimatedWeatherIcon />
          </div>

          {/* Advisory strip */}
          <div
            className="mt-4 rounded-2xl px-4 py-3 flex items-start gap-3"
            style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Sprout className="w-4 h-4 text-green-200 shrink-0 mt-0.5" />
            <p className="text-white/90 text-xs font-medium leading-relaxed">
              <span className="text-green-200 font-bold">Crop Advisory: </span>
              Ideal for irrigation today. Avoid fertilizers — rain expected Thursday.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ══ PAGE BODY ════════════════════════════════════════ */}
      <div className="flex flex-col gap-7 px-4 sm:px-6 pt-7 pb-8 max-w-7xl mx-auto w-full">

        {/* ── Quick Actions ─────────────────────────────── */}
        <section>
          <SectionHeader title="Quick Actions" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTIONS.map((a, i) => {
              const card = (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, transition: { duration: 0.18 } }}
                  whileTap={{ scale: 0.96 }}
                  className="flex flex-col items-center gap-3 rounded-3xl p-5 cursor-pointer"
                  style={{
                    background: a.grad,
                    boxShadow: `0 6px 24px ${a.shadow}, 0 1px 4px rgba(0,0,0,0.06)`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                    style={{
                      background: a.iconBg,
                      boxShadow: `0 4px 16px ${a.shadow}`,
                    }}
                  >
                    {a.icon}
                  </div>
                  <p className="font-bold text-sm text-center leading-tight" style={{ color: "#263238" }}>
                    {a.label}
                  </p>
                </motion.div>
              );
              return a.external
                ? <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer">{card}</a>
                : <Link key={a.label} href={a.href}>{card}</Link>;
            })}
          </div>
        </section>

        {/* ── High Demand Crops (horizontal scroll) ─────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "#FBC02D" }}>
                🔥 High Demand
              </p>
              <h2 className="text-lg font-display font-bold" style={{ color: "#1B5E20" }}>
                Today's Hot Crops
              </h2>
            </div>
            <Link href="/prices">
              <span className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: "#E8F5E9", color: "#2E7D32" }}>
                View all <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {HOT_CROPS.map((crop, i) => (
              <motion.div
                key={crop.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  width: "160px",
                  background: "#FFFFFF",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {/* Image */}
                <div className="relative h-28 overflow-hidden">
                  <img
                    src={crop.img}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Trend badge */}
                  <div
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: crop.trend === "up" ? "#E8F5E9" : "#FFEBEE",
                      color: crop.trend === "up" ? "#2E7D32" : "#C62828",
                    }}
                  >
                    {crop.trend === "up"
                      ? <TrendingUp className="w-3 h-3" />
                      : <TrendingDown className="w-3 h-3" />}
                    {crop.change}
                  </div>
                </div>
                {/* Info */}
                <div className="px-3 py-3">
                  <p className="font-bold text-sm" style={{ color: "#263238" }}>{crop.name}</p>
                  <p className="text-[11px] font-medium mb-1" style={{ color: "#78909C" }}>{crop.nameHi}</p>
                  <p
                    className="font-extrabold text-base"
                    style={{ color: crop.trend === "up" ? "#2E7D32" : "#C62828" }}
                  >
                    {crop.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Daily Tip ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
        >
          <div
            className="rounded-3xl px-5 py-4 flex items-start gap-4"
            style={{
              background: "linear-gradient(135deg,#FFF9C4 0%,#FFFDE7 100%)",
              border: "1.5px solid #FFE082",
              boxShadow: "0 6px 20px rgba(251,192,45,0.15)",
            }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "#FFF176", boxShadow: "0 4px 12px rgba(249,168,37,0.2)" }}
            >
              <Lightbulb className="w-5 h-5" style={{ color: "#F9A825" }} />
            </motion.div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: "#F57F17" }}>
                💡 Daily Farming Tip
              </p>
              <p className="text-sm font-semibold leading-relaxed" style={{ color: "#37474F" }}>
                {TODAY_TIP}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── KisanMitra AI ─────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.5 }}
        >
          <Link href="/ai-assistant">
            <motion.div
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-3xl overflow-hidden p-5 flex items-center gap-4 cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#1A5C20 0%,#2E7D32 50%,#43A047 100%)",
                boxShadow: "0 10px 36px rgba(27,94,32,0.28)",
              }}
            >
              {/* Decorative */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute bottom-0 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

              <div
                className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                🤖
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-white text-base">KisanMitra AI</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#A5D6A7" }}
                  >
                    LIVE
                  </span>
                </div>
                <p className="text-green-100/80 text-xs font-medium">
                  Ask in Hindi, Kannada or English
                </p>
                <div className="flex gap-2 mt-2">
                  {["Hindi", "Kannada", "English"].map(l => (
                    <span key={l} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="relative z-10 flex items-center gap-1 px-4 py-2.5 rounded-2xl font-bold text-sm shrink-0"
                style={{ background: "#FBC02D", color: "#1B5E20", boxShadow: "0 4px 12px rgba(251,192,45,0.3)" }}
              >
                Ask <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </Link>
        </motion.section>

        {/* ── Market Snapshot ───────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-bold" style={{ color: "#1B5E20" }}>
              📈 Market Snapshot
            </h2>
            <Link href="/prices">
              <span className="text-xs font-bold flex items-center gap-1" style={{ color: "#2E7D32" }}>
                Full prices <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
              border: "1px solid #DCEDC8",
            }}
          >
            {[
              { crop: "🌾 Wheat",  price: "₹2,200/q", change: "-2%", trend: "down" as const },
              { crop: "🍅 Tomato", price: "₹4,200/q", change: "+12%", trend: "up" as const },
              { crop: "🧅 Onion",  price: "₹2,800/q", change: "+5%",  trend: "up" as const },
              { crop: "🥔 Potato", price: "₹1,800/q", change: "+3%",  trend: "stable" as const },
            ].map((row, i, arr) => (
              <div
                key={row.crop}
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid #F1F8E9" : "none" }}
              >
                <p className="font-semibold text-sm" style={{ color: "#263238" }}>{row.crop}</p>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-sm" style={{ color: "#263238" }}>{row.price}</p>
                  <div
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: row.trend === "up" ? "#E8F5E9" : row.trend === "down" ? "#FFEBEE" : "#FFF9C4",
                      color: row.trend === "up" ? "#2E7D32" : row.trend === "down" ? "#C62828" : "#F57F17",
                    }}
                  >
                    {row.trend === "up" && <TrendingUp className="w-3 h-3" />}
                    {row.trend === "down" && <TrendingDown className="w-3 h-3" />}
                    {row.trend === "stable" && <Minus className="w-3 h-3" />}
                    {row.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sell Your Harvest CTA ─────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
        >
          <a href="https://web-app-builder-shreyaspiano.replit.app" target="_blank" rel="noopener noreferrer">
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-3xl overflow-hidden px-6 py-6 flex items-center justify-between gap-4 cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#F57F17 0%,#FBC02D 60%,#FFD54F 100%)",
                boxShadow: "0 10px 36px rgba(251,192,45,0.35)",
              }}
            >
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute bottom-0 left-32 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10">
                <p className="text-amber-900/70 text-xs font-bold uppercase tracking-wider mb-1">AgriGo Marketplace</p>
                <h3 className="text-amber-950 text-xl font-display font-extrabold leading-tight">
                  Ready to sell<br />your harvest? 🌾
                </h3>
                <p className="text-amber-800/80 text-xs mt-1 font-medium">Connect with buyers across India</p>
              </div>
              <div
                className="relative z-10 shrink-0 flex items-center gap-1.5 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap"
                style={{
                  background: "#1B5E20",
                  color: "#FFFFFF",
                  boxShadow: "0 4px 16px rgba(27,94,32,0.3)",
                }}
              >
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </a>
        </motion.section>

        {/* ── News ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="pb-2"
        >
          <h2 className="text-lg font-display font-bold mb-3" style={{ color: "#1B5E20" }}>
            🗞️ Agriculture News
          </h2>
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 6px 24px rgba(0,0,0,0.07)",
              border: "1px solid #DCEDC8",
            }}
          >
            {[
              { titleKey: "news.item1.title", tagKey: "news.item1.tag", date: "2h", dot: "#1565C0" },
              { titleKey: "news.item2.title", tagKey: "news.item2.tag", date: "5h", dot: "#2E7D32" },
              { titleKey: "news.item3.title", tagKey: "news.item3.tag", date: "1d", dot: "#F9A825" },
            ].map((news, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className="group flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-green-50/50 transition-colors"
                style={{ borderBottom: i < 2 ? "1px solid #F1F8E9" : "none" }}
              >
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: news.dot }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug group-hover:text-green-800 transition-colors" style={{ color: "#263238" }}>
                    {t(news.titleKey)}
                  </p>
                  <p className="text-xs mt-0.5 font-medium" style={{ color: "#90A4AE" }}>{news.date} ago</p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-25 group-hover:opacity-60 transition-opacity" style={{ color: "#2E7D32" }} />
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-display font-bold mb-3" style={{ color: "#1B5E20" }}>
      {title}
    </h2>
  );
}
