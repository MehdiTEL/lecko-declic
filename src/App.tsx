import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Results from "./pages/Results";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Equipe from "./pages/Equipe";
import EquipeResultats from "./pages/EquipeResultats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/resultats" element={<Results />} />
          <Route path="/historique" element={<History />} />
          <Route path="/parametres" element={<Settings />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/equipe/resultats" element={<EquipeResultats />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
