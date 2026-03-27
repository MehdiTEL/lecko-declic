import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EntretienLive() {
  const { id, entretienId } = useParams();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-foreground mb-4">Entretien live</h1>
        <p className="text-sm text-foreground-muted">Mission: {id} / Entretien: {entretienId}</p>
      </main>
      <Footer />
    </div>
  );
}
