import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, X, Sparkles, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { FREE_JOB_LABELS, findInLocalDatabase } from "@/data/jobDatabase";
import { getApiKey, analyzeJob as callAnalyzeJob } from "@/lib/aiProvider";
import { AnalysisResult, AnalysisSource } from "@/types/analysis";
import { TeamMember, TeamJobResult, TeamAnalysisResult } from "@/types/team";

const MAX_MEMBERS = 10;

interface ProgressItem {
  metier: string;
  status: "pending" | "running" | "done" | "error";
}

export default function Equipe() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [progressLabel, setProgressLabel] = useState("");

  const addMember = (metier?: string) => {
    const job = (metier ?? input).trim();
    if (!job) return;
    if (members.length >= MAX_MEMBERS) return;
    // avoid duplicates
    if (members.some((m) => m.metier.toLowerCase() === job.toLowerCase())) {
      setInput("");
      return;
    }
    setMembers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), metier: job, count: 1 },
    ]);
    setInput("");
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateCount = (id: string, count: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, count: Math.max(1, Math.min(50, count)) } : m))
    );
  };

  const handleAnalyze = async () => {
    if (members.length < 2) return;
    setIsAnalyzing(true);

    const items: ProgressItem[] = members.map((m) => ({
      metier: m.metier,
      status: "pending",
    }));
    setProgress(items);

    const results: TeamJobResult[] = [];

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      setProgressLabel(`Analyse ${i + 1}/${members.length} : ${member.metier}...`);
      setProgress((prev) =>
        prev.map((p, idx) => (idx === i ? { ...p, status: "running" } : p))
      );

      try {
        // 1. Try local DB first
        const local = findInLocalDatabase(member.metier);
        if (local) {
          results.push({ member, result: local, source: "local" as AnalysisSource });
        } else if (getApiKey()) {
          // 2. Fall back to API
          const content = await callAnalyzeJob(member.metier);
          let parsed: AnalysisResult;
          try {
            parsed = JSON.parse(content);
          } catch {
            const match = content.match(/\{[\s\S]*\}/);
            if (!match) throw new Error("Invalid response");
            parsed = JSON.parse(match[0]);
          }
          results.push({ member, result: parsed, source: "api" as AnalysisSource });
        } else {
          throw new Error("No local match and no API key");
        }

        setProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "done" } : p))
        );
      } catch {
        setProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "error" } : p))
        );
        // push empty placeholder so we don't block
      }
    }

    setIsAnalyzing(false);

    if (results.length < 1) return;

    const teamResult: TeamAnalysisResult = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      members,
      results,
    };

    // Store in sessionStorage for the results page
    sessionStorage.setItem("lecko-team-result", JSON.stringify(teamResult));
    navigate("/equipe/resultats");
  };

  const totalPeople = members.reduce((s, m) => s + m.count, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="lecko-deco-square" aria-hidden />

      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-lecko-blue/10 border border-lecko-blue/20 text-lecko-blue text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <Users size={13} />
            Mode Équipe
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Analyse d'<span className="text-lecko-orange">équipe</span>
          </h1>
          <p className="text-foreground-secondary text-sm">
            Ajoutez les métiers de votre organisation pour mesurer le potentiel d'automatisation global.
          </p>
        </motion.div>

        {/* Loading overlay */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-6"
            >
              <div className="lecko-card p-8 max-w-md w-full space-y-5">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-lecko-blue border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-center font-semibold text-foreground text-sm">{progressLabel}</p>
                <div className="space-y-2">
                  {progress.map((p) => (
                    <div key={p.metier} className="flex items-center gap-3 text-sm">
                      <span className="w-5 text-center">
                        {p.status === "done" && "✅"}
                        {p.status === "running" && (
                          <span className="inline-block w-3 h-3 border-2 border-lecko-blue border-t-transparent rounded-full animate-spin" />
                        )}
                        {p.status === "pending" && <span className="text-foreground-muted">○</span>}
                        {p.status === "error" && "❌"}
                      </span>
                      <span className={p.status === "done" ? "text-lecko-green font-semibold" : "text-foreground-secondary"}>
                        {p.metier}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lecko-blue transition-all duration-500 rounded-full"
                    style={{
                      width: `${(progress.filter((p) => p.status === "done" || p.status === "error").length / Math.max(progress.length, 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add job form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lecko-card p-5 mb-5"
        >
          <label className="text-xs font-bold text-foreground-muted uppercase tracking-widest mb-2 block">
            Ajouter un métier
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
              placeholder="Ex : Comptable, Chef de projet..."
              disabled={members.length >= MAX_MEMBERS}
              className="flex-1 h-10 px-4 text-sm bg-background border border-border rounded-lg outline-none focus:border-lecko-blue transition-colors text-foreground placeholder:text-foreground-muted disabled:opacity-50"
            />
            <button
              onClick={() => addMember()}
              disabled={!input.trim() || members.length >= MAX_MEMBERS}
              className="h-10 px-4 rounded-lg font-bold text-sm flex items-center gap-1.5 bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="mt-3">
            <p className="text-xs text-foreground-muted mb-2 flex items-center gap-1">
              <Sparkles size={10} className="text-lecko-blue" />
              Suggestions rapides :
            </p>
            <div className="tags-scroll flex-wrap">
              {FREE_JOB_LABELS.slice(0, 8).map((label) => (
                <button
                  key={label}
                  onClick={() => addMember(label)}
                  disabled={
                    members.length >= MAX_MEMBERS ||
                    members.some((m) => m.metier.toLowerCase() === label.toLowerCase())
                  }
                  className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full border border-lecko-blue/30 bg-lecko-blue/5 text-lecko-blue hover:bg-lecko-blue hover:text-primary-foreground transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Members list */}
        <AnimatePresence>
          {members.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="lecko-card p-5 mb-5 space-y-2"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-widest">
                  Équipe constituée
                </span>
                <span className="text-xs text-foreground-muted">
                  {members.length} métier{members.length > 1 ? "s" : ""} — {totalPeople} collaborateur{totalPeople > 1 ? "s" : ""}
                </span>
              </div>

              <AnimatePresence>
                {members.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2.5"
                  >
                    <span className="text-sm">👤</span>
                    <span className="flex-1 text-sm font-semibold text-foreground">{m.metier}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-foreground-muted">×</span>
                      <input
                        type="number"
                        value={m.count}
                        min={1}
                        max={50}
                        onChange={(e) => updateCount(m.id, parseInt(e.target.value) || 1)}
                        className="w-14 h-7 text-center text-sm font-bold bg-card border border-border rounded-md outline-none focus:border-lecko-blue transition-colors"
                      />
                      <span className="text-xs text-foreground-muted">pers.</span>
                    </div>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="p-1 rounded-md text-foreground-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Launch button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            onClick={handleAnalyze}
            disabled={members.length < 2 || isAnalyzing}
            className="w-full h-12 rounded-xl font-bold text-base flex items-center justify-center gap-2 bg-lecko-blue text-primary-foreground hover:bg-lecko-orange transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-card hover:shadow-card-hover"
          >
            <Rocket size={18} />
            Analyser l'équipe
          </button>
          <p className="text-center text-xs text-foreground-muted mt-2">
            {members.length < 2
              ? `Ajoutez au moins ${2 - members.length} métier${2 - members.length > 1 ? "s" : ""} supplémentaire${2 - members.length > 1 ? "s" : ""} pour lancer l'analyse`
              : "L'analyse peut prendre quelques secondes par métier"}
          </p>
        </motion.div>
      </main>

      <footer className="bg-card border-t border-border px-4 py-4 text-center">
        <p className="text-xs text-foreground-muted">
          <span className="font-bold">lecko.</span>{" "}
          <a href="https://lecko.fr" target="_blank" rel="noopener noreferrer" className="hover:text-lecko-blue transition-colors">
            lecko.fr
          </a>
        </p>
      </footer>
    </div>
  );
}
