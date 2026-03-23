import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Sprout, 
  CloudSun, 
  ArrowRight, 
  MessageSquare,
  ShieldCheck,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-farm.png`}
            alt="Lush green farm" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-green-900/70 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-white mb-6">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-semibold tracking-wide">Empowering Farmers • किसानों का सशक्तिकरण</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              Smart farming,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-100">
                better futures.
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-green-50 mb-8 font-medium max-w-xl drop-shadow">
              Get live mandi prices, connect with fellow farmers, and receive AI-driven crop advice in your language.
              <br/><span className="opacity-80 text-base mt-2 block">लाइव मंडी भाव प्राप्त करें, साथी किसानों से जुड़ें, और अपनी भाषा में फसल सलाह प्राप्त करें।</span>
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="rounded-xl bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 text-white shadow-lg shadow-primary/30 border-0 h-14 px-8 text-lg group">
                <Link href="/prices">
                  Check Prices / भाव देखें
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 h-14 px-8 text-lg border-2">
                <Link href="/ai-assistant">
                  Ask AI / एआई से पूछें
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickCard 
              href="/prices"
              icon={TrendingUp}
              title="Mandi Prices"
              titleHi="मंडी भाव"
              desc="Live crop rates across states"
              color="bg-amber-50 text-amber-600"
              delay={0.1}
            />
            <QuickCard 
              href="/schemes"
              icon={ShieldCheck}
              title="Govt Schemes"
              titleHi="सरकारी योजनाएं"
              desc="Subsidies and insurance"
              color="bg-blue-50 text-blue-600"
              delay={0.2}
            />
            <QuickCard 
              href="/community"
              icon={MessageSquare}
              title="Community"
              titleHi="किसान समुदाय"
              desc="Connect with local farmers"
              color="bg-purple-50 text-purple-600"
              delay={0.3}
            />
            <QuickCard 
              href="/sms-mode"
              icon={Smartphone}
              title="Basic Mode"
              titleHi="एसएमएस मोड"
              desc="Fast, low-data text interface"
              color="bg-slate-100 text-slate-700"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Info Widgets */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Weather Widget Placeholder */}
        <div className="col-span-1 lg:col-span-1 bg-white rounded-3xl p-6 shadow-xl shadow-primary/5 border border-border/60">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Local Weather</h3>
              <p className="text-sm text-muted-foreground font-medium">स्थानीय मौसम</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center">
              <CloudSun className="w-6 h-6 text-sky-500" />
            </div>
          </div>
          
          <div className="flex items-end gap-4 mb-6">
            <span className="text-5xl font-display font-bold text-foreground">28°</span>
            <div className="pb-1 text-muted-foreground font-medium">
              <p>Partly Cloudy</p>
              <p className="text-sm">H: 32° L: 21°</p>
            </div>
          </div>
          
          <div className="space-y-3 pt-6 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Humidity (नमी)</span>
              <span className="font-semibold">65%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wind (हवा)</span>
              <span className="font-semibold">12 km/h</span>
            </div>
          </div>
        </div>

        {/* Latest News */}
        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50/30 rounded-3xl p-6 shadow-xl shadow-primary/5 border border-primary/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Agriculture News</h3>
              <p className="text-sm text-primary font-medium">कृषि समाचार</p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {[
              { title: "Monsoon expected to arrive early in Central India", hi: "मध्य भारत में मानसून जल्दी आने की संभावना", date: "2 hours ago" },
              { title: "New MSP announced for Rabi crops 2024-25", hi: "रबी फसलों 2024-25 के लिए नया एमएसपी घोषित", date: "5 hours ago" },
              { title: "Govt increases subsidy on organic fertilizers by 15%", hi: "सरकार ने जैविक खाद पर सब्सिडी 15% बढ़ाई", date: "1 day ago" }
            ].map((news, i) => (
              <div key={i} className="group p-4 rounded-2xl bg-white/60 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-primary/20 shadow-sm">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{news.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{news.hi}</p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-white px-2 py-1 rounded-md">{news.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickCard({ href, icon: Icon, title, titleHi, desc, color, delay }: any) {
  return (
    <Link href={href}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="group h-full bg-white rounded-3xl p-6 shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300 cursor-pointer flex flex-col"
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${color}`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm font-medium text-primary mb-3">{titleHi}</p>
        <p className="text-muted-foreground text-sm mt-auto">{desc}</p>
      </motion.div>
    </Link>
  );
}
