import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded pages (code splitting)
const Results = lazy(() => import("./pages/Results"));
const History = lazy(() => import("./pages/History"));
const Settings = lazy(() => import("./pages/Settings"));
const Equipe = lazy(() => import("./pages/Equipe"));
const EquipeResultats = lazy(() => import("./pages/EquipeResultats"));
const Methode = lazy(() => import("./pages/Methode"));
const MonParcours = lazy(() => import("./pages/MonParcours"));
const DiagnosticForm = lazy(() => import("./pages/DiagnosticForm"));
const ConfigurerApi = lazy(() => import("./pages/ConfigurerApi"));
const NotreHistoire = lazy(() => import("./pages/NotreHistoire"));
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
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-6 h-6 border-2 border-lecko-blue border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Public — accessible sans inscription */}
            <Route path="/" element={<Index />} />
            <Route path="/resultats" element={<Results />} />
            <Route path="/methode" element={<Methode />} />
            <Route path="/notre-histoire" element={<NotreHistoire />} />

            {/* Premium — inscription requise */}
            <Route path="/diagnostic" element={<ProtectedRoute><DiagnosticForm /></ProtectedRoute>} />
            <Route path="/configurer-api" element={<ProtectedRoute><ConfigurerApi /></ProtectedRoute>} />
            <Route path="/equipe" element={<ProtectedRoute><Equipe /></ProtectedRoute>} />
            <Route path="/equipe/resultats" element={<ProtectedRoute><EquipeResultats /></ProtectedRoute>} />
            <Route path="/historique" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/mon-parcours" element={<ProtectedRoute><MonParcours /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
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
