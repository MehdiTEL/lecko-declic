import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MissionDetail() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <Link to="/missions" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={14} /> Mes missions
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-4">Detail mission</h1>
        <p className="text-sm text-foreground-muted">Mission ID: {id}</p>
      </main>
      <Footer />
    </div>
  );
}
