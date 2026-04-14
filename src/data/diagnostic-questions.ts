import type { Question } from '../types/diagnostic';

export const QUESTIONS: Question[] = [
  // =============================================
  // DOCUMENTS (doc-1 à doc-6)
  // =============================================
  {
    id: 'doc-1',
    domaine: 'documents',
    texte: 'Quand vous devez rédiger un document professionnel (rapport, note, proposition), comment utilisez-vous l\'IA ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je ne l\'utilise pas, je rédige tout moi-même', valeur: 0 },
      { label: 'Je demande parfois à l\'IA de reformuler ou corriger mes textes', valeur: 1 },
      { label: 'Je fournis un plan et des consignes précises pour que l\'IA rédige un premier jet complet', valeur: 2 },
      { label: 'J\'utilise des prompts structurés avec ton, contexte et audience pour obtenir un document quasi-final', valeur: 3 },
    ],
  },
  {
    id: 'doc-2',
    domaine: 'documents',
    texte: 'Après une réunion, comment produisez-vous le compte-rendu ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je prends des notes à la main et rédige le CR manuellement', valeur: 0 },
      { label: 'Je copie-colle mes notes dans l\'IA pour les mettre en forme', valeur: 1 },
      { label: 'J\'utilise un prompt avec un format précis (participants, décisions, actions) pour structurer le CR', valeur: 2 },
      { label: 'J\'ai un template de prompt réutilisable qui produit un CR structuré avec actions et responsables en quelques secondes', valeur: 3 },
    ],
  },
  {
    id: 'doc-3',
    domaine: 'documents',
    texte: 'Quand vous devez extraire des informations d\'un PDF (contrat, rapport, facture), comment procédez-vous ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je lis le document en entier et recopie les infos manuellement', valeur: 0 },
      { label: 'Je copie-colle des passages dans l\'IA pour poser des questions dessus', valeur: 1 },
      { label: 'J\'uploade le PDF dans un outil IA et pose des questions ciblées pour extraire les données clés', valeur: 2 },
      { label: 'J\'utilise l\'IA pour extraire automatiquement les données structurées (montants, dates, clauses) dans un format exploitable', valeur: 3 },
    ],
  },
  {
    id: 'doc-4',
    domaine: 'documents',
    texte: 'Quand vous recevez un document long (50+ pages), comment en faites-vous la synthèse ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je le lis en entier et rédige ma propre synthèse', valeur: 0 },
      { label: 'Je demande à l\'IA de résumer le texte sans instructions particulières', valeur: 1 },
      { label: 'Je découpe le document en sections et demande à l\'IA de résumer chaque partie avec des consignes précises', valeur: 2 },
      { label: 'J\'utilise un prompt multi-étapes : résumé par section, puis synthèse globale avec points clés, risques et recommandations', valeur: 3 },
    ],
  },
  {
    id: 'doc-5',
    domaine: 'documents',
    texte: 'Pour produire un livrable complexe (appel d\'offres, dossier client, documentation technique), comment enchaînez-vous les étapes avec l\'IA ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Je ne l\'utilise pas pour ce type de documents', valeur: 0 },
      { label: 'Je demande à l\'IA de rédiger le document en une seule fois', valeur: 1 },
      { label: 'Je décompose en étapes (plan, puis chaque section) et j\'enchaîne les prompts manuellement', valeur: 2 },
      { label: 'J\'ai un workflow de prompts chaînés : brief → plan → rédaction section par section → relecture → mise en forme finale', valeur: 3 },
    ],
  },
  {
    id: 'doc-6',
    domaine: 'documents',
    texte: 'Avez-vous mis en place un pipeline automatisé pour la production récurrente de documents (rapports mensuels, fiches produit, contrats) ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Non, chaque document est créé from scratch', valeur: 0 },
      { label: 'J\'ai des modèles Word/Google Docs que je remplis manuellement', valeur: 1 },
      { label: 'J\'utilise des templates de prompts réutilisables pour accélérer la production', valeur: 2 },
      { label: 'J\'ai un pipeline automatisé : les données alimentent un template, l\'IA génère le document et le formate automatiquement', valeur: 3 },
    ],
  },

  // =============================================
  // COMMUNICATION (com-1 à com-6)
  // =============================================
  {
    id: 'com-1',
    domaine: 'communication',
    texte: 'Pour rédiger vos emails professionnels, comment utilisez-vous l\'IA ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je rédige tous mes emails moi-même sans IA', valeur: 0 },
      { label: 'Je demande parfois à l\'IA de corriger ou reformuler un email', valeur: 1 },
      { label: 'Je donne le contexte et le ton souhaité pour que l\'IA rédige l\'email complet', valeur: 2 },
      { label: 'J\'ai des prompts par type d\'email (relance, proposition, refus) que je personnalise en quelques secondes', valeur: 3 },
    ],
  },
  {
    id: 'com-2',
    domaine: 'communication',
    texte: 'Combien de temps passez-vous à produire un compte-rendu de réunion exploitable ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Plus de 30 minutes, je fais tout manuellement', valeur: 0 },
      { label: '15-30 minutes, j\'utilise parfois l\'IA pour reformuler', valeur: 1 },
      { label: '5-15 minutes, j\'utilise un outil de transcription + IA pour structurer', valeur: 2 },
      { label: 'Moins de 5 minutes, mon workflow automatisé transcrit, structure et envoie le CR', valeur: 3 },
    ],
  },
  {
    id: 'com-3',
    domaine: 'communication',
    texte: 'Comment gérez-vous les demandes récurrentes que vous recevez par email ou messagerie (même question posée régulièrement) ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je réponds à chaque fois manuellement', valeur: 0 },
      { label: 'J\'ai des réponses types que je copie-colle et adapte', valeur: 1 },
      { label: 'J\'utilise l\'IA pour générer des réponses personnalisées à partir de modèles', valeur: 2 },
      { label: 'J\'ai mis en place des réponses automatiques intelligentes qui s\'adaptent au contexte de chaque demande', valeur: 3 },
    ],
  },
  {
    id: 'com-4',
    domaine: 'communication',
    texte: 'Quand vous devez communiquer dans une autre langue ou adapter un message à un contexte culturel différent, comment faites-vous ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je n\'ai pas ce besoin ou je demande à un collègue', valeur: 0 },
      { label: 'J\'utilise un traducteur en ligne (Google Translate, DeepL)', valeur: 1 },
      { label: 'Je demande à l\'IA de traduire et d\'adapter le ton au contexte culturel cible', valeur: 2 },
      { label: 'J\'utilise l\'IA avec des consignes précises sur la culture, le registre et les usages locaux pour produire un message natif', valeur: 3 },
    ],
  },
  {
    id: 'com-5',
    domaine: 'communication',
    texte: 'Quand un même message doit être diffusé sur plusieurs canaux (email, Slack, LinkedIn, newsletter), comment procédez-vous ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Je rédige chaque version séparément à la main', valeur: 0 },
      { label: 'Je rédige une version et la copie-colle en l\'adaptant canal par canal', valeur: 1 },
      { label: 'Je demande à l\'IA de décliner un message source en versions adaptées à chaque canal', valeur: 2 },
      { label: 'J\'ai un workflow qui génère automatiquement les déclinaisons multi-canaux à partir d\'un brief unique', valeur: 3 },
    ],
  },
  {
    id: 'com-6',
    domaine: 'communication',
    texte: 'Avez-vous déjà construit un chatbot ou un assistant IA pour répondre automatiquement aux questions fréquentes de votre équipe ou vos clients ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Non, je ne sais pas comment faire', valeur: 0 },
      { label: 'J\'y ai pensé mais je n\'ai pas encore essayé', valeur: 1 },
      { label: 'J\'ai créé un assistant simple avec une base de connaissances (FAQ, docs internes)', valeur: 2 },
      { label: 'J\'ai déployé un assistant connecté à nos données qui répond de façon contextuelle et s\'améliore avec le temps', valeur: 3 },
    ],
  },

  // =============================================
  // DONNÉES (data-1 à data-6)
  // =============================================
  {
    id: 'data-1',
    domaine: 'donnees',
    texte: 'Comment produisez-vous vos tableaux de bord et reportings ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je construis mes tableaux manuellement dans Excel ou Sheets', valeur: 0 },
      { label: 'J\'utilise des modèles pré-faits que je mets à jour avec de nouvelles données', valeur: 1 },
      { label: 'Je demande à l\'IA de m\'aider à structurer mes données et créer des visualisations', valeur: 2 },
      { label: 'Mes dashboards se mettent à jour automatiquement et l\'IA génère les commentaires d\'analyse', valeur: 3 },
    ],
  },
  {
    id: 'data-2',
    domaine: 'donnees',
    texte: 'Quand vous recevez des données brutes (CSV, exports, fichiers clients), comment les nettoyez-vous ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je les corrige à la main cellule par cellule', valeur: 0 },
      { label: 'J\'utilise des fonctions Excel (rechercher/remplacer, filtres) pour nettoyer', valeur: 1 },
      { label: 'Je demande à l\'IA de détecter les anomalies et proposer des corrections', valeur: 2 },
      { label: 'J\'ai un script ou workflow IA qui nettoie, dédoublonne et standardise automatiquement les données', valeur: 3 },
    ],
  },
  {
    id: 'data-3',
    domaine: 'donnees',
    texte: 'Quand vous explorez un jeu de données pour en tirer des insights, comment procédez-vous ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je regarde les données manuellement et fais des tris/filtres basiques', valeur: 0 },
      { label: 'Je crée des tableaux croisés dynamiques et quelques graphiques', valeur: 1 },
      { label: 'Je charge les données dans l\'IA et lui demande de trouver les tendances et corrélations', valeur: 2 },
      { label: 'J\'utilise l\'IA pour une analyse exploratoire complète : statistiques, corrélations, anomalies et recommandations', valeur: 3 },
    ],
  },
  {
    id: 'data-4',
    domaine: 'donnees',
    texte: 'Comment créez-vous vos formules complexes ou scripts de traitement de données ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je n\'utilise que des formules simples (SOMME, MOYENNE)', valeur: 0 },
      { label: 'Je cherche des formules sur internet et les adapte à mon besoin', valeur: 1 },
      { label: 'Je décris mon besoin à l\'IA qui me génère la formule ou le script adapté', valeur: 2 },
      { label: 'Je demande à l\'IA de créer des scripts complets (Python, Apps Script) que j\'intègre directement dans mes outils', valeur: 3 },
    ],
  },
  {
    id: 'data-5',
    domaine: 'donnees',
    texte: 'Utilisez-vous l\'IA pour faire des prédictions ou détecter des tendances dans vos données métier ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Non, je ne fais pas de prédictions', valeur: 0 },
      { label: 'Je fais des projections simples manuellement (règle de trois, tendance linéaire)', valeur: 1 },
      { label: 'Je demande à l\'IA d\'analyser les tendances et de proposer des projections', valeur: 2 },
      { label: 'J\'utilise l\'IA pour du machine learning léger : prédictions, scoring, détection d\'anomalies sur mes données', valeur: 3 },
    ],
  },
  {
    id: 'data-6',
    domaine: 'donnees',
    texte: 'Avez-vous mis en place un pipeline automatisé pour collecter, transformer et charger vos données (ETL) ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Non, je fais tout manuellement (copier-coller entre outils)', valeur: 0 },
      { label: 'J\'exporte et importe les données manuellement mais de façon régulière', valeur: 1 },
      { label: 'J\'ai automatisé certaines étapes (import automatique, transformation basique)', valeur: 2 },
      { label: 'J\'ai un pipeline complet : collecte automatique, nettoyage IA, transformation et chargement dans mes outils de reporting', valeur: 3 },
    ],
  },

  // =============================================
  // WORKFLOWS (wf-1 à wf-6)
  // =============================================
  {
    id: 'wf-1',
    domaine: 'workflows',
    texte: 'Utilisez-vous des outils d\'automatisation (Zapier, Make, Power Automate, n8n) dans votre travail ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Non, je ne connais pas ces outils', valeur: 0 },
      { label: 'Je connais mais je n\'en utilise pas encore', valeur: 1 },
      { label: 'J\'ai mis en place quelques automatisations simples (notifications, transferts de fichiers)', valeur: 2 },
      { label: 'J\'utilise régulièrement ces outils pour automatiser des processus complets entre plusieurs applications', valeur: 3 },
    ],
  },
  {
    id: 'wf-2',
    domaine: 'workflows',
    texte: 'Comment gérez-vous les notifications et alertes liées à votre activité (deadline, nouveau lead, anomalie) ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je vérifie manuellement ou j\'attends qu\'on me prévienne', valeur: 0 },
      { label: 'J\'utilise les notifications natives des outils (rappels calendrier, emails)', valeur: 1 },
      { label: 'J\'ai configuré des alertes automatiques entre outils (ex : Slack quand un formulaire est rempli)', valeur: 2 },
      { label: 'J\'ai un système d\'alertes intelligentes qui filtre, priorise et route les notifications selon leur urgence', valeur: 3 },
    ],
  },
  {
    id: 'wf-3',
    domaine: 'workflows',
    texte: 'Comment fonctionnent vos processus de validation et d\'approbation (congés, devis, achats) ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Par email ou de vive voix, sans process formalisé', valeur: 0 },
      { label: 'Via un formulaire ou un fichier partagé avec suivi manuel', valeur: 1 },
      { label: 'J\'ai un workflow automatisé qui envoie les demandes au bon valideur et suit l\'état', valeur: 2 },
      { label: 'Mes circuits de validation sont entièrement automatisés avec escalade, relances et reporting', valeur: 3 },
    ],
  },
  {
    id: 'wf-4',
    domaine: 'workflows',
    texte: 'Comment connectez-vous vos différents outils métier entre eux (CRM, facturation, gestion de projet, etc.) ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Mes outils ne sont pas connectés, je ressaisis les données', valeur: 0 },
      { label: 'J\'utilise des exports/imports CSV pour transférer les données', valeur: 1 },
      { label: 'J\'ai connecté certains outils avec des intégrations natives ou Zapier/Make', valeur: 2 },
      { label: 'Mes outils sont interconnectés via des APIs et workflows automatisés, les données circulent en temps réel', valeur: 3 },
    ],
  },
  {
    id: 'wf-5',
    domaine: 'workflows',
    texte: 'Intégrez-vous de l\'IA dans vos workflows automatisés (ex : classification automatique, prise de décision) ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Non, mes automatisations sont basées sur des règles simples', valeur: 0 },
      { label: 'J\'y réfléchis mais je n\'ai pas encore intégré d\'IA', valeur: 1 },
      { label: 'J\'ai ajouté des étapes IA dans certains workflows (classification de tickets, résumé automatique)', valeur: 2 },
      { label: 'Mes workflows incluent des décisions IA conditionnelles qui s\'adaptent au contenu et au contexte', valeur: 3 },
    ],
  },
  {
    id: 'wf-6',
    domaine: 'workflows',
    texte: 'Comment surveillez-vous vos automatisations et gérez-vous les erreurs ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Je ne surveille pas, je découvre les problèmes quand quelqu\'un se plaint', valeur: 0 },
      { label: 'Je vérifie de temps en temps que tout fonctionne', valeur: 1 },
      { label: 'J\'ai des alertes en cas d\'erreur et je corrige manuellement', valeur: 2 },
      { label: 'J\'ai un monitoring complet avec logs, alertes, retry automatique et tableau de bord de suivi', valeur: 3 },
    ],
  },

  // =============================================
  // CRÉATIF (crea-1 à crea-6)
  // =============================================
  {
    id: 'crea-1',
    domaine: 'creatif',
    texte: 'Quand vous devez créer un visuel ou une présentation, utilisez-vous l\'IA ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Non, je fais tout avec PowerPoint/Canva sans IA', valeur: 0 },
      { label: 'J\'utilise les suggestions automatiques de Canva ou PowerPoint (design ideas)', valeur: 1 },
      { label: 'Je génère des éléments visuels avec l\'IA (images, mises en page) que j\'intègre dans mes créations', valeur: 2 },
      { label: 'J\'utilise l\'IA pour générer des présentations complètes à partir d\'un brief (structure, textes, visuels)', valeur: 3 },
    ],
  },
  {
    id: 'crea-2',
    domaine: 'creatif',
    texte: 'Pour rédiger du contenu éditorial (posts LinkedIn, articles de blog, newsletter), comment utilisez-vous l\'IA ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je rédige tout moi-même sans aide IA', valeur: 0 },
      { label: 'Je demande à l\'IA des idées de sujets ou de titres', valeur: 1 },
      { label: 'Je fournis un brief détaillé et l\'IA rédige un premier jet que j\'ajuste', valeur: 2 },
      { label: 'J\'ai des prompts par format (post, article, newsletter) qui produisent du contenu prêt à publier dans mon ton', valeur: 3 },
    ],
  },
  {
    id: 'crea-3',
    domaine: 'creatif',
    texte: 'Comment utilisez-vous la génération d\'images par IA (Midjourney, DALL-E, Stable Diffusion) ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je n\'utilise pas de générateur d\'images IA', valeur: 0 },
      { label: 'J\'ai essayé quelques fois par curiosité', valeur: 1 },
      { label: 'Je génère régulièrement des visuels pour mes projets avec des prompts travaillés', valeur: 2 },
      { label: 'Je maîtrise les paramètres avancés (styles, seeds, inpainting) pour produire des visuels professionnels cohérents', valeur: 3 },
    ],
  },
  {
    id: 'crea-4',
    domaine: 'creatif',
    texte: 'Comment l\'IA intervient-elle dans la création de vos présentations (slides) ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Je crée mes slides manuellement de A à Z', valeur: 0 },
      { label: 'J\'utilise l\'IA pour rédiger le texte des slides, puis je mets en forme moi-même', valeur: 1 },
      { label: 'J\'utilise l\'IA pour générer structure, textes et suggestions de visuels pour chaque slide', valeur: 2 },
      { label: 'J\'ai un workflow IA complet : brief → plan → slides générées avec textes, visuels et notes speaker', valeur: 3 },
    ],
  },
  {
    id: 'crea-5',
    domaine: 'creatif',
    texte: 'Utilisez-vous l\'IA pour maintenir la cohérence de votre identité visuelle (charte graphique, ton éditorial) ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Je n\'ai pas de processus particulier pour la cohérence', valeur: 0 },
      { label: 'J\'ai une charte graphique que j\'applique manuellement', valeur: 1 },
      { label: 'J\'ai intégré ma charte dans mes prompts IA pour que le contenu généré soit cohérent', valeur: 2 },
      { label: 'J\'ai un système IA entraîné sur ma charte qui génère automatiquement du contenu on-brand (textes et visuels)', valeur: 3 },
    ],
  },
  {
    id: 'crea-6',
    domaine: 'creatif',
    texte: 'Avez-vous mis en place un pipeline de production de contenu créatif assisté par IA ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Non, chaque contenu est produit indépendamment', valeur: 0 },
      { label: 'J\'ai des templates et processus manuels que je suis à chaque fois', valeur: 1 },
      { label: 'J\'ai un workflow semi-automatisé : brief → génération IA → revue → publication', valeur: 2 },
      { label: 'J\'ai un pipeline complet automatisé : calendrier éditorial → génération multi-format → validation → publication multi-canaux', valeur: 3 },
    ],
  },

  // =============================================
  // ORCHESTRATION (orch-1 à orch-6)
  // =============================================
  {
    id: 'orch-1',
    domaine: 'orchestration',
    texte: 'Savez-vous ce qu\'est un "system prompt" et l\'utilisez-vous ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'Je ne sais pas ce que c\'est', valeur: 0 },
      { label: 'Je sais ce que c\'est mais je n\'en utilise pas', valeur: 1 },
      { label: 'J\'utilise des system prompts basiques pour cadrer le comportement de l\'IA', valeur: 2 },
      { label: 'Je rédige des system prompts détaillés avec rôle, contraintes, format de sortie et exemples', valeur: 3 },
    ],
  },
  {
    id: 'orch-2',
    domaine: 'orchestration',
    texte: 'Comment choisissez-vous le bon modèle d\'IA (GPT-4, Claude, Mistral, Gemini) pour une tâche donnée ?',
    type: 'choix_unique',
    niveau: 'basique',
    options: [
      { label: 'J\'utilise toujours le même outil sans me poser la question', valeur: 0 },
      { label: 'Je sais qu\'il existe différents modèles mais je reste sur celui que je connais', valeur: 1 },
      { label: 'Je choisis le modèle selon la tâche (rédaction, code, analyse) en connaissant les forces de chacun', valeur: 2 },
      { label: 'Je sélectionne le modèle optimal selon le rapport qualité/coût/vitesse et j\'ajuste les paramètres (température, tokens)', valeur: 3 },
    ],
  },
  {
    id: 'orch-3',
    domaine: 'orchestration',
    texte: 'Savez-vous enchaîner plusieurs appels IA pour accomplir une tâche complexe (prompt chaining) ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Non, je fais un seul prompt par tâche', valeur: 0 },
      { label: 'Je fais parfois plusieurs prompts à la suite manuellement', valeur: 1 },
      { label: 'Je conçois des chaînes de prompts où la sortie de l\'un alimente l\'entrée du suivant', valeur: 2 },
      { label: 'J\'ai des pipelines de prompts automatisés avec branchements conditionnels selon les résultats', valeur: 3 },
    ],
  },
  {
    id: 'orch-4',
    domaine: 'orchestration',
    texte: 'Avez-vous déjà utilisé l\'API d\'un modèle d\'IA (OpenAI API, Anthropic API, etc.) ?',
    type: 'choix_unique',
    niveau: 'intermediaire',
    options: [
      { label: 'Non, je ne sais pas ce qu\'est une API', valeur: 0 },
      { label: 'Je sais ce qu\'est une API mais je n\'en ai jamais utilisé pour l\'IA', valeur: 1 },
      { label: 'J\'ai fait quelques appels API simples (via Postman, Make ou un script basique)', valeur: 2 },
      { label: 'J\'intègre des API IA dans mes applications et workflows de production', valeur: 3 },
    ],
  },
  {
    id: 'orch-5',
    domaine: 'orchestration',
    texte: 'Connaissez-vous et utilisez-vous des agents IA autonomes (qui exécutent des tâches en plusieurs étapes sans intervention) ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Je ne sais pas ce qu\'est un agent IA', valeur: 0 },
      { label: 'J\'en ai entendu parler mais je n\'en ai jamais utilisé', valeur: 1 },
      { label: 'J\'ai testé des agents (GPTs personnalisés, assistants) pour des tâches spécifiques', valeur: 2 },
      { label: 'Je déploie des agents autonomes avec des outils (recherche web, code, fichiers) qui accomplissent des missions complètes', valeur: 3 },
    ],
  },
  {
    id: 'orch-6',
    domaine: 'orchestration',
    texte: 'Avez-vous mis en place une architecture multi-agents ou utilisez-vous le protocole MCP (Model Context Protocol) ?',
    type: 'choix_unique',
    niveau: 'avance',
    options: [
      { label: 'Je ne sais pas de quoi il s\'agit', valeur: 0 },
      { label: 'J\'ai lu des articles sur le sujet mais je n\'ai pas pratiqué', valeur: 1 },
      { label: 'J\'ai expérimenté avec plusieurs agents qui collaborent ou j\'ai connecté des outils via MCP', valeur: 2 },
      { label: 'J\'ai une architecture multi-agents en production avec orchestration, mémoire partagée et connexions MCP', valeur: 3 },
    ],
  },
];
