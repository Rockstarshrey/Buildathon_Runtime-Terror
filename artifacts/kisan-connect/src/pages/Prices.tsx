import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  MapPin,
  Loader2
} from "lucide-react";
import { useGetMandiPrices } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";

export default function Prices() {
  const { data: prices, isLoading } = useGetMandiPrices();
  const [search, setSearch] = useState("");

  const filteredPrices = prices?.filter(p => 
    p.crop.toLowerCase().includes(search.toLowerCase()) || 
    p.cropHindi.includes(search) ||
    p.state.toLowerCase().includes(search.toLowerCase()) ||
    p.market.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Mandi Prices</h1>
          <p className="text-primary font-medium mt-1">ताज़ा मंडी भाव</p>
        </div>
        
        <div className="relative w-full lg:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop or state / फसल या राज्य खोजें..." 
            className="pl-12 h-14 bg-white rounded-2xl border-border/80 shadow-sm text-base focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
      </div>

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
                  <th className="px-6 py-5 font-semibold text-sm text-foreground hidden sm:table-cell">Min - Max</th>
                  <th className="px-6 py-5 font-semibold text-sm text-foreground text-center">Trend / रुझान</th>
                  <th className="px-6 py-5 font-semibold text-sm text-foreground text-right hidden md:table-cell">Date / दिनांक</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredPrices?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No prices found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredPrices?.map((price, i) => (
                    <motion.tr 
                      key={price.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{price.crop}</div>
                        <div className="text-sm font-medium text-primary mt-0.5">{price.cropHindi}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                          {price.market}
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5 pl-5">{price.state}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg text-foreground">₹{price.modalPrice}</div>
                        <div className="text-xs text-muted-foreground">per {price.unit}</div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground font-medium">
                        ₹{price.minPrice} - ₹{price.maxPrice}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex justify-center items-center w-10 h-10 rounded-full bg-white border shadow-sm">
                          {price.trend === "up" && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                          {price.trend === "down" && <TrendingDown className="w-5 h-5 text-rose-500" />}
                          {price.trend === "stable" && <Minus className="w-5 h-5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right hidden md:table-cell text-sm font-medium text-muted-foreground">
                        {format(new Date(price.date), "dd MMM yyyy")}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
