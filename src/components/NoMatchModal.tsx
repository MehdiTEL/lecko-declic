import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

export interface NoMatchModalProps {
  metier: string;
  onClose: () => void;
  onUseApi: () => void;
  similarJobs: string[];
  onPickJob: (job: string) => void;
}

export default function NoMatchModal({ metier, onClose, onUseApi, similarJobs, onPickJob }: NoMatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border/50 rounded-2xl shadow-float max-w-md w-full p-8 space-y-5"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-muted mx-auto">
          <Search size={22} className="text-foreground-muted" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h2 className="font-heading text-lg font-bold text-foreground mb-2">
            Ce metier n'est pas dans notre base express
          </h2>
          <p className="text-sm text-foreground-secondary">
            Le diagnostic express couvre 15 metiers. <span className="font-semibold text-primary">"{metier}"</span> n'en fait pas encore partie. Essayez un metier proche ci-dessous, ou lancez un diagnostic personnalise.
          </p>
        </div>

        <button
          onClick={onUseApi}
          className="w-full h-11 rounded-full font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-all hover:shadow-md flex items-center justify-center gap-2"
        >
          Diagnostic personnalise
          <ArrowRight size={15} />
        </button>

        {similarJobs.length > 0 && (
          <div>
            <p className="text-xs text-foreground-muted mb-2.5 text-center">
              Metiers proches disponibles gratuitement :
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {similarJobs.map((j) => (
                <button
                  key={j}
                  onClick={() => onPickJob(j)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-foreground-secondary hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full text-xs text-foreground-muted hover:text-foreground transition-colors py-1"
        >
          Annuler
        </button>
      </motion.div>
    </div>
  );
}
