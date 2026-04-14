import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const HomePage = lazy(() => import("./pages/HomePage"));
const DiagnosticPage = lazy(() => import("./pages/DiagnosticPage"));
const DiagnosticTestPage = lazy(() => import("./pages/DiagnosticTestPage"));
const DiagnosticResultsPage = lazy(() => import("./pages/DiagnosticResultsPage"));
const FormationsPage = lazy(() => import("./pages/FormationsPage"));
const FormationDetailPage = lazy(() => import("./pages/FormationDetailPage"));
const ModulePage = lazy(() => import("./pages/ModulePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ConnexionPage = lazy(() => import("./pages/ConnexionPage"));

const queryClient = new QueryClient();

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/diagnostic" element={<DiagnosticPage />} />
              <Route path="/diagnostic/test" element={<DiagnosticTestPage />} />
              <Route path="/diagnostic/resultats" element={<DiagnosticResultsPage />} />
              <Route path="/formations" element={<FormationsPage />} />
              <Route path="/formations/:slug" element={<FormationDetailPage />} />
              <Route path="/formations/:slug/:moduleId" element={<ModulePage />} />
              <Route path="/tableau-de-bord" element={<DashboardPage />} />
              <Route path="/connexion" element={<ConnexionPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
