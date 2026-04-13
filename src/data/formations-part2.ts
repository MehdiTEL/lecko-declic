import type { Formation } from '../types/formation';

export const FORMATIONS_PART2: Formation[] = [
  // =============================================
  // WORKFLOWS - DÉBUTANT
  // =============================================
  {
    id: 'wor-deb',
    slug: 'workflows-debutant',
    titre: 'Automatiser ses premiers workflows avec l\'IA',
    description: 'Découvrez comment l\'IA peut automatiser vos tâches répétitives et créer des workflows intelligents sans écrire une seule ligne de code.',
    domaine: 'workflows',
    niveau: 'debutant',
    duree: '2h00',
    objectifs: [
      'Comprendre ce qu\'est un workflow automatisé et pourquoi l\'IA change la donne',
      'Identifier les tâches répétitives automatisables dans son quotidien professionnel',
      'Créer son premier workflow no-code avec un outil comme Make ou Zapier',
      'Mettre en place des triggers simples qui déclenchent des actions automatiques',
    ],
    modules: [
      {
        id: 'wor-deb-m1',
        titre: 'Comprendre l\'automatisation par l\'IA',
        duree: '25 min',
        contenu: `# Comprendre l'automatisation par l'IA

## Qu'est-ce qu'un workflow automatisé ?

Un **workflow automatisé** est une séquence d'actions qui s'exécutent sans intervention humaine, déclenchée par un événement précis. Par exemple : quand un client remplit un formulaire, un email de confirmation est envoyé, une ligne est ajoutée dans un tableur, et une notification Slack est postée à l'équipe commerciale.

Avant l'IA, ces automatisations étaient **rigides** : elles suivaient des règles fixes de type "si X alors Y". L'IA apporte une dimension nouvelle : la capacité de **comprendre**, **interpréter** et **décider** de manière flexible.

## L'IA comme cerveau de vos workflows

Imaginez un workflow de traitement d'emails entrants. Sans IA, vous devez créer des règles pour chaque cas : mots-clés, expéditeurs, etc. Avec l'IA, le système peut :

- **Analyser le contenu** d'un email et comprendre l'intention (demande de devis, réclamation, question technique)
- **Extraire les informations clés** (nom du client, numéro de commande, montant)
- **Router intelligemment** vers le bon service sans règles manuelles
- **Rédiger un brouillon** de réponse adapté au contexte

## Les 3 piliers de l'automatisation IA

1. **Le trigger** (déclencheur) : l'événement qui lance le workflow. Exemples : réception d'un email, ajout d'une ligne dans un tableur, heure programmée.

2. **Le traitement IA** : l'étape où l'intelligence artificielle intervient pour analyser, classifier, générer ou transformer des données.

3. **L'action** : ce que le workflow produit en sortie. Exemples : envoi d'un message, mise à jour d'une base de données, création d'un document.

## Pourquoi le no-code change tout

Des plateformes comme **Make** (ex-Integromat), **Zapier** ou **n8n** permettent de construire ces workflows visuellement, en connectant des blocs entre eux. Vous n'avez pas besoin de savoir coder : vous configurez des connexions entre vos outils existants et ajoutez des étapes IA en quelques clics.

> **Point clé** : L'automatisation IA ne remplace pas votre expertise métier. Elle libère votre temps des tâches répétitives pour que vous puissiez vous concentrer sur les décisions à forte valeur ajoutée.`,
        quiz: [
          {
            id: 'wor-deb-m1-q1',
            question: 'Quelle est la principale différence entre une automatisation classique et une automatisation enrichie par l\'IA ?',
            options: [
              'L\'automatisation IA est plus rapide',
              'L\'IA peut comprendre, interpréter et décider de manière flexible',
              'L\'automatisation classique ne peut pas envoyer d\'emails',
              'L\'IA remplace totalement l\'humain dans le processus',
            ],
            correctIndex: 1,
            explication: 'L\'IA apporte la capacité de comprendre le contexte et de prendre des décisions flexibles, contrairement aux règles rigides "si X alors Y" des automatisations classiques.',
          },
          {
            id: 'wor-deb-m1-q2',
            question: 'Quels sont les 3 piliers de l\'automatisation IA ?',
            options: [
              'Code, serveur, base de données',
              'Trigger, traitement IA, action',
              'Email, tableur, notification',
              'Analyse, décision, rapport',
            ],
            correctIndex: 1,
            explication: 'Les 3 piliers sont : le trigger (événement déclencheur), le traitement IA (analyse, classification, génération) et l\'action (résultat produit par le workflow).',
          },
          {
            id: 'wor-deb-m1-q3',
            question: 'Que permettent les plateformes no-code comme Make ou Zapier ?',
            options: [
              'De coder des applications complexes',
              'De construire des workflows visuellement sans écrire de code',
              'De remplacer tous les logiciels de l\'entreprise',
              'D\'héberger des sites web',
            ],
            correctIndex: 1,
            explication: 'Les plateformes no-code permettent de construire des workflows visuellement en connectant des blocs entre eux, sans compétences en programmation.',
          },
        ],
      },
      {
        id: 'wor-deb-m2',
        titre: 'Identifier ses opportunités d\'automatisation',
        duree: '25 min',
        contenu: `# Identifier ses opportunités d'automatisation

## La méthode d'audit de ses tâches

Avant de construire un workflow, il faut identifier **quoi** automatiser. Utilisez cette grille d'analyse pour chaque tâche récurrente :

| Critère | Question à se poser |
|---------|-------------------|
| **Fréquence** | Combien de fois par jour/semaine cette tâche revient-elle ? |
| **Durée** | Combien de temps me prend-elle à chaque fois ? |
| **Complexité** | Suit-elle un schéma prévisible ou nécessite-t-elle du jugement ? |
| **Erreur** | Est-ce que je fais parfois des erreurs par inattention ? |
| **Valeur** | Cette tâche exploite-t-elle réellement mon expertise ? |

**Règle d'or** : si une tâche est fréquente, prend du temps, suit un schéma repérable et ne nécessite pas de créativité humaine profonde, c'est une excellente candidate à l'automatisation.

## Les 5 familles de workflows les plus courants

### 1. Gestion des emails et communications
- Trier et catégoriser les emails entrants
- Envoyer des réponses types personnalisées
- Transférer au bon interlocuteur selon le sujet

### 2. Traitement de données
- Saisir des données d'un format à un autre
- Consolider des informations de plusieurs sources
- Mettre à jour des tableaux de bord automatiquement

### 3. Gestion documentaire
- Nommer et classer des fichiers reçus
- Extraire des données de factures ou contrats
- Générer des rapports périodiques

### 4. Processus RH et administratifs
- Onboarding de nouveaux collaborateurs
- Demandes de congés et validations
- Rappels et relances automatiques

### 5. Veille et notification
- Surveiller des sources d'information
- Alerter quand un événement important se produit
- Résumer des flux d'actualités

## Exercice pratique : votre inventaire personnel

Prenez 10 minutes pour lister vos 5 tâches les plus répétitives de la semaine. Pour chacune, notez :
- Le temps passé par semaine
- Le nombre d'étapes manuelles
- Les outils impliqués (email, tableur, CRM, etc.)

> **Astuce** : Commencez par automatiser la tâche la plus simple et la plus fréquente. Un premier succès rapide vous motivera pour les suivantes.`,
        quiz: [
          {
            id: 'wor-deb-m2-q1',
            question: 'Quel critère n\'est PAS dans la grille d\'analyse pour identifier les tâches automatisables ?',
            options: [
              'Fréquence de la tâche',
              'Budget disponible pour les outils',
              'Taux d\'erreur potentiel',
              'Durée de la tâche',
            ],
            correctIndex: 1,
            explication: 'La grille d\'analyse se base sur la fréquence, la durée, la complexité, le taux d\'erreur et la valeur ajoutée. Le budget n\'est pas un critère d\'identification mais un paramètre de mise en œuvre.',
          },
          {
            id: 'wor-deb-m2-q2',
            question: 'Quelle est la recommandation pour démarrer l\'automatisation ?',
            options: [
              'Commencer par le processus le plus complexe de l\'entreprise',
              'Automatiser toutes les tâches en même temps',
              'Commencer par la tâche la plus simple et la plus fréquente',
              'Attendre d\'avoir formé toute l\'équipe avant de commencer',
            ],
            correctIndex: 2,
            explication: 'Il est recommandé de commencer par une tâche simple et fréquente pour obtenir un succès rapide et se motiver pour automatiser des processus plus complexes ensuite.',
          },
          {
            id: 'wor-deb-m2-q3',
            question: 'L\'extraction de données de factures appartient à quelle famille de workflows ?',
            options: [
              'Gestion des emails',
              'Processus RH',
              'Gestion documentaire',
              'Veille et notification',
            ],
            correctIndex: 2,
            explication: 'L\'extraction de données de factures fait partie de la famille "Gestion documentaire", qui inclut le classement, l\'extraction et la génération de documents.',
          },
        ],
      },
      {
        id: 'wor-deb-m3',
        titre: 'Créer son premier workflow avec Make',
        duree: '35 min',
        contenu: `# Créer son premier workflow avec Make

## Présentation de Make (ex-Integromat)

**Make** est une plateforme no-code qui permet de créer des workflows visuels appelés **scénarios**. Chaque scénario est composé de **modules** connectés entre eux, formant un flux de données.

L'interface est intuitive : vous glissez-déposez des modules sur un canevas, les connectez et configurez les paramètres de chacun.

## Anatomie d'un scénario Make

Un scénario Make se compose de :

- **Un module déclencheur** (trigger) : il surveille un événement. Exemples : nouveau email dans Gmail, nouvelle ligne dans Google Sheets, message dans Slack.
- **Des modules d'action** : ils transforment ou transmettent les données. Exemples : envoyer un email, créer un document, appeler une API.
- **Des modules IA** : ils analysent ou génèrent du contenu via des services comme OpenAI ou Claude.
- **Des filtres** : ils conditionnent le passage des données entre modules.
- **Des routeurs** : ils créent des branches parallèles selon des conditions.

## Cas pratique : automatiser le traitement de formulaires

Voici un scénario concret étape par étape :

**Objectif** : Quand un prospect remplit un formulaire Google Forms, l'IA analyse sa demande, catégorise le lead et envoie un email personnalisé.

**Étape 1 — Trigger** : Ajouter le module "Google Forms — Watch Responses". Connecter votre compte Google et sélectionner le formulaire cible.

**Étape 2 — Traitement IA** : Ajouter un module "OpenAI — Create a Completion". Configurer le prompt :

\`\`\`
Analyse cette demande de prospect et retourne un JSON :
- categorie : "chaud", "tiede" ou "froid"
- resume : résumé en 1 phrase
- reponse_suggeree : brouillon d'email de réponse

Demande du prospect : {{1.responses}}
\`\`\`

**Étape 3 — Routeur** : Ajouter un routeur avec 2 branches selon la catégorie retournée par l'IA.

**Étape 4 — Actions** :
- Branche "chaud" : notification Slack immédiate à l'équipe commerciale + email personnalisé au prospect
- Branche "tiède/froid" : ajout dans un tableur de suivi + email de remerciement standard

## Bonnes pratiques

- **Testez chaque module individuellement** avant de lancer le scénario complet
- **Utilisez le mode "Run once"** pour vérifier que les données passent correctement
- **Nommez vos scénarios** clairement : "Traitement formulaire prospect — v1"
- **Activez les notifications d'erreur** pour être prévenu si un scénario échoue

> **Important** : Un scénario Make gratuit est limité à 1 000 opérations par mois. Pour un usage professionnel, prévoyez un plan payant adapté à votre volume.`,
        quiz: [
          {
            id: 'wor-deb-m3-q1',
            question: 'Dans Make, comment s\'appelle la séquence d\'actions automatisées ?',
            options: [
              'Un pipeline',
              'Un scénario',
              'Un programme',
              'Une recette',
            ],
            correctIndex: 1,
            explication: 'Dans Make, les workflows automatisés sont appelés des "scénarios". Chaque scénario est composé de modules connectés entre eux sur un canevas visuel.',
          },
          {
            id: 'wor-deb-m3-q2',
            question: 'À quoi sert un routeur dans un scénario Make ?',
            options: [
              'À connecter Make à Internet',
              'À accélérer le traitement des données',
              'À créer des branches parallèles selon des conditions',
              'À sauvegarder les données en cas d\'erreur',
            ],
            correctIndex: 2,
            explication: 'Un routeur permet de créer des branches parallèles dans le workflow. Les données suivent un chemin différent selon les conditions définies, par exemple selon la catégorie attribuée par l\'IA.',
          },
          {
            id: 'wor-deb-m3-q3',
            question: 'Quelle bonne pratique est recommandée avant de lancer un scénario complet ?',
            options: [
              'Supprimer tous les filtres pour aller plus vite',
              'Tester chaque module individuellement avec "Run once"',
              'Activer le scénario en production immédiatement',
              'Connecter un maximum de modules en une seule fois',
            ],
            correctIndex: 1,
            explication: 'Il est essentiel de tester chaque module individuellement avec le mode "Run once" pour vérifier que les données passent correctement avant d\'activer le scénario complet.',
          },
        ],
      },
      {
        id: 'wor-deb-m4',
        titre: 'Triggers, erreurs et supervision',
        duree: '35 min',
        contenu: `# Triggers, erreurs et supervision

## Les types de triggers

Le trigger est la porte d'entrée de votre workflow. Bien le choisir est crucial pour la fiabilité de votre automatisation.

### Triggers événementiels (webhooks)
Le workflow se déclenche **instantanément** quand un événement survient. C'est le mode le plus réactif.

Exemples :
- Un formulaire est soumis → traitement immédiat
- Un paiement est reçu sur Stripe → confirmation instantanée
- Un message est posté dans un canal Slack → réponse automatique

### Triggers programmés (polling)
Le workflow s'exécute **à intervalles réguliers** pour vérifier s'il y a de nouvelles données à traiter.

Exemples :
- Toutes les 15 minutes : vérifier les nouveaux emails
- Chaque jour à 8h : générer le rapport quotidien
- Chaque lundi : consolider les données de la semaine

### Triggers manuels
Le workflow se déclenche quand un utilisateur clique sur un bouton ou appelle une URL spécifique. Utile pour les processus semi-automatisés.

## Gérer les erreurs intelligemment

Un workflow qui échoue silencieusement est pire qu'un workflow qui n'existe pas. Voici comment gérer les erreurs :

**1. Les erreurs de connexion** : une API est temporairement indisponible. Solution : configurer des **retries automatiques** (3 tentatives avec un délai croissant).

**2. Les erreurs de données** : le format reçu ne correspond pas à ce qui est attendu. Solution : ajouter des **validations** en amont et des **valeurs par défaut**.

**3. Les erreurs IA** : le modèle retourne une réponse inattendue. Solution : encadrer le prompt avec des instructions précises sur le format de sortie attendu, et prévoir un **fallback** (chemin alternatif).

\`\`\`
// Exemple de prompt robuste pour éviter les erreurs IA
Retourne UNIQUEMENT un JSON valide avec cette structure exacte :
{
  "categorie": "chaud" | "tiede" | "froid",
  "score": nombre entre 0 et 100
}
Ne retourne aucun texte avant ou après le JSON.
\`\`\`

## Mettre en place la supervision

Un workflow en production doit être **supervisé**. Voici les éléments essentiels :

- **Logs d'exécution** : consultez l'historique de chaque exécution pour identifier les anomalies
- **Alertes** : configurez des notifications (email, Slack) en cas d'échec
- **Métriques** : suivez le nombre d'exécutions, le taux de succès et le temps de traitement
- **Revue périodique** : planifiez une vérification mensuelle de vos workflows actifs

> **Conseil** : Créez un canal Slack dédié "#automatisations-alertes" où toutes les erreurs de vos workflows sont remontées. Cela crée un point de surveillance unique pour toute l'équipe.`,
        quiz: [
          {
            id: 'wor-deb-m4-q1',
            question: 'Quel type de trigger offre la réactivité la plus immédiate ?',
            options: [
              'Trigger programmé (polling)',
              'Trigger manuel',
              'Trigger événementiel (webhook)',
              'Trigger quotidien',
            ],
            correctIndex: 2,
            explication: 'Les triggers événementiels (webhooks) déclenchent le workflow instantanément quand l\'événement survient, contrairement au polling qui vérifie à intervalles réguliers.',
          },
          {
            id: 'wor-deb-m4-q2',
            question: 'Comment gérer une erreur de connexion temporaire à une API ?',
            options: [
              'Supprimer le module défaillant',
              'Configurer des retries automatiques avec délai croissant',
              'Ignorer l\'erreur et continuer',
              'Arrêter définitivement le workflow',
            ],
            correctIndex: 1,
            explication: 'Les retries automatiques avec un délai croissant permettent de surmonter les indisponibilités temporaires d\'API sans intervention manuelle.',
          },
          {
            id: 'wor-deb-m4-q3',
            question: 'Pourquoi est-il important de superviser un workflow en production ?',
            options: [
              'Pour augmenter la vitesse de traitement',
              'Pour détecter les échecs et anomalies rapidement',
              'Pour réduire le coût des API',
              'Pour impressionner la direction',
            ],
            correctIndex: 1,
            explication: 'La supervision permet de détecter rapidement les échecs et anomalies. Un workflow qui échoue silencieusement peut causer des problèmes importants sans que personne ne s\'en rende compte.',
          },
        ],
      },
    ],
  },

  // =============================================
  // WORKFLOWS - INTERMÉDIAIRE
  // =============================================
  {
    id: 'wor-inter',
    slug: 'workflows-intermediaire',
    titre: 'Workflows IA avancés : intégrations et logique complexe',
    description: 'Maîtrisez la conception de workflows multi-étapes avec branchement conditionnel, intégrations API et traitement IA en chaîne pour des processus métier complets.',
    domaine: 'workflows',
    niveau: 'intermediaire',
    duree: '2h30',
    objectifs: [
      'Concevoir des workflows multi-branches avec logique conditionnelle avancée',
      'Intégrer des appels API REST dans ses automatisations',
      'Chaîner plusieurs étapes IA pour un traitement en profondeur',
      'Optimiser la performance et la fiabilité de ses workflows en production',
    ],
    modules: [
      {
        id: 'wor-inter-m1',
        titre: 'Architecture de workflows complexes',
        duree: '30 min',
        contenu: `# Architecture de workflows complexes

## Penser en architecte de processus

Un workflow avancé n'est pas simplement une chaîne linéaire de modules. C'est un **système** qui doit être conçu avec rigueur. Avant d'ouvrir Make ou n8n, prenez le temps de **cartographier** votre processus.

## Les patterns d'architecture

### Pattern 1 : Fan-out / Fan-in
Un événement unique déclenche **plusieurs traitements parallèles**, dont les résultats sont ensuite **agrégés**.

Exemple concret : une candidature reçue est simultanément analysée pour l'adéquation au poste (branche 1), vérifiée pour les prérequis obligatoires (branche 2), et scorée par rapport aux candidatures précédentes (branche 3). Les trois résultats sont consolidés dans une fiche synthétique.

### Pattern 2 : Pipeline enrichissement
Chaque étape **enrichit** la donnée initiale avec de nouvelles informations avant de la passer à l'étape suivante.

\`\`\`
Email entrant
  → Extraction IA des entités (nom, entreprise, sujet)
  → Enrichissement via API CRM (historique client)
  → Analyse de sentiment IA
  → Score de priorité calculé
  → Routage vers le bon service
\`\`\`

### Pattern 3 : Event-driven avec file d'attente
Pour les gros volumes, les événements sont placés dans une **file d'attente** et traités séquentiellement. Cela évite de surcharger les API et de dépasser les rate limits.

### Pattern 4 : Boucle de validation humaine
Le workflow prépare une action, la soumet à un humain pour validation (via Slack, email ou interface dédiée), puis exécute ou ajuste selon la réponse.

## Documenter son architecture

Créez un **diagramme de flux** avant de construire. Utilisez un outil simple comme Miro, Whimsical ou même un papier/crayon. Pour chaque étape, notez :

- **Entrée** : quelles données arrivent ?
- **Traitement** : que se passe-t-il ?
- **Sortie** : quelles données repartent ?
- **Erreur** : que se passe-t-il si ça échoue ?

> **Principe clé** : Un bon workflow est **lisible** par quelqu'un d'autre que son créateur. Si vous ne pouvez pas l'expliquer en 2 minutes à un collègue, il est probablement trop complexe et doit être découpé en sous-workflows.`,
        quiz: [
          {
            id: 'wor-inter-m1-q1',
            question: 'Quel pattern d\'architecture traite un événement en plusieurs branches parallèles avant de consolider les résultats ?',
            options: [
              'Pipeline enrichissement',
              'Boucle de validation humaine',
              'Fan-out / Fan-in',
              'Event-driven avec file d\'attente',
            ],
            correctIndex: 2,
            explication: 'Le pattern Fan-out / Fan-in déclenche plusieurs traitements parallèles (fan-out) à partir d\'un événement unique, puis agrège les résultats (fan-in).',
          },
          {
            id: 'wor-inter-m1-q2',
            question: 'Pourquoi utiliser une file d\'attente dans un workflow event-driven ?',
            options: [
              'Pour accélérer le traitement des données',
              'Pour éviter de surcharger les API et respecter les rate limits',
              'Pour stocker les données de façon permanente',
              'Pour permettre aux utilisateurs de modifier les données',
            ],
            correctIndex: 1,
            explication: 'La file d\'attente permet de gérer les gros volumes en traitant les événements séquentiellement, évitant ainsi de surcharger les API et de dépasser leurs limites de requêtes.',
          },
          {
            id: 'wor-inter-m1-q3',
            question: 'Quel est le principe clé d\'un bon workflow selon le module ?',
            options: [
              'Il doit utiliser le maximum de modules possibles',
              'Il doit être lisible et explicable en 2 minutes à un collègue',
              'Il doit fonctionner sans aucune supervision',
              'Il doit traiter au moins 1000 événements par heure',
            ],
            correctIndex: 1,
            explication: 'Un bon workflow doit être lisible par quelqu\'un d\'autre que son créateur. S\'il ne peut pas être expliqué en 2 minutes, il est probablement trop complexe et doit être découpé.',
          },
        ],
      },
      {
        id: 'wor-inter-m2',
        titre: 'Intégrations API et webhooks',
        duree: '35 min',
        contenu: `# Intégrations API et webhooks

## Comprendre les API REST

Une **API REST** (Application Programming Interface) est un point d'accès permettant à deux logiciels de communiquer. Dans le contexte des workflows, les API vous permettent de connecter **n'importe quel service**, même ceux qui n'ont pas de connecteur natif dans votre plateforme d'automatisation.

Les 4 méthodes HTTP essentielles :

| Méthode | Usage | Exemple |
|---------|-------|---------|
| **GET** | Récupérer des données | Lire la fiche d'un contact CRM |
| **POST** | Créer une ressource | Ajouter un nouveau ticket |
| **PUT** | Mettre à jour une ressource | Modifier un statut |
| **DELETE** | Supprimer une ressource | Archiver un enregistrement |

## Configurer un appel API dans Make

Dans Make, le module **HTTP — Make a request** permet d'appeler n'importe quelle API :

\`\`\`
URL : https://api.monservice.com/v1/contacts
Méthode : POST
Headers :
  Authorization: Bearer {{connection.api_key}}
  Content-Type: application/json
Body :
{
  "nom": "{{2.nom_extrait}}",
  "email": "{{2.email_extrait}}",
  "score": {{3.score_ia}}
}
\`\`\`

Les doubles accolades \`{{}}\` font référence aux données produites par les modules précédents du scénario.

## Créer un webhook entrant

Un **webhook** est une URL que vous exposez pour que des services externes puissent déclencher votre workflow. C'est l'inverse d'un appel API : au lieu d'aller chercher l'information, vous la recevez.

Cas d'usage courants :
- **Stripe** envoie un webhook quand un paiement est confirmé
- **GitHub** envoie un webhook quand un commit est poussé
- **Typeform** envoie un webhook quand un formulaire est soumis

Dans Make, créez un module "Webhooks — Custom webhook". Make génère une URL unique. Collez cette URL dans les paramètres webhook du service externe.

## Authentification et sécurité

Ne stockez **jamais** vos clés API en dur dans les scénarios. Utilisez les **connexions** de Make ou les **credentials** de n8n pour stocker vos secrets de façon sécurisée.

Pour les webhooks entrants, mettez en place :
- **Vérification de signature** : assurez-vous que la requête vient bien du service attendu
- **Validation du payload** : vérifiez la structure des données reçues avant de les traiter
- **Rate limiting** : protégez-vous contre les appels abusifs

> **Astuce avancée** : Utilisez un service comme **Pipedream** ou **RequestBin** pour inspecter les payloads des webhooks avant de les intégrer dans votre workflow. Cela vous permet de comprendre la structure des données envoyées par le service externe.`,
        quiz: [
          {
            id: 'wor-inter-m2-q1',
            question: 'Quelle méthode HTTP utilise-t-on pour créer une nouvelle ressource via une API ?',
            options: [
              'GET',
              'PUT',
              'POST',
              'DELETE',
            ],
            correctIndex: 2,
            explication: 'La méthode POST est utilisée pour créer de nouvelles ressources. GET récupère des données, PUT met à jour et DELETE supprime.',
          },
          {
            id: 'wor-inter-m2-q2',
            question: 'Qu\'est-ce qu\'un webhook ?',
            options: [
              'Un langage de programmation pour les automatisations',
              'Une URL exposée pour recevoir des données d\'un service externe',
              'Un type de base de données',
              'Un outil de monitoring de workflows',
            ],
            correctIndex: 1,
            explication: 'Un webhook est une URL que vous exposez pour que des services externes puissent envoyer des données et déclencher votre workflow automatiquement.',
          },
          {
            id: 'wor-inter-m2-q3',
            question: 'Comment doit-on gérer les clés API dans les workflows ?',
            options: [
              'Les écrire directement dans les modules pour plus de simplicité',
              'Les partager avec l\'équipe par email',
              'Les stocker dans les connexions sécurisées de la plateforme',
              'Les inclure dans les logs pour le débogage',
            ],
            correctIndex: 2,
            explication: 'Les clés API doivent être stockées dans les connexions sécurisées (credentials) de la plateforme, jamais en dur dans les scénarios ni partagées en clair.',
          },
        ],
      },
      {
        id: 'wor-inter-m3',
        titre: 'Chaîner les traitements IA',
        duree: '35 min',
        contenu: `# Chaîner les traitements IA

## Pourquoi chaîner plutôt qu'un seul prompt ?

Demander à l'IA de tout faire en un seul prompt produit souvent des résultats médiocres. En découpant le traitement en **étapes spécialisées**, chaque appel IA se concentre sur une tâche précise et produit un résultat plus fiable.

Comparaison :

**Approche monolithique** (fragile) :
\`\`\`
"Lis cet email, extrais les entités, analyse le sentiment,
catégorise la demande et rédige une réponse."
\`\`\`

**Approche chaînée** (robuste) :
\`\`\`
Étape 1 : "Extrais les entités de cet email : nom, entreprise, sujet."
Étape 2 : "Analyse le sentiment de ce texte. Retourne : positif, neutre ou négatif."
Étape 3 : "Catégorise cette demande parmi : support, commercial, partenariat, autre."
Étape 4 : "Rédige une réponse professionnelle pour une demande de type {{categorie}}
           avec un sentiment {{sentiment}} de la part de {{nom}} chez {{entreprise}}."
\`\`\`

## Patterns de chaînage IA

### Extraction → Enrichissement → Génération
C'est le pattern le plus courant. L'IA extrait d'abord des données structurées, ces données sont enrichies (par d'autres API ou une seconde passe IA), puis l'IA génère un output final.

### Génération → Critique → Révision
L'IA génère un premier brouillon, un second appel évalue la qualité et identifie les améliorations, puis un troisième appel produit la version finale. Ce pattern améliore significativement la qualité du contenu généré.

### Classification → Routage → Traitement spécialisé
L'IA classifie d'abord l'input, le workflow route vers la bonne branche, et chaque branche utilise un prompt spécialisé pour le type de contenu identifié.

## Gérer le contexte entre les étapes

Chaque appel IA est **indépendant** : le modèle ne se souvient pas des étapes précédentes. Vous devez explicitement transmettre le contexte nécessaire dans chaque prompt.

\`\`\`
// Module 3 : le prompt reçoit les résultats des modules 1 et 2
"Contexte : email de {{module1.nom}} ({{module1.entreprise}}).
Sentiment détecté : {{module2.sentiment}}.
Sujet : {{module1.sujet}}.

Rédige une réponse adaptée en 3-5 phrases."
\`\`\`

## Optimiser les coûts

Chaque appel IA a un coût. Pour optimiser :
- Utilisez un **modèle léger** (GPT-3.5, Claude Haiku) pour les tâches simples (classification, extraction)
- Réservez les **modèles puissants** (GPT-4, Claude Sonnet/Opus) pour la génération de contenu complexe
- **Cachez les résultats** quand c'est possible : si la même classification revient souvent, stockez-la

> **Règle pratique** : En chaînant 3 appels à un modèle léger plutôt qu'un seul appel à un modèle puissant, vous obtenez souvent un meilleur résultat pour un coût inférieur.`,
        quiz: [
          {
            id: 'wor-inter-m3-q1',
            question: 'Pourquoi est-il préférable de chaîner plusieurs appels IA plutôt qu\'un seul prompt monolithique ?',
            options: [
              'C\'est toujours moins cher',
              'Chaque appel se concentre sur une tâche précise et produit un résultat plus fiable',
              'Les API IA ne peuvent pas traiter de longs prompts',
              'C\'est obligatoire dans Make et Zapier',
            ],
            correctIndex: 1,
            explication: 'Le chaînage permet à chaque appel IA de se concentrer sur une tâche spécifique, ce qui produit des résultats plus fiables et prévisibles qu\'un prompt monolithique.',
          },
          {
            id: 'wor-inter-m3-q2',
            question: 'Dans le pattern "Génération → Critique → Révision", quel est le rôle de l\'étape "Critique" ?',
            options: [
              'Supprimer le brouillon si il est mauvais',
              'Évaluer la qualité et identifier les améliorations à apporter',
              'Traduire le contenu dans une autre langue',
              'Formater le texte en HTML',
            ],
            correctIndex: 1,
            explication: 'L\'étape Critique évalue la qualité du brouillon généré et identifie les points d\'amélioration, permettant à l\'étape Révision de produire une version finale de meilleure qualité.',
          },
          {
            id: 'wor-inter-m3-q3',
            question: 'Comment optimiser les coûts dans une chaîne d\'appels IA ?',
            options: [
              'Toujours utiliser le modèle le plus puissant',
              'Ne faire qu\'un seul appel IA maximum par workflow',
              'Utiliser des modèles légers pour les tâches simples et réserver les puissants pour le contenu complexe',
              'Désactiver les logs pour économiser des tokens',
            ],
            correctIndex: 2,
            explication: 'L\'optimisation des coûts passe par l\'utilisation de modèles adaptés à la complexité de chaque tâche : modèles légers pour l\'extraction et la classification, modèles puissants pour la génération complexe.',
          },
        ],
      },
      {
        id: 'wor-inter-m4',
        titre: 'Monitoring et optimisation en production',
        duree: '30 min',
        contenu: `# Monitoring et optimisation en production

## Passer du prototype à la production

Un workflow qui fonctionne en test n'est pas nécessairement prêt pour la production. Le passage en production nécessite de prendre en compte la **fiabilité**, la **scalabilité** et la **maintenabilité**.

### Checklist de mise en production

- [ ] Tous les chemins d'erreur sont gérés (pas de "happy path only")
- [ ] Les retries sont configurés sur les appels API et IA
- [ ] Les alertes sont en place pour les échecs
- [ ] Les données sensibles sont protégées (pas de logs de données personnelles)
- [ ] Le workflow est documenté (nom clair, description, diagramme)
- [ ] Un responsable est identifié pour la maintenance

## Tableau de bord de monitoring

Construisez un tableau de bord simple avec ces métriques :

| Métrique | Objectif | Alerte si |
|----------|----------|-----------|
| Taux de succès | > 98% | < 95% |
| Temps d'exécution moyen | < 30s | > 60s |
| Nombre d'exécutions/jour | Stable ±20% | Variation > 50% |
| Coût IA mensuel | Dans le budget | Dépassement > 20% |

Dans **Make**, consultez l'onglet "History" de chaque scénario. Dans **n8n**, utilisez les logs d'exécution intégrés. Pour un monitoring centralisé, envoyez vos métriques vers un outil comme **Datadog**, **Grafana** ou simplement un **Google Sheets** dédié.

## Techniques d'optimisation

### Réduire le temps d'exécution
- Parallélisez les appels indépendants (utilisez des routeurs sans conditions mutuelles)
- Évitez les appels API redondants : cachez les résultats dans une variable ou un data store
- Réduisez la taille des prompts IA : envoyez uniquement les données nécessaires

### Réduire les erreurs
- Ajoutez des **validations de données** entre chaque module critique
- Utilisez des **valeurs par défaut** pour les champs optionnels
- Implémentez un **dead letter queue** : les événements qui échouent après N tentatives sont stockés dans un tableur pour traitement manuel

### Réduire les coûts
- Filtrez en amont : ne déclenchez le traitement IA que quand c'est nécessaire
- Utilisez des **modèles adaptés** : pas besoin de GPT-4 pour extraire une date
- Mettez en place des **quotas** : limitez le nombre d'exécutions quotidiennes

## Maintenance et évolution

Planifiez une **revue trimestrielle** de vos workflows :
- Les besoins métier ont-ils évolué ?
- Les API utilisées ont-elles changé de version ?
- Le volume de traitement justifie-t-il une optimisation ?
- Y a-t-il de nouveaux outils IA plus performants ou moins chers ?

> **Culture d'amélioration continue** : Chaque incident est une opportunité d'améliorer le workflow. Documentez les problèmes rencontrés et les solutions appliquées dans un registre partagé.`,
        quiz: [
          {
            id: 'wor-inter-m4-q1',
            question: 'Quel taux de succès minimum est recommandé pour un workflow en production ?',
            options: [
              '80%',
              '90%',
              '98%',
              '100%',
            ],
            correctIndex: 2,
            explication: 'Un taux de succès supérieur à 98% est l\'objectif recommandé. Une alerte doit être déclenchée si le taux descend en dessous de 95%.',
          },
          {
            id: 'wor-inter-m4-q2',
            question: 'Qu\'est-ce qu\'un "dead letter queue" dans le contexte des workflows ?',
            options: [
              'Un système de suppression automatique des vieux workflows',
              'Un stockage des événements qui échouent après plusieurs tentatives pour traitement manuel',
              'Un outil de monitoring en temps réel',
              'Une file d\'attente pour les emails non lus',
            ],
            correctIndex: 1,
            explication: 'Un dead letter queue stocke les événements qui ont échoué après N tentatives, permettant un traitement manuel ultérieur plutôt que de perdre les données.',
          },
          {
            id: 'wor-inter-m4-q3',
            question: 'À quelle fréquence est-il recommandé de faire une revue complète de ses workflows ?',
            options: [
              'Chaque jour',
              'Chaque semaine',
              'Chaque trimestre',
              'Chaque année',
            ],
            correctIndex: 2,
            explication: 'Une revue trimestrielle est recommandée pour vérifier l\'adéquation avec les besoins métier, les évolutions d\'API, le volume de traitement et les nouvelles solutions IA disponibles.',
          },
        ],
      },
    ],
  },

  // =============================================
  // CRÉATIF - DÉBUTANT
  // =============================================
  {
    id: 'cre-deb',
    slug: 'creatif-debutant',
    titre: 'Créer avec l\'IA : images, visuels et design',
    description: 'Apprenez à utiliser les outils d\'IA générative pour créer des images, des visuels professionnels et des éléments de design adaptés à vos besoins métier.',
    domaine: 'creatif',
    niveau: 'debutant',
    duree: '2h00',
    objectifs: [
      'Comprendre les différents outils d\'IA générative pour la création visuelle',
      'Rédiger des prompts efficaces pour la génération d\'images',
      'Créer des visuels professionnels pour la communication d\'entreprise',
      'Respecter les bonnes pratiques éthiques et juridiques de l\'IA créative',
    ],
    modules: [
      {
        id: 'cre-deb-m1',
        titre: 'Panorama des outils d\'IA créative',
        duree: '25 min',
        contenu: `# Panorama des outils d'IA créative

## L'explosion de la création par IA

Depuis 2022, les outils d'IA générative ont révolutionné la création visuelle. Ce qui nécessitait auparavant des heures de travail d'un graphiste peut désormais être produit en quelques secondes. Mais attention : ces outils sont des **assistants puissants**, pas des remplaçants du sens créatif humain.

## Les principales catégories d'outils

### Génération d'images à partir de texte (text-to-image)

- **Midjourney** : excellent pour les visuels artistiques et le photoréalisme. Accessible via Discord. Idéal pour les concepts visuels, illustrations et mood boards.
- **DALL-E 3** (OpenAI) : intégré à ChatGPT, très accessible. Bon pour les illustrations professionnelles et le respect précis des instructions.
- **Stable Diffusion** : open source, peut être installé localement. Le plus flexible pour les usages techniques et la personnalisation avancée.
- **Adobe Firefly** : intégré à la suite Adobe (Photoshop, Illustrator). Entraîné uniquement sur du contenu sous licence, limitant les risques juridiques.

### Retouche et édition assistées par IA

- **Photoshop (Generative Fill)** : étendre, modifier ou supprimer des éléments d'une image existante.
- **Canva Magic Studio** : suite d'outils IA intégrés à Canva pour la retouche, le détourage et la génération.
- **Remove.bg** : suppression automatique d'arrière-plans.

### Vidéo et animation

- **Runway** : génération et édition de vidéo par IA. Text-to-video et image-to-video.
- **Pika** : création de courtes vidéos animées à partir de texte ou d'images.
- **HeyGen** : création de vidéos avec avatars IA réalistes, idéal pour la formation ou le marketing.

### Design et branding

- **Looka** : génération de logos et identités visuelles.
- **Brandmark** : création automatisée de systèmes de branding.
- **Figma + plugins IA** : assistance à la conception d'interfaces.

## Comment choisir son outil ?

| Besoin | Outil recommandé |
|--------|-----------------|
| Illustration pour un article | DALL-E 3 ou Midjourney |
| Visuel pour les réseaux sociaux | Canva Magic Studio |
| Photo produit professionnelle | Midjourney ou Adobe Firefly |
| Vidéo marketing courte | Runway ou Pika |
| Logo et branding | Looka ou Brandmark |

> **Conseil** : Ne vous dispersez pas. Choisissez **un outil principal** et maîtrisez-le avant d'en explorer d'autres. La qualité du résultat dépend plus de votre maîtrise du prompting que de l'outil lui-même.`,
        quiz: [
          {
            id: 'cre-deb-m1-q1',
            question: 'Quel outil d\'IA est spécifiquement entraîné sur du contenu sous licence pour limiter les risques juridiques ?',
            options: [
              'Midjourney',
              'Stable Diffusion',
              'Adobe Firefly',
              'DALL-E 3',
            ],
            correctIndex: 2,
            explication: 'Adobe Firefly est entraîné uniquement sur du contenu sous licence (Adobe Stock, contenu libre de droits), ce qui limite les risques juridiques liés au droit d\'auteur.',
          },
          {
            id: 'cre-deb-m1-q2',
            question: 'Quel outil est recommandé pour créer des vidéos avec des avatars IA réalistes ?',
            options: [
              'Runway',
              'HeyGen',
              'Canva',
              'Stable Diffusion',
            ],
            correctIndex: 1,
            explication: 'HeyGen est spécialisé dans la création de vidéos avec des avatars IA réalistes, particulièrement utile pour la formation ou le marketing.',
          },
          {
            id: 'cre-deb-m1-q3',
            question: 'Quel conseil est donné pour bien démarrer avec les outils d\'IA créative ?',
            options: [
              'Tester tous les outils en même temps pour comparer',
              'Choisir un outil principal et le maîtriser avant d\'en explorer d\'autres',
              'Toujours utiliser l\'outil le plus cher',
              'Commencer par la vidéo car c\'est le plus impactant',
            ],
            correctIndex: 1,
            explication: 'Il est recommandé de choisir un outil principal et de le maîtriser, car la qualité du résultat dépend davantage de votre maîtrise du prompting que de l\'outil lui-même.',
          },
        ],
      },
      {
        id: 'cre-deb-m2',
        titre: 'L\'art du prompt visuel',
        duree: '30 min',
        contenu: `# L'art du prompt visuel

## La structure d'un prompt efficace

Un prompt pour la génération d'images suit une logique différente d'un prompt textuel. Il faut **décrire visuellement** ce que vous voulez voir, comme si vous donniez des instructions à un photographe ou un illustrateur.

### La formule en 5 composantes

1. **Sujet** : Que montre l'image ? (une personne, un objet, un lieu, une scène)
2. **Style** : Quel rendu visuel ? (photo réaliste, illustration, aquarelle, 3D, flat design)
3. **Composition** : Comment est cadrée l'image ? (gros plan, vue aérienne, plongée, symétrique)
4. **Éclairage** : Quelle ambiance lumineuse ? (lumière naturelle, studio, golden hour, néon)
5. **Détails techniques** : Qualité, format, couleurs dominantes

### Exemples comparés

**Prompt vague** (résultat imprévisible) :
\`\`\`
Une équipe au bureau
\`\`\`

**Prompt structuré** (résultat maîtrisé) :
\`\`\`
Photo professionnelle d'une équipe diverse de 4 personnes
collaborant autour d'un écran dans un bureau moderne lumineux,
style corporate authentique, lumière naturelle latérale,
tons chauds, profondeur de champ faible,
format 16:9
\`\`\`

## Les mots-clés qui font la différence

### Pour le photoréalisme
- "photorealistic", "shot on Canon EOS R5", "35mm lens", "bokeh", "natural lighting"
- "editorial photography", "corporate lifestyle", "candid shot"

### Pour l'illustration
- "digital illustration", "flat design", "vector art", "isometric"
- "minimalist", "hand-drawn", "watercolor texture"

### Pour le branding
- "clean background", "centered composition", "brand identity"
- "mockup", "product photography", "white background"

## La technique de l'itération

Ne vous arrêtez **jamais** au premier résultat. Le processus créatif avec l'IA est **itératif** :

1. **Prompt initial** : posez votre intention de base
2. **Évaluation** : identifiez ce qui vous plaît et ce qui manque
3. **Affinement** : ajoutez des détails, modifiez le style, ajustez la composition
4. **Variations** : demandez des alternatives en changeant un seul paramètre à la fois

> **Astuce pro** : Créez-vous une **bibliothèque de prompts** organisée par type de visuel (portrait, paysage, produit, abstrait). Notez les formulations qui produisent les meilleurs résultats. Cette bibliothèque deviendra votre atout le plus précieux au fil du temps.`,
        quiz: [
          {
            id: 'cre-deb-m2-q1',
            question: 'Quelles sont les 5 composantes d\'un prompt visuel efficace ?',
            options: [
              'Titre, description, tags, catégorie, format',
              'Sujet, style, composition, éclairage, détails techniques',
              'Couleur, forme, taille, position, texture',
              'Intention, contexte, contrainte, référence, output',
            ],
            correctIndex: 1,
            explication: 'Les 5 composantes sont : le sujet (quoi), le style (quel rendu), la composition (cadrage), l\'éclairage (ambiance) et les détails techniques (qualité, format, couleurs).',
          },
          {
            id: 'cre-deb-m2-q2',
            question: 'Pourquoi ne faut-il pas s\'arrêter au premier résultat généré ?',
            options: [
              'Parce que le premier résultat est toujours mauvais',
              'Parce que le processus créatif avec l\'IA est itératif et s\'améliore par affinement',
              'Parce que les outils IA sont défectueux',
              'Parce qu\'il faut générer au moins 100 images',
            ],
            correctIndex: 1,
            explication: 'Le processus créatif avec l\'IA est itératif : on évalue, affine et explore des variations pour converger vers le résultat souhaité. Chaque itération améliore la qualité.',
          },
          {
            id: 'cre-deb-m2-q3',
            question: 'Quel type de mots-clés améliore le réalisme photographique dans un prompt ?',
            options: [
              '"flat design", "vector art", "minimalist"',
              '"watercolor texture", "hand-drawn", "sketch"',
              '"photorealistic", "shot on Canon EOS R5", "natural lighting"',
              '"abstract", "surreal", "dreamlike"',
            ],
            correctIndex: 2,
            explication: 'Les termes techniques de photographie comme "photorealistic", les références à du matériel photo (Canon EOS R5, 35mm lens) et "natural lighting" guident l\'IA vers un rendu photoréaliste.',
          },
        ],
      },
      {
        id: 'cre-deb-m3',
        titre: 'Visuels professionnels pour la communication',
        duree: '30 min',
        contenu: `# Visuels professionnels pour la communication

## Créer des visuels pour les réseaux sociaux

Les réseaux sociaux sont le terrain de jeu idéal pour l'IA créative. Chaque plateforme a ses codes visuels et ses formats.

### Formats essentiels

| Plateforme | Format post | Format story | Résolution |
|-----------|------------|-------------|------------|
| LinkedIn | 1200×627 px | 1080×1920 px | 72 dpi |
| Instagram | 1080×1080 px | 1080×1920 px | 72 dpi |
| Twitter/X | 1600×900 px | — | 72 dpi |

### Workflow de création type

1. **Définir le message** : quel est le point clé à communiquer ?
2. **Choisir le style** : photo, illustration, infographie, citation visuelle ?
3. **Générer l'image de base** avec l'IA (Midjourney, DALL-E, Firefly)
4. **Composer dans Canva** : ajouter texte, logo, charte graphique
5. **Décliner** : adapter aux différents formats depuis le même visuel de base

## Présentations et supports internes

L'IA peut transformer vos présentations PowerPoint ou Google Slides. Au lieu de chercher des banques d'images génériques, générez des visuels **sur-mesure** qui illustrent précisément votre propos.

Exemples de prompts pour des présentations :

\`\`\`
Illustration minimaliste flat design représentant la transformation
digitale d'une entreprise, tons bleus et orange, fond blanc,
style corporate moderne, sans texte
\`\`\`

\`\`\`
Icône isométrique représentant l'automatisation des processus,
engrenages et flux de données, palette de couleurs professionnelle,
fond transparent, style tech moderne
\`\`\`

## Cohérence visuelle et charte graphique

Le plus grand piège de l'IA créative est de produire des visuels **incohérents** entre eux. Pour maintenir une identité visuelle :

- **Créez un prompt de base** qui inclut toujours vos couleurs et votre style
- **Utilisez un préfixe constant** : commencez chaque prompt par les mêmes termes de style
- **Documentez votre style** : notez les paramètres qui fonctionnent (seeds, styles, modèles)

Exemple de préfixe de marque :
\`\`\`
[Style : illustration flat design, palette #2563EB et #F97316,
lignes épurées, style corporate moderne, fond blanc]
\`\`\`

## Retouche et finalisation

L'image générée est rarement le produit final. Prévoyez une étape de **retouche** :

- Recadrez pour votre format cible
- Ajustez la luminosité et le contraste
- Ajoutez votre texte et votre logo
- Vérifiez la lisibilité sur mobile

> **Règle d'or** : Un visuel IA de qualité + 5 minutes de retouche dans Canva = un résultat professionnel. L'IA fournit la matière première, votre sens esthétique fait la différence.`,
        quiz: [
          {
            id: 'cre-deb-m3-q1',
            question: 'Quelle est la dernière étape du workflow de création type pour les réseaux sociaux ?',
            options: [
              'Générer l\'image avec l\'IA',
              'Définir le message à communiquer',
              'Décliner le visuel aux différents formats',
              'Choisir le style graphique',
            ],
            correctIndex: 2,
            explication: 'La dernière étape est la déclinaison : adapter le visuel de base aux différents formats (post, story, bannière) de chaque plateforme.',
          },
          {
            id: 'cre-deb-m3-q2',
            question: 'Comment maintenir une cohérence visuelle quand on utilise l\'IA pour générer plusieurs visuels ?',
            options: [
              'Utiliser un outil différent pour chaque visuel',
              'Créer un prompt de base avec un préfixe constant incluant couleurs et style',
              'Générer les visuels de manière aléatoire et choisir les meilleurs',
              'Toujours utiliser le même seed sans changer le prompt',
            ],
            correctIndex: 1,
            explication: 'Pour maintenir la cohérence, il faut créer un prompt de base avec un préfixe constant qui inclut toujours les couleurs de la charte, le style et les paramètres visuels de référence.',
          },
          {
            id: 'cre-deb-m3-q3',
            question: 'Quel format est recommandé pour un post LinkedIn standard ?',
            options: [
              '1080×1080 px',
              '1200×627 px',
              '1600×900 px',
              '1920×1080 px',
            ],
            correctIndex: 1,
            explication: 'Le format recommandé pour un post LinkedIn standard est de 1200×627 pixels en 72 dpi.',
          },
        ],
      },
      {
        id: 'cre-deb-m4',
        titre: 'Éthique et droits d\'utilisation',
        duree: '25 min',
        contenu: `# Éthique et droits d'utilisation

## Le cadre juridique en évolution

Le droit autour de l'IA créative est en **pleine construction**. En tant que professionnel, vous devez connaître les règles actuelles et anticiper les évolutions pour protéger votre entreprise.

### Ce que dit la loi aujourd'hui

- **Pas de droit d'auteur sur les images générées purement par IA** : dans la plupart des juridictions (dont la France et les États-Unis), une image générée uniquement par IA ne peut pas être protégée par le droit d'auteur, car il n'y a pas d'auteur humain.
- **Le prompt seul ne suffit pas** : rédiger un prompt ne confère pas automatiquement de droits sur l'image produite.
- **La retouche humaine peut créer des droits** : si vous modifiez significativement une image IA, votre contribution créative peut être protégeable.

### Les risques à connaître

- **Ressemblance avec des œuvres existantes** : l'IA peut générer des images similaires à des œuvres protégées, exposant à des poursuites.
- **Représentation de personnes réelles** : générer des images de personnes existantes pose des problèmes de droit à l'image.
- **Marques et logos** : l'IA peut reproduire des éléments de marques déposées.

## Bonnes pratiques professionnelles

### Transparence
Indiquez clairement quand un visuel est généré ou assisté par IA. De plus en plus de plateformes l'exigent. C'est aussi une question de confiance avec votre audience.

### Vérification
Avant de publier un visuel IA :
- **Recherche d'image inversée** : vérifiez que l'image ne ressemble pas trop à une œuvre existante
- **Vérification des visages** : assurez-vous qu'aucun visage généré ne ressemble à une personne réelle identifiable
- **Contrôle des biais** : l'IA reproduit les biais de ses données d'entraînement (stéréotypes de genre, d'âge, ethniques)

### Diversité et inclusion
Soyez vigilant sur la représentation dans vos visuels IA :
- Variez les profils des personnes représentées
- Évitez les stéréotypes visuels
- Testez vos prompts pour identifier les biais par défaut du modèle

## Licences et conditions d'utilisation

Chaque outil a ses propres conditions :

| Outil | Usage commercial | Propriété des images |
|-------|-----------------|---------------------|
| Midjourney (payant) | Oui | Utilisateur |
| DALL-E 3 | Oui | Utilisateur |
| Stable Diffusion | Oui (selon licence du modèle) | Utilisateur |
| Adobe Firefly | Oui | Utilisateur + indemnisation IP |

> **Recommandation forte** : Lisez attentivement les conditions d'utilisation de l'outil que vous choisissez. En cas de doute pour un usage commercial sensible (publicité, packaging, campagne officielle), consultez un juriste spécialisé en propriété intellectuelle.`,
        quiz: [
          {
            id: 'cre-deb-m4-q1',
            question: 'Peut-on protéger par le droit d\'auteur une image générée uniquement par IA ?',
            options: [
              'Oui, le prompt constitue une œuvre originale',
              'Non, il n\'y a pas d\'auteur humain dans la création',
              'Oui, si on paye un abonnement premium',
              'Oui, automatiquement après 24 heures',
            ],
            correctIndex: 1,
            explication: 'Dans la plupart des juridictions, une image générée uniquement par IA ne peut pas être protégée par le droit d\'auteur car il n\'y a pas d\'auteur humain. La retouche significative peut cependant créer des droits.',
          },
          {
            id: 'cre-deb-m4-q2',
            question: 'Que faut-il vérifier avant de publier un visuel généré par IA ?',
            options: [
              'Uniquement la résolution de l\'image',
              'Seulement la date de création',
              'La ressemblance avec des œuvres existantes, les visages et les biais',
              'Le nombre de tokens utilisés pour le prompt',
            ],
            correctIndex: 2,
            explication: 'Avant publication, il faut vérifier la ressemblance avec des œuvres existantes (recherche inversée), les visages (pas de personnes réelles identifiables) et les biais de représentation.',
          },
          {
            id: 'cre-deb-m4-q3',
            question: 'Quel outil offre une indemnisation en propriété intellectuelle en plus de la propriété des images ?',
            options: [
              'Midjourney',
              'DALL-E 3',
              'Stable Diffusion',
              'Adobe Firefly',
            ],
            correctIndex: 3,
            explication: 'Adobe Firefly offre à la fois la propriété des images à l\'utilisateur et une indemnisation en propriété intellectuelle (IP indemnity), car il est entraîné sur du contenu sous licence.',
          },
        ],
      },
    ],
  },

  // =============================================
  // CRÉATIF - INTERMÉDIAIRE
  // =============================================
  {
    id: 'cre-inter',
    slug: 'creatif-intermediaire',
    titre: 'IA créative avancée : vidéo, branding et workflows de production',
    description: 'Approfondissez vos compétences en IA créative avec la production vidéo, la construction d\'identités visuelles cohérentes et l\'intégration de l\'IA dans vos pipelines de production.',
    domaine: 'creatif',
    niveau: 'intermediaire',
    duree: '2h30',
    objectifs: [
      'Produire des vidéos courtes avec les outils d\'IA générative',
      'Construire et maintenir une identité visuelle cohérente avec l\'IA',
      'Intégrer l\'IA créative dans un pipeline de production continu',
      'Maîtriser les techniques avancées de prompting visuel et d\'édition IA',
    ],
    modules: [
      {
        id: 'cre-inter-m1',
        titre: 'Production vidéo avec l\'IA',
        duree: '35 min',
        contenu: `# Production vidéo avec l'IA

## L'état de l'art en vidéo IA

La génération vidéo par IA a fait un bond spectaculaire. Les outils actuels permettent de créer des clips de quelques secondes à plusieurs minutes, avec un réalisme croissant. Voici les principales approches.

### Text-to-video
Vous décrivez une scène en texte, l'IA génère la vidéo. C'est la méthode la plus accessible mais aussi la moins contrôlable.

**Outils phares** : Runway Gen-3, Pika Labs, Sora (OpenAI)

Exemple de prompt text-to-video :
\`\`\`
Une femme professionnelle marche dans un couloir de bureau moderne,
lumière naturelle traversant de grandes baies vitrées,
mouvement de caméra fluide en travelling latéral,
style corporate authentique, 4K
\`\`\`

### Image-to-video
Vous fournissez une image de départ, l'IA l'anime. Cette méthode offre un **contrôle supérieur** sur le résultat car vous maîtrisez le cadrage, les couleurs et la composition.

**Workflow recommandé** :
1. Générez une image parfaite avec Midjourney ou DALL-E
2. Importez-la dans Runway ou Pika
3. Décrivez le mouvement souhaité
4. Ajustez la durée et la fluidité

### Avatars IA et vidéos de présentation
Pour la formation, le marketing ou la communication interne, les avatars IA offrent une solution rapide et économique.

**HeyGen** et **Synthesia** permettent de :
- Créer un avatar à partir d'une vidéo de référence (votre propre visage)
- Faire parler l'avatar dans n'importe quelle langue
- Produire des vidéos de formation standardisées à moindre coût

## Montage et post-production

L'IA excelle aussi dans le **montage** et la **post-production** :

- **Descript** : éditez votre vidéo comme un document texte. Supprimez les hésitations, ajoutez des sous-titres automatiques.
- **Runway** : supprimez ou remplacez des arrière-plans vidéo, appliquez des effets de style.
- **CapCut** : sous-titrage automatique, effets et transitions assistés par IA.

## Limitations actuelles

Soyez réaliste sur ce que la vidéo IA peut et ne peut **pas** faire aujourd'hui :

- Les mouvements de mains et doigts restent problématiques
- La cohérence sur de longues séquences (>10 secondes) est limitée
- Le texte dans les vidéos est souvent illisible
- Les transitions de plans sont difficiles à contrôler

> **Stratégie pragmatique** : Utilisez l'IA pour des plans courts (3-5 secondes) et assemblez-les dans un outil de montage classique. Combinez plans IA et plans réels pour un résultat plus professionnel.`,
        quiz: [
          {
            id: 'cre-inter-m1-q1',
            question: 'Quelle approche de génération vidéo IA offre le plus de contrôle sur le résultat ?',
            options: [
              'Text-to-video',
              'Image-to-video',
              'Audio-to-video',
              'Génération entièrement aléatoire',
            ],
            correctIndex: 1,
            explication: 'L\'approche image-to-video offre un contrôle supérieur car vous maîtrisez l\'image de départ (cadrage, couleurs, composition) et ne demandez à l\'IA que d\'animer cette base.',
          },
          {
            id: 'cre-inter-m1-q2',
            question: 'Quelle limitation majeure persiste dans la vidéo IA actuelle ?',
            options: [
              'Impossibilité de générer des couleurs vives',
              'Les mouvements de mains et doigts restent problématiques',
              'Incapacité totale de générer des visages',
              'Durée limitée à 1 seconde maximum',
            ],
            correctIndex: 1,
            explication: 'Les mouvements de mains et de doigts restent l\'un des défis majeurs de la vidéo IA, produisant souvent des résultats non naturels ou déformés.',
          },
          {
            id: 'cre-inter-m1-q3',
            question: 'Quelle stratégie est recommandée pour un résultat vidéo professionnel avec l\'IA ?',
            options: [
              'Générer une vidéo longue d\'une seule traite',
              'Utiliser uniquement des plans réels',
              'Créer des plans courts IA (3-5s) et les assembler dans un montage classique',
              'Laisser l\'IA gérer tout le montage automatiquement',
            ],
            correctIndex: 2,
            explication: 'La stratégie pragmatique consiste à utiliser l\'IA pour des plans courts (3-5 secondes) et les assembler dans un outil de montage classique, en combinant plans IA et plans réels.',
          },
        ],
      },
      {
        id: 'cre-inter-m2',
        titre: 'Construire une identité visuelle IA',
        duree: '35 min',
        contenu: `# Construire une identité visuelle IA

## Le défi de la cohérence

Le plus grand défi quand on utilise l'IA pour le branding n'est pas de générer **un** beau visuel, mais de maintenir une **cohérence** sur l'ensemble de vos supports. Chaque génération est unique : l'IA ne se souvient pas de ses créations précédentes.

## Créer un guide de style IA

Pour garantir la cohérence, créez un **document de référence** que vous utiliserez pour tous vos prompts :

### 1. Palette de couleurs
Définissez vos couleurs en termes que l'IA comprend :
\`\`\`
Couleurs principales : bleu profond (#1E3A5F), blanc cassé (#F5F0EB)
Couleurs d'accent : orange cuivré (#D97B2B), vert sauge (#87A878)
Ambiance : chaleureuse, professionnelle, contemporaine
\`\`\`

### 2. Style graphique
\`\`\`
Style : illustration vectorielle minimaliste avec textures subtiles
Lignes : épurées, géométriques, arrondies
Niveau de détail : modéré, pas surchargé
Référence artistique : entre le flat design et l'illustration éditoriale
\`\`\`

### 3. Traitement des personnages
\`\`\`
Représentation : diverse, contemporaine, professionnelle décontractée
Proportions : réalistes, pas de stylisation extrême
Expressions : positives, engageantes, naturelles
\`\`\`

### 4. Template de prompt

Créez un **préfixe réutilisable** :
\`\`\`
[STYLE MARQUE] Illustration vectorielle minimaliste avec textures
subtiles, palette bleu profond et orange cuivré, lignes épurées
et géométriques, ambiance chaleureuse et professionnelle.
[/STYLE MARQUE]

[Votre description spécifique ici]
\`\`\`

## Techniques avancées de cohérence

### Le style reference dans Midjourney
Utilisez le paramètre \`--sref\` pour maintenir un style visuel cohérent entre plusieurs générations. Identifiez une image de référence qui capture votre style, puis réutilisez-la systématiquement.

### Les LoRA dans Stable Diffusion
Un **LoRA** (Low-Rank Adaptation) est un petit modèle entraîné sur vos propres visuels. En entraînant un LoRA sur 20-30 images de votre identité visuelle existante, vous obtenez un style personnalisé reproductible.

### Les modèles personnalisés
Certains services (Midjourney, Leonardo.ai) permettent d'entraîner des modèles sur vos images de référence pour reproduire un style spécifique.

## Créer un brand kit complet

Avec l'IA, générez l'ensemble des éléments de votre identité :
- **Logo** et ses déclinaisons (monochrome, icône, horizontal, vertical)
- **Éléments graphiques** : motifs, séparateurs, arrière-plans
- **Photos de style** : banque d'images personnalisée cohérente
- **Templates** : gabarits pour réseaux sociaux, présentations, emails

> **Point de vigilance** : L'IA est un excellent point de départ pour explorer des directions créatives, mais pour un branding définitif d'entreprise, faites valider et affiner par un designer professionnel. L'IA accélère l'exploration, l'humain garantit la pertinence stratégique.`,
        quiz: [
          {
            id: 'cre-inter-m2-q1',
            question: 'Quel est le plus grand défi de l\'utilisation de l\'IA pour le branding ?',
            options: [
              'La qualité insuffisante des images générées',
              'Le coût élevé des outils',
              'Le maintien d\'une cohérence visuelle entre les différentes générations',
              'L\'impossibilité de créer des logos',
            ],
            correctIndex: 2,
            explication: 'Le principal défi est la cohérence : chaque génération IA est unique et le modèle ne se souvient pas de ses créations précédentes. Il faut mettre en place des stratégies pour maintenir une identité visuelle cohérente.',
          },
          {
            id: 'cre-inter-m2-q2',
            question: 'Qu\'est-ce qu\'un LoRA dans le contexte de Stable Diffusion ?',
            options: [
              'Un type de licence d\'utilisation',
              'Un petit modèle entraîné sur vos propres visuels pour reproduire un style',
              'Un format d\'image haute résolution',
              'Un outil de retouche automatique',
            ],
            correctIndex: 1,
            explication: 'Un LoRA (Low-Rank Adaptation) est un petit modèle personnalisé entraîné sur vos propres images (20-30 suffisent) qui permet de reproduire un style visuel spécifique de manière cohérente.',
          },
          {
            id: 'cre-inter-m2-q3',
            question: 'Quel paramètre Midjourney aide à maintenir la cohérence de style entre plusieurs générations ?',
            options: [
              '--quality',
              '--chaos',
              '--sref (style reference)',
              '--aspect',
            ],
            correctIndex: 2,
            explication: 'Le paramètre --sref (style reference) dans Midjourney permet de maintenir un style visuel cohérent en utilisant une image de référence qui capture le style souhaité.',
          },
        ],
      },
      {
        id: 'cre-inter-m3',
        titre: 'Pipeline de production créative',
        duree: '35 min',
        contenu: `# Pipeline de production créative

## De l'artisanat à l'industrialisation

Générer un visuel ponctuel est une chose. Mettre en place un **pipeline de production** capable de sortir du contenu visuel de qualité **régulièrement et à l'échelle** est un tout autre défi. C'est pourtant ce dont les équipes marketing et communication ont besoin.

## Architecture d'un pipeline créatif IA

### Phase 1 : Brief et planification
Chaque semaine ou chaque mois, définissez :
- Les **thèmes** de contenu à couvrir
- Les **formats** nécessaires (post LinkedIn, story Instagram, bannière email, slide)
- Le **volume** à produire
- Les **assets existants** à réutiliser

### Phase 2 : Génération par lots (batch)
Au lieu de générer les visuels un par un au fil de l'eau, regroupez les générations par **sessions thématiques** :

\`\`\`
Session "Transformation digitale" (1h) :
- 5 illustrations pour articles de blog
- 3 visuels LinkedIn (format 1200×627)
- 2 stories Instagram
- 1 bannière newsletter

Prompt de base commun + déclinaisons spécifiques
\`\`\`

Cette approche batch garantit la **cohérence** au sein d'une même campagne.

### Phase 3 : Curation et validation
Toutes les images générées ne sont pas publiables. Mettez en place un process de **tri** :

1. **Tri rapide** : gardez uniquement les visuels qui respectent votre identité
2. **Vérification qualité** : biais, artefacts, lisibilité, impact visuel
3. **Validation métier** : le visuel sert-il le message ? Est-il adapté à la cible ?

Comptez un ratio de **3 pour 1** : générez 3 visuels pour en garder 1.

### Phase 4 : Adaptation et finalisation
Les visuels validés passent par un process de finition :

- Recadrage aux formats cibles
- Ajout du texte, logo, call-to-action
- Retouches mineures (luminosité, contraste, saturation)
- Export dans les formats requis (PNG, JPEG, WebP)

## Automatiser le pipeline

Combinez les outils créatifs IA avec vos outils d'automatisation :

- **Airtable** ou **Notion** comme base de données de briefs et de suivi
- **Make ou Zapier** pour déclencher les étapes automatiquement
- **Google Drive ou Dropbox** pour le stockage organisé
- **Buffer ou Hootsuite** pour la programmation de publication

Un workflow automatisé peut par exemple : quand une ligne de brief est validée dans Airtable → appeler l'API Midjourney → stocker les résultats dans un dossier → notifier le responsable pour validation → programmer la publication.

## Mesurer la performance

Trackez les métriques clés de votre pipeline :
- **Temps moyen** de production par visuel
- **Taux d'utilisation** : % de visuels générés effectivement utilisés
- **Coût par visuel** : abonnements outils + temps humain
- **Performance des visuels IA** vs visuels traditionnels (engagement, clics)

> **Objectif** : Un pipeline mature permet de produire 5 à 10 fois plus de contenu visuel qu'un process traditionnel, avec un coût par unité divisé par 3 à 5.`,
        quiz: [
          {
            id: 'cre-inter-m3-q1',
            question: 'Quel ratio de génération/utilisation faut-il prévoir dans un pipeline créatif IA ?',
            options: [
              '1 pour 1 : chaque visuel généré est utilisé',
              '2 pour 1 : 2 générés pour 1 retenu',
              '3 pour 1 : 3 générés pour 1 retenu',
              '10 pour 1 : 10 générés pour 1 retenu',
            ],
            correctIndex: 2,
            explication: 'Un ratio de 3 pour 1 est recommandé : il faut prévoir de générer environ 3 visuels pour en garder 1 après le processus de curation et validation.',
          },
          {
            id: 'cre-inter-m3-q2',
            question: 'Pourquoi est-il préférable de générer les visuels par lots (batch) plutôt qu\'un par un ?',
            options: [
              'Parce que c\'est moins cher',
              'Parce que cela garantit la cohérence au sein d\'une même campagne',
              'Parce que les outils IA fonctionnent uniquement en batch',
              'Parce que c\'est obligatoire pour le format story',
            ],
            correctIndex: 1,
            explication: 'L\'approche batch avec un prompt de base commun et des déclinaisons spécifiques garantit la cohérence visuelle au sein d\'une même campagne ou thématique.',
          },
          {
            id: 'cre-inter-m3-q3',
            question: 'Quel gain de productivité peut atteindre un pipeline créatif IA mature ?',
            options: [
              '2 fois plus de contenu',
              '5 à 10 fois plus de contenu avec un coût divisé par 3 à 5',
              '100 fois plus de contenu sans coût supplémentaire',
              'Le même volume mais avec une meilleure qualité',
            ],
            correctIndex: 1,
            explication: 'Un pipeline mature permet de produire 5 à 10 fois plus de contenu visuel qu\'un processus traditionnel, avec un coût par unité divisé par 3 à 5.',
          },
        ],
      },
      {
        id: 'cre-inter-m4',
        titre: 'Techniques avancées d\'édition IA',
        duree: '25 min',
        contenu: `# Techniques avancées d'édition IA

## Au-delà de la génération : l'édition intelligente

La vraie puissance de l'IA créative ne réside pas seulement dans la génération depuis zéro, mais dans la capacité à **transformer**, **corriger** et **enrichir** des visuels existants. Ces techniques d'édition sont souvent plus utiles au quotidien professionnel.

## Inpainting : modifier une zone précise

L'**inpainting** permet de sélectionner une zone d'une image et de demander à l'IA de la remplacer par autre chose, tout en préservant le reste de l'image.

Cas d'usage professionnels :
- **Changer le décor** d'une photo produit sans refaire le shooting
- **Supprimer un élément gênant** (logo concurrent, objet indésirable)
- **Ajouter un élément** cohérent avec la scène existante
- **Corriger un défaut** dans une illustration générée

Dans Photoshop avec Generative Fill :
1. Sélectionnez la zone à modifier avec l'outil de sélection
2. Cliquez sur "Generative Fill" dans la barre contextuelle
3. Décrivez ce que vous voulez voir à la place (ou laissez vide pour supprimer)
4. Choisissez parmi les 3 variations proposées

## Outpainting : étendre une image

L'**outpainting** permet d'étendre une image au-delà de ses bords originaux. L'IA génère du contenu cohérent avec l'image existante pour remplir les nouvelles zones.

Application typique : vous avez une photo carrée mais besoin d'un format panoramique (16:9). Au lieu de recadrer et perdre du contenu, vous étendez l'image latéralement.

\`\`\`
Image originale : 1080×1080 (carré)
→ Outpainting latéral
Image étendue : 1920×1080 (16:9) avec un décor cohérent
\`\`\`

## Upscaling : améliorer la résolution

Les outils d'**upscaling IA** augmentent la résolution d'une image tout en recréant des détails nets. Idéal quand vous avez un visuel de bonne qualité mais en basse résolution.

Outils recommandés :
- **Topaz Gigapixel AI** : le plus performant pour la photo
- **Magnific** : excellent pour les illustrations et le photoréalisme
- **Upscayl** : gratuit et open source, très correct pour un usage courant

## Style transfer : appliquer un style artistique

Le **style transfer** applique le style visuel d'une image de référence à votre contenu. Exemples :
- Transformer une photo de bureau en illustration aquarelle
- Appliquer le style de votre charte graphique à une photo stock
- Créer une série visuellement cohérente à partir de photos disparates

## Workflow d'édition combiné

Les techniques avancées se combinent pour un maximum d'impact :

\`\`\`
Photo brute
  → Upscaling (améliorer la résolution)
  → Inpainting (corriger les éléments gênants)
  → Outpainting (adapter au format cible)
  → Style transfer (harmoniser avec l'identité visuelle)
  → Export final
\`\`\`

> **Gain de temps concret** : Un process d'édition IA qui prenait 45 minutes en retouche manuelle peut être réduit à 5-10 minutes. Sur un volume de 20 visuels par semaine, c'est plus de 10 heures économisées par mois.`,
        quiz: [
          {
            id: 'cre-inter-m4-q1',
            question: 'Qu\'est-ce que l\'inpainting en IA créative ?',
            options: [
              'La génération d\'une image complète à partir de texte',
              'La modification d\'une zone précise d\'une image en préservant le reste',
              'L\'augmentation de la résolution d\'une image',
              'L\'application d\'un filtre sur toute l\'image',
            ],
            correctIndex: 1,
            explication: 'L\'inpainting permet de sélectionner une zone spécifique d\'une image et de la remplacer par un nouveau contenu généré par l\'IA, tout en préservant le reste de l\'image.',
          },
          {
            id: 'cre-inter-m4-q2',
            question: 'Dans quel cas l\'outpainting est-il particulièrement utile ?',
            options: [
              'Pour supprimer un objet d\'une photo',
              'Pour réduire la taille d\'une image',
              'Pour étendre une image à un format différent sans recadrer',
              'Pour changer les couleurs d\'une image',
            ],
            correctIndex: 2,
            explication: 'L\'outpainting est idéal pour étendre une image au-delà de ses bords (par exemple passer d\'un format carré à un format panoramique) en générant du contenu cohérent dans les nouvelles zones.',
          },
          {
            id: 'cre-inter-m4-q3',
            question: 'Quel est l\'ordre recommandé dans un workflow d\'édition IA combiné ?',
            options: [
              'Style transfer → Inpainting → Outpainting → Upscaling',
              'Upscaling → Inpainting → Outpainting → Style transfer',
              'Inpainting → Style transfer → Upscaling → Outpainting',
              'Outpainting → Upscaling → Style transfer → Inpainting',
            ],
            correctIndex: 1,
            explication: 'L\'ordre recommandé est : Upscaling (améliorer la résolution), Inpainting (corriger), Outpainting (adapter au format), puis Style transfer (harmoniser le style). Cet ordre optimise la qualité à chaque étape.',
          },
        ],
      },
    ],
  },

  // =============================================
  // ORCHESTRATION - DÉBUTANT
  // =============================================
  {
    id: 'orc-deb',
    slug: 'orchestration-debutant',
    titre: 'Introduction à l\'orchestration d\'agents IA',
    description: 'Découvrez le concept d\'agents IA, comprenez comment ils fonctionnent et apprenez à coordonner plusieurs agents pour résoudre des problèmes complexes.',
    domaine: 'orchestration',
    niveau: 'debutant',
    duree: '2h00',
    objectifs: [
      'Comprendre ce qu\'est un agent IA et en quoi il diffère d\'un simple chatbot',
      'Identifier les cas d\'usage pertinents pour les agents IA en entreprise',
      'Configurer son premier agent IA avec des instructions et des outils',
      'Comprendre les principes de base de la coordination multi-agents',
    ],
    modules: [
      {
        id: 'orc-deb-m1',
        titre: 'Qu\'est-ce qu\'un agent IA ?',
        duree: '25 min',
        contenu: `# Qu'est-ce qu'un agent IA ?

## Du chatbot à l'agent

Un **chatbot classique** répond à vos questions dans une conversation. Un **agent IA** va beaucoup plus loin : il peut **raisonner**, **planifier**, **utiliser des outils** et **agir** de manière autonome pour accomplir une tâche complexe.

| Chatbot classique | Agent IA |
|-------------------|----------|
| Répond aux questions | Accomplit des tâches |
| Conversation uniquement | Conversation + actions |
| Pas de mémoire entre sessions | Peut mémoriser le contexte |
| Capacités fixes | Peut utiliser des outils externes |
| Réponse unique | Boucle de réflexion-action itérative |

## L'anatomie d'un agent IA

Un agent IA est composé de 4 éléments fondamentaux :

### 1. Le modèle de langage (LLM)
C'est le "cerveau" de l'agent. Il comprend les instructions, raisonne et décide des actions à entreprendre. Les modèles les plus utilisés : Claude (Anthropic), GPT-4 (OpenAI), Gemini (Google).

### 2. Les instructions système (system prompt)
C'est la **personnalité et les directives** de l'agent. Elles définissent son rôle, ses contraintes, son ton et sa spécialité.

Exemple d'instruction système :
\`\`\`
Tu es un assistant commercial spécialisé dans le secteur SaaS B2B.
Ton rôle est d'analyser les leads entrants, de qualifier leur potentiel
et de préparer des propositions commerciales personnalisées.
Tu as accès au CRM, au catalogue produits et à l'historique des ventes.
Sois factuel, concis et orienté données dans tes analyses.
\`\`\`

### 3. Les outils (tools / functions)
Ce sont les **capacités d'action** de l'agent. Sans outils, un agent ne fait que parler. Avec des outils, il peut agir sur le monde :
- Rechercher dans une base de données
- Envoyer un email
- Créer un document
- Appeler une API
- Lire un fichier

### 4. La mémoire
L'agent peut stocker et rappeler des informations d'interactions précédentes. Cela lui permet de maintenir le contexte sur la durée et de s'adapter à l'utilisateur.

## Le cycle Réflexion-Action

Un agent IA fonctionne en **boucle itérative** :

1. **Observation** : l'agent reçoit une demande ou un signal
2. **Réflexion** : il analyse la situation et planifie les étapes
3. **Action** : il exécute une action (appel d'outil, génération de texte)
4. **Évaluation** : il observe le résultat et décide si la tâche est terminée
5. **Itération** : si nécessaire, il revient à l'étape 2

> **Point clé** : La puissance d'un agent ne vient pas seulement du modèle IA, mais de la qualité de ses instructions et de la pertinence des outils mis à sa disposition. Un agent bien configuré avec un modèle moyen surpassera souvent un agent mal configuré avec le meilleur modèle.`,
        quiz: [
          {
            id: 'orc-deb-m1-q1',
            question: 'Quelle est la différence fondamentale entre un chatbot classique et un agent IA ?',
            options: [
              'Un agent IA est plus rapide',
              'Un agent IA peut raisonner, utiliser des outils et agir de manière autonome',
              'Un chatbot est gratuit, un agent est payant',
              'Un agent IA fonctionne sans modèle de langage',
            ],
            correctIndex: 1,
            explication: 'Un agent IA va au-delà de la conversation : il peut raisonner, planifier, utiliser des outils externes et agir de manière autonome pour accomplir des tâches complexes.',
          },
          {
            id: 'orc-deb-m1-q2',
            question: 'Quels sont les 4 éléments fondamentaux d\'un agent IA ?',
            options: [
              'Interface, base de données, serveur, réseau',
              'Modèle de langage, instructions système, outils, mémoire',
              'Code, design, testing, déploiement',
              'Input, processing, output, feedback',
            ],
            correctIndex: 1,
            explication: 'Un agent IA repose sur : le modèle de langage (cerveau), les instructions système (personnalité), les outils (capacités d\'action) et la mémoire (contexte persistant).',
          },
          {
            id: 'orc-deb-m1-q3',
            question: 'Selon le module, qu\'est-ce qui détermine le plus la performance d\'un agent ?',
            options: [
              'Uniquement la puissance du modèle IA',
              'La vitesse de connexion Internet',
              'La qualité des instructions et la pertinence des outils',
              'Le nombre d\'agents déployés simultanément',
            ],
            correctIndex: 2,
            explication: 'La puissance d\'un agent vient principalement de la qualité de ses instructions et de la pertinence de ses outils. Un agent bien configuré avec un modèle moyen peut surpasser un agent mal configuré avec le meilleur modèle.',
          },
        ],
      },
      {
        id: 'orc-deb-m2',
        titre: 'Cas d\'usage des agents IA en entreprise',
        duree: '25 min',
        contenu: `# Cas d'usage des agents IA en entreprise

## Où les agents IA apportent le plus de valeur

Les agents IA sont particulièrement pertinents dans les situations où une tâche nécessite **plusieurs étapes**, **l'accès à différentes sources d'information** et **un raisonnement contextuel**. Voici les cas d'usage les plus matures en entreprise.

## 1. Agent de support client

Un agent de support peut gérer les demandes de niveau 1 et 2 de manière autonome :

**Fonctionnement** :
- Reçoit la demande du client (email, chat, ticket)
- Cherche dans la base de connaissances et la FAQ
- Consulte l'historique du client dans le CRM
- Rédige une réponse personnalisée et contextuelle
- Escalade vers un humain si la confiance est insuffisante

**Résultat typique** : 60-70% des tickets résolus automatiquement, temps de réponse divisé par 10, satisfaction client maintenue ou améliorée.

## 2. Agent d'analyse de données

Un agent analyste peut explorer des données complexes et produire des insights actionnables :

**Fonctionnement** :
- Reçoit une question métier en langage naturel
- Interroge les bases de données (SQL, API)
- Analyse les résultats et identifie les tendances
- Produit un rapport avec visualisations et recommandations

**Exemple** : "Quels sont nos 3 produits les plus rentables ce trimestre et pourquoi ?" → L'agent interroge le data warehouse, croise les données de ventes et de coûts, et produit un rapport argumenté.

## 3. Agent de recherche et veille

**Fonctionnement** :
- Surveille des sources d'information (sites web, flux RSS, réseaux sociaux)
- Filtre et classe les informations pertinentes selon vos critères
- Résume les articles et rapports importants
- Alerte sur les sujets stratégiques

## 4. Agent de recrutement

**Fonctionnement** :
- Analyse les CV reçus par rapport à la fiche de poste
- Score chaque candidature sur des critères objectifs
- Prépare un résumé structuré pour le recruteur
- Suggère des questions d'entretien personnalisées

## 5. Agent de rédaction structurée

**Fonctionnement** :
- Reçoit un brief éditorial ou une consigne métier
- Recherche des données de référence dans vos sources internes
- Produit un premier brouillon structuré
- Intègre les retours et itère jusqu'à validation

## Choisir son premier cas d'usage

Pour votre premier agent, choisissez un cas qui :
- A un **périmètre clair et limité** (pas "tout automatiser")
- Dispose de **données accessibles** (base de connaissances existante)
- Présente un **volume suffisant** pour justifier l'investissement
- Tolère une **marge d'erreur** (pas de contexte critique)

> **Conseil pragmatique** : Commencez par un agent interne (destiné à vos équipes) plutôt qu'un agent en contact direct avec les clients. Le risque est moindre et vous apprenez dans un environnement contrôlé.`,
        quiz: [
          {
            id: 'orc-deb-m2-q1',
            question: 'Quel pourcentage de tickets peut typiquement être résolu automatiquement par un agent de support client IA ?',
            options: [
              '10-20%',
              '30-40%',
              '60-70%',
              '95-100%',
            ],
            correctIndex: 2,
            explication: 'Un agent de support IA bien configuré peut résoudre typiquement 60-70% des tickets de niveau 1 et 2, tout en maintenant ou améliorant la satisfaction client.',
          },
          {
            id: 'orc-deb-m2-q2',
            question: 'Quel critère n\'est PAS recommandé pour choisir son premier cas d\'usage d\'agent IA ?',
            options: [
              'Périmètre clair et limité',
              'Contexte critique sans marge d\'erreur',
              'Données accessibles',
              'Volume suffisant pour justifier l\'investissement',
            ],
            correctIndex: 1,
            explication: 'Pour un premier agent IA, il est recommandé de choisir un contexte qui tolère une marge d\'erreur, pas un contexte critique. Cela permet d\'apprendre et d\'itérer en sécurité.',
          },
          {
            id: 'orc-deb-m2-q3',
            question: 'Pourquoi est-il recommandé de commencer par un agent interne plutôt qu\'un agent en contact client ?',
            options: [
              'Parce que les agents internes sont moins chers',
              'Parce que les employés sont plus patients que les clients',
              'Parce que le risque est moindre et on peut apprendre dans un environnement contrôlé',
              'Parce que les agents internes ne nécessitent pas d\'IA',
            ],
            correctIndex: 2,
            explication: 'Un agent interne présente un risque moindre car il s\'adresse à vos équipes dans un environnement contrôlé, permettant d\'apprendre et d\'itérer avant de s\'exposer aux clients.',
          },
        ],
      },
      {
        id: 'orc-deb-m3',
        titre: 'Configurer son premier agent',
        duree: '30 min',
        contenu: `# Configurer son premier agent

## Choisir sa plateforme

Plusieurs plateformes permettent de créer des agents IA sans coder ou avec très peu de code :

| Plateforme | Complexité | Idéal pour |
|-----------|-----------|------------|
| **GPTs (OpenAI)** | Très simple | Agents conversationnels internes |
| **Claude Projects** | Simple | Analyse de documents, rédaction |
| **Relevance AI** | Moyen | Agents avec outils et intégrations |
| **LangFlow / Flowise** | Moyen | Agents personnalisés open source |
| **Crew AI / AutoGen** | Avancé | Orchestration multi-agents (code) |

Pour ce module, nous utiliserons l'approche **GPTs + instructions structurées**, accessible à tous.

## Rédiger des instructions système efficaces

Les instructions système sont le **facteur de succès n°1** d'un agent. Voici une structure éprouvée :

\`\`\`
## Identité
Tu es [nom de l'agent], un assistant spécialisé en [domaine].

## Mission
Ta mission est de [objectif principal].
Tu aides [qui] à [faire quoi] en [comment].

## Compétences et outils
Tu as accès aux outils suivants :
- [Outil 1] : [description de quand l'utiliser]
- [Outil 2] : [description de quand l'utiliser]

## Règles de comportement
- Toujours [règle positive]
- Ne jamais [règle négative]
- En cas de doute, [comportement par défaut]

## Format de réponse
Tes réponses doivent [format attendu].
Utilise [structure : bullet points, tableaux, etc.].

## Escalade
Si tu ne peux pas répondre avec confiance, indique clairement
que tu recommandes de consulter [qui/quoi].
\`\`\`

## Ajouter des connaissances (RAG)

Le **RAG** (Retrieval-Augmented Generation) permet à votre agent de puiser dans vos propres documents. Concrètement :

1. **Préparez vos documents** : FAQ, guides, procédures, bases de connaissances
2. **Importez-les** dans la plateforme (GPTs, Claude Projects, etc.)
3. **Instruisez l'agent** pour qu'il se base sur ces documents avant de répondre

\`\`\`
## Utilisation des connaissances
Avant de répondre à toute question, consulte d'abord les documents
fournis. Base ta réponse UNIQUEMENT sur les informations contenues
dans ces documents. Si l'information n'y figure pas, indique-le
clairement.
\`\`\`

## Tester et itérer

Une fois l'agent configuré, testez-le systématiquement :

1. **Tests positifs** : posez les questions que l'agent doit savoir traiter
2. **Tests négatifs** : posez des questions hors périmètre pour vérifier qu'il gère correctement
3. **Tests limites** : posez des questions ambiguës pour voir comment il réagit
4. **Tests adverses** : essayez de le faire dévier de son rôle (jailbreak)

Documentez chaque problème trouvé et ajustez les instructions en conséquence.

> **Itération rapide** : Prévoyez 3 à 5 cycles d'itération sur les instructions avant d'obtenir un agent fiable. Chaque cycle de test révèle des cas non anticipés qu'il faut intégrer dans les instructions.`,
        quiz: [
          {
            id: 'orc-deb-m3-q1',
            question: 'Quel est le facteur de succès n°1 d\'un agent IA ?',
            options: [
              'La puissance du modèle de langage choisi',
              'Le nombre d\'outils connectés',
              'La qualité des instructions système',
              'La vitesse de réponse',
            ],
            correctIndex: 2,
            explication: 'Les instructions système sont le facteur de succès n°1 d\'un agent IA. Elles définissent son rôle, ses règles, ses compétences et ses limites, déterminant directement la qualité de ses réponses.',
          },
          {
            id: 'orc-deb-m3-q2',
            question: 'Qu\'est-ce que le RAG (Retrieval-Augmented Generation) ?',
            options: [
              'Un type de modèle IA spécialisé',
              'Une technique permettant à l\'agent de puiser dans vos propres documents pour répondre',
              'Un outil de test automatisé pour agents',
              'Un langage de programmation pour agents IA',
            ],
            correctIndex: 1,
            explication: 'Le RAG permet à l\'agent de consulter vos propres documents (FAQ, guides, procédures) avant de répondre, assurant des réponses basées sur vos données spécifiques plutôt que sur les connaissances générales du modèle.',
          },
          {
            id: 'orc-deb-m3-q3',
            question: 'Combien de cycles d\'itération faut-il typiquement prévoir pour obtenir un agent fiable ?',
            options: [
              '1 seul cycle suffit',
              '3 à 5 cycles',
              '10 à 15 cycles',
              'Il n\'y a jamais besoin d\'itérer',
            ],
            correctIndex: 1,
            explication: 'Il faut prévoir 3 à 5 cycles d\'itération sur les instructions. Chaque cycle de test révèle des cas non anticipés qu\'il faut intégrer dans les instructions pour améliorer la fiabilité.',
          },
        ],
      },
      {
        id: 'orc-deb-m4',
        titre: 'Introduction au multi-agents',
        duree: '30 min',
        contenu: `# Introduction au multi-agents

## Pourquoi plusieurs agents plutôt qu'un seul ?

Un agent unique avec trop de responsabilités devient **moins performant** : ses instructions sont trop longues, ses outils trop nombreux, et sa capacité de raisonnement se dilue. La solution : **spécialiser** chaque agent et les faire collaborer.

C'est le même principe qu'une équipe humaine : un expert comptable, un commercial et un juriste travaillent mieux ensemble que si vous demandiez à une seule personne de tout faire.

## Les modèles de coordination

### Modèle hiérarchique (superviseur)
Un **agent superviseur** reçoit la demande, la décompose en sous-tâches, distribue chaque sous-tâche à un agent spécialisé et agrège les résultats.

\`\`\`
Utilisateur → Agent Superviseur
                ├→ Agent Recherche : trouve les données
                ├→ Agent Analyse : interprète les données
                └→ Agent Rédaction : produit le rapport
              ← Agent Superviseur consolide et répond
\`\`\`

### Modèle séquentiel (chaîne)
Chaque agent passe son résultat au suivant dans un ordre défini, comme une chaîne de montage.

\`\`\`
Input → Agent Extraction → Agent Enrichissement → Agent Validation → Output
\`\`\`

### Modèle collaboratif (débat)
Plusieurs agents "débattent" pour converger vers une meilleure réponse. Un agent propose, un autre critique, un troisième synthétise.

## Exemple concret : équipe d'analyse de marché

Imaginons que vous vouliez analyser un concurrent :

**Agent Collecteur** :
- Spécialité : recherche web et extraction de données
- Outils : recherche web, scraping, APIs de données business
- Mission : collecter toutes les informations publiques sur le concurrent

**Agent Analyste** :
- Spécialité : analyse stratégique et financière
- Outils : calcul, comparaison, modèles d'analyse
- Mission : interpréter les données collectées et identifier les points clés

**Agent Rédacteur** :
- Spécialité : rédaction structurée de rapports
- Outils : templates de rapports, mise en forme
- Mission : produire un rapport clair et actionnable

**Agent Superviseur** :
- Spécialité : coordination et contrôle qualité
- Mission : orchestrer les 3 agents, vérifier la cohérence et livrer le résultat final

## Les pièges à éviter

- **Trop d'agents** : commencez avec 2-3 agents maximum. La complexité de coordination augmente exponentiellement.
- **Communication floue** : définissez précisément le format d'échange entre agents (JSON structuré de préférence).
- **Boucles infinies** : prévoyez des conditions d'arrêt claires pour éviter qu'un agent relance indéfiniment un autre.
- **Absence de supervision** : gardez toujours un humain dans la boucle pour les décisions critiques.

> **Premier pas** : Avant de construire un système multi-agents complexe, maîtrisez d'abord un agent unique parfaitement. Le multi-agents résout les problèmes de complexité, pas les problèmes de configuration de base.`,
        quiz: [
          {
            id: 'orc-deb-m4-q1',
            question: 'Pourquoi est-il préférable d\'utiliser plusieurs agents spécialisés plutôt qu\'un seul agent général ?',
            options: [
              'Parce que c\'est plus économique en tokens',
              'Parce qu\'un agent avec trop de responsabilités voit sa performance se diluer',
              'Parce que les plateformes imposent un maximum de fonctions par agent',
              'Parce qu\'un seul agent ne peut pas accéder à Internet',
            ],
            correctIndex: 1,
            explication: 'Un agent unique surchargé devient moins performant : instructions trop longues, outils trop nombreux, raisonnement dilué. La spécialisation et la collaboration entre agents donnent de meilleurs résultats.',
          },
          {
            id: 'orc-deb-m4-q2',
            question: 'Dans le modèle hiérarchique, quel est le rôle de l\'agent superviseur ?',
            options: [
              'Exécuter toutes les tâches lui-même',
              'Recevoir la demande, la décomposer, distribuer les sous-tâches et agréger les résultats',
              'Remplacer les agents défaillants',
              'Communiquer directement avec l\'utilisateur final uniquement',
            ],
            correctIndex: 1,
            explication: 'L\'agent superviseur reçoit la demande initiale, la décompose en sous-tâches, distribue chaque sous-tâche à un agent spécialisé, puis agrège les résultats pour produire la réponse finale.',
          },
          {
            id: 'orc-deb-m4-q3',
            question: 'Avec combien d\'agents est-il recommandé de commencer un système multi-agents ?',
            options: [
              '1 seul',
              '2-3 maximum',
              '5-10 pour couvrir tous les besoins',
              'Le plus possible pour maximiser les capacités',
            ],
            correctIndex: 1,
            explication: 'Il est recommandé de commencer avec 2-3 agents maximum. La complexité de coordination augmente exponentiellement avec le nombre d\'agents, et il vaut mieux maîtriser un petit système avant de l\'étendre.',
          },
        ],
      },
    ],
  },

  // =============================================
  // ORCHESTRATION - INTERMÉDIAIRE
  // =============================================
  {
    id: 'orc-inter',
    slug: 'orchestration-intermediaire',
    titre: 'Orchestration multi-agents avancée',
    description: 'Concevez des systèmes multi-agents robustes avec gestion d\'état, stratégies de coordination avancées, supervision et mise en production.',
    domaine: 'orchestration',
    niveau: 'intermediaire',
    duree: '2h30',
    objectifs: [
      'Concevoir une architecture multi-agents adaptée à un problème métier complexe',
      'Implémenter des stratégies de coordination et de communication inter-agents',
      'Mettre en place la supervision, le monitoring et la gestion des erreurs',
      'Déployer un système multi-agents en production avec les bonnes pratiques',
    ],
    modules: [
      {
        id: 'orc-inter-m1',
        titre: 'Architectures multi-agents avancées',
        duree: '35 min',
        contenu: `# Architectures multi-agents avancées

## Au-delà des modèles simples

Les architectures multi-agents en entreprise doivent gérer des cas complexes : concurrence d'accès, états partagés, reprises sur erreur, et interactions longues. Voici les patterns architecturaux éprouvés.

## Pattern 1 : Orchestrateur central avec état

L'orchestrateur maintient un **état global** qui évolue à mesure que les agents travaillent. Chaque agent lit l'état, exécute sa tâche et met à jour l'état.

\`\`\`
État global = {
  demande_originale: "...",
  etape_courante: "analyse",
  donnees_collectees: [...],
  analyse_en_cours: {...},
  validation: null,
  rapport_final: null
}

Orchestrateur :
  1. Lit l'état → etape_courante = "collecte"
  2. Dispatche à l'Agent Collecteur
  3. Agent Collecteur met à jour donnees_collectees
  4. Orchestrateur avance → etape_courante = "analyse"
  5. Dispatche à l'Agent Analyste
  ... et ainsi de suite
\`\`\`

L'avantage de cette approche : en cas d'erreur, on peut **reprendre exactement où on s'est arrêté** sans recommencer depuis le début.

## Pattern 2 : Agents autonomes avec tableau partagé (blackboard)

Inspiré du pattern "blackboard" en informatique, les agents lisent et écrivent sur un **espace partagé**. Chaque agent décide de manière autonome quand intervenir en fonction de l'état du tableau.

C'est un pattern puissant pour les problèmes où **l'ordre des opérations n'est pas fixe** et où les agents doivent réagir dynamiquement aux contributions des autres.

## Pattern 3 : Pipeline avec points de contrôle

Chaque étape du pipeline produit un **artefact versionné**. Si une étape échoue, on revient au dernier point de contrôle valide.

\`\`\`
[Input] → Checkpoint 0
  → Agent A → [Artefact A] → Checkpoint 1
  → Agent B → [Artefact B] → Checkpoint 2
  → Agent C → [Artefact C] → Checkpoint 3
[Output final]

Si Agent C échoue → rollback à Checkpoint 2 → retry
\`\`\`

## Pattern 4 : Swarm (essaim)

Plusieurs instances du même agent travaillent en parallèle sur des sous-ensembles du problème. Un agrégateur combine les résultats.

Cas d'usage : analyser 500 CV en parallèle avec 10 instances de l'Agent Recruteur, puis agréger les scores.

## Choisir son architecture

| Critère | Orchestrateur central | Blackboard | Pipeline | Swarm |
|---------|----------------------|------------|----------|-------|
| Contrôle | Fort | Faible | Moyen | Moyen |
| Flexibilité | Moyen | Fort | Faible | Faible |
| Scalabilité | Moyen | Moyen | Fort | Très fort |
| Complexité | Moyen | Fort | Faible | Faible |

> **Règle d'or** : Choisissez l'architecture la **plus simple** qui résout votre problème. La complexité architecturale est un coût permanent de maintenance. Un pipeline bien pensé vaut mieux qu'un blackboard surdimensionné.`,
        quiz: [
          {
            id: 'orc-inter-m1-q1',
            question: 'Quel est l\'avantage principal du pattern "orchestrateur central avec état" ?',
            options: [
              'Il est le plus rapide en termes de performance',
              'Il permet de reprendre exactement où on s\'est arrêté en cas d\'erreur',
              'Il ne nécessite aucune coordination entre agents',
              'Il est le plus simple à implémenter',
            ],
            correctIndex: 1,
            explication: 'L\'état global maintenu par l\'orchestrateur permet de reprendre le traitement exactement à l\'étape où l\'erreur s\'est produite, sans recommencer depuis le début.',
          },
          {
            id: 'orc-inter-m1-q2',
            question: 'Dans quel cas le pattern Swarm est-il le plus adapté ?',
            options: [
              'Quand les tâches doivent être exécutées dans un ordre strict',
              'Quand un problème peut être découpé en sous-ensembles traités en parallèle',
              'Quand il n\'y a qu\'un seul agent disponible',
              'Quand le problème nécessite un débat entre agents',
            ],
            correctIndex: 1,
            explication: 'Le pattern Swarm excelle quand un problème peut être découpé en sous-ensembles indépendants traités en parallèle par plusieurs instances du même agent, comme l\'analyse de nombreux CV.',
          },
          {
            id: 'orc-inter-m1-q3',
            question: 'Quelle est la règle d\'or pour choisir une architecture multi-agents ?',
            options: [
              'Toujours choisir l\'architecture la plus complète',
              'Choisir l\'architecture la plus simple qui résout le problème',
              'Utiliser systématiquement le pattern blackboard',
              'Combiner tous les patterns pour plus de flexibilité',
            ],
            correctIndex: 1,
            explication: 'Il faut choisir l\'architecture la plus simple qui résout le problème. La complexité architecturale est un coût permanent de maintenance qu\'il faut minimiser.',
          },
        ],
      },
      {
        id: 'orc-inter-m2',
        titre: 'Communication et protocoles inter-agents',
        duree: '35 min',
        contenu: `# Communication et protocoles inter-agents

## L'enjeu de la communication structurée

Quand deux agents IA échangent des informations, la qualité de leur communication détermine la qualité du résultat final. Un échange mal structuré entraîne des pertes d'information, des malentendus et des erreurs en cascade.

## Définir un contrat d'interface

Chaque agent doit avoir un **contrat d'interface** clair qui définit :

\`\`\`typescript
// Contrat de l'Agent Analyste
interface AgentAnalysteInput {
  donnees_brutes: string;        // Données à analyser
  contexte_metier: string;       // Contexte pour guider l'analyse
  format_attendu: "resume" | "detaille" | "score_uniquement";
}

interface AgentAnalysteOutput {
  analyse: string;               // Résultat de l'analyse
  confiance: number;             // Score de confiance 0-100
  points_cles: string[];         // Liste des insights principaux
  recommandations: string[];     // Actions suggérées
  metadata: {
    temps_traitement: number;
    sources_utilisees: string[];
  };
}
\`\`\`

Ce contrat garantit que l'agent en amont sait **quoi fournir** et que l'agent en aval sait **quoi attendre**.

## Protocoles de communication

### Synchrone (requête-réponse)
L'agent appelant attend la réponse avant de continuer. Simple et prévisible, mais peut créer des goulots d'étranglement.

### Asynchrone (événementiel)
L'agent publie un résultat et n'attend pas. Les agents intéressés récupèrent le résultat quand il est disponible. Plus scalable, mais plus complexe à déboguer.

### Message queue
Les messages transitent par une file d'attente. Cela découple les agents et permet de gérer les pics de charge. Outils : Redis, RabbitMQ, ou simplement un tableur partagé pour les cas simples.

## Gestion du contexte partagé

Les agents ont besoin d'un **contexte commun** pour collaborer efficacement. Deux approches :

### Context passing (passage de contexte)
Chaque message entre agents contient tout le contexte nécessaire. Simple mais verbeux.

\`\`\`json
{
  "task_id": "analyse-q4-2025",
  "etape": 3,
  "contexte": {
    "client": "Acme Corp",
    "periode": "Q4 2025",
    "objectif": "identifier les leviers de croissance"
  },
  "resultats_precedents": {
    "collecte": { "...": "..." },
    "analyse_primaire": { "...": "..." }
  },
  "instruction": "Produire les recommandations finales"
}
\`\`\`

### Shared state (état partagé)
Les agents lisent et écrivent dans un store centralisé (base de données, document partagé). Chaque agent accède uniquement aux informations dont il a besoin.

## Gestion des conflits

Quand plusieurs agents modifient le même état, des conflits peuvent survenir. Solutions :
- **Verrouillage** : un seul agent peut modifier une section à la fois
- **Versioning** : chaque modification crée une nouvelle version, les conflits sont résolus par l'orchestrateur
- **CRDT** (Conflict-free Replicated Data Types) : structures de données qui se résolvent automatiquement

> **Pragmatisme** : Pour 90% des cas d'usage en entreprise, le context passing synchrone suffit largement. Ne passez aux architectures asynchrones que quand vous avez un besoin réel de scalabilité ou de parallélisme.`,
        quiz: [
          {
            id: 'orc-inter-m2-q1',
            question: 'Qu\'est-ce qu\'un contrat d\'interface dans le contexte multi-agents ?',
            options: [
              'Un document juridique entre fournisseurs d\'IA',
              'La définition précise des entrées attendues et sorties produites par un agent',
              'Un accord de confidentialité entre agents',
              'Le prix d\'utilisation d\'un agent',
            ],
            correctIndex: 1,
            explication: 'Un contrat d\'interface définit précisément les données en entrée (input) et en sortie (output) d\'un agent, garantissant que les agents en amont et en aval savent exactement quoi fournir et quoi attendre.',
          },
          {
            id: 'orc-inter-m2-q2',
            question: 'Quel protocole de communication est le plus simple et prévisible ?',
            options: [
              'Asynchrone événementiel',
              'Message queue',
              'Synchrone requête-réponse',
              'CRDT',
            ],
            correctIndex: 2,
            explication: 'La communication synchrone (requête-réponse) est la plus simple et prévisible : l\'agent appelant attend la réponse avant de continuer. Elle peut cependant créer des goulots d\'étranglement.',
          },
          {
            id: 'orc-inter-m2-q3',
            question: 'Pour 90% des cas d\'usage en entreprise, quel mode de communication est suffisant ?',
            options: [
              'Architecture asynchrone avec message queue',
              'CRDT distribués',
              'Context passing synchrone',
              'Blockchain décentralisée',
            ],
            correctIndex: 2,
            explication: 'Le context passing synchrone suffit pour 90% des cas d\'usage en entreprise. Les architectures asynchrones ne sont nécessaires que pour des besoins réels de scalabilité ou de parallélisme.',
          },
        ],
      },
      {
        id: 'orc-inter-m3',
        titre: 'Supervision et gestion des erreurs',
        duree: '30 min',
        contenu: `# Supervision et gestion des erreurs

## Le besoin critique de supervision

Un système multi-agents est par nature plus fragile qu'un agent unique : chaque agent peut échouer, et une erreur à une étape peut se propager aux suivantes. La supervision est donc **non négociable** en production.

## Les niveaux de supervision

### Niveau 1 : Monitoring technique
Surveillez les métriques de base de chaque agent :
- **Disponibilité** : l'agent répond-il ?
- **Latence** : en combien de temps ?
- **Taux d'erreur** : quel pourcentage d'appels échouent ?
- **Consommation de tokens** : reste-t-on dans le budget ?

### Niveau 2 : Monitoring fonctionnel
Évaluez la **qualité des résultats** produits :
- **Score de confiance** : chaque agent doit évaluer sa propre confiance
- **Cohérence** : les résultats entre agents sont-ils cohérents ?
- **Pertinence** : les réponses correspondent-elles aux attentes métier ?

### Niveau 3 : Supervision humaine
Maintenez un **humain dans la boucle** pour :
- Les décisions critiques ou irréversibles
- Les cas où la confiance du système est basse
- L'échantillonnage aléatoire pour contrôle qualité

## Stratégies de gestion des erreurs

### Retry avec backoff exponentiel
\`\`\`
Tentative 1 : immédiate
Tentative 2 : après 2 secondes
Tentative 3 : après 4 secondes
Tentative 4 : après 8 secondes
→ Si échec après 4 tentatives : escalade
\`\`\`

### Fallback agent
Si l'agent principal échoue, un agent de secours prend le relais. L'agent de secours peut être :
- Le même agent avec un modèle IA différent (ex : Claude → GPT-4)
- Un agent simplifié qui traite les cas basiques
- Un routage vers un humain

### Circuit breaker
Quand un agent échoue trop souvent (ex : > 5 erreurs en 1 minute), le circuit breaker **coupe les appels** vers cet agent pendant un temps défini. Cela évite de gaspiller des ressources et de propager les erreurs.

\`\`\`
État normal → Agent opérationnel
  ↓ (seuil d'erreurs dépassé)
Circuit ouvert → Appels bloqués, fallback activé
  ↓ (après timeout)
Demi-ouvert → Test avec un appel unique
  ↓ (succès)
État normal → Agent opérationnel
\`\`\`

### Dead letter processing
Les tâches qui échouent définitivement sont stockées dans une file "dead letter" pour analyse et traitement manuel ultérieur. Aucune donnée ne doit être perdue silencieusement.

## Tableau de bord de supervision

Créez un dashboard centralisé avec :
- Vue d'ensemble : statut de chaque agent (vert/jaune/rouge)
- Graphiques : latence, taux d'erreur, volume traité dans le temps
- Alertes : notification immédiate en cas d'anomalie
- Logs : historique détaillé des interactions entre agents

> **Principe fondamental** : Dans un système multi-agents, les erreurs ne sont pas des exceptions, elles sont la norme. Concevez votre système en partant du principe que chaque composant peut échouer à tout moment, et assurez-vous que le système global reste fonctionnel.`,
        quiz: [
          {
            id: 'orc-inter-m3-q1',
            question: 'Qu\'est-ce qu\'un circuit breaker dans le contexte multi-agents ?',
            options: [
              'Un dispositif électrique de protection',
              'Un mécanisme qui coupe les appels vers un agent défaillant après un seuil d\'erreurs',
              'Un agent spécialisé dans la détection des bugs',
              'Un outil de déploiement automatisé',
            ],
            correctIndex: 1,
            explication: 'Le circuit breaker coupe automatiquement les appels vers un agent qui échoue trop souvent, évitant le gaspillage de ressources. Après un timeout, il teste avec un seul appel avant de rétablir la connexion.',
          },
          {
            id: 'orc-inter-m3-q2',
            question: 'Quel principe fondamental guide la conception d\'un système multi-agents fiable ?',
            options: [
              'Chaque composant doit être parfait avant le déploiement',
              'Les erreurs ne doivent jamais se produire en production',
              'Chaque composant peut échouer à tout moment et le système doit rester fonctionnel',
              'Seul l\'orchestrateur a besoin de gestion d\'erreurs',
            ],
            correctIndex: 2,
            explication: 'Il faut concevoir le système en partant du principe que chaque composant peut échouer à tout moment. La gestion des erreurs n\'est pas une exception mais une part intégrante du design.',
          },
          {
            id: 'orc-inter-m3-q3',
            question: 'À quoi sert le monitoring fonctionnel (niveau 2) ?',
            options: [
              'Vérifier que les serveurs sont en ligne',
              'Évaluer la qualité et la pertinence des résultats produits par les agents',
              'Compter le nombre de tokens consommés',
              'Surveiller la bande passante réseau',
            ],
            correctIndex: 1,
            explication: 'Le monitoring fonctionnel évalue la qualité des résultats : score de confiance, cohérence entre agents et pertinence par rapport aux attentes métier. Il va au-delà du simple monitoring technique.',
          },
        ],
      },
      {
        id: 'orc-inter-m4',
        titre: 'Déploiement et stratégie d\'adoption',
        duree: '30 min',
        contenu: `# Déploiement et stratégie d'adoption

## Du prototype à la production

Le passage d'un prototype multi-agents fonctionnel à un système en production est un moment critique. Voici les étapes pour y arriver de manière maîtrisée.

## Phase 1 : Validation pré-production

### Tests de charge
Simulez le volume réel de demandes pour vérifier que le système tient la charge :
- Combien de tâches simultanées le système peut-il gérer ?
- Quel est le temps de réponse sous charge ?
- À partir de quel volume les performances se dégradent-elles ?

### Tests de régression
Constituez un jeu de tests de référence (**benchmark**) :

\`\`\`
Jeu de test = [
  { input: "demande type 1", output_attendu: "...", score_min: 0.8 },
  { input: "demande type 2", output_attendu: "...", score_min: 0.85 },
  { input: "cas limite 1", output_attendu: "...", score_min: 0.7 },
  ...
]

→ Exécuter avant chaque mise à jour
→ Alerter si le score descend sous le seuil
\`\`\`

Ce benchmark permet de vérifier que chaque modification n'a pas dégradé les performances existantes.

### Tests d'intégration
Vérifiez les interactions entre agents dans des scénarios réalistes de bout en bout (end-to-end).

## Phase 2 : Déploiement progressif

### Canary deployment
Déployez la nouvelle version pour **5% des utilisateurs** d'abord. Surveillez les métriques. Si tout va bien, augmentez progressivement : 25%, 50%, 100%.

### Feature flags
Activez ou désactivez des fonctionnalités du système sans redéployer. Cela permet de couper rapidement une fonctionnalité problématique.

### Rollback automatique
Si les métriques clés (taux d'erreur, latence) dépassent un seuil, le système revient automatiquement à la version précédente.

## Phase 3 : Adoption par les utilisateurs

La technologie ne suffit pas. L'**adoption humaine** est le facteur de succès le plus sous-estimé.

### Formation des utilisateurs
- Expliquez **ce que fait** le système (et ce qu'il ne fait pas)
- Montrez **comment interagir** avec les agents
- Formez aux **limites** : quand ne pas faire confiance au système
- Créez des **guides rapides** avec des exemples concrets

### Gestion du changement
- Identifiez des **champions** : des utilisateurs enthousiastes qui deviennent ambassadeurs
- Recueillez le **feedback** systématiquement dans les premières semaines
- Itérez rapidement sur les points de friction remontés
- Communiquez les **victoires** : montrez les gains concrets (temps économisé, qualité améliorée)

### Métriques d'adoption
Suivez l'adoption réelle :

| Métrique | Cible à 1 mois | Cible à 3 mois |
|----------|----------------|----------------|
| % utilisateurs actifs | > 50% | > 80% |
| Fréquence d'utilisation | 2x/semaine | Quotidien |
| Satisfaction (NPS) | > 30 | > 50 |
| Taux d'escalade humaine | < 40% | < 25% |

## La boucle d'amélioration continue

Un système multi-agents n'est jamais "terminé". Mettez en place :
- **Revue hebdomadaire** des erreurs et escalades
- **Revue mensuelle** des performances et de l'adoption
- **Revue trimestrielle** de l'architecture et de la stratégie

> **Vision long terme** : Les systèmes multi-agents les plus performants sont ceux qui s'améliorent en continu grâce au feedback des utilisateurs. Chaque interaction est une donnée d'entraînement potentielle pour affiner les instructions, les outils et les processus.`,
        quiz: [
          {
            id: 'orc-inter-m4-q1',
            question: 'Qu\'est-ce qu\'un "canary deployment" ?',
            options: [
              'Un déploiement qui se fait la nuit',
              'Un déploiement progressif commençant par un petit pourcentage d\'utilisateurs',
              'Un déploiement uniquement pour les développeurs',
              'Un déploiement qui ne concerne que le monitoring',
            ],
            correctIndex: 1,
            explication: 'Le canary deployment consiste à déployer la nouvelle version pour un petit pourcentage d\'utilisateurs (ex : 5%), surveiller les métriques, puis augmenter progressivement si tout va bien.',
          },
          {
            id: 'orc-inter-m4-q2',
            question: 'Quel est le facteur de succès le plus sous-estimé dans le déploiement d\'un système multi-agents ?',
            options: [
              'La puissance des serveurs',
              'Le nombre d\'agents déployés',
              'L\'adoption humaine',
              'Le choix du modèle IA',
            ],
            correctIndex: 2,
            explication: 'L\'adoption humaine est le facteur le plus sous-estimé. La technologie seule ne suffit pas : il faut former les utilisateurs, gérer le changement et itérer sur le feedback.',
          },
          {
            id: 'orc-inter-m4-q3',
            question: 'Quel taux d\'escalade humaine est ciblé après 3 mois d\'utilisation ?',
            options: [
              'Moins de 5%',
              'Moins de 10%',
              'Moins de 25%',
              'Moins de 50%',
            ],
            correctIndex: 2,
            explication: 'L\'objectif à 3 mois est un taux d\'escalade humaine inférieur à 25%, contre moins de 40% à 1 mois. Cela reflète l\'amélioration progressive du système grâce au feedback et à l\'itération.',
          },
        ],
      },
    ],
  },
];
