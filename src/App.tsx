import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const Missions            = lazy(() => import("./pages/consultant/Missions"));
const MissionDetail       = lazy(() => import("./pages/consultant/MissionDetail"));
const EntretienLive       = lazy(() => import("./pages/consultant/EntretienLive"));
const RoadmapPage         = lazy(() => import("./pages/consultant/Roadmap"));
const Bibliotheque        = lazy(() => import("./pages/consultant/Bibliotheque"));
const QuestionnaireEditor = lazy(() => import("./pages/consultant/QuestionnaireEditor"));
const Settings            = lazy(() => import("./pages/Settings"));
const EntretienAsync      = lazy(() => import("./pages/EntretienAsync"));
const PortailClient       = lazy(() => import("./pages/PortailClient"));

const queryClient = new QueryClient();

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster /><Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/entretien/:token" element={<EntretienAsync />} />
                <Route path="/client/:token" element={<PortailClient />} />
                <Route path="/missions"
                  element={<ProtectedRoute><Missions /></ProtectedRoute>} />
                <Route path="/missions/:id"
                  element={<ProtectedRoute><MissionDetail /></ProtectedRoute>} />
                <Route path="/missions/:id/entretien/:entretienId"
                  element={<ProtectedRoute><EntretienLive /></ProtectedRoute>} />
                <Route path="/missions/:id/roadmap"
                  element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
                <Route path="/bibliotheque"
                  element={<ProtectedRoute><Bibliotheque /></ProtectedRoute>} />
                <Route path="/bibliotheque/questionnaire/:id"
                  element={<ProtectedRoute><QuestionnaireEditor /></ProtectedRoute>} />
                <Route path="/parametres"
                  element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/missions" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
