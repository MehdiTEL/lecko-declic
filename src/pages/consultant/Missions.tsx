import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Missions() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mes missions</h1>
            <p className="text-sm text-foreground-muted mt-1">Gerez vos missions de conseil en automatisation</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity">
            <Plus size={15} /> Nouvelle mission
          </button>
        </div>
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-foreground-muted text-sm mb-4">Aucune mission pour le moment</p>
          <p className="text-foreground-muted text-xs">Creez votre premiere mission pour commencer a accompagner un client.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
