import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded pages (code splitting)
const Results = lazy(() => import("./pages/Results"));
const History = lazy(() => import("./pages/History"));
const Settings = lazy(() => import("./pages/Settings"));
const Equipe = lazy(() => import("./pages/Equipe"));
const EquipeRejoindre = lazy(() => import("./pages/EquipeRejoindre"));
const EquipeResultats = lazy(() => import("./pages/EquipeResultats"));
const MonParcours = lazy(() => import("./pages/MonParcours"));
const MesAutomations = lazy(() => import("./pages/MesAutomations"));
const DiagnosticForm = lazy(() => import("./pages/DiagnosticForm"));
const ConfigurerApi = lazy(() => import("./pages/ConfigurerApi"));
const Profil = lazy(() => import("./pages/Profil"));
const Stats = lazy(() => import("./pages/Stats"));
// Consultant mode
const Missions = lazy(() => import("./pages/consultant/Missions"));
const MissionDetail = lazy(() => import("./pages/consultant/MissionDetail"));
const EntretienLive = lazy(() => import("./pages/consultant/EntretienLive"));
const RoadmapPage = lazy(() => import("./pages/consultant/Roadmap"));
const Bibliotheque = lazy(() => import("./pages/consultant/Bibliotheque"));
const QuestionnaireEditor = lazy(() => import("./pages/consultant/QuestionnaireEditor"));
const PortailClient = lazy(() => import("./pages/PortailClient"));
const EntretienAsync = lazy(() => import("./pages/EntretienAsync"));
import { ChatProvider } from "./context/ChatContext";
import { PageProvider } from "./context/PageContext";
import { ProgressProvider } from "./context/ProgressContext";
import { useProgress } from "./context/ProgressContext";
import { ChatPanel } from "./components/chat/ChatPanel";
import CelebrationOverlay from "./components/CelebrationOverlay";
import { ProfileProvider } from "./context/ProfileContext";

const queryClient = new QueryClient();

const VITRINE_URL = import.meta.env.VITE_VITRINE_URL ?? "https://lecko.fr";

function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return null;
}

function AppCelebration() {
  const { celebration, dismissCelebration } = useProgress();
  return <CelebrationOverlay celebration={celebration} onDismiss={dismissCelebration} />;
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>
        <ProfileProvider>
          <PageProvider>
            <ChatProvider>{children}</ChatProvider>
          </PageProvider>
        </ProfileProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProviders>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-6 h-6 border-2 border-lecko-blue border-t-transparent rounded-full animate-spin" /></div>}>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />

            {/* Public — accessible sans inscription */}
            <Route path="/" element={<Index />} />
            <Route path="/resultats" element={<Results />} />
            <Route path="/methode" element={<ExternalRedirect to={`${VITRINE_URL}/methode`} />} />
            <Route path="/notre-histoire" element={<ExternalRedirect to={`${VITRINE_URL}/notre-histoire`} />} />
            <Route path="/stats" element={<Stats />} />

            {/* Premium — inscription requise */}
            <Route path="/diagnostic" element={<ProtectedRoute><DiagnosticForm /></ProtectedRoute>} />
            <Route path="/configurer-api" element={<ProtectedRoute><ConfigurerApi /></ProtectedRoute>} />
            <Route path="/equipe" element={<ProtectedRoute><Equipe /></ProtectedRoute>} />
            <Route path="/equipe/rejoindre" element={<EquipeRejoindre />} />
            <Route path="/equipe/resultats" element={<ProtectedRoute><EquipeResultats /></ProtectedRoute>} />
            <Route path="/historique" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/parametres" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/mon-parcours" element={<ProtectedRoute><MonParcours /></ProtectedRoute>} />
            <Route path="/mes-automations" element={<ProtectedRoute><MesAutomations /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />

            {/* Consultant mode */}
            <Route path="/missions" element={<ProtectedRoute><Missions /></ProtectedRoute>} />
            <Route path="/missions/:id" element={<ProtectedRoute><MissionDetail /></ProtectedRoute>} />
            <Route path="/missions/:id/entretien/:entretienId" element={<ProtectedRoute><EntretienLive /></ProtectedRoute>} />
            <Route path="/missions/:id/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
            <Route path="/bibliotheque" element={<ProtectedRoute><Bibliotheque /></ProtectedRoute>} />
            <Route path="/bibliotheque/questionnaire/:id" element={<ProtectedRoute><QuestionnaireEditor /></ProtectedRoute>} />
            <Route path="/bibliotheque/questionnaire/nouveau" element={<ProtectedRoute><QuestionnaireEditor /></ProtectedRoute>} />
            {/* Public — entretien async */}
            <Route path="/entretien/:token" element={<EntretienAsync />} />
            <Route path="/client/:token" element={<PortailClient />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <ChatPanel />
          <AppCelebration />
        </AppProviders>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
