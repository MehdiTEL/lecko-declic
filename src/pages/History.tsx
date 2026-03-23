import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Eye, Clock, BarChart, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getHistory, removeFromHistory, clearHistory } from "@/lib/history";
import { HistoryEntry } from "@/types/analysis";

export default function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>(getHistory);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    removeFromHistory(id);
    setEntries(getHistory());
    setConfirmDelete(null);
  };

  const handleClear = () => {
    clearHistory();
    setEntries([]);
    setConfirmClear(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      <main className="max-w-4xl mx-auto px-4 py-10 flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
            Historique de vos <span className="text-lecko-orange">analyses</span>
          </h1>
          <p className="text-foreground-secondary text-sm mb-8">
            Retrouvez toutes vos analyses précédentes.
          </p>
        </motion.div>

        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lecko-card p-12 text-center"
          >
            <div className="text-5xl mb-4"></div>
            <p className="text-foreground-secondary font-medium mb-4">
              Aucune analyse pour le moment. Lancez votre première analyse !
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-lecko-orange transition-colors"
            >
              Lancer une analyse
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="space-y-3">
              <AnimatePresence>
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="lecko-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{entry.metier}</span>
                        {/* Score badge */}
                        <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                          <BarChart size={11} />
                          {entry.result.score_global}%
                        </div>
                        {/* Source badge */}
                        {entry.source === "api" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <Bot size={10} />
                            API
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-foreground-muted border border-border">
                            <Sparkles size={10} />
                            Gratuit
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-foreground-muted">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(entry.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span>{entry.result.taches.length} tâches analysées</span>
                        <span className="text-lecko-orange font-semibold">
                          {entry.result.heures_economisees_semaine}h/sem. gagnées
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/resultats?metier=${encodeURIComponent(entry.metier)}&cached=${encodeURIComponent(btoa(encodeURIComponent(JSON.stringify(entry.result))))}&source=${entry.source ?? "local"}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Eye size={13} />
                        Revoir
                      </Link>
                      {confirmDelete === entry.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleRemove(entry.id)}
                            className="px-2 py-1.5 text-xs font-bold rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1.5 text-xs font-bold rounded-lg border border-border text-foreground-secondary hover:border-foreground transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(entry.id)}
                          className="p-1.5 rounded-lg text-foreground-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Clear all */}
            <div className="mt-6 flex justify-end">
              {confirmClear ? (
                <div className="flex items-center gap-2 lecko-card px-4 py-2">
                  <span className="text-sm text-foreground-secondary">Vider tout l'historique ?</span>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1 text-xs font-bold rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1 text-xs font-bold rounded-lg border border-border text-foreground-secondary hover:border-foreground transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-2 text-sm text-foreground-muted hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                  Vider l'historique
                </button>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
