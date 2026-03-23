import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotreHistoire() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="px-4 pt-12 pb-8 md:pt-16 md:pb-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-lecko-blue mb-4">Notre histoire</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ lineHeight: "1.2", letterSpacing: "-0.02em" }}>
            20 ans de transformation.<br />
            Un constat. Un outil.
          </h1>
          <p className="text-base text-foreground-secondary" style={{ lineHeight: "1.7" }}>
            DECLIC est ne d'une conviction forgee sur le terrain : les organisations qui reussissent leur transformation ne sont pas celles qui deploient le plus d'outils — ce sont celles qui structurent leur demarche.
          </p>
        </div>
      </section>

      {/* Timeline narrative */}
      <article className="px-4 pb-16">
        <div className="max-w-2xl mx-auto space-y-12">

          {/* 2005 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-lecko-blue">2005</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Lecko, le debut</h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              Arnaud Rayrole fonde Lecko (alors Useo) avec une intuition simple : le numerique va profondement transformer la facon dont les organisations travaillent. Pas seulement les outils — les pratiques, les habitudes, la culture.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Des le depart, Lecko choisit une approche differente des cabinets classiques : pas de grands programmes descendants imposes depuis le COMEX, mais un accompagnement au plus pres des equipes, avec une conviction que chacun doit devenir acteur de sa propre transformation.
            </p>
          </section>

          {/* 2012 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-lecko-blue">2012</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Le Referentiel : observer avant de prescrire</h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              Lecko lance son Etat de l'art de la transformation des organisations — une etude annuelle qui deviendra la reference du secteur. Chaque annee, le cabinet analyse les pratiques reelles, les outils du marche, et les tendances de fond.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
              Le principe fondateur : on n'invente pas une methode dans un bureau. On observe ce qui fonctionne sur le terrain, on mesure, on structure, et on partage. 20% des ressources de Lecko sont consacrees a cette recherche appliquee.
            </p>
            <a
              href="https://referentiel.lecko.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-lecko-blue hover:underline transition-colors"
            >
              Consulter le Referentiel Lecko <ExternalLink size={13} />
            </a>
          </section>

          {/* Chiffres cles */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
            {[
              { value: "20", unit: "ans", label: "d'expertise terrain" },
              { value: "14", unit: "+", label: "editions du Referentiel" },
              { value: "20", unit: "%", label: "du temps consacre a la R&D" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}<span className="text-lecko-orange">{stat.unit}</span>
                </p>
                <p className="text-xs text-foreground-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* 2015-2023 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-lecko-blue">2015–2023</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">Des centaines de missions, un constat recurrent</h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              En accompagnant des grands groupes, des collectivites et des ETI dans leur transformation numerique, Lecko accumule un savoir-faire methodologique dense. Deploiement de Microsoft 365, adoption des outils collaboratifs, conduite du changement — chaque mission confirme la meme observation.
            </p>
            <div className="rounded-xl p-5 my-5" style={{ backgroundColor: "hsl(var(--surface-accent, 220 40% 98%))" }}>
              <p className="text-sm text-foreground font-medium leading-relaxed italic">
                "Les organisations echouent rarement pour des raisons techniques. Elles echouent parce qu'elles automatisent des processus qu'elles n'ont pas pris le temps de comprendre, avec des outils qu'elles n'ont pas pris le temps de choisir, sans accompagner les personnes impactees."
              </p>
            </div>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Ce constat est le germe de DECLIC : avant d'automatiser, il faut detecter, evaluer, concevoir. Et quand on automatise, il faut tester, iterer, consolider. Six phases. Un cadre. Une methode.
            </p>
          </section>

          {/* 2023-2024 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-lecko-blue">2023–2024</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">L'IA generative change la donne</h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              L'arrivee de ChatGPT et des LLM bouleverse le paysage. Pour la premiere fois, des taches qui semblaient impossibles a automatiser — rediger un compte-rendu, analyser un document, classifier un email — deviennent accessibles. Le potentiel d'automatisation des metiers explose.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              Mais avec ce potentiel vient un risque : l'automatisation "au feeling". Des outils comme N8N, Make, et Power Automate permettent de construire des workflows en quelques clics. Tout le monde s'y met — souvent sans methode, sans cadrage, sans mesure de l'impact.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Lecko observe dans son Referentiel 2025 que l'IA s'integre massivement dans les environnements de travail, mais que la question de son deploiement structure reste entiere. L'outil est disponible — la methode manque.
            </p>
          </section>

          {/* 2025 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-lecko-orange">2025</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">DECLIC — la methode devient un outil</h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              DECLIC nait de cette question : comment rendre accessible a tous le savoir-faire methodologique que Lecko a construit en 20 ans de missions terrain ?
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              La reponse est un outil de diagnostic qui guide chaque professionnel dans l'identification de ce que l'IA peut automatiser dans SON quotidien — avec la rigueur d'une methode de consultant, mais l'accessibilite d'un produit en libre-service.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-5">
              La methode DECLIC structure le parcours en 6 phases : Detecter les taches qui freinent, Evaluer leur potentiel sur 5 criteres, Concevoir le workflow avant de le construire, Lancer avec un filet de securite, Iterer apres les premiers retours, Consolider les gains dans la duree. Chaque phase s'appuie sur des pratiques eprouvees en mission.
            </p>

            {/* DECLIC phases compact */}
            <div className="grid grid-cols-6 gap-1.5 mb-5">
              {[
                { letter: "D", label: "Detecter", color: "#F59E0B" },
                { letter: "E", label: "Evaluer", color: "#2563EB" },
                { letter: "C", label: "Concevoir", color: "#7C3AED" },
                { letter: "L", label: "Lancer", color: "#10B981" },
                { letter: "I", label: "Iterer", color: "#0EA5E9" },
                { letter: "C", label: "Consolider", color: "#D97706" },
              ].map((phase) => (
                <div key={phase.letter + phase.label} className="text-center p-2 rounded-lg" style={{ backgroundColor: `${phase.color}10` }}>
                  <p className="text-lg font-bold" style={{ color: phase.color }}>{phase.letter}</p>
                  <p className="text-[9px] text-foreground-muted font-medium">{phase.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Principe fondateur */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">Un principe fondateur : sans IA d'abord</h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              DECLIC herite d'une conviction forte de Lecko : la technologie est un moyen, pas une fin. L'IA est puissante, mais elle n'est pas toujours necessaire. Beaucoup de taches peuvent etre automatisees avec des regles simples — un workflow N8N, une formule Excel, un filtre Outlook.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              Le diagnostic DECLIC evalue chaque tache honnetement : est-ce que l'IA est reellement necessaire ici, ou est-ce qu'une automatisation simple suffit ? Cette honnetete est ce qui distingue DECLIC d'un outil qui vend de l'IA a tout prix.
            </p>
          </section>

          {/* Aujourd'hui */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-lecko-blue">Aujourd'hui</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">L'expertise Lecko, accessible a tous</h2>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              DECLIC rend accessible ce qui etait jusqu'ici reserve aux missions de conseil : un diagnostic structure, un scoring methodique, des recommandations concretes avec les etapes de mise en place, et un accompagnement via le Copilot integre.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
              Pour les cas simples, l'outil suffit. Pour les transformations plus profondes — deploiement a l'echelle, integration SI, conduite du changement — les consultants Lecko prennent le relais avec la connaissance approfondie du contexte que le diagnostic a deja cartographie.
            </p>
            <p className="text-sm text-foreground-secondary leading-relaxed">
              C'est le cercle vertueux : l'outil democratise l'expertise, l'expertise enrichit l'outil. Chaque mission terrain nourrit la base de connaissances. Chaque diagnostic utilisateur valide ou affine la methode.
            </p>
          </section>

          {/* CTA */}
          <div className="rounded-2xl p-6 md:p-8 text-center" style={{ backgroundColor: "hsl(var(--surface-accent, 220 40% 98%))" }}>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Envie de voir ce que DECLIC peut faire pour vous ?
            </h2>
            <p className="text-sm text-foreground-secondary mb-6 max-w-md mx-auto">
              Entrez votre metier. En 30 secondes, identifiez ce que l'IA peut automatiser dans votre quotidien.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-lecko-blue hover:opacity-90 transition-opacity"
            >
              Lancer un diagnostic <ArrowRight size={15} />
            </Link>
          </div>

        </div>
      </article>

      <Footer />
    </div>
  );
}
