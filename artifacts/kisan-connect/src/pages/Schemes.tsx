import { motion } from "framer-motion";
import { 
  ExternalLink,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useGetGovernmentSchemes } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function Schemes() {
  const { data: schemes, isLoading } = useGetGovernmentSchemes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-foreground">Government Schemes</h1>
        <p className="text-xl text-primary font-medium mt-2 mb-4">सरकारी योजनाएं</p>
        <p className="text-muted-foreground">Discover financial support, insurance, and resources provided by the government to help you grow your farming business.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes?.map((scheme, i) => {
            const applyLink = (scheme as any).applyLink || "";

            const openLink = () => {
              if (applyLink) window.open(applyLink, "_blank", "noopener,noreferrer");
            };

            return (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-border/60 shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-100 border border-primary/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform select-none">
                    {scheme.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-2 py-1 rounded-md">{scheme.category}</span>
                    <h3 className="font-bold text-lg text-foreground mt-2 leading-tight">{scheme.name}</h3>
                    <p className="text-sm font-medium text-muted-foreground mt-0.5">{scheme.nameHindi}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4 text-sm mt-2">
                  <p className="text-foreground leading-relaxed">
                    {scheme.description}
                  </p>
                  
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3 border border-border/50">
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Benefits (लाभ)</span>
                      <span className="font-semibold text-emerald-700">{scheme.benefit}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Eligibility (पात्रता)</span>
                      <span className="font-medium text-foreground">{scheme.eligibility}</span>
                    </div>
                    {applyLink && (
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Official Website</span>
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

                <div className="mt-6 pt-6 border-t border-border flex gap-3">
                  <Button
                    onClick={openLink}
                    disabled={!applyLink}
                    className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold"
                  >
                    Apply Now / आवेदन करें
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={openLink}
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
        </div>
      )}
    </div>
  );
}
