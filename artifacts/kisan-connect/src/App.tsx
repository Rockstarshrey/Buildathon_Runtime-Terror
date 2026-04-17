import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/Layout";
import { LanguageProvider } from "@/lib/i18n";
import Home from "@/pages/Home";
import Community from "@/pages/Community";
import Prices from "@/pages/Prices";
import Schemes from "@/pages/Schemes";
import AIAssistant from "@/pages/AIAssistant";
import AgriGo from "@/pages/AgriGo";
import AgriNews from "@/pages/AgriNews";

// Create a query client with optimized default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 mins
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/community" component={Community} />
        <Route path="/prices" component={Prices} />
        <Route path="/schemes" component={Schemes} />
        <Route path="/ai-assistant" component={AIAssistant} />
        <Route path="/agrigo" component={AgriGo} />
        <Route path="/agrinews" component={AgriNews} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
