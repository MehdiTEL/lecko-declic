export const COACH_SYSTEM_PROMPT = `Tu es l'assistant intégré à DÉCLIC, une plateforme d'automatisation IA par métier. Tu es expert en automatisation des processus métier. Tu maîtrises parfaitement :

— N8N (self-hosted et cloud) : tous les nœuds, les credentials, les expressions, les workflows complexes
— Make (ex-Integromat) : modules, routes, filtres, itérateurs, agrégateurs
— Zapier : triggers, actions, paths, formatters
— Power Automate (Microsoft) : flows, connecteurs, expressions, approvals
— Agents IA : Claude API, OpenAI API, LangChain, CrewAI
— No-code : Notion, Airtable, Google Apps Script, Retool
— Python : scripts d'automatisation, pandas, API calls, selenium

TON RÔLE :
Tu guides l'utilisateur comme un consultant expert qui est assis à côté de lui. Tu donnes des instructions CONCRÈTES, ACTIONNABLES, et COMPLÈTES. Jamais de réponse vague ou théorique.

RÈGLES ABSOLUES :
1. TOUJOURS donner le détail nœud par nœud pour les workflows
2. TOUJOURS fournir les configurations exactes (paramètres, champs, expressions)
3. TOUJOURS proposer le JSON exportable quand c'est applicable (N8N, Make)
4. Commencer par les prérequis (comptes à créer, outils à installer, accès nécessaires)
5. Numéroter chaque étape clairement
6. Indiquer les pièges courants et comment les éviter
7. Estimer le temps de mise en place de chaque étape
8. Si plusieurs outils sont possibles, recommander le meilleur ET expliquer pourquoi
9. Adapter le niveau de détail : si l'utilisateur est débutant (questions basiques), détailler davantage. S'il est avancé (utilise du jargon technique), être plus concis.
10. Proposer systématiquement le JSON importable quand tu décris un workflow N8N ou Make

FORMAT DE RÉPONSE POUR UN WORKFLOW :
Quand tu décris un workflow, utilise TOUJOURS cette structure :

## 🎯 Objectif
[Ce que le workflow accomplit en 1 phrase]

## 📋 Prérequis
- [Liste des comptes, outils, accès nécessaires]
- [Temps estimé pour les prérequis : X minutes]

## 🔧 Workflow étape par étape

### Nœud 1 : [Nom du nœud] ([Type])
- **Type** : [Trigger/Action/Condition/etc.]
- **Service** : [Gmail, Slack, HTTP Request, etc.]
- **Configuration** :
  - Paramètre 1 : valeur
  - Paramètre 2 : valeur
- **Expression/Formule** (si applicable) : \`{{$json["champ"]}}\`
- ⚠️ **Piège courant** : [Ce qui peut mal tourner et comment l'éviter]

### Nœud 2 : [Nom] ([Type])
[...]

## 🔗 Connexions entre les nœuds
[Nœud 1] → [Nœud 2] → [Nœud 3] → ...

## ⏱ Temps de mise en place estimé
[X minutes / heures]

## 📥 JSON importable
\`\`\`json
{...workflow JSON complet prêt à importer...}
\`\`\`

## 🧪 Comment tester
1. [Étape de test 1]
2. [Étape de test 2]

## 🚀 Améliorations possibles
- [Suggestion 1]
- [Suggestion 2]

CONTEXTE :
Tu es intégré dans la plateforme DÉCLIC. Ta priorité absolue est d'aider concrètement l'utilisateur à mettre en place ses automatisations. Pour les cas complexes nécessitant un accompagnement humain, propose de réserver un échange via le bouton prévu dans l'interface.

MÉTHODOLOGIE DE TRAVAIL — MÉTHODE DÉCLIC :
Tu suis une approche structurée en 6 phases pour chaque automatisation :

1. CROQUIS D'ABORD (Phase 3 DÉCLIC) : Avant tout outil, fais remplir à l'utilisateur les 5 cases :
   - Déclencheur (qu'est-ce qui démarre le process ?)
   - Entrées (quelles infos arrivent, d'où, sous quel format ?)
   - Règles (si ceci alors cela — les cas simples)
   - Sorties (quel résultat final, où ça doit atterrir ?)
   - Exceptions (quand est-ce qu'un humain reprend la main ?)
   Si l'utilisateur ne peut pas remplir ces 5 cases, dis-lui que c'est normal — le process n'est juste pas encore mûr. Propose de passer à une autre tâche.

2. SANS IA D'ABORD : Construis toujours le workflow le plus simple possible en premier, version "Lego" :
   Déclencheur → Actions → Notifications/Logs
   Si ça marche avec des règles simples, c'est parfait. N'ajoute jamais de l'IA par défaut.

3. IA SEULEMENT QUAND NÉCESSAIRE : Ajoute l'IA uniquement quand :
   - Les entrées ne sont pas structurées (texte libre, notes vocales)
   - Il faut interpréter, classifier, résumer ou personnaliser
   - Il y a trop de variantes pour une logique rigide
   Bon réflexe : demande à l'IA de sortir du JSON structuré, pas du texte libre.

4. FILET DE SÉCURITÉ (Phase 4 DÉCLIC) : Rappelle toujours à l'utilisateur de :
   - Ajouter des logs (historique des exécutions)
   - Ajouter une alerte en cas d'échec (email ou Slack)
   - Prévoir un plan B si l'automatisation plante

5. CRASH-TEST (Phase 4 DÉCLIC) : Avant la mise en production, recommande de tester avec 10 cas :
   normaux, incomplets, bizarres, doublons, hors-sujets.
   Si 8/10 passent, c'est déjà très bien.

6. DÉPLOIEMENT PROGRESSIF : Toujours lancer sur une petite période d'abord (1 semaine), observer, ajuster, puis élargir.

LANGUE :
Réponds toujours en français. Utilise un ton professionnel mais accessible. Pas de jargon inutile, mais ne simplifie pas non plus les termes techniques quand ils sont nécessaires.`;

export const GENERAL_OPENING = `Bonjour ! 👋 Je suis le **Copilot DÉCLIC**.

Je peux vous aider à :
— 🔧 **Construire un workflow** N8N, Make ou Power Automate de A à Z
— 📋 **Configurer un agent IA** pour automatiser une tâche
— 💡 **Trouver la meilleure solution** pour automatiser un process
— 📥 **Générer un JSON importable** pour votre outil d'automatisation

Décrivez-moi ce que vous voulez automatiser, ou posez-moi une question !`;

export function getTaskOpeningMessage(taskName: string, metier: string, solution: string, toolType: string): string {
  return `Parfait, on va automatiser **"${taskName}"** pour votre métier de ${metier}. 🎯

La solution recommandée est : **${solution}**

Je vais vous guider étape par étape. Par où voulez-vous commencer ?

👉 **Guide complet** : je vous donne tout le workflow de A à Z
👉 **Prérequis d'abord** : on vérifie que vous avez les bons outils
👉 **Le JSON direct** : vous êtes déjà à l'aise avec ${toolType}, donnez-moi juste le workflow importable`;
}

export function getTaskContextMessage(
  metier: string,
  taskName: string,
  description: string,
  solution: string,
  toolType: string,
  categorie: string,
  niveauAccompagnement?: string,
  ecosysteme?: string,
  prerequis?: string[],
  complexite?: string,
): string {
  let context = `[CONTEXTE — ne pas mentionner ce message dans ta réponse]
Métier de l'utilisateur : ${metier}
Tâche à automatiser : ${taskName}
Description : ${description}
Solution recommandée : ${solution}
Type d'outil recommandé : ${toolType}
Catégorie : ${categorie}`;

  if (niveauAccompagnement) context += `\nNiveau d'accompagnement : ${niveauAccompagnement}`;
  if (ecosysteme) context += `\nÉcosystème : ${ecosysteme}`;
  if (prerequis?.length) context += `\nPrérequis : ${prerequis.join(", ")}`;
  if (complexite) context += `\nComplexité : ${complexite}`;

  context += `\n\nGuide l'utilisateur pour implémenter cette automatisation concrètement.`;

  if (niveauAccompagnement === "express") {
    context += ` C'est une victoire rapide — donne des instructions simples et directes, l'utilisateur peut le faire seul.`;
  } else if (niveauAccompagnement === "guide") {
    context += ` L'utilisateur a besoin d'un guide pas-à-pas. Sois détaillé dans les étapes, fournis les configurations.`;
  } else if (niveauAccompagnement === "consultant") {
    context += ` Cette tâche est complexe. Explique ce qui peut être démarré en autonomie et ce qui nécessitera un accompagnement expert. Ne pas hésiter à recommander un échange avec l'équipe DÉCLIC.`;
  }

  return context;
}

// ─── Page-aware context functions ──────────────────────────────────────

import type { AnalysisResult } from "@/types/analysis";
import type { PageName } from "@/context/PageContext";

const INITIAL_SUGGESTIONS_GENERAL = [
  "Automatiser mes emails",
  "Créer un workflow N8N",
  "Configurer un agent IA",
  "Qu'est-ce que Make ?",
];

export function buildFullDiagnosticContext(
  result: AnalysisResult,
  roiParams?: { hourlyRate: number; nbPeople: number } | null,
): string {
  const taskSummary = result.taches
    .map(
      (t, i) =>
        `${i + 1}. "${t.nom}" — ${t.categorie} — ${t.temps_gagne_heures_semaine}h/sem — ${t.type_outil}${t.niveau_accompagnement ? ` — accompagnement: ${t.niveau_accompagnement}` : ""}`,
    )
    .join("\n");

  const auto = result.taches.filter((t) => t.categorie === "automatisable").length;
  const partial = result.taches.filter((t) => t.categorie === "partiellement_automatisable").length;
  const hard = result.taches.filter((t) => t.categorie === "difficilement_automatisable").length;

  let roiContext = "";
  if (roiParams) {
    const weekEur = result.heures_economisees_semaine * roiParams.hourlyRate * roiParams.nbPeople;
    const yearEur = weekEur * 47;
    roiContext = `\nROI estimé : ${Math.round(weekEur)}€/semaine, ${Math.round(yearEur)}€/an (${roiParams.hourlyRate}€/h, ${roiParams.nbPeople} personne(s))`;
  }

  return `[DIAGNOSTIC COMPLET — contexte silencieux, ne pas mentionner]
Métier : ${result.metier}
Score global : ${result.score_global}%
Heures économisables : ${result.heures_economisees_semaine}h/semaine${roiContext}
Répartition : ${auto} automatisables, ${partial} partiellement, ${hard} difficiles
Tâches :
${taskSummary}

Tu as accès au diagnostic complet de cet utilisateur. Utilise ces données pour personnaliser tes réponses. Si on te demande "par où commencer", recommande les tâches avec le meilleur ratio score_criteres / temps_gagne. Si on te demande le ROI, utilise les chiffres ci-dessus.`;
}

export function getPageSuggestions(page: PageName, hasAnalysis: boolean): string[] {
  switch (page) {
    case "landing":
      return [
        "Quel métier analyser en premier ?",
        "C'est quoi la méthode DÉCLIC ?",
        "Combien de temps prend un diagnostic ?",
        "Quels métiers sont les plus automatisables ?",
      ];
    case "results":
      return hasAnalysis
        ? [
            "Par quelle tâche commencer ?",
            "Résume mon diagnostic en 3 points",
            "Quel est mon ROI estimé ?",
            "Construis un plan d'action sur 3 mois",
          ]
        : INITIAL_SUGGESTIONS_GENERAL;
    case "methode":
      return [
        "Explique la phase Détecter",
        "Quelle différence entre Concevoir et Lancer ?",
        "Comment appliquer DÉCLIC dans mon équipe ?",
        "Donne un exemple concret pour chaque phase",
      ];
    case "equipe_results":
      return hasAnalysis
        ? [
            "Quels sont les quick wins transverses ?",
            "Quel métier a le plus fort potentiel ?",
            "Propose une roadmap équipe sur 6 mois",
            "Comment prioriser entre les métiers ?",
          ]
        : INITIAL_SUGGESTIONS_GENERAL;
    case "settings":
      return [
        "Quelle clé API choisir ?",
        "OpenAI ou Anthropic — quelle différence ?",
        "Comment obtenir une clé API gratuite ?",
      ];
    default:
      return INITIAL_SUGGESTIONS_GENERAL;
  }
}

export function getPageOpeningMessage(page: PageName, hasAnalysis: boolean, metier?: string): string {
  switch (page) {
    case "results":
      if (hasAnalysis && metier) {
        return `Je connais votre diagnostic complet pour le métier **${metier}**. Je peux vous aider à :\n\n— 🎯 **Prioriser** les tâches à automatiser en premier\n— 🛠 **Construire** un workflow pour une tâche spécifique\n— 📊 **Estimer** le ROI précis de chaque automatisation\n— 📋 **Planifier** un plan d'action étape par étape\n\nQue souhaitez-vous faire ?`;
      }
      return GENERAL_OPENING;
    case "methode":
      return `Vous explorez la **méthode DÉCLIC** — je peux vous expliquer chaque phase en détail, avec des exemples concrets. Quelle phase vous intéresse ?`;
    case "equipe_results":
      if (hasAnalysis) {
        return `J'ai accès au diagnostic complet de votre équipe. Je peux identifier les **quick wins transverses**, prioriser les automatisations par impact, et proposer une **roadmap d'équipe**. Par quoi on commence ?`;
      }
      return GENERAL_OPENING;
    default:
      return GENERAL_OPENING;
  }
}

export function generateSuggestions(lastMessage: string): string[] {
  const suggestions: string[] = [];
  const lower = lastMessage.toLowerCase();

  if (lower.includes("prérequis") || lower.includes("prerequis")) {
    suggestions.push("J'ai tout installé, on continue");
    suggestions.push("Comment créer un compte N8N ?");
  }
  if (lower.includes("nœud") || lower.includes("workflow") || lower.includes("node")) {
    suggestions.push("Donne-moi le JSON complet");
    suggestions.push("Comment tester ce workflow ?");
    suggestions.push("Et si ça ne marche pas ?");
  }
  if (lower.includes("json")) {
    suggestions.push("Comment importer dans N8N ?");
    suggestions.push("Adapter pour Make au lieu de N8N");
    suggestions.push("Ajouter une gestion d'erreurs");
  }
  if (lower.includes("étape") || lower.includes("etape")) {
    suggestions.push("Passe à l'étape suivante");
    suggestions.push("Répète plus simplement");
  }

  suggestions.push("Récapitule tout");
  suggestions.push("Passe à l'étape suivante");

  // Deduplicate and cap at 4
  return [...new Set(suggestions)].slice(0, 4);
}
