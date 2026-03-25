import { Link, useLocation } from "wouter";
import { 
  Home, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  Bot, 
  Tractor,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home", labelHi: "होम", icon: Home },
  { href: "/prices", label: "Mandi Prices", labelHi: "मंडी भाव", icon: TrendingUp },
  { href: "/schemes", label: "Schemes", labelHi: "योजनाएं", icon: FileText },
  { href: "/community", label: "Community", labelHi: "समुदाय", icon: MessageSquare },
  { href: "/ai-assistant", label: "AI Assistant", labelHi: "एआई सहायक", icon: Bot },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 overflow-hidden rounded-2xl bg-white shadow-lg shadow-primary/20 group-hover:shadow-primary/35 transition-all duration-300 border border-primary/10 flex items-center justify-center p-1">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo-wheat.png`}
                  alt="KisanConnect Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-tight text-foreground">
                  Kisan<span className="text-primary">Connect</span>
                </span>
                <span className="text-xs font-medium text-muted-foreground -mt-1">किसान कनेक्ट</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      relative flex flex-col items-center px-4 py-2 rounded-xl transition-all duration-200
                      ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <link.icon className="w-4 h-4" />
                      <span className="font-semibold">{link.label}</span>
                    </div>
                    <span className="text-[10px] opacity-70 font-medium">{link.labelHi}</span>
                  </Link>
                );
              })}

              {/* AgriGo — external link */}
              <a
                href="https://web-app-builder-shreyaspiano.replit.app"
                className="relative flex flex-col items-center px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Tractor className="w-4 h-4" />
                  <span className="font-semibold">AgriGo</span>
                </div>
                <span className="text-[10px] opacity-70 font-medium">एग्रीगो</span>
              </a>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-20 z-40 bg-white border-b border-border shadow-2xl"
          >
            <div className="p-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-xl transition-colors
                      ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted font-medium"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <span>{link.label}</span>
                    </div>
                    <span className="text-sm opacity-60">{link.labelHi}</span>
                  </Link>
                );
              })}

              {/* AgriGo — external link (mobile) */}
              <a
                href="https://web-app-builder-shreyaspiano.replit.app"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-foreground hover:bg-muted font-medium transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Tractor className="w-5 h-5 text-muted-foreground" />
                  <span>AgriGo</span>
                </div>
                <span className="text-sm opacity-60">एग्रीगो</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>

      {/* Footer — hidden on AI Assistant page */}
      {location !== "/ai-assistant" && (
        <footer className="bg-white border-t border-border mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
            <p className="font-medium text-sm">© {new Date().getFullYear()} KisanConnect. Empowering Indian Farmers.</p>
            <p className="text-xs mt-1">किसान कनेक्ट - भारतीय किसानों का सशक्तिकरण</p>
          </div>
        </footer>
      )}
    </div>
  );
}
