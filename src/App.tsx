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
import Methode from "./pages/Methode";
import MonParcours from "./pages/MonParcours";
import DiagnosticForm from "./pages/DiagnosticForm";
import NotFound from "./pages/NotFound";
import { ChatProvider } from "./context/ChatContext";
import { PageProvider } from "./context/PageContext";
import { ProgressProvider } from "./context/ProgressContext";
import { useProgress } from "./context/ProgressContext";
import { ChatPanel } from "./components/chat/ChatPanel";
import CelebrationOverlay from "./components/CelebrationOverlay";

const queryClient = new QueryClient();

function AppCelebration() {
  const { celebration, dismissCelebration } = useProgress();
  return <CelebrationOverlay celebration={celebration} onDismiss={dismissCelebration} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ProgressProvider>
        <PageProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/resultats" element={<Results />} />
            <Route path="/historique" element={<History />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/equipe/resultats" element={<EquipeResultats />} />
            <Route path="/methode" element={<Methode />} />
            <Route path="/mon-parcours" element={<MonParcours />} />
            <Route path="/diagnostic" element={<DiagnosticForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatPanel />
          <AppCelebration />
        </ChatProvider>
        </PageProvider>
        </ProgressProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
