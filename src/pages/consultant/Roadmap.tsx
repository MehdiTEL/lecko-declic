import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Roadmap() {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <Link to={`/missions/${id}`} className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={14} /> Retour mission
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-4">Feuille de route</h1>
        <p className="text-sm text-foreground-muted">Roadmap pour mission {id}</p>
      </main>
      <Footer />
    </div>
  );
}
