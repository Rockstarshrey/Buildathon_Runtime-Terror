import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { ExternalLink, ChevronRight, Loader2, Search } from "lucide-react";
import { useGetGovernmentSchemes } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/hooks/useTranslate";

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  income:         { label: "Income Support", color: "text-emerald-700", bg: "bg-emerald-100" },
  insurance:      { label: "Insurance",      color: "text-blue-700",    bg: "bg-blue-100"    },
  credit:         { label: "Credit & Loans", color: "text-violet-700",  bg: "bg-violet-100"  },
  advisory:       { label: "Advisory",       color: "text-amber-700",   bg: "bg-amber-100"   },
  infrastructure: { label: "Infrastructure", color: "text-sky-700",     bg: "bg-sky-100"     },
  market:         { label: "Market Access",  color: "text-rose-700",    bg: "bg-rose-100"    },
  pension:        { label: "Pension",        color: "text-purple-700",  bg: "bg-purple-100"  },
  machinery:      { label: "Machinery",      color: "text-orange-700",  bg: "bg-orange-100"  },
};

function catMeta(cat: string) {
  return CATEGORY_META[cat] ?? { label: cat, color: "text-primary", bg: "bg-primary/10" };
}

export default function Schemes() {
  const { t, lang } = useLang();
  const { data: schemes, isLoading } = useGetGovernmentSchemes();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const categories = schemes
    ? ["all", ...Array.from(new Set(schemes.map((s: any) => s.category)))]
    : ["all"];

  const filtered = schemes?.filter((s: any) => {
    const matchCat = activeCategory === "all" || s.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.benefit?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const schemesList = useMemo(() => schemes ?? [], [schemes]);
  const schemeNames = useMemo(() => schemesList.map((s: any) => s.name ?? ""), [schemesList]);
  const schemeDescs = useMemo(() => schemesList.map((s: any) => s.description ?? ""), [schemesList]);
  const schemeBenefits = useMemo(() => schemesList.map((s: any) => s.benefit ?? ""), [schemesList]);
  const schemeEligibility = useMemo(() => schemesList.map((s: any) => s.eligibility ?? ""), [schemesList]);

  const { translated: txNames } = useTranslate(lang === "en" ? [] : schemeNames);
  const { translated: txDescs } = useTranslate(lang === "en" ? [] : schemeDescs);
  const { translated: txBenefits } = useTranslate(lang === "en" ? [] : schemeBenefits);
  const { translated: txEligibility } = useTranslate(lang === "en" ? [] : schemeEligibility);

  function getSchemeText(idx: number, field: "name" | "description" | "benefit" | "eligibility") {
    const scheme = schemesList[idx];
    if (!scheme) return "";
    if (lang === "en") return scheme[field] ?? "";
    const maps: Record<string, string[]> = { name: txNames, description: txDescs, benefit: txBenefits, eligibility: txEligibility };
    return maps[field]?.[idx] || scheme[field] || "";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-foreground">{t("schemes.title")}</h1>
        <p className="text-muted-foreground mt-3">{t("schemes.subtitle")}</p>
        {schemes && (
          <p className="mt-2 text-sm font-semibold text-primary">
            {schemes.length} schemes — updated 2025–26
          </p>
        )}
      </div>

      {/* Search + Category Filter */}
      {!isLoading && schemes && (
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes…"
              className="pl-9 rounded-xl border-border/60"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => {
              const meta = cat === "all" ? { label: "All Schemes", color: "text-foreground", bg: "bg-gray-300" } : catMeta(cat);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                    isActive
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : `${meta.bg} ${meta.color} border-transparent hover:border-current/20`
                  }`}
                >
                  {cat === "all" ? "All Schemes" : meta.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-5 text-center">
            {filtered?.length} scheme{filtered?.length !== 1 ? "s" : ""} found
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered?.map((scheme: any, i: number) => {
                const applyLink = scheme.applyLink || "";
                const meta = catMeta(scheme.category);
                const globalIdx = schemesList.indexOf(scheme);

                return (
                  <motion.div
                    key={scheme.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="bg-white rounded-3xl p-6 border border-border/60 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                  >
                    {/* Header row */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-100 border border-primary/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform select-none">
                        {scheme.icon}
                      </div>
                      <div>
                        <span className={`text-xs font-bold tracking-wider uppercase px-2 py-1 rounded-md ${meta.bg} ${meta.color}`}>
                          {meta.label}
                        </span>
                        <h3 className="font-bold text-lg text-foreground mt-2 leading-tight">{getSchemeText(globalIdx, "name")}</h3>
                        <p className="text-sm font-medium text-muted-foreground mt-0.5">{scheme.nameHindi}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1 space-y-4 text-sm mt-2">
                      <p className="text-foreground leading-relaxed">{getSchemeText(globalIdx, "description")}</p>

                      <div className="bg-muted/50 rounded-xl p-4 space-y-3 border border-border/50">
                        <div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                            {t("schemes.benefits")}
                          </span>
                          <span className="font-semibold text-emerald-700">{getSchemeText(globalIdx, "benefit")}</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                            {t("schemes.eligibility")}
                          </span>
                          <span className="font-medium text-foreground">{getSchemeText(globalIdx, "eligibility")}</span>
                        </div>
                        {applyLink && (
                          <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                              Official Website
                            </span>
                            <a
                              href={applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary font-medium text-xs hover:underline break-all"
                            >
                              {applyLink}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t border-border flex gap-3">
                      <Button
                        onClick={() => applyLink && window.open(applyLink, "_blank", "noopener,noreferrer")}
                        disabled={!applyLink}
                        className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
                      >
                        {t("schemes.apply_now")}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => applyLink && window.open(applyLink, "_blank", "noopener,noreferrer")}
                        disabled={!applyLink}
                        className="px-4 rounded-xl border-border/80"
                        title="Open official website"
                      >
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered?.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No schemes match your search.
            </div>
          )}
        </>
      )}
    </div>
  );
}
