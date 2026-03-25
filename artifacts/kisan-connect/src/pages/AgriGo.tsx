import { motion } from "framer-motion";
import { Tractor, Sprout, Package, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function AgriGo() {
  return (
    <div className="flex-1 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 py-20 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-5 py-2 text-white/90 text-sm font-semibold mb-6">
            <Tractor className="w-4 h-4" />
            AgriGo · एग्रीगो
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            Farm to Market,<br />
            <span className="text-lime-300">Simplified.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            Connect directly with buyers, book transport, and track your produce — all in one place.
            <br />
            <span className="text-white/60 text-base">खरीदारों से सीधे जुड़ें, ट्रांसपोर्ट बुक करें और अपनी उपज ट्रैक करें।</span>
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-4 justify-center">
            <button className="flex items-center gap-2 px-7 py-3.5 bg-lime-400 hover:bg-lime-300 text-green-900 font-bold rounded-2xl shadow-lg shadow-lime-900/30 transition-all duration-200">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-2xl border border-white/25 transition-all duration-200">
              Learn More
            </button>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <motion.p {...fadeUp(0)} className="text-center text-xs font-bold uppercase tracking-widest text-primary mb-3">Coming Soon</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="text-center text-2xl sm:text-3xl font-black text-foreground mb-12">
          Everything a farmer needs to sell smarter
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Package, title: "Direct Buyer Connect", titleHi: "सीधे खरीदार से जुड़ें", desc: "Skip the middlemen. Sell directly to wholesalers, retailers, and exporters.", color: "from-emerald-500 to-green-600", bg: "bg-emerald-50", iconBg: "bg-emerald-100 text-emerald-700" },
            { icon: Tractor, title: "Transport Booking", titleHi: "वाहन बुकिंग", desc: "Book trucks and mini-vehicles to transport your harvest to the nearest mandi.", color: "from-lime-500 to-green-500", bg: "bg-lime-50", iconBg: "bg-lime-100 text-lime-700" },
            { icon: Sprout, title: "Crop Listings", titleHi: "फसल लिस्टिंग", desc: "List your produce with photos, quantity, and price for buyers across India.", color: "from-teal-500 to-emerald-600", bg: "bg-teal-50", iconBg: "bg-teal-100 text-teal-700" },
          ].map((f, i) => (
            <motion.div key={f.title} {...fadeUp(0.1 + i * 0.1)}
              className={`${f.bg} rounded-3xl p-6 border border-white shadow-sm`}>
              <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-primary font-semibold mb-2">{f.titleHi}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp(0.4)} className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl border border-border px-6 py-4 shadow-sm">
            <span className="text-2xl">🚀</span>
            <div className="text-left">
              <p className="font-bold text-foreground text-sm">AgriGo is launching soon</p>
              <p className="text-xs text-muted-foreground">We're building something great for Indian farmers.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
