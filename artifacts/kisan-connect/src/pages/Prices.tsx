import { useState, useMemo, useCallback } from "react";
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

const TREND_META: Record<Trend, { label: string; icon: React.ReactNode; color: string }> = {
  up: {
    label: "Rising ↑",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  down: {
    label: "Falling ↓",
    icon: <TrendingDown className="w-3.5 h-3.5" />,
    color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  },
  stable: {
    label: "Stable ─",
    icon: <Minus className="w-3.5 h-3.5" />,
    color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "price-high", label: "Price: High → Low" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "crop-az", label: "Crop: A → Z" },
  { value: "crop-za", label: "Crop: Z → A" },
];

export default function Prices() {
  const { data: prices, isLoading } = useGetMandiPrices();

  const [search, setSearch] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedTrends, setSelectedTrends] = useState<Set<Trend>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("price-high");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const { crops, states, globalMin, globalMax } = useMemo(() => {
    if (!prices) return { crops: [], states: [], globalMin: 0, globalMax: 5000 };
    const cropSet = new Set<string>();
    const stateSet = new Set<string>();
    let min = Infinity;
    let max = -Infinity;
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
      const searchLower = search.toLowerCase();
      if (
        search &&
        !p.crop.toLowerCase().includes(searchLower) &&
        !p.cropHindi.includes(search) &&
        !p.state.toLowerCase().includes(searchLower) &&
        !p.market.toLowerCase().includes(searchLower)
      )
        return false;
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
      if (next.has(trend)) next.delete(trend);
      else next.add(trend);
      return next;
    });
  }, []);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCrop("all");
    setSelectedState("all");
    setSelectedTrends(new Set());
    setPriceRange(null);
  };

  const hasActiveFilters =
    search || selectedCrop !== "all" || selectedState !== "all" || selectedTrends.size > 0 || priceRange !== null;

  const activeFilterTags: { key: string; label: string; onRemove: () => void }[] = [];
  if (search) activeFilterTags.push({ key: "search", label: `"${search}"`, onRemove: () => setSearch("") });
  if (selectedCrop !== "all") activeFilterTags.push({ key: "crop", label: `Crop: ${selectedCrop}`, onRemove: () => setSelectedCrop("all") });
  if (selectedState !== "all") activeFilterTags.push({ key: "state", label: `State: ${selectedState}`, onRemove: () => setSelectedState("all") });
  selectedTrends.forEach((t) =>
    activeFilterTags.push({ key: `trend-${t}`, label: TREND_META[t].label, onRemove: () => toggleTrend(t) })
  );
  if (priceRange)
    activeFilterTags.push({
      key: "price",
      label: `₹${priceRange[0]} – ₹${priceRange[1]}`,
      onRemove: () => setPriceRange(null),
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Mandi Prices</h1>
          <p className="text-primary font-medium mt-1">ताज़ा मंडी भाव</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            {filtered.length} of {prices?.length ?? 0} results
          </span>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger className="w-48 rounded-xl border-border/80 bg-white shadow-sm h-10">
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
      </div>

      {/* ── Search Bar ────────────────────────────────────── */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search crop, market, or state / फसल, मंडी या राज्य खोजें..."
          className="pl-12 pr-10 h-12 bg-white rounded-2xl border-border/80 shadow-sm text-base focus-visible:ring-primary/20 focus-visible:border-primary"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Filter Panel ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm mb-4 overflow-hidden">
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Filters / फ़िल्टर
            {hasActiveFilters && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterTags.length}
              </span>
            )}
          </span>
          {filtersOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              key="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 border-t border-border/40 space-y-5 pt-4">

                {/* Crop Filter */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Crop / फसल</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCrop("all")}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                        selectedCrop === "all"
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-foreground border-border/80 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      All / सभी
                    </button>
                    {crops.map((crop) => (
                      <button
                        key={crop}
                        onClick={() => setSelectedCrop(selectedCrop === crop ? "all" : crop)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                          selectedCrop === crop
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-foreground border-border/80 hover:border-primary/40 hover:bg-primary/5"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                  {/* Trend Filter */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Trend / रुझान</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.entries(TREND_META) as [Trend, (typeof TREND_META)[Trend]][]).map(([key, meta]) => (
                        <button
                          key={key}
                          onClick={() => toggleTrend(key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            selectedTrends.has(key)
                              ? `${meta.color} ring-2 ring-offset-1 ring-current shadow-sm`
                              : `bg-white text-muted-foreground border-border/80 hover:${meta.color}`
                          }`}
                        >
                          {meta.icon}
                          {meta.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* State Filter */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">State / राज्य</p>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="w-full rounded-xl border-border/80 bg-white h-10 text-sm">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All States / सभी राज्य</SelectItem>
                        {states.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
                      Price Range / मूल्य सीमा
                      <span className="ml-2 text-primary font-bold normal-case tracking-normal">
                        ₹{effectiveMin} – ₹{effectiveMax}
                      </span>
                    </p>
                    <div className="px-1 pt-1 pb-2">
                      <Slider
                        min={globalMin}
                        max={globalMax}
                        step={100}
                        value={[effectiveMax]}
                        onValueChange={([val]) =>
                          setPriceRange([effectiveMin, val])
                        }
                        className="mb-3"
                      />
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1">
                          <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Min ₹</label>
                          <Input
                            type="number"
                            min={globalMin}
                            max={effectiveMax}
                            step={100}
                            value={effectiveMin}
                            onChange={(e) => setPriceRange([Number(e.target.value), effectiveMax])}
                            className="h-8 text-sm rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-muted-foreground font-medium mb-1 block">Max ₹</label>
                          <Input
                            type="number"
                            min={effectiveMin}
                            max={globalMax}
                            step={100}
                            value={effectiveMax}
                            onChange={(e) => setPriceRange([effectiveMin, Number(e.target.value)])}
                            className="h-8 text-sm rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground hover:text-foreground rounded-xl text-xs">
                      <X className="w-3.5 h-3.5 mr-1.5" />
                      Clear All Filters / सभी फ़िल्टर हटाएं
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Active Filter Tags ─────────────────────────────── */}
      <AnimatePresence>
        {activeFilterTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            <span className="text-xs font-semibold text-muted-foreground self-center">Active:</span>
            {activeFilterTags.map((tag) => (
              <Badge
                key={tag.key}
                variant="outline"
                className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-primary/8 border-primary/30 text-primary font-semibold text-xs cursor-pointer hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-colors group"
                onClick={tag.onRemove}
              >
                {tag.label}
                <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </Badge>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results Table ──────────────────────────────────── */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-5 font-semibold text-sm text-foreground">Crop / फसल</th>
                  <th className="px-6 py-5 font-semibold text-sm text-foreground">Market / मंडी</th>
                  <th className="px-6 py-5 font-semibold text-sm text-foreground">Modal Price / भाव</th>
                  <th className="px-6 py-5 font-semibold text-sm text-foreground hidden sm:table-cell">Min – Max</th>
                  <th className="px-6 py-5 font-semibold text-sm text-foreground text-center">Trend / रुझान</th>
                  <th className="px-6 py-5 font-semibold text-sm text-foreground text-right hidden md:table-cell">Date / दिनांक</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Search className="w-10 h-10 opacity-30" />
                        <p className="font-semibold text-base">No prices match your filters</p>
                        <p className="text-sm">कोई परिणाम नहीं मिला</p>
                        <Button variant="outline" size="sm" onClick={clearAllFilters} className="mt-2 rounded-xl">
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filtered.map((price, i) => (
                      <motion.tr
                        key={price.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground">{price.crop}</div>
                          <div className="text-sm font-medium text-primary mt-0.5">{price.cropHindi}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            {price.market}
                          </div>
                          <div className="text-sm text-muted-foreground mt-0.5 pl-5">{price.state}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-lg text-foreground">₹{price.modalPrice.toLocaleString("en-IN")}</div>
                          <div className="text-xs text-muted-foreground">per {price.unit}</div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground font-medium">
                          ₹{price.minPrice.toLocaleString("en-IN")} – ₹{price.maxPrice.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {price.trend === "up" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                              <TrendingUp className="w-3.5 h-3.5" /> Rising
                            </span>
                          )}
                          {price.trend === "down" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                              <TrendingDown className="w-3.5 h-3.5" /> Falling
                            </span>
                          )}
                          {price.trend === "stable" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                              <Minus className="w-3.5 h-3.5" /> Stable
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right hidden md:table-cell text-sm font-medium text-muted-foreground">
                          {format(new Date(price.date), "dd MMM yyyy")}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-muted/30 border-t border-border/50 text-xs text-muted-foreground font-medium">
              Showing {filtered.length} of {prices?.length ?? 0} entries
            </div>
          )}
        </div>
      )}
    </div>
  );
}
