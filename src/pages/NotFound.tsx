import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-lecko-blue mb-4">404</p>
          <h1 className="text-xl font-bold text-foreground mb-2">Page introuvable</h1>
          <p className="text-sm text-foreground-muted mb-6">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-lecko-blue text-white hover:opacity-90 transition-opacity"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
