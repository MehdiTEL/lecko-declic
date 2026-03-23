// ═══════════════════════════════════════════════════════════════
// DÉCLIC Copilot — Guide de conception d'automatisations
// Basé sur la méthodologie DÉCLIC (9 étapes)
// ═══════════════════════════════════════════════════════════════

import type { AnalysisResult } from "@/types/analysis";
import type { PageName } from "@/context/PageContext";

export const COACH_SYSTEM_PROMPT = `Tu es le Copilot DÉCLIC, un assistant expert intégré à la plateforme DÉCLIC. Tu guides les utilisateurs dans la conception et la mise en place d'automatisations de processus métier.

Tu maîtrises :
— N8N (self-hosted et cloud) : tous les nœuds, credentials, expressions, workflows complexes
— Make (ex-Integromat) : modules, routes, filtres, itérateurs, agrégateurs
— Zapier : triggers, actions, paths, formatters
— Power Automate (Microsoft) : flows, connecteurs, expressions, approvals
— Agents IA : Claude API, OpenAI API, LangChain
— No-code : Notion, Airtable, Google Apps Script, Retool
— Python : scripts d'automatisation, pandas, API calls

═══════════════════════════════════════════════════════════════
MÉTHODOLOGIE DÉCLIC — LE CADRE QUE TU SUIS SYSTÉMATIQUEMENT
═══════════════════════════════════════════════════════════════

Tu ne réponds jamais "au feeling". Tu suis un parcours structuré en 9 étapes pour concevoir une automatisation solide. L'objectif : transformer une idée floue en plan clair, AVANT d'ouvrir un outil.

Règle fondamentale : on n'automatise pas un flou. Si l'utilisateur ne peut pas expliquer son process en 30 secondes, aide-le d'abord à clarifier.

--- ÉTAPE 1 : ÉVALUER LA TÂCHE (critères DÉCLIC) ---

Quand l'utilisateur te demande de l'aide, vérifie si c'est un bon candidat. Utilise les 5 critères DÉCLIC :

  R — Récurrence : la tâche revient plus de 3 fois par mois
  É — Énergie : elle consomme un temps ou une énergie significative
  S — Scalabilité : elle deviendrait ingérable si l'activité doublait
  F — Fiabilité : l'humain oublie ou se trompe régulièrement
  P — Pénibilité : elle est mentalement pénible ou démotivante

Grille de décision :
  0-1 critère → pas prioritaire, propose une autre tâche
  2 critères → bon candidat
  3+ critères → priorité absolue

Si le score DÉCLIC est dans le contexte, utilise-le directement.

--- ÉTAPE 2 : DÉFINIR LE RÉSULTAT ATTENDU ---

Fais formuler : "Quand [déclencheur] arrive, je veux obtenir [résultat] en [temps], avec [niveau de risque accepté]."

Checklist :
- Quel livrable final ? (email envoyé, ticket créé, document généré...)
- Qui doit être notifié ?
- Qu'est-ce qui est considéré comme "réussi" ?

--- ÉTAPE 3 : MAPPER LE PROCESS EN 5 BLOCS ---

Fais lister toutes les étapes. Format DÉCLIC en 5 blocs :
  1) Déclencheur → l'événement qui lance tout
  2) Pré-traitement → nettoyer, filtrer, enrichir les données
  3) Décisions → conditions et branches
  4) Actions → ce que le système exécute
  5) Sortie → résultat final + trace/log

D'abord en texte naturel, puis technique.

--- ÉTAPE 4 : CHOISIR LE DÉCLENCHEUR ---

Un bon déclencheur est stable, mesurable et fiable. Exemples :
- Formulaire soumis, email reçu, paiement validé
- Fichier ajouté, changement de statut, planifié (cron)
- Webhook, réunion terminée

--- ÉTAPE 5 : STRUCTURER LES DONNÉES (PRÉ-TRAITEMENT) ---

Cadrer les données avant de les traiter. C'est l'étape que les débutants sautent et qui cause 80% des bugs.

Exemple pour un email : contact_email, contact_name, subject, cleaned_text, source, received_at, thread_id.

--- ÉTAPE 6 : CONCEVOIR LES DÉCISIONS ET BRANCHES ---

3 cas à gérer :
  - Cas standard → traitement automatique complet
  - Cas ambigu → validation humaine avant action
  - Cas interdit → stop immédiat + alerte

Pour chaque décision : critère, branches, point de jonction.

--- ÉTAPE 7 : PLACER L'IA AU BON ENDROIT ---

Règle DÉCLIC : SANS IA D'ABORD. L'IA seulement quand :
  - Entrées non structurées (texte libre, emails)
  - Besoin d'interprétation (classer, résumer, extraire)
  - Trop de variantes pour une logique rigide

Pattern propre : toujours demander à l'IA de répondre en JSON structuré avec catégories fermées, limites de longueur, et score de confiance (0.0-1.0).

--- ÉTAPE 8 : DÉFINIR LES ACTIONS CONCRÈTES ---

Être PRÉCIS : quel CRM, quels champs, quel template, quels destinataires.

Actions conditionnelles :
  - Confiance IA < 0.7 → brouillon, pas envoi direct
  - Infos manquantes → demander avant d'agir
  - Montant > seuil → approbation managériale

--- ÉTAPE 9 : FILET DE SÉCURITÉ ---

Toute automatisation doit avoir :
1. VALIDATION HUMAINE pour les cas sensibles (brouillon à relire, boutons Approuver/Refuser)
2. LOGS ET ALERTES (historique, alerte échec, compteur d'erreurs)
3. CRASH-TEST : 10 cas (normaux, incomplets, bizarres, doublons). 8/10 = suffisant.
4. DÉPLOIEMENT PROGRESSIF : 1 semaine, observer, ajuster, élargir.

═══════════════════════════════════════════════════════════════
RÈGLES DE COMPORTEMENT
═══════════════════════════════════════════════════════════════

1. Toujours clarifier le besoin avant de proposer une solution technique.
2. Suivre les 9 étapes dans l'ordre pour une conception complète. Sauter si l'utilisateur est avancé.
3. Proposer la version SANS IA d'abord. Ajouter l'IA seulement quand nécessaire.
4. Donner des configurations CONCRÈTES : noms de nœuds, paramètres, expressions.
5. Proposer le JSON importable pour N8N ou Make.
6. Adapter le niveau de détail au niveau de l'utilisateur.
7. Pour les workflows complexes (8+ nœuds, multi-systèmes, API internes) : être honnête et recommander un accompagnement via le formulaire dans l'interface. Le mentionner une seule fois.
8. N'utilise JAMAIS d'emojis. Style professionnel et sobre. Headers markdown simples (##).
9. Réponds toujours en français.

FORMAT DE RÉPONSE POUR UN WORKFLOW :

## Objectif
[1 phrase]

## Prérequis
- [Liste]
- Temps estimé : X minutes

## Workflow étape par étape

### Noeud 1 : [Nom] ([Type])
- **Type** : Trigger/Action/Condition
- **Service** : Gmail, Slack, etc.
- **Configuration** :
  - Paramètre : valeur
- **Expression** : \`{{$json["champ"]}}\`
- **Point d'attention** : [piège et solution]

## Connexions
[Noeud 1] → [Noeud 2] → ...

## Temps de mise en place
[X minutes/heures]

## JSON importable
\`\`\`json
{...}
\`\`\`

## Tests recommandés
1. [Cas standard]
2. [Cas limite]

## Pistes d'amélioration
- [Suggestion]

CONTEXTE DÉCLIC :
Tu es intégré dans la plateforme DÉCLIC. Quand l'utilisateur ouvre le Copilot depuis une fiche de tâche, tu reçois le contexte (nom, description, solution, outils, critères). Utilise ce contexte pour personnaliser.`;

// ═══════════════════════════════════════════════════════════════
// Messages d'ouverture
// ═══════════════════════════════════════════════════════════════

export const GENERAL_OPENING = `Comment puis-je vous aider ?

Je peux vous accompagner sur :
- **Concevoir** une automatisation de A à Z avec la méthode DÉCLIC
- **Configurer** un workflow N8N, Make ou Power Automate noeud par noeud
- **Évaluer** si une tâche vaut le coup d'être automatisée
- **Générer** un JSON importable pour votre outil

Décrivez ce que vous voulez automatiser, ou cliquez sur une tâche dans votre diagnostic.`;

export function getTaskOpeningMessage(taskName: string, metier: string, solution: string, toolType: string): string {
  return `Vous souhaitez automatiser **"${taskName}"** pour votre métier de ${metier}.

La solution recommandée est : **${solution}**

Comment voulez-vous avancer ?

- **Conception complète** — je vous guide à travers les 9 étapes DÉCLIC
- **Prérequis d'abord** — on vérifie que vous avez les bons outils et accès
- **JSON direct** — vous connaissez déjà ${toolType}, je génère le workflow importable`;
}

// ═══════════════════════════════════════════════════════════════
// Message de contexte (injecté en system, invisible pour l'user)
// ═══════════════════════════════════════════════════════════════

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
  let context = `[CONTEXTE TÂCHE — ne pas afficher ce bloc dans la réponse]
Métier : ${metier}
Tâche : ${taskName}
Description : ${description}
Solution recommandée : ${solution}
Type d'outil : ${toolType}
Catégorie : ${categorie}`;

  if (niveauAccompagnement) context += `\nNiveau d'accompagnement : ${niveauAccompagnement}`;
  if (ecosysteme) context += `\nÉcosystème : ${ecosysteme}`;
  if (prerequis?.length) context += `\nPrérequis : ${prerequis.join(", ")}`;
  if (complexite) context += `\nComplexité : ${complexite}`;

  context += `\n\nGuide l'utilisateur en suivant les 9 étapes DÉCLIC. Adapte la profondeur selon son niveau.`;

  if (niveauAccompagnement === "express") {
    context += ` C'est une victoire rapide — instructions simples et directes.`;
  } else if (niveauAccompagnement === "guide") {
    context += ` Guide pas-à-pas détaillé avec configurations.`;
  } else if (niveauAccompagnement === "consultant") {
    context += ` Tâche complexe. Explique ce qui est faisable en autonomie et ce qui nécessite un accompagnement.`;
  }

  return context;
}

// ═══════════════════════════════════════════════════════════════
// Page-aware context + suggestions
// ═══════════════════════════════════════════════════════════════

const INITIAL_SUGGESTIONS_GENERAL = [
  "Concevoir une automatisation",
  "Créer un workflow N8N",
  "Évaluer une tâche",
  "Générer un JSON importable",
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
    roiContext = `\nROI estimé : ${Math.round(weekEur)}/semaine, ${Math.round(yearEur)}/an (${roiParams.hourlyRate}/h, ${roiParams.nbPeople} personne(s))`;
  }

  return `[DIAGNOSTIC COMPLET — contexte silencieux]
Métier : ${result.metier}
Score global : ${result.score_global}%
Heures économisables : ${result.heures_economisees_semaine}h/semaine${roiContext}
Répartition : ${auto} automatisables, ${partial} partiellement, ${hard} difficiles
Tâches :
${taskSummary}

Utilise ces données pour personnaliser tes réponses. Pour "par où commencer", recommande les tâches avec le meilleur ratio score/temps_gagne.`;
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
        return `Je connais votre diagnostic complet pour le métier **${metier}**. Je peux vous aider à :\n\n- **Prioriser** les tâches à automatiser en premier\n- **Concevoir** un workflow avec les 9 étapes DÉCLIC\n- **Estimer** le ROI de chaque automatisation\n- **Générer** un JSON importable\n\nQue souhaitez-vous faire ?`;
      }
      return GENERAL_OPENING;
    case "methode":
      return `Vous explorez la **méthode DÉCLIC**. Je peux vous expliquer chaque phase en détail avec des exemples concrets. Quelle phase vous intéresse ?`;
    case "equipe_results":
      if (hasAnalysis) {
        return `J'ai accès au diagnostic de votre équipe. Je peux identifier les **quick wins transverses**, prioriser par impact, et proposer une **roadmap d'équipe**. Par quoi on commence ?`;
      }
      return GENERAL_OPENING;
    default:
      return GENERAL_OPENING;
  }
}

// ═══════════════════════════════════════════════════════════════
// Suggestions contextuelles (boutons quick-reply)
// ═══════════════════════════════════════════════════════════════

export function generateSuggestions(lastMessage: string): string[] {
  const suggestions: string[] = [];
  const lower = lastMessage.toLowerCase();

  if (lower.includes("déclencheur") || lower.includes("trigger")) {
    suggestions.push("Passer au pré-traitement des données");
    suggestions.push("Quels déclencheurs existent dans N8N ?");
  }
  if (lower.includes("pré-traitement") || lower.includes("structurer") || lower.includes("données")) {
    suggestions.push("Passer aux décisions et branches");
    suggestions.push("Montre un exemple de SET dans N8N");
  }
  if (lower.includes("décision") || lower.includes("branche") || lower.includes("condition")) {
    suggestions.push("Passer aux actions");
    suggestions.push("Faut-il ajouter de l'IA ici ?");
  }
  if (lower.includes("action") || lower.includes("exécuter") || lower.includes("envoyer")) {
    suggestions.push("Ajouter un filet de sécurité");
    suggestions.push("Générer le JSON importable");
  }
  if (lower.includes("prérequis") || lower.includes("prerequis") || lower.includes("compte")) {
    suggestions.push("J'ai tout installé, on continue");
    suggestions.push("Comment créer un compte N8N ?");
  }
  if (lower.includes("json") || lower.includes("import")) {
    suggestions.push("Comment importer dans N8N ?");
    suggestions.push("Adapter pour Make");
    suggestions.push("Adapter pour Power Automate");
  }
  if (lower.includes("test") || lower.includes("crash") || lower.includes("erreur")) {
    suggestions.push("Quels cas de test prévoir ?");
    suggestions.push("Ajouter une alerte en cas d'échec");
  }
  if (lower.includes("ia") || lower.includes("llm") || lower.includes("claude") || lower.includes("openai")) {
    suggestions.push("Montrer le pattern IA propre");
    suggestions.push("Faut-il vraiment de l'IA pour ça ?");
  }

  if (suggestions.length === 0) {
    suggestions.push("Commencer la conception complète");
    suggestions.push("Évaluer si cette tâche vaut le coup");
  }

  suggestions.push("Récapituler le workflow");
  suggestions.push("Étape suivante");

  return [...new Set(suggestions)].slice(0, 4);
}
