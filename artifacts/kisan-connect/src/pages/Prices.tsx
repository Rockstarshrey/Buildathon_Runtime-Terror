import { useState, useMemo, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  MapPin,
  Loader2,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Globe,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useGetMandiPrices } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Trend = "up" | "down" | "stable";
type SortKey = "price-high" | "price-low" | "crop-az" | "crop-za";

const CROP_EMOJI: Record<string, string> = {
  Wheat: "🌾", Rice: "🍚", Tomato: "🍅", Onion: "🧅", Potato: "🥔",
  Cotton: "🌿", Sugarcane: "🎋", Soybean: "🫘", Mustard: "🌻",
  Groundnut: "🥜", Chickpea: "🫘", Maize: "🌽", Turmeric: "🟡",
  Banana: "🍌", Apple: "🍎", Cauliflower: "🥦", Spinach: "🥬", Garlic: "🧄",
};

const TREND_META: Record<Trend, { label: string; labelHi: string; icon: React.ReactNode; rowBorder: string; badge: string; priceCls: string }> = {
  up: {
    label: "Rising", labelHi: "बढ़त",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    rowBorder: "border-l-4 border-l-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    priceCls: "text-emerald-700",
  },
  down: {
    label: "Falling", labelHi: "गिरावट",
    icon: <TrendingDown className="w-3.5 h-3.5" />,
    rowBorder: "border-l-4 border-l-rose-400",
    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    priceCls: "text-rose-600",
  },
  stable: {
    label: "Stable", labelHi: "स्थिर",
    icon: <Minus className="w-3.5 h-3.5" />,
    rowBorder: "border-l-4 border-l-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    priceCls: "text-amber-700",
  },
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price-high", label: "Price: High → Low" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "crop-az", label: "Crop: A → Z" },
  { value: "crop-za", label: "Crop: Z → A" },
];

export default function Prices() {
  const { t } = useLang();
  const { data: prices, isLoading } = useGetMandiPrices();

  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedTrends, setSelectedTrends] = useState<Set<Trend>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("price-high");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const { crops, states, globalMin, globalMax } = useMemo(() => {
    if (!prices) return { crops: [], states: [], globalMin: 0, globalMax: 10000 };
    const cropSet = new Set<string>();
    const stateSet = new Set<string>();
    let min = Infinity, max = -Infinity;
    for (const p of prices) {
      cropSet.add(p.crop);
      stateSet.add(p.state);
      if (p.modalPrice < min) min = p.modalPrice;
      if (p.modalPrice > max) max = p.modalPrice;
    }
    return {
      crops: Array.from(cropSet).sort(),
      states: Array.from(stateSet).sort(),
      globalMin: Math.floor(min / 100) * 100,
      globalMax: Math.ceil(max / 100) * 100,
    };
  }, [prices]);

  const effectiveMin = priceRange ? priceRange[0] : globalMin;
  const effectiveMax = priceRange ? priceRange[1] : globalMax;

  const filtered = useMemo(() => {
    if (!prices) return [];
    let result = prices.filter((p) => {
      const q = search.toLowerCase();
      if (q && !p.crop.toLowerCase().includes(q) && !p.cropHindi.includes(search) &&
          !p.state.toLowerCase().includes(q) && !p.market.toLowerCase().includes(q)) return false;
      if (selectedCrop !== "all" && p.crop !== selectedCrop) return false;
      if (selectedState !== "all" && p.state !== selectedState) return false;
      if (selectedTrends.size > 0 && !selectedTrends.has(p.trend as Trend)) return false;
      if (p.modalPrice < effectiveMin || p.modalPrice > effectiveMax) return false;
      return true;
    });
    result.sort((a, b) => {
      if (sortKey === "price-high") return b.modalPrice - a.modalPrice;
      if (sortKey === "price-low") return a.modalPrice - b.modalPrice;
      if (sortKey === "crop-az") return a.crop.localeCompare(b.crop);
      if (sortKey === "crop-za") return b.crop.localeCompare(a.crop);
      return 0;
    });
    return result;
  }, [prices, search, selectedCrop, selectedState, selectedTrends, effectiveMin, effectiveMax, sortKey]);

  const toggleTrend = useCallback((trend: Trend) => {
    setSelectedTrends((prev) => {
      const next = new Set(prev);
      next.has(trend) ? next.delete(trend) : next.add(trend);
      return next;
    });
  }, []);

  const clearAllFilters = () => {
    setSearch(""); setSelectedCrop("all"); setSelectedState("all");
    setSelectedTrends(new Set()); setPriceRange(null);
  };

  const hasActiveFilters = search || selectedCrop !== "all" || selectedState !== "all" || selectedTrends.size > 0 || priceRange !== null;

  const activeFilterTags: { key: string; label: string; onRemove: () => void }[] = [];
  if (search) activeFilterTags.push({ key: "search", label: `"${search}"`, onRemove: () => setSearch("") });
  if (selectedCrop !== "all") activeFilterTags.push({ key: "crop", label: selectedCrop, onRemove: () => setSelectedCrop("all") });
  if (selectedState !== "all") activeFilterTags.push({ key: "state", label: selectedState, onRemove: () => setSelectedState("all") });
  selectedTrends.forEach((t) => activeFilterTags.push({ key: `trend-${t}`, label: TREND_META[t].label, onRemove: () => toggleTrend(t) }));
  if (priceRange) activeFilterTags.push({ key: "price", label: `₹${priceRange[0]} – ₹${priceRange[1]}`, onRemove: () => setPriceRange(null) });

  const risingCount  = prices?.filter(p => p.trend === "up").length ?? 0;
  const fallingCount = prices?.filter(p => p.trend === "down").length ?? 0;
  const stableCount  = prices?.filter(p => p.trend === "stable").length ?? 0;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-green-50/40 to-amber-50/30">

      {/* ── Hero Banner ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-900 via-emerald-800 to-teal-800 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-teal-300/10 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-4 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t("prices.live_badge")}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight">
                  {t("prices.title")}
                </h1>
                <p className="text-emerald-100/70 text-sm mt-2 max-w-lg">
                  {t("prices.subtitle")}
                </p>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: BarChart3, label: `${prices?.length ?? "–"} ${t("prices.markets")}`, sub: t("prices.tracked_today"), color: "bg-white/10 text-white" },
                  { icon: Globe, label: `${states.length} States`, sub: t("prices.states_covered"), color: "bg-white/10 text-white" },
                  { icon: Activity, label: `${risingCount} Rising`, sub: t("prices.rising_today"), color: "bg-emerald-400/20 text-emerald-200" },
                ].map((s) => (
                  <div key={s.label} className={`flex items-center gap-2.5 ${s.color} backdrop-blur rounded-2xl px-4 py-2.5 border border-white/10`}>
                    <s.icon className="w-4 h-4 opacity-80" />
                    <div>
                      <p className="font-bold text-sm leading-tight">{s.label}</p>
                      <p className="text-[11px] opacity-60">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-12">

        {/* ── Trend Summary Cards ──────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { trend: "up" as Trend, count: risingCount, icon: TrendingUp, bg: "from-emerald-500 to-green-600", light: "bg-emerald-50 text-emerald-700" },
            { trend: "down" as Trend, count: fallingCount, icon: TrendingDown, bg: "from-rose-500 to-red-600", light: "bg-rose-50 text-rose-700" },
            { trend: "stable" as Trend, count: stableCount, icon: Minus, bg: "from-amber-500 to-orange-500", light: "bg-amber-50 text-amber-700" },
          ].map(({ trend, count, icon: Icon, bg, light }) => (
            <motion.button
              key={trend}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (["up","down","stable"].indexOf(trend)) }}
              onClick={() => toggleTrend(trend)}
              className={`relative overflow-hidden rounded-2xl p-4 shadow-md text-left transition-all duration-200 ${
                selectedTrends.has(trend)
                  ? `bg-gradient-to-br ${bg} text-white shadow-lg scale-[1.02]`
                  : `${light} hover:shadow-md hover:scale-[1.01]`
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-display font-bold leading-none">{count}</p>
                  <p className="text-sm font-semibold mt-1 capitalize">{TREND_META[trend].label}</p>
                  <p className="text-[11px] opacity-70">{TREND_META[trend].labelHi}</p>
                </div>
                <Icon className={`w-8 h-8 opacity-60 ${selectedTrends.has(trend) ? "text-white" : ""}`} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Search + Sort row ────────────────────────────────── */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("prices.search_placeholder")}
              className="pl-12 pr-10 h-12 bg-white rounded-2xl border-border/80 shadow-sm text-base focus-visible:ring-primary/30 focus-visible:border-primary/60 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger className="w-52 rounded-2xl border-border/80 bg-white shadow-sm h-12 shrink-0">
              <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Filter Panel ─────────────────────────────────────── */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-border/50 shadow-sm mb-4 overflow-hidden">
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
              </div>
              {t("prices.filters")}
              {hasActiveFilters && (
                <span className="bg-primary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wide">
                  {activeFilterTags.length} active
                </span>
              )}
            </span>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <span>{filtered.length} / {prices?.length ?? 0} {t("prices.results")}</span>
              {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                key="filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-border/40 space-y-5 pt-4 bg-gradient-to-br from-green-50/60 to-white">

                  {/* Crop chips with emojis */}
                  <div>
                    <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-3">{t("prices.crop")}</p>
                    <div className="flex flex-wrap gap-2">
                      <CropChip label={t("prices.all")} active={selectedCrop === "all"} onClick={() => setSelectedCrop("all")} />
                      {crops.map((crop) => (
                        <CropChip
                          key={crop}
                          label={`${CROP_EMOJI[crop] ?? "🌱"} ${crop}`}
                          active={selectedCrop === crop}
                          onClick={() => setSelectedCrop(selectedCrop === crop ? "all" : crop)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* State */}
                    <div>
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-3">{t("prices.state")}</p>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger className="w-full rounded-xl border-border/80 bg-white h-10 text-sm shadow-sm">
                          <MapPin className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                          <SelectValue placeholder={t("prices.all_states")} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="all">{t("prices.all_states")}</SelectItem>
                          {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="sm:col-span-2">
                      <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-3">
                        {t("prices.price_range")}
                        <span className="ml-2 text-primary font-bold normal-case tracking-normal text-xs">
                          ₹{effectiveMin.toLocaleString("en-IN")} – ₹{effectiveMax.toLocaleString("en-IN")}
                        </span>
                      </p>
                      <div className="px-1">
                        <Slider
                          min={globalMin} max={globalMax} step={100}
                          value={[effectiveMin, effectiveMax]}
                          onValueChange={([lo, hi]) => setPriceRange([lo, hi])}
                          className="mb-3"
                        />
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Min ₹</label>
                            <Input type="number" min={globalMin} max={effectiveMax} step={100} value={effectiveMin}
                              onChange={(e) => setPriceRange([Number(e.target.value), effectiveMax])}
                              className="h-8 text-sm rounded-lg" />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Max ₹</label>
                            <Input type="number" min={effectiveMin} max={globalMax} step={100} value={effectiveMax}
                              onChange={(e) => setPriceRange([effectiveMin, Number(e.target.value)])}
                              className="h-8 text-sm rounded-lg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs gap-1.5">
                        <X className="w-3.5 h-3.5" /> {t("prices.clear_all")}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active tags */}
        <AnimatePresence>
          {activeFilterTags.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-semibold text-muted-foreground self-center">{t("prices.active_filters")}</span>
              {activeFilterTags.map((tag) => (
                <Badge key={tag.key} onClick={tag.onRemove}
                  className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold text-xs cursor-pointer hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-colors group">
                  {tag.label}
                  <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </Badge>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Table ────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium text-sm">{t("prices.loading")}</p>
          </div>
        ) : (
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-border/60">
            {/* Inner white table card */}
            <div className="relative overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap text-foreground">#</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap text-foreground">{t("prices.col_crop")}</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap text-foreground">{t("prices.col_market")}</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap text-foreground">{t("prices.col_price")}</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap text-foreground hidden sm:table-cell">{t("prices.col_range")}</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap text-foreground text-center">{t("prices.col_trend")}</th>
                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap text-foreground text-right hidden md:table-cell">{t("prices.col_date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                              <Search className="w-7 h-7 opacity-40" />
                            </div>
                            <p className="font-bold text-base text-foreground">{t("prices.no_results")}</p>
                            <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2 rounded-xl">
                              {t("prices.clear_all")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {filtered.map((price, i) => {
                          const trend = price.trend as Trend;
                          const meta = TREND_META[trend];
                          const emoji = CROP_EMOJI[price.crop] ?? "🌱";
                          const isEven = i % 2 === 0;
                          return (
                            <motion.tr
                              key={price.id}
                              layout
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ delay: Math.min(i * 0.025, 0.4) }}
                              className={`group transition-colors duration-150 hover:bg-primary/5 ${meta.rowBorder} ${isEven ? "bg-white" : "bg-slate-50/60"}`}
                            >
                              {/* Row number */}
                              <td className="px-5 py-4">
                                <span className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                  {i + 1}
                                </span>
                              </td>
                              {/* Crop */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-2xl leading-none">{emoji}</span>
                                  <div>
                                    <div className="font-bold text-foreground leading-tight">{price.crop}</div>
                                    <div className="text-xs font-medium text-primary mt-0.5">{price.cropHindi}</div>
                                  </div>
                                </div>
                              </td>
                              {/* Market */}
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  {price.market}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5 pl-5">{price.state}</div>
                              </td>
                              {/* Modal Price */}
                              <td className="px-5 py-4">
                                <div className={`text-xl font-display font-extrabold ${meta.priceCls} leading-tight`}>
                                  ₹{price.modalPrice.toLocaleString("en-IN")}
                                </div>
                                <div className="text-[11px] text-muted-foreground">per {price.unit}</div>
                              </td>
                              {/* Range */}
                              <td className="px-5 py-4 hidden sm:table-cell">
                                <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                                  ₹{price.minPrice.toLocaleString("en-IN")}
                                  <span className="mx-1 text-border">–</span>
                                  ₹{price.maxPrice.toLocaleString("en-IN")}
                                </div>
                              </td>
                              {/* Trend badge */}
                              <td className="px-5 py-4 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${meta.badge}`}>
                                  {meta.icon}
                                  {meta.label}
                                </span>
                              </td>
                              {/* Date */}
                              <td className="px-5 py-4 text-right hidden md:table-cell">
                                <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg">
                                  {format(new Date(price.date), "dd MMM yyyy")}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table footer */}
              {filtered.length > 0 && (
                <div className="px-5 py-3 bg-gradient-to-r from-muted/40 to-muted/20 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Showing <span className="text-foreground font-bold">{filtered.length}</span> of{" "}
                    <span className="text-foreground font-bold">{prices?.length ?? 0}</span> entries
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {(["up","down","stable"] as Trend[]).map((t) => (
                      <span key={t} className={`inline-flex items-center gap-1 font-semibold ${TREND_META[t].badge} px-2.5 py-1 rounded-full`}>
                        {TREND_META[t].icon}
                        {filtered.filter(p => p.trend === t).length} {TREND_META[t].label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 bg-muted/30 border-t border-border/40 flex items-center justify-between text-muted-foreground text-xs">
              <span>Source: Agmarknet / eNAM · Prices in ₹ per quintal</span>
              <span>Updated: {format(new Date(), "dd MMM yyyy")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CropChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
          : "bg-white text-foreground border-border/70 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}
