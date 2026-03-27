import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function EntretienAsync() {
  const { token } = useParams();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-foreground mb-4">Diagnostic collaboratif</h1>
        <p className="text-sm text-foreground-muted mb-6">
          Vous avez ete invite a completer un diagnostic pour votre service.
        </p>
        <p className="text-xs text-foreground-muted">Token: {token}</p>
      </main>
      <Footer />
    </div>
  );
}
