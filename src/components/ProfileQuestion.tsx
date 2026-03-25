import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ProfileQuestionProps {
  question: "role" | "secteur" | "stack";
  onAnswer: (value: string) => void;
  onDismiss: () => void;
}

const QUESTIONS = {
  role: {
    text: "Vous utilisez DECLIC en tant que...",
    options: [
      { label: "Salarie", value: "salarie" },
      { label: "Manager", value: "manager" },
      { label: "Consultant", value: "consultant" },
    ],
    cols: 3,
  },
  secteur: {
    text: "Votre domaine principal ?",
    options: [
      { label: "Finance & Gestion", value: "finance_gestion" },
      { label: "Tech & Produit", value: "tech_produit" },
      { label: "Marketing & Comm.", value: "marketing_communication" },
      { label: "Management & Conseil", value: "management_conseil" },
      { label: "RH & Commercial", value: "rh_commercial" },
      { label: "Secteur Public", value: "secteur_public" },
    ],
    cols: 2,
  },
  stack: {
    text: "Votre environnement de travail ?",
    options: [
      { label: "Microsoft 365", value: "m365" },
      { label: "Google Workspace", value: "google" },
      { label: "Les deux", value: "les_deux" },
      { label: "Autre", value: "autre" },
    ],
    cols: 2,
  },
};

export default function ProfileQuestion({ question, onAnswer, onDismiss }: ProfileQuestionProps) {
  const q = QUESTIONS[question];

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-sm w-full px-4"
    >
      <div className="bg-card border border-border/60 rounded-2xl shadow-float p-4 relative">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-foreground-muted hover:text-foreground hover:bg-muted transition-colors"
        >
          <X size={13} />
        </button>

        <p className="text-sm font-semibold text-foreground mb-3 pr-6">{q.text}</p>

        <div className={`grid gap-2 ${q.cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              className="px-3 py-2 text-xs font-semibold rounded-full bg-muted text-foreground-secondary hover:bg-primary hover:text-white transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-foreground-muted/60 mt-2.5 text-center">
          Aide a personnaliser vos recommandations
        </p>
      </div>
    </motion.div>
  );
}
