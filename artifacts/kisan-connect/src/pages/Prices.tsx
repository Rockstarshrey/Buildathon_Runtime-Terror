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
  ChevronDown,
  ChevronUp,
  Activity,
  Phone,
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

const CROP_IMAGE: Record<string, string> = {
  Wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop",
  Rice: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop",
  Tomato: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=400&auto=format&fit=crop",
  Onion: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&auto=format&fit=crop",
  Potato: "https://images.unsplash.com/photo-1518977676405-d674f104c8f5?w=400&auto=format&fit=crop",
  Cotton: "https://images.unsplash.com/photo-1569498455476-e4cca86ae57c?w=400&auto=format&fit=crop",
  Sugarcane: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400&auto=format&fit=crop",
  Maize: "https://images.unsplash.com/photo-1601593768799-76e0fc0efba6?w=400&auto=format&fit=crop",
  Banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop",
  Apple: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400&auto=format&fit=crop",
  Spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop",
  Garlic: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=400&auto=format&fit=crop",
};

const TREND_META: Record<Trend, { label: string; icon: React.ReactNode; badge: string; priceCls: string; dot: string }> = {
  up: {
    label: "Rising",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    priceCls: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  down: {
    label: "Falling",
    icon: <TrendingDown className="w-3.5 h-3.5" />,
    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    priceCls: "text-rose-600",
    dot: "bg-rose-500",
  },
  stable: {
    label: "Stable",
    icon: <Minus className="w-3.5 h-3.5" />,
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    priceCls: "text-amber-700",
    dot: "bg-amber-500",
  },
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price-high", label: "Price: High → Low" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "crop-az", label: "Crop: A → Z" },
  { value: "crop-za", label: "Crop: Z → A" },
];

function CropChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-primary text-white border-primary shadow-sm shadow-primary/30"
          : "bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

export default function Prices() {
  const { t } = useLang();
  const { data: prices, isLoading, refetch } = useGetMandiPrices();

  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("price-high");
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      if (selectedTrend !== null && p.trend !== selectedTrend) return false;
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
  }, [prices, search, selectedCrop, selectedState, selectedTrend, effectiveMin, effectiveMax, sortKey]);

  const toggleTrend = useCallback((trend: Trend) => {
    setSelectedTrend((prev) => (prev === trend ? null : trend));
  }, []);

  const clearAllFilters = () => {
    setSearch(""); setSelectedCrop("all"); setSelectedState("all");
    setSelectedTrend(null); setPriceRange(null);
  };

  const hasActiveFilters = search || selectedCrop !== "all" || selectedState !== "all" || selectedTrend !== null || priceRange !== null;

  const activeFilterTags: { key: string; label: string; onRemove: () => void }[] = [];
  if (search) activeFilterTags.push({ key: "search", label: `"${search}"`, onRemove: () => setSearch("") });
  if (selectedCrop !== "all") activeFilterTags.push({ key: "crop", label: selectedCrop, onRemove: () => setSelectedCrop("all") });
  if (selectedState !== "all") activeFilterTags.push({ key: "state", label: selectedState, onRemove: () => setSelectedState("all") });
  if (selectedTrend !== null) activeFilterTags.push({ key: `trend-${selectedTrend}`, label: TREND_META[selectedTrend].label, onRemove: () => setSelectedTrend(null) });
  if (priceRange) activeFilterTags.push({ key: "price", label: `₹${priceRange[0]} – ₹${priceRange[1]}`, onRemove: () => setPriceRange(null) });

  const risingCount  = prices?.filter(p => p.trend === "up").length ?? 0;
  const fallingCount = prices?.filter(p => p.trend === "down").length ?? 0;
  const stableCount  = prices?.filter(p => p.trend === "stable").length ?? 0;

  return (
    <div className="min-h-full">

      {/* ── Header ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#43A047] pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t("prices.live_badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">{t("prices.title")}</h1>
            <p className="text-emerald-100/70 text-sm mt-1 mb-6 max-w-lg">{t("prices.subtitle")}</p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("prices.search_placeholder")}
                className="pl-12 pr-10 h-14 bg-white rounded-2xl border-0 shadow-lg text-base focus-visible:ring-primary/30 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-8">

        {/* ── Trend Summary Pills ──────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { trend: "up" as Trend, count: risingCount, icon: TrendingUp, bg: "from-emerald-500 to-green-600", light: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { trend: "down" as Trend, count: fallingCount, icon: TrendingDown, bg: "from-rose-500 to-red-600", light: "bg-rose-50 text-rose-700 border-rose-200" },
            { trend: "stable" as Trend, count: stableCount, icon: Minus, bg: "from-amber-500 to-orange-500", light: "bg-amber-50 text-amber-700 border-amber-200" },
          ].map(({ trend, count, icon: Icon, bg, light }) => (
            <motion.button
              key={trend}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (["up","down","stable"].indexOf(trend)) }}
              onClick={() => toggleTrend(trend)}
              className={`relative overflow-hidden rounded-2xl p-4 border text-left transition-all duration-200 shadow-sm ${
                selectedTrend === trend
                  ? `bg-gradient-to-br ${bg} text-white border-transparent shadow-md scale-[1.02]`
                  : `${light} hover:shadow-md hover:scale-[1.01]`
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-display font-bold leading-none">{count}</p>
                  <p className="text-sm font-semibold mt-1 capitalize">{TREND_META[trend].label}</p>
                </div>
                <Icon className={`w-7 h-7 opacity-60`} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Sort + Filter bar ───────────────────────────── */}
        <div className="flex gap-3 mb-4">
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger className="flex-1 rounded-2xl border-border/80 bg-white shadow-sm h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={() => setFiltersOpen(v => !v)}
            className={`flex items-center gap-2 px-4 h-12 rounded-2xl border font-semibold text-sm shadow-sm transition-all duration-200 ${
              hasActiveFilters ? "bg-primary text-white border-primary" : "bg-white text-foreground border-border hover:border-primary/50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-primary text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterTags.length}
              </span>
            )}
            {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={() => refetch()}
            className="w-12 h-12 rounded-2xl border border-border bg-white shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* ── Filter Panel ────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              key="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-5 space-y-5">
                {/* Crop chips */}
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

        {/* Active filter tags */}
        <AnimatePresence>
          {activeFilterTags.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="flex flex-wrap gap-2 mb-4">
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

        {/* Result count */}
        <p className="text-sm text-muted-foreground font-medium mb-4">
          Showing <span className="font-bold text-foreground">{filtered.length}</span> of {prices?.length ?? 0} listings
        </p>

        {/* ── Cards Grid ──────────────────────────────────── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">{t("prices.loading")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="w-7 h-7 opacity-40" />
            </div>
            <p className="font-bold text-base text-foreground">{t("prices.no_results")}</p>
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="rounded-2xl">
              {t("prices.clear_all")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((price, i) => {
                const trend = price.trend as Trend;
                const meta = TREND_META[trend];
                const emoji = CROP_EMOJI[price.crop] ?? "🌱";
                const image = CROP_IMAGE[price.crop];
                const dateStr = price.reportedDate
                  ? format(new Date(price.reportedDate), "d MMM")
                  : "";

                return (
                  <motion.div
                    key={price.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="bg-white rounded-3xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-black/8 transition-shadow duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Crop Image */}
                    <div className="relative h-36 bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={price.crop}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">{emoji}</span>
                        </div>
                      )}
                      {/* Trend badge */}
                      <div className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${meta.badge}`}>
                        {meta.icon}
                        {meta.label}
                      </div>
                      {/* Date */}
                      {dateStr && (
                        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {dateStr}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Crop Name */}
                      <div className="mb-3">
                        <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                          {emoji} {price.crop}
                        </h3>
                        <p className="text-muted-foreground text-sm font-medium">{price.cropHindi}</p>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <div className={`text-3xl font-display font-bold ${meta.priceCls} leading-none`}>
                          ₹{price.modalPrice.toLocaleString("en-IN")}
                        </div>
                        <p className="text-muted-foreground text-xs mt-0.5">per quintal · Modal price</p>
                        <p className="text-muted-foreground text-xs">
                          Min ₹{price.minPrice.toLocaleString("en-IN")} · Max ₹{price.maxPrice.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                        <MapPin className="w-4 h-4 shrink-0 text-primary" />
                        <span className="font-medium truncate">{price.market}, {price.state}</span>
                      </div>

                      {/* Contact Button */}
                      <button className="mt-auto w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-semibold text-sm h-11 rounded-2xl shadow-sm shadow-primary/30 transition-all duration-200">
                        <Phone className="w-4 h-4" />
                        Contact Seller
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
