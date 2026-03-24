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
import ConfigurerApi from "./pages/ConfigurerApi";
import NotreHistoire from "./pages/NotreHistoire";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
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
        <AuthProvider>
        <ProgressProvider>
        <PageProvider>
        <ChatProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/resultats" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/historique" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/equipe" element={<ProtectedRoute><Equipe /></ProtectedRoute>} />
            <Route path="/equipe/resultats" element={<ProtectedRoute><EquipeResultats /></ProtectedRoute>} />
            <Route path="/methode" element={<ProtectedRoute><Methode /></ProtectedRoute>} />
            <Route path="/mon-parcours" element={<ProtectedRoute><MonParcours /></ProtectedRoute>} />
            <Route path="/diagnostic" element={<ProtectedRoute><DiagnosticForm /></ProtectedRoute>} />
            <Route path="/configurer-api" element={<ProtectedRoute><ConfigurerApi /></ProtectedRoute>} />
            <Route path="/notre-histoire" element={<ProtectedRoute><NotreHistoire /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatPanel />
          <AppCelebration />
        </ChatProvider>
        </PageProvider>
        </ProgressProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
