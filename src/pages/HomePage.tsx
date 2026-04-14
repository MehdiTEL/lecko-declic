import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { domaines } from "@/data/domaines";
import {
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
  Brain,
  FileText,
  MessageSquare,
  BarChart3,
  GitBranch,
  Palette,
  Cpu,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  FileText,
  MessageSquare,
  BarChart3,
  GitBranch,
  Palette,
  Cpu,
};

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    el.querySelectorAll(".reveal").forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function HomePage() {
  const containerRef = useScrollReveal();

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-36 text-center relative">
          <div className="reveal">
            <p className="section-label mb-6">
              <Sparkles size={14} className="inline mr-1.5 -mt-0.5" />
              Plateforme de formation IA
            </p>
            <h1 className="text-display text-white font-display mb-6 max-w-4xl mx-auto">
              Maîtrisez l'IA dans votre métier
            </h1>
            <p className="text-body-lg text-[#8A8AA3] max-w-2xl mx-auto mb-10">
              Diagnostic personnalisé, formations pratiques et assistant IA.
              Montez en compétence à votre rythme, gratuitement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/diagnostic"
                className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-8 py-3.5 rounded-full transition-all btn-glow text-lg"
              >
                Évaluer mon niveau
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/formations"
                className="inline-flex items-center justify-center gap-2 bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] text-white font-semibold px-8 py-3.5 rounded-full transition-all text-lg"
              >
                Voir les formations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problème — 3 stats */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-4">Le constat</p>
            <h2 className="text-heading-xl text-white font-display">
              L'IA transforme chaque métier
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { stat: "87%", label: "des entreprises prévoient d'intégrer l'IA d'ici 2026" },
              { stat: "40%", label: "des tâches répétitives automatisables avec l'IA" },
              { stat: "3x", label: "plus productifs avec les bons outils IA" },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card p-8 text-center reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2 font-display">
                  {item.stat}
                </div>
                <p className="text-[#8A8AA3] text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Méthode — 3 étapes */}
      <section className="py-20 sm:py-28 bg-[#0D0D14]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-4">La méthode</p>
            <h2 className="text-heading-xl text-white font-display">
              3 étapes pour progresser
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                step: "01",
                title: "Diagnostiquez",
                desc: "Évaluez votre maturité IA sur 6 domaines clés avec notre diagnostic gratuit.",
              },
              {
                icon: BookOpen,
                step: "02",
                title: "Formez-vous",
                desc: "Suivez des formations adaptées à votre niveau avec du contenu pratique et des quiz.",
              },
              {
                icon: Brain,
                step: "03",
                title: "Appliquez",
                desc: "Utilisez l'assistant IA intégré pour mettre en pratique dans votre contexte métier.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                    <item.icon size={20} className="text-violet-400" />
                  </div>
                  <span className="text-xs font-mono text-[#55556A]">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[#8A8AA3] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domaines */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal">
            <p className="section-label mb-4">Les domaines</p>
            <h2 className="text-heading-xl text-white font-display">
              6 domaines de compétence IA
            </h2>
            <p className="text-body text-[#8A8AA3] max-w-2xl mx-auto mt-4">
              Chaque domaine couvre un aspect essentiel de l'utilisation de l'IA en entreprise.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domaines.map((d, i) => {
              const Icon = ICON_MAP[d.icone] ?? FileText;
              return (
                <div
                  key={d.id}
                  className="glass-card p-6 reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${d.couleur}20` }}
                  >
                    <Icon size={20} style={{ color: d.couleur }} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{d.titre}</h3>
                  <p className="text-[#8A8AA3] text-sm leading-relaxed">{d.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 sm:py-28 bg-[#0D0D14]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center reveal">
          <h2 className="text-heading-xl text-white font-display mb-4">
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="text-body-lg text-[#8A8AA3] mb-8">
            Commencez par un diagnostic gratuit de 5 minutes.
            Sans inscription, sans engagement.
          </p>
          <Link
            to="/diagnostic"
            className="inline-flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold px-10 py-4 rounded-full transition-all btn-glow text-lg"
          >
            Lancer le diagnostic
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
