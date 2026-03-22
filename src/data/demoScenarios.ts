import type { AnalysisResult, AnalysisTask } from "@/types/analysis";

export interface DemoScenario {
  id: string;
  label: string;
  description: string;
  result: AnalysisResult;
  roiParams: { hourlyRate: number; nbPeople: number };
  context: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 1 : Chef de projet digital - Collectivite territoriale
// ─────────────────────────────────────────────────────────────────────────────

const collectiviteTasks: AnalysisTask[] = [
  {
    nom: "Reporting hebdomadaire avancement migration M365",
    description:
      "Consolider les KPIs de migration (adoption, tickets, formations) depuis SharePoint Lists, Planner et les logs Azure AD pour produire un tableau de bord hebdomadaire destination de la DGS.",
    categorie: "automatisable",
    solution:
      "Power Automate collecte automatiquement les donnees SharePoint Lists + Planner chaque vendredi, alimente un rapport Power BI embed dans une page SharePoint, et envoie un resume par mail Adaptive Card aux directeurs.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 2.5,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 5,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "M365_PowerAutomate",
    outils_specifiques: ["Power Automate", "Power BI", "SharePoint Lists", "Planner"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "La connexion Power BI + SharePoint Lists necessite un parametrage initial guide pour les sources de donnees et les rafraichissements planifies.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 5,
    prerequis: ["Licence Power BI Pro ou Premium per User", "SharePoint Lists de suivi migration en place"],
  },
  {
    nom: "Diffusion et archivage des comptes-rendus de COPIL",
    description:
      "Apres chaque COPIL migration, mettre en forme le CR, le deposer dans la bonne bibliotheque SharePoint, notifier les participants et archiver la version signee.",
    categorie: "automatisable",
    solution:
      "Un flux Power Automate declenche sur depot du CR brut dans un dossier Teams : conversion en PDF, deplacement dans la bibliotheque SharePoint dediee avec metadonnees automatiques (date, instance, participants), notification Adaptive Card dans le canal COPIL.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "M365_PowerAutomate",
    outils_specifiques: ["Power Automate", "SharePoint Online", "Microsoft Teams"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Flux standard avec des connecteurs natifs, realisable en autonomie avec un template fourni.",
    complexite: "faible",
    temps_mise_en_place_jours: 1,
    prerequis: ["Arborescence SharePoint COPIL definie"],
  },
  {
    nom: "Suivi des tickets de support post-migration par direction",
    description:
      "Suivre les tickets ServiceNow / GLPI ouverts par les agents apres chaque vague de migration, categoriser par direction et priorite, alerter quand un seuil est depasse.",
    categorie: "partiellement_automatisable",
    solution:
      "Power Automate interroge l'API du ITSM toutes les 2h, categorise les tickets par direction via SharePoint Lists, met a jour un dashboard Power BI et envoie une alerte Teams quand le volume depasse le seuil fixe par direction.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.5,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: true, penibilite: false },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "M365_PowerAutomate",
    outils_specifiques: ["Power Automate", "Power BI", "SharePoint Lists", "API ITSM"],
    niveau_accompagnement: "consultant",
    raison_accompagnement:
      "L'integration ITSM (ServiceNow/GLPI) avec Power Automate necessite un connecteur personnalise et une analyse des donnees specifiques a la collectivite.",
    complexite: "elevee",
    temps_mise_en_place_jours: 10,
    prerequis: [
      "Acces API ITSM en lecture",
      "Referentiel des directions dans SharePoint Lists",
      "Seuils d'alerte valides par la DSI",
    ],
  },
  {
    nom: "Generation des supports de formation agents",
    description:
      "Creer les guides utilisateur et fiches reflexes pour chaque vague de migration (Outlook, Teams, SharePoint, OneDrive) adaptes au niveau des agents.",
    categorie: "partiellement_automatisable",
    solution:
      "Copilot dans Word genere une premiere version du support a partir d'un prompt structure et du referentiel de formation SharePoint. Le chef de projet valide, ajuste et publie dans la bibliotheque de formation.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 1.5,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: false, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La generation de contenu pedagogique adapte au niveau des agents necessite un LLM pour produire des textes clairs et structures a partir du referentiel technique.",
    ecosysteme: "M365_Copilot",
    outils_specifiques: ["Microsoft 365 Copilot", "Word", "SharePoint"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "Le prompt engineering pour des supports de formation de qualite necessite un accompagnement initial pour calibrer le ton et le niveau.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 3,
    prerequis: ["Licence Copilot for Microsoft 365", "Referentiel de formation existant"],
  },
  {
    nom: "Planification et convocation des sessions de formation",
    description:
      "Organiser les creneaux de formation par vague de migration, envoyer les convocations, gerer les inscriptions et relances pour les 15 directions.",
    categorie: "automatisable",
    solution:
      "Microsoft Bookings gere les creneaux, Power Automate envoie les convocations personnalisees par direction via Adaptive Cards Teams, relance automatique J-2 et J+1 pour recueillir le feedback via Forms.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "M365_PowerAutomate",
    outils_specifiques: ["Power Automate", "Microsoft Bookings", "Microsoft Teams", "Microsoft Forms"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Bookings et Power Automate natifs, templates disponibles. Configuration en quelques heures.",
    complexite: "faible",
    temps_mise_en_place_jours: 2,
    prerequis: ["Calendrier de migration par direction valide"],
  },
  {
    nom: "Veille reglementaire RGPD et SecNumCloud",
    description:
      "Suivre les evolutions reglementaires (CNIL, ANSSI, DINUM) impactant le projet M365 et produire une note de synthese mensuelle pour la DSI.",
    categorie: "partiellement_automatisable",
    solution:
      "Un agent IA base sur Copilot Studio scrute les flux RSS CNIL/ANSSI/DINUM, identifie les publications pertinentes, genere un brouillon de note de synthese dans Word que le chef de projet revoit et valide avant diffusion.",
    type_outil: "Agent IA",
    temps_gagne_heures_semaine: 0.5,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: true },
    score_criteres: 3,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "L'analyse et la synthese de publications reglementaires multisources necessite un LLM pour extraire les points d'impact projet et rediger une note structuree.",
    ecosysteme: "Agent_IA",
    outils_specifiques: ["Copilot Studio", "Power Automate", "Word", "RSS CNIL/ANSSI"],
    niveau_accompagnement: "consultant",
    raison_accompagnement:
      "La conception d'un agent de veille reglementaire fiable necessite une expertise metier (conformite secteur public) et un travail de prompt engineering avance.",
    complexite: "elevee",
    temps_mise_en_place_jours: 12,
    prerequis: [
      "Licence Copilot Studio",
      "Sources RSS identifiees et validees",
      "Criteres de pertinence definis avec le RSSI",
    ],
  },
  {
    nom: "Consolidation des indicateurs d'adoption Teams",
    description:
      "Extraire les metriques d'usage Teams (messages, reunions, fichiers) par direction depuis le centre d'administration M365 et produire un bilan mensuel d'adoption.",
    categorie: "automatisable",
    solution:
      "Power Automate appelle l'API Microsoft Graph (rapports d'utilisation) mensuellement, stocke les donnees dans SharePoint Lists, alimente un rapport Power BI avec ventilation par direction et tendances.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 5,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "M365_PowerAutomate",
    outils_specifiques: ["Power Automate", "Microsoft Graph API", "Power BI", "SharePoint Lists"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "L'utilisation de l'API Graph pour les rapports d'activite necessite un enregistrement d'app Azure AD et des permissions specifiques.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 5,
    prerequis: [
      "App Registration Azure AD avec permissions Reports.Read.All",
      "Referentiel directions / groupes Azure AD",
    ],
  },
  {
    nom: "Redaction des notes de cadrage par lot de migration",
    description:
      "Produire une note de cadrage pour chaque lot de migration (perimetre, planning, risques, criteres de GO) a partir des donnees projet existantes.",
    categorie: "partiellement_automatisable",
    solution:
      "Copilot dans Word genere la note de cadrage a partir d'un template et des donnees du lot (SharePoint Lists). Le chef de projet complete les sections risques et criteres specifiques puis valide.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: true },
    score_criteres: 3,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La structuration et la redaction d'une note de cadrage a partir de donnees brutes necessite un LLM pour produire un document coherent et professionnel.",
    ecosysteme: "M365_Copilot",
    outils_specifiques: ["Microsoft 365 Copilot", "Word", "SharePoint Lists"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Utilisation directe de Copilot dans Word avec un prompt bien calibre. Template fourni.",
    complexite: "faible",
    temps_mise_en_place_jours: 1,
    prerequis: ["Licence Copilot for Microsoft 365", "Template de note de cadrage valide"],
  },
  {
    nom: "Gestion des demandes d'habilitation SharePoint",
    description:
      "Traiter les demandes d'acces aux sites SharePoint des directions : reception, validation hierarchique, application des droits, notification.",
    categorie: "automatisable",
    solution:
      "Power Automate orchestre le workflow complet : formulaire Forms pour la demande, approbation hierarchique via Adaptive Card, application automatique des droits SharePoint via Graph API, notification de confirmation.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "M365_PowerAutomate",
    outils_specifiques: ["Power Automate", "Microsoft Forms", "SharePoint Online", "Microsoft Graph API"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "Le workflow d'approbation avec application automatique des droits SharePoint necessite un parametrage precis des permissions Graph.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 4,
    prerequis: [
      "Politique d'habilitation SharePoint validee",
      "Matrice des droits par type de site",
    ],
  },
  {
    nom: "Preparation des comites de pilotage",
    description:
      "Compiler les elements pour chaque COPIL : avancement global, indicateurs cles, points bloquants, decisions a prendre, et generer le support de presentation.",
    categorie: "partiellement_automatisable",
    solution:
      "Copilot dans PowerPoint genere le support a partir des donnees consolidees (Power BI, SharePoint Lists). Power Automate pre-remplit les slides avec les KPIs actualises. Le chef de projet ajuste la narration et les recommandations.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 0.5,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: true },
    score_criteres: 3,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La generation d'un support de presentation structure avec narration coherente a partir de donnees multisources necessite un LLM.",
    ecosysteme: "M365_Copilot",
    outils_specifiques: ["Microsoft 365 Copilot", "PowerPoint", "Power BI", "SharePoint Lists"],
    niveau_accompagnement: "consultant",
    raison_accompagnement:
      "L'integration Power BI + Copilot PowerPoint pour des supports de COPIL fiables necessite une calibration initiale avec l'expertise d'un consultant.",
    complexite: "elevee",
    temps_mise_en_place_jours: 8,
    prerequis: [
      "Licence Copilot for Microsoft 365",
      "Dashboard Power BI operationnel",
      "Template COPIL valide par la DGS",
    ],
  },
];

const scenario1: DemoScenario = {
  id: "chef-projet-collectivite",
  label: "Chef de projet digital \u2014 Collectivit\u00e9",
  description: "Sc\u00e9nario secteur public : migration M365, 15 m\u00e9tiers, 2500 agents",
  result: {
    metier: "Chef de projet digital",
    score_global: 72,
    heures_economisees_semaine: 11.5,
    taches: collectiviteTasks,
  },
  roiParams: { hourlyRate: 55, nbPeople: 3 },
  context:
    "Collectivit\u00e9 territoriale \u00cele-de-France, 2500 agents, migration M365 E3 en cours, DSI de 12 personnes",
};

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 2 : Equipe Marketing - PME Tech
// ─────────────────────────────────────────────────────────────────────────────

const marketingTasks: AnalysisTask[] = [
  {
    nom: "Reporting performance campagnes multi-canal",
    description:
      "Agreger les KPIs des campagnes emailing (HubSpot), SEA (Google Ads), SEO (Search Console) et social (LinkedIn/Meta) dans un reporting hebdomadaire consolide.",
    categorie: "automatisable",
    solution:
      "Make.com connecte les APIs HubSpot, Google Ads, Search Console et LinkedIn Ads. Les donnees sont centralisees dans Google Sheets et alimentent un dashboard Looker Studio mis a jour automatiquement chaque lundi matin.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 2.5,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 5,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Make_Zapier",
    outils_specifiques: ["Make.com", "HubSpot", "Google Ads API", "Google Sheets", "Looker Studio"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "La connexion multi-API (HubSpot + Google Ads + Search Console) dans Make necessite un parametrage initial des scenarios et des transformations de donnees.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 5,
    prerequis: [
      "Comptes publicitaires avec acces API",
      "Compte Make.com (plan Teams)",
      "Nomenclature UTM harmonisee",
    ],
  },
  {
    nom: "Nurturing leads post-demo automatise",
    description:
      "Declencher automatiquement une sequence d'emails personnalises apres chaque demo produit, adaptes au profil du prospect et a son engagement.",
    categorie: "automatisable",
    solution:
      "Workflow HubSpot natif : a la cloture de l'activite 'Demo realisee', le lead entre dans une sequence de nurturing de 5 emails sur 3 semaines avec scoring comportemental et branchement conditionnel selon les ouvertures/clics.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.5,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Natif_SaaS",
    outils_specifiques: ["HubSpot Marketing Hub", "HubSpot CRM"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Fonctionnalite native de HubSpot Workflows. Configuration standard avec les templates fournis.",
    complexite: "faible",
    temps_mise_en_place_jours: 2,
    prerequis: ["HubSpot Marketing Hub Pro", "Templates emails valides"],
  },
  {
    nom: "Creation de visuels pour les reseaux sociaux",
    description:
      "Produire chaque semaine 4 a 6 visuels (posts LinkedIn, stories Instagram, bannieres) en respectant la charte graphique.",
    categorie: "partiellement_automatisable",
    solution:
      "L'equipe utilise Canva avec les templates de marque pre-configures. Un agent IA (Claude via API) genere les accroches et textes d'accompagnement a partir du calendrier editorial Google Sheets. Make.com orchestre la publication programmee.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 2.0,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: false, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La generation de textes d'accroche adaptes au canal (LinkedIn vs Instagram) et au persona necessite un LLM pour varier le ton et les angles.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "Canva Pro", "Make.com", "Google Sheets"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "Le calibrage du prompt pour les accroches (ton, persona, contraintes par canal) necessite un accompagnement initial.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 4,
    prerequis: [
      "Canva Pro avec Brand Kit configure",
      "Calendrier editorial dans Google Sheets",
      "Cle API Claude / OpenAI",
    ],
  },
  {
    nom: "Enrichissement et scoring des leads entrants",
    description:
      "Enrichir automatiquement les nouveaux leads (taille entreprise, secteur, technos utilisees) et calculer un lead score base sur le profil et le comportement.",
    categorie: "automatisable",
    solution:
      "Make.com intercepte chaque nouveau contact HubSpot, appelle l'API Clearbit/Apollo pour l'enrichissement firmographique, met a jour les proprietes HubSpot et recalcule le lead score selon la matrice definie. Alerte Slack au commercial si MQL.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.5,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Make_Zapier",
    outils_specifiques: ["Make.com", "HubSpot CRM", "Clearbit API", "Slack"],
    niveau_accompagnement: "consultant",
    raison_accompagnement:
      "La definition de la matrice de scoring et l'integration API d'enrichissement necessitent un audit du funnel et une expertise RevOps.",
    complexite: "elevee",
    temps_mise_en_place_jours: 8,
    prerequis: [
      "Compte Clearbit ou Apollo.io",
      "Matrice ICP documentee",
      "Proprietes custom HubSpot definies",
    ],
  },
  {
    nom: "Redaction de brouillons d'articles de blog SEO",
    description:
      "Produire 2 articles de blog par semaine de 1200-1500 mots, optimises SEO, alignes avec le calendrier editorial et la strategie de mots-cles.",
    categorie: "partiellement_automatisable",
    solution:
      "Claude (API) genere un brouillon structure a partir du brief SEO (mot-cle principal, mots-cles secondaires, intent, outline). Le content manager revoit, enrichit avec des donnees internes et publie via le CMS HubSpot.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 2.0,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: false, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La redaction d'articles longs, structures et optimises SEO necessite un LLM pour produire un premier jet de qualite exploitable.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "HubSpot CMS", "Semrush", "Google Docs"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "Le prompt engineering pour des articles SEO-friendly avec le bon ton de marque necessite une phase de calibrage accompagnee.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 3,
    prerequis: [
      "Strategie de mots-cles documentee (Semrush)",
      "Guidelines editoriales de la marque",
      "Cle API Claude",
    ],
  },
  {
    nom: "Synchronisation CRM-outil de facturation",
    description:
      "Synchroniser les deals gagnes dans HubSpot CRM avec l'outil de facturation (Pennylane) : creation automatique du client et de la facture proforma.",
    categorie: "automatisable",
    solution:
      "Make.com detecte le passage en 'Closed Won' dans HubSpot, cree ou met a jour le client dans Pennylane via API, genere la facture proforma avec les lignes de commande, et notifie le DAF sur Slack.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Make_Zapier",
    outils_specifiques: ["Make.com", "HubSpot CRM", "Pennylane API", "Slack"],
    niveau_accompagnement: "consultant",
    raison_accompagnement:
      "L'integration CRM-Facturation touche aux donnees financieres et necessite une cartographie precise des champs et une validation comptable.",
    complexite: "elevee",
    temps_mise_en_place_jours: 7,
    prerequis: [
      "Acces API Pennylane",
      "Mapping champs HubSpot <-> Pennylane valide par le DAF",
      "Plan de comptes configure",
    ],
  },
  {
    nom: "Monitoring des mentions de marque et concurrents",
    description:
      "Surveiller en continu les mentions de la marque et des 3 principaux concurrents sur le web, les reseaux sociaux et les sites d'avis (G2, Capterra).",
    categorie: "partiellement_automatisable",
    solution:
      "Google Alerts + Mention.com captent les mentions. Make.com centralise les alertes dans un Google Sheet, Claude API categorise le sentiment et la priorite. Alerte Slack temps reel pour les mentions negatives ou a fort engagement.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: false, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "L'analyse de sentiment et la categorisation automatique des mentions necessitent un LLM pour distinguer les mentions critiques des simples citations.",
    ecosysteme: "Make_Zapier",
    outils_specifiques: ["Make.com", "Mention.com", "Claude API", "Google Sheets", "Slack"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "La configuration des filtres de pertinence et du prompt de categorisation necessite un guidage initial.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 4,
    prerequis: ["Compte Mention.com", "Liste de mots-cles marque et concurrents"],
  },
  {
    nom: "Gestion du calendrier editorial et publication",
    description:
      "Maintenir le calendrier editorial (blog, social, newsletter), assigner les contenus, envoyer les rappels et publier automatiquement aux heures optimales.",
    categorie: "automatisable",
    solution:
      "Google Sheets sert de calendrier editorial centralise. Google Apps Script envoie les rappels automatiques par email et Slack J-3 avant la date de publication. Make.com declenche la publication programmee sur LinkedIn et le blog HubSpot.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Google_AppsScript",
    outils_specifiques: ["Google Apps Script", "Google Sheets", "Make.com", "Slack", "HubSpot CMS"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Apps Script standard pour les rappels, et connecteurs Make natifs pour la publication. Realisation rapide.",
    complexite: "faible",
    temps_mise_en_place_jours: 2,
    prerequis: ["Calendrier editorial structure dans Google Sheets"],
  },
  {
    nom: "Generation de landing pages pour les campagnes",
    description:
      "Creer rapidement des landing pages pour chaque campagne marketing (webinar, ebook, essai gratuit) avec formulaire, tracking et A/B test.",
    categorie: "partiellement_automatisable",
    solution:
      "HubSpot Landing Pages avec templates pre-configures. Copilot IA (Claude) propose les variantes de headlines et CTA pour l'A/B test a partir du brief campagne. Le responsable marketing selectionne et publie.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: false },
    score_criteres: 2,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La generation de variantes de headlines et CTA performants pour l'A/B testing necessite un LLM pour explorer un large espace creatif.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "HubSpot CMS", "Google Analytics 4"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Templates HubSpot existants et utilisation ponctuelle de Claude. Pas de configuration complexe.",
    complexite: "faible",
    temps_mise_en_place_jours: 1,
    prerequis: ["HubSpot Marketing Hub Pro", "Templates landing page configures"],
  },
  {
    nom: "Analyse et synthese des retours clients (NPS/CSAT)",
    description:
      "Analyser mensuellement les retours du NPS et des enquetes CSAT pour identifier les tendances, pain points et opportunites produit.",
    categorie: "partiellement_automatisable",
    solution:
      "Google Forms collecte les reponses. Make.com centralise dans Google Sheets. Claude API analyse les verbatims, categorise les themes (UX, pricing, support, features) et genere une synthese avec recommandations priorisees.",
    type_outil: "Agent IA",
    temps_gagne_heures_semaine: 0.5,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: false, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "L'analyse semantique de verbatims clients et la detection de themes emergents necessitent un LLM pour traiter le langage naturel a grande echelle.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "Make.com", "Google Forms", "Google Sheets"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "Le prompt de categorisation et d'analyse des verbatims doit etre calibre sur les specificites produit et marche.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 3,
    prerequis: [
      "Processus NPS/CSAT en place",
      "Historique de reponses disponible pour calibrage",
    ],
  },
];

const scenario2: DemoScenario = {
  id: "equipe-marketing-pme",
  label: "\u00c9quipe Marketing \u2014 PME Tech",
  description: "Sc\u00e9nario PME : \u00e9quipe de 5, stack Google Workspace + HubSpot",
  result: {
    metier: "Responsable Marketing",
    score_global: 78,
    heures_economisees_semaine: 14,
    taches: marketingTasks,
  },
  roiParams: { hourlyRate: 45, nbPeople: 5 },
  context:
    "PME SaaS B2B, 45 collaborateurs, \u00e9quipe marketing de 5 personnes, stack Google + HubSpot",
};

// ─────────────────────────────────────────────────────────────────────────────
// Scenario 3 : Consultant Senior - Cabinet de conseil
// ─────────────────────────────────────────────────────────────────────────────

const consultantTasks: AnalysisTask[] = [
  {
    nom: "Preparation des propositions commerciales",
    description:
      "Rediger les propositions commerciales (contexte client, approche, planning, budget) a partir des notes de cadrage et du referentiel de missions similaires.",
    categorie: "partiellement_automatisable",
    solution:
      "Claude API genere un brouillon de proposition a partir d'un prompt structure (contexte client, enjeux, methodologie DÉCLIC). Le consultant ajuste, personnalise avec les references client pertinentes et finalise dans Google Docs.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 2.0,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: true },
    score_criteres: 3,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La redaction d'une proposition commerciale structuree a partir de notes de cadrage brutes necessite un LLM pour produire un document coherent et convaincant.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "Google Docs", "Google Drive"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Utilisation directe de Claude avec un prompt de proposition commerciale. Templates et exemples fournis.",
    complexite: "faible",
    temps_mise_en_place_jours: 1,
    prerequis: ["Cle API Claude", "Referentiel de propositions existantes dans Drive"],
  },
  {
    nom: "Synthese des entretiens de diagnostic",
    description:
      "Apres chaque entretien de diagnostic (8 a 12 par mission), transcrire, synthetiser les points cles, verbatims et recommandations dans un format exploitable.",
    categorie: "partiellement_automatisable",
    solution:
      "Otter.ai transcrit automatiquement l'entretien. Claude API analyse la transcription, extrait les themes cles, les verbatims marquants et les recommandations, et produit une fiche synthese structuree dans Google Docs.",
    type_outil: "Agent IA",
    temps_gagne_heures_semaine: 2.0,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: false, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "L'extraction de themes et de verbatims pertinents a partir d'une transcription longue (45-60 min) necessite un LLM pour distinguer l'essentiel du bruit.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "Otter.ai", "Google Docs"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "Le calibrage du prompt d'analyse d'entretien (grille thematique, format de sortie) necessite un accompagnement initial pour s'adapter a la methodologie du cabinet.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 3,
    prerequis: [
      "Compte Otter.ai (ou equivalent transcription)",
      "Grille d'entretien type du cabinet",
    ],
  },
  {
    nom: "Suivi du temps passe par mission et facturation",
    description:
      "Consolider les heures saisies (Toggl/Harvest), verifier la coherence avec les budgets vendus, preparer les elements de facturation mensuelle.",
    categorie: "automatisable",
    solution:
      "Make.com collecte les entrees Toggl Track par projet, compare avec les budgets dans Google Sheets (ref mission), calcule les ecarts et genere un pre-remplissage de facture pour Pennylane. Alerte Slack quand un budget atteint 80%.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Make_Zapier",
    outils_specifiques: ["Make.com", "Toggl Track API", "Google Sheets", "Pennylane API", "Slack"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "L'integration Toggl + Pennylane avec les regles de facturation specifiques (regie, forfait, avenant) necessite un parametrage guide.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 5,
    prerequis: [
      "Toggl Track avec projets structures",
      "Referentiel missions dans Google Sheets",
      "Acces API Pennylane",
    ],
  },
  {
    nom: "Veille sectorielle et competitive",
    description:
      "Suivre l'actualite des secteurs clients (digital workplace, transformation digitale, IA) et des concurrents pour alimenter les propositions et les livrables.",
    categorie: "partiellement_automatisable",
    solution:
      "Un agent IA base sur Claude orchestre la veille : collecte RSS (Feedly), analyse des publications LinkedIn cles, categorisation et scoring de pertinence, synthese hebdomadaire dans Notion avec tags par secteur/client.",
    type_outil: "Agent IA",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: true, scalabilite: true, fiabilite: false, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "L'analyse, la categorisation et la synthese de contenus multisources necessitent un LLM pour produire une veille actionnable et non un simple flux d'articles.",
    ecosysteme: "Agent_IA",
    outils_specifiques: ["Claude API", "Feedly", "Notion", "Make.com"],
    niveau_accompagnement: "consultant",
    raison_accompagnement:
      "La conception d'un agent de veille sectorielle fiable necessite une expertise metier pour definir les criteres de pertinence et les sources strategiques.",
    complexite: "elevee",
    temps_mise_en_place_jours: 10,
    prerequis: [
      "Compte Feedly Pro",
      "Base Notion structuree",
      "Liste de sources et mots-cles validee",
    ],
  },
  {
    nom: "Generation de slides de livrable client",
    description:
      "Produire les slides de restitution (diagnostic, recommandations, feuille de route) a partir des analyses et donnees collectees en mission.",
    categorie: "partiellement_automatisable",
    solution:
      "Claude API genere le contenu textuel structure des slides (titres, bullet points, speaker notes) a partir du document d'analyse. Le consultant importe dans Google Slides avec le template du cabinet et ajuste la mise en forme.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 1.5,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: true },
    score_criteres: 3,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La structuration d'analyses complexes en messages cles percutants pour des slides de presentation necessite un LLM pour synthetiser et hierarchiser l'information.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "Google Slides", "Google Docs"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Utilisation directe de Claude avec un prompt de structuration de slides. Approche simple et immeditament productive.",
    complexite: "faible",
    temps_mise_en_place_jours: 1,
    prerequis: ["Cle API Claude", "Templates Google Slides du cabinet"],
  },
  {
    nom: "Redaction du rapport de mission final",
    description:
      "Compiler et rediger le rapport de mission final (50-80 pages) : executive summary, diagnostic, recommandations, feuille de route, annexes.",
    categorie: "difficilement_automatisable",
    solution:
      "Claude API assiste la redaction section par section : genere les brouillons a partir des notes de mission, harmonise le style, propose des reformulations. Le consultant garde la main sur le fond et la validation de chaque section.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 0.5,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: true },
    score_criteres: 3,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "L'harmonisation stylistique et la reformulation de sections techniques en langage client necessitent un LLM pour maintenir la coherence sur un document long.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "Google Docs"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "L'utilisation efficace de Claude pour un rapport long necessite un workflow structure (section par section) et un prompt system bien calibre.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 3,
    prerequis: ["Template de rapport du cabinet", "Notes de mission structurees"],
  },
  {
    nom: "Gestion administrative des missions (contracts, avenants)",
    description:
      "Generer les contrats de mission, avenants, lettres de mission a partir des propositions commerciales validees.",
    categorie: "automatisable",
    solution:
      "Google Apps Script genere automatiquement le contrat a partir d'un template Google Docs et des donnees de la proposition (Google Sheets). Envoi via DocuSign pour signature electronique. Archivage automatique dans Drive.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 0.5,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Google_AppsScript",
    outils_specifiques: ["Google Apps Script", "Google Docs", "Google Sheets", "DocuSign"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Script Apps Script standard de mail merge. Templates et code fournis.",
    complexite: "faible",
    temps_mise_en_place_jours: 2,
    prerequis: ["Templates de contrats valides juridiquement", "Compte DocuSign"],
  },
  {
    nom: "Preparation des ateliers collaboratifs client",
    description:
      "Concevoir les ateliers (objectifs, deroulement, supports, exercices) pour les phases de co-construction avec les equipes client.",
    categorie: "partiellement_automatisable",
    solution:
      "Claude API genere un scenario d'atelier complet (timing, consignes animateur, templates Miro) a partir du brief (objectifs, participants, duree, livrables attendus). Le consultant personnalise et adapte au contexte client.",
    type_outil: "Copilot / Assistant IA",
    temps_gagne_heures_semaine: 1.0,
    criteres: { recurrence: true, energie: true, scalabilite: false, fiabilite: false, penibilite: false },
    score_criteres: 2,
    peut_fonctionner_sans_ia: false,
    raison_ia:
      "La generation de scenarios d'ateliers adaptes aux objectifs et au public necessite un LLM pour proposer des exercices et des dynamiques pertinentes.",
    ecosysteme: "LLM_API",
    outils_specifiques: ["Claude API", "Miro", "Google Slides"],
    niveau_accompagnement: "express",
    raison_accompagnement:
      "Utilisation directe de Claude pour generer des trames d'ateliers. Prompt simple et resultats immediatement exploitables.",
    complexite: "faible",
    temps_mise_en_place_jours: 1,
    prerequis: ["Cle API Claude", "Compte Miro"],
  },
  {
    nom: "CRM interne et pipeline commercial",
    description:
      "Maintenir a jour le pipeline commercial du cabinet : opportunites, statuts, probabilites, previsions de CA, relances a planifier.",
    categorie: "automatisable",
    solution:
      "Notion sert de CRM leger avec des vues Kanban par statut. Make.com synchronise les evenements cles (envoi proposition, relance, signature) avec Google Calendar et envoie des rappels Slack automatiques pour les relances planifiees.",
    type_outil: "Automatisation No-Code",
    temps_gagne_heures_semaine: 0.5,
    criteres: { recurrence: true, energie: false, scalabilite: true, fiabilite: true, penibilite: true },
    score_criteres: 4,
    peut_fonctionner_sans_ia: true,
    raison_ia: null,
    ecosysteme: "Notion_Airtable",
    outils_specifiques: ["Notion", "Make.com", "Google Calendar", "Slack"],
    niveau_accompagnement: "guide",
    raison_accompagnement:
      "La structuration du CRM Notion et la configuration des automatisations Make necessitent un accompagnement pour definir le bon workflow commercial.",
    complexite: "moyenne",
    temps_mise_en_place_jours: 4,
    prerequis: ["Compte Notion Team", "Processus commercial du cabinet documente"],
  },
];

const scenario3: DemoScenario = {
  id: "consultant-cabinet",
  label: "Consultant Senior \u2014 Cabinet de conseil",
  description: "Sc\u00e9nario consulting : missions client, livrables, facturation",
  result: {
    metier: "Consultant",
    score_global: 70,
    heures_economisees_semaine: 10,
    taches: consultantTasks,
  },
  roiParams: { hourlyRate: 75, nbPeople: 1 },
  context:
    "Cabinet de conseil en transformation digitale, 25 consultants, clients grands comptes",
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_SCENARIOS: DemoScenario[] = [scenario1, scenario2, scenario3];

export function getDemoScenario(id?: string): DemoScenario {
  if (id) {
    const found = DEMO_SCENARIOS.find((s) => s.id === id);
    if (found) return found;
  }
  return DEMO_SCENARIOS[0];
}
