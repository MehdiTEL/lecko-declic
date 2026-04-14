import type { Formation } from '../types/formation';

export const FORMATIONS_PART1: Formation[] = [
  // ============================================================
  // DOMAINE : DOCUMENTS
  // ============================================================

  // --- Documents - Débutant ---
  {
    id: 'doc-deb',
    slug: 'documents-debutant',
    titre: 'Premiers pas avec l\'IA pour le traitement de documents',
    description: 'Apprenez à utiliser l\'intelligence artificielle pour résumer, extraire des informations et classer vos documents professionnels. Aucune compétence technique préalable requise.',
    domaine: 'documents',
    niveau: 'debutant',
    duree: '2h30',
    objectifs: [
      'Comprendre comment l\'IA analyse et traite les documents textuels',
      'Savoir rédiger des prompts efficaces pour résumer un document',
      'Extraire des informations clés d\'un document long',
      'Classer automatiquement des documents par catégorie',
    ],
    modules: [
      {
        id: 'doc-deb-m1',
        titre: 'Comprendre le traitement de documents par l\'IA',
        duree: '35 min',
        contenu: `## Qu'est-ce que le traitement de documents par l'IA ?

Le traitement de documents par l'intelligence artificielle désigne l'ensemble des techniques permettant à une machine de **lire, comprendre et analyser** des documents textuels de manière automatisée. Contrairement à une simple recherche par mots-clés, l'IA moderne est capable de saisir le **sens** d'un texte et d'en extraire des informations pertinentes.

### Les grands modèles de langage (LLM)

Les outils comme ChatGPT, Claude ou Gemini reposent sur des **grands modèles de langage** (Large Language Models). Ces modèles ont été entraînés sur d'immenses corpus de textes et sont capables de :

- **Résumer** un document de 50 pages en quelques paragraphes
- **Extraire** des données spécifiques (dates, montants, noms)
- **Reformuler** un texte dans un style ou un ton différent
- **Classer** un document dans une catégorie prédéfinie

### Cas d'usage en entreprise

En contexte professionnel, le traitement de documents par l'IA permet de gagner un temps considérable sur des tâches répétitives :

| Tâche manuelle | Tâche automatisée par l'IA |
|---|---|
| Lire 30 pages de rapport | Obtenir un résumé en 30 secondes |
| Chercher une clause dans un contrat | Extraction ciblée par question |
| Trier des emails par thème | Classification automatique |
| Comparer deux versions d'un document | Analyse différentielle assistée |

### Les limites à connaître

L'IA n'est pas infaillible. Il est essentiel de garder un regard critique :

- **Les hallucinations** : l'IA peut inventer des informations qui semblent plausibles mais sont fausses
- **La confidentialité** : attention aux données sensibles envoyées à des services cloud
- **La longueur** : certains modèles ont une limite de contexte (nombre de mots qu'ils peuvent traiter en une fois)

> **Bonne pratique** : Toujours vérifier les informations critiques extraites par l'IA, surtout pour des documents juridiques ou financiers.

### Choisir le bon outil

Pour débuter, vous pouvez utiliser des outils gratuits ou avec un essai gratuit :

- **ChatGPT** (OpenAI) : polyvalent, bonne gestion des documents longs avec GPT-4
- **Claude** (Anthropic) : excellent pour l'analyse de documents longs, fenêtre de contexte étendue
- **Gemini** (Google) : bien intégré à Google Workspace

Chacun a ses forces. L'important est de **tester avec vos propres documents** pour voir lequel répond le mieux à vos besoins.`,
        quiz: [
          {
            id: 'doc-deb-m1-q1',
            question: 'Qu\'est-ce qu\'une "hallucination" dans le contexte de l\'IA ?',
            options: [
              'Un bug qui fait planter l\'application',
              'Une information inventée par l\'IA qui semble vraie mais est fausse',
              'Un effet visuel dans les images générées par l\'IA',
              'Une fonctionnalité avancée des modèles de langage',
            ],
            correctIndex: 1,
            explication: 'Une hallucination désigne une information générée par l\'IA qui paraît plausible et cohérente mais qui est en réalité fausse ou inventée. C\'est pourquoi il est crucial de toujours vérifier les informations critiques.',
          },
          {
            id: 'doc-deb-m1-q2',
            question: 'Quel avantage principal offre l\'IA par rapport à une recherche par mots-clés classique ?',
            options: [
              'Elle est toujours gratuite',
              'Elle fonctionne sans connexion internet',
              'Elle comprend le sens du texte, pas seulement les mots exacts',
              'Elle ne fait jamais d\'erreur',
            ],
            correctIndex: 2,
            explication: 'L\'IA moderne, grâce aux grands modèles de langage, est capable de comprendre le sens sémantique d\'un texte. Elle peut donc trouver des informations pertinentes même si les mots exacts recherchés ne sont pas présents dans le document.',
          },
          {
            id: 'doc-deb-m1-q3',
            question: 'Quelle précaution importante faut-il prendre avant d\'envoyer un document à un outil d\'IA en ligne ?',
            options: [
              'Vérifier que le document est au format PDF',
              'S\'assurer que le document ne contient pas de données confidentielles ou sensibles',
              'Convertir le document en anglais pour de meilleurs résultats',
              'Réduire le document à moins de 5 pages',
            ],
            correctIndex: 1,
            explication: 'Les documents envoyés à des services d\'IA en ligne transitent par des serveurs externes. Il faut donc être vigilant sur la confidentialité des données et s\'assurer que l\'envoi est conforme à la politique de sécurité de votre entreprise.',
          },
        ],
      },
      {
        id: 'doc-deb-m2',
        titre: 'Résumer un document efficacement avec l\'IA',
        duree: '40 min',
        contenu: `## L'art du résumé assisté par l'IA

Résumer un document est l'une des tâches les plus courantes et les plus utiles que l'IA peut accomplir pour vous. Mais la qualité du résumé dépend directement de la **qualité de votre demande** (le prompt).

### La technique du prompt structuré

Un bon prompt de résumé doit préciser trois éléments :

1. **Le contexte** : à qui s'adresse le résumé
2. **Le format souhaité** : longueur, structure, style
3. **Le focus** : quels aspects privilégier

#### Exemple de prompt basique vs optimisé

**Prompt basique :**
\`\`\`
Résume ce document.
\`\`\`

**Prompt optimisé :**
\`\`\`
Résume ce rapport annuel en 5 points clés destinés au comité
de direction. Concentre-toi sur les résultats financiers,
les risques identifiés et les recommandations stratégiques.
Utilise un ton professionnel et factuel.
\`\`\`

La différence de qualité entre les deux résultats sera considérable.

### Les différents types de résumés

Selon votre besoin, vous pouvez demander différents formats :

- **Résumé exécutif** : 3-5 phrases pour une vue d'ensemble rapide
- **Points clés (bullet points)** : liste des informations essentielles
- **Résumé structuré** : avec sections et sous-titres
- **Résumé comparatif** : pour mettre en parallèle plusieurs documents
- **Résumé actionnable** : centré sur les décisions à prendre

### Technique avancée : le résumé en chaîne

Pour les documents très longs (plus de 50 pages), utilisez la technique du **résumé en chaîne** :

1. Découpez le document en sections logiques
2. Résumez chaque section séparément
3. Demandez à l'IA de synthétiser l'ensemble des résumés

\`\`\`
Voici les résumés de 5 sections d'un rapport.
Crée une synthèse globale cohérente en conservant
les informations les plus importantes de chaque section.
\`\`\`

### Vérifier la qualité d'un résumé

Après avoir obtenu un résumé, posez-vous ces questions :

- Les chiffres mentionnés sont-ils corrects ?
- Des informations importantes ont-elles été omises ?
- Le ton est-il adapté à l'audience cible ?
- La structure est-elle claire et logique ?

> **Astuce** : Demandez à l'IA de noter la confiance qu'elle a dans son résumé et d'indiquer les passages qu'elle a trouvés ambigus. Cela vous aide à cibler votre relecture.`,
        quiz: [
          {
            id: 'doc-deb-m2-q1',
            question: 'Quels sont les trois éléments clés d\'un bon prompt de résumé ?',
            options: [
              'La date, l\'auteur et le titre du document',
              'Le contexte, le format souhaité et le focus',
              'La langue, la longueur et la police de caractères',
              'Le modèle d\'IA, la température et le nombre de tokens',
            ],
            correctIndex: 1,
            explication: 'Un prompt de résumé efficace précise le contexte (pour qui), le format souhaité (longueur, structure) et le focus (quels aspects privilégier). Ces trois éléments permettent à l\'IA de produire un résumé adapté à votre besoin exact.',
          },
          {
            id: 'doc-deb-m2-q2',
            question: 'Quelle technique est recommandée pour résumer un document de plus de 50 pages ?',
            options: [
              'Copier-coller tout le document d\'un coup dans l\'IA',
              'Ne résumer que les 10 premières pages',
              'Utiliser la technique du résumé en chaîne (découper, résumer, synthétiser)',
              'Demander à l\'IA de lire le fichier directement sur votre ordinateur',
            ],
            correctIndex: 2,
            explication: 'Le résumé en chaîne consiste à découper le document en sections, résumer chaque section séparément, puis demander une synthèse globale. Cela contourne les limites de contexte des modèles et produit un résumé plus fidèle.',
          },
          {
            id: 'doc-deb-m2-q3',
            question: 'Pourquoi un prompt "Résume ce document" produit-il souvent un résultat médiocre ?',
            options: [
              'Parce que l\'IA ne sait pas lire les documents',
              'Parce qu\'il manque le contexte, le format et le focus du résumé souhaité',
              'Parce que le prompt est trop court pour être compris',
              'Parce que l\'IA a besoin du nom de l\'auteur pour résumer',
            ],
            correctIndex: 1,
            explication: 'Sans indication de contexte (audience), de format (longueur, structure) et de focus (aspects à privilégier), l\'IA produit un résumé générique qui ne correspond pas forcément à votre besoin spécifique.',
          },
        ],
      },
      {
        id: 'doc-deb-m3',
        titre: 'Extraire des informations clés d\'un document',
        duree: '40 min',
        contenu: `## Extraction d'informations : transformer un document en données exploitables

L'extraction d'informations consiste à **identifier et isoler des données spécifiques** au sein d'un document. L'IA excelle dans cette tâche car elle comprend le contexte et peut repérer des informations même lorsqu'elles sont formulées de manière variable.

### Types d'informations extractibles

Voici les catégories d'informations que vous pouvez extraire :

- **Entités nommées** : noms de personnes, entreprises, lieux, dates
- **Données chiffrées** : montants, pourcentages, quantités
- **Relations** : liens entre entités (qui travaille pour qui, qui a signé quoi)
- **Clauses et conditions** : dans des contrats ou documents juridiques
- **Sentiments et opinions** : dans des retours clients ou enquêtes

### Rédiger un prompt d'extraction efficace

La clé est d'être **précis sur ce que vous cherchez** et sur le **format de sortie** souhaité.

#### Exemple : extraire des données d'une facture

\`\`\`
Extrais les informations suivantes de cette facture et
présente-les sous forme de tableau :

- Numéro de facture
- Date d'émission
- Nom du fournisseur
- Montant HT
- Montant TVA
- Montant TTC
- Date d'échéance

Si une information est absente, indique "Non spécifié".
\`\`\`

#### Exemple : analyser un contrat

\`\`\`
Dans ce contrat de prestation, identifie et liste :

1. Les obligations du prestataire
2. Les obligations du client
3. Les conditions de résiliation
4. Les pénalités prévues
5. La durée du contrat et les conditions de renouvellement

Pour chaque élément, cite le numéro de l'article concerné.
\`\`\`

### Extraction en lot (batch)

Quand vous devez traiter plusieurs documents similaires, créez un **modèle de prompt réutilisable** :

\`\`\`
Tu es un assistant spécialisé dans l'analyse de CV.
Pour chaque CV que je te soumets, extrais :
- Nom complet
- Dernier poste occupé
- Nombre d'années d'expérience
- Compétences techniques principales (max 5)
- Formation la plus élevée

Présente le résultat en JSON.
\`\`\`

### Le format JSON pour les extractions structurées

Le format JSON est particulièrement utile quand vous souhaitez réutiliser les données extraites dans un tableur ou une application :

\`\`\`json
{
  "nom": "Marie Dupont",
  "poste": "Directrice Marketing",
  "experience_annees": 12,
  "competences": ["SEO", "Analytics", "CRM", "Gestion de projet"],
  "formation": "Master Marketing Digital - HEC Paris"
}
\`\`\`

> **Conseil** : Testez toujours votre prompt d'extraction sur 2-3 documents avant de l'appliquer à un lot complet. Cela vous permet d'affiner la formulation et de repérer les cas particuliers.`,
        quiz: [
          {
            id: 'doc-deb-m3-q1',
            question: 'Pourquoi le format JSON est-il recommandé pour l\'extraction structurée d\'informations ?',
            options: [
              'Parce qu\'il est plus joli visuellement',
              'Parce qu\'il permet de réutiliser facilement les données dans un tableur ou une application',
              'Parce que l\'IA ne peut produire que du JSON',
              'Parce qu\'il compresse les données pour les rendre plus légères',
            ],
            correctIndex: 1,
            explication: 'Le JSON est un format structuré standard qui peut être directement importé dans des tableurs, bases de données ou applications. Il garantit une organisation cohérente des données extraites.',
          },
          {
            id: 'doc-deb-m3-q2',
            question: 'Quelle bonne pratique est recommandée avant d\'appliquer un prompt d\'extraction à un lot de documents ?',
            options: [
              'Traduire tous les documents en anglais',
              'Supprimer les images des documents',
              'Tester le prompt sur 2-3 documents pour l\'affiner',
              'Réduire tous les documents à 1 page maximum',
            ],
            correctIndex: 2,
            explication: 'Tester sur un petit échantillon permet de vérifier que le prompt produit les résultats attendus et de l\'ajuster avant de traiter un volume important de documents.',
          },
          {
            id: 'doc-deb-m3-q3',
            question: 'Dans un prompt d\'extraction, que faut-il préciser quand une information pourrait être absente du document ?',
            options: [
              'Demander à l\'IA d\'inventer une valeur plausible',
              'Indiquer à l\'IA de marquer "Non spécifié" ou équivalent',
              'Ignorer cette information dans la demande',
              'Demander à l\'IA de chercher sur internet',
            ],
            correctIndex: 1,
            explication: 'En précisant un comportement par défaut pour les informations absentes (comme "Non spécifié"), on évite que l\'IA invente des données (hallucinations) et on obtient un résultat fiable et honnête.',
          },
        ],
      },
      {
        id: 'doc-deb-m4',
        titre: 'Classer et organiser des documents automatiquement',
        duree: '35 min',
        contenu: `## Classification automatique de documents

La classification de documents consiste à **attribuer automatiquement une catégorie** à chaque document. C'est une tâche idéale pour l'IA, surtout quand le volume de documents est important.

### Pourquoi classer ses documents avec l'IA ?

Dans une entreprise, les documents s'accumulent rapidement :

- Emails entrants à trier par service
- Factures à catégoriser (achats, prestations, abonnements)
- Réclamations clients à orienter vers le bon département
- Documents RH à organiser par type (contrats, fiches de paie, congés)

La classification manuelle est **chronophage et source d'erreurs**. L'IA peut traiter des centaines de documents en quelques minutes avec une cohérence que l'humain ne peut pas maintenir sur la durée.

### Définir vos catégories

Avant de classer, il faut **définir clairement vos catégories**. Un système de classification efficace est :

- **Exhaustif** : chaque document doit pouvoir entrer dans une catégorie
- **Exclusif** : un document ne devrait idéalement appartenir qu'à une catégorie
- **Clair** : les critères de chaque catégorie sont sans ambiguïté

#### Exemple de prompt de classification

\`\`\`
Classe chaque document dans UNE des catégories suivantes :

- FACTURE : document de facturation (facture, avoir, note de débit)
- CONTRAT : document contractuel (contrat, avenant, bon de commande)
- CORRESPONDANCE : échange écrit (email, courrier, mémo)
- RH : document lié aux ressources humaines (fiche de paie, congé, évaluation)
- TECHNIQUE : documentation technique (spécification, manuel, procédure)
- AUTRE : tout document n'entrant pas dans les catégories précédentes

Pour chaque document, indique :
1. La catégorie choisie
2. Le niveau de confiance (élevé, moyen, faible)
3. Une justification en une phrase
\`\`\`

### Classification multi-critères

Parfois, un seul critère ne suffit pas. Vous pouvez demander une classification sur **plusieurs axes** :

\`\`\`
Pour ce document, indique :
- Type : facture / devis / bon de commande / autre
- Urgence : haute / moyenne / basse
- Service concerné : comptabilité / juridique / commercial / RH
- Action requise : à payer / à signer / à archiver / à transmettre
\`\`\`

### Automatiser avec un workflow

Pour aller plus loin, vous pouvez intégrer la classification IA dans un processus automatisé :

1. Un document arrive par email ou dans un dossier partagé
2. L'IA le lit et le classe automatiquement
3. Le document est déplacé dans le bon dossier
4. Une notification est envoyée au responsable concerné

Des outils comme **Microsoft Power Automate**, **Zapier** ou **Make** permettent de créer ces workflows sans coder, en connectant votre outil d'IA à vos applications métier.

> **Attention** : Pour les documents sensibles (juridiques, financiers), prévoyez toujours une étape de **validation humaine** avant l'action finale. L'IA classe, l'humain valide.`,
        quiz: [
          {
            id: 'doc-deb-m4-q1',
            question: 'Quelles sont les trois qualités d\'un bon système de classification de documents ?',
            options: [
              'Rapide, gratuit et automatique',
              'Exhaustif, exclusif et clair',
              'Simple, coloré et intuitif',
              'Numérique, alphabétique et chronologique',
            ],
            correctIndex: 1,
            explication: 'Un bon système de classification doit être exhaustif (couvrir tous les cas), exclusif (un document par catégorie) et clair (critères sans ambiguïté). Ces qualités garantissent une classification cohérente et fiable.',
          },
          {
            id: 'doc-deb-m4-q2',
            question: 'Pourquoi est-il recommandé de demander un niveau de confiance à l\'IA lors de la classification ?',
            options: [
              'Pour que l\'IA travaille plus lentement et soit plus précise',
              'Pour identifier les documents nécessitant une vérification humaine',
              'Pour générer des statistiques sur les performances de l\'IA',
              'Parce que c\'est obligatoire pour le fonctionnement de l\'IA',
            ],
            correctIndex: 1,
            explication: 'Le niveau de confiance permet d\'identifier les cas ambigus où l\'IA hésite entre plusieurs catégories. Ces documents à faible confiance peuvent alors être revus par un humain, optimisant ainsi le temps de vérification.',
          },
          {
            id: 'doc-deb-m4-q3',
            question: 'Quels outils permettent d\'automatiser un workflow de classification sans coder ?',
            options: [
              'Python, JavaScript et SQL',
              'Word, Excel et PowerPoint',
              'Power Automate, Zapier ou Make',
              'Photoshop, Illustrator et InDesign',
            ],
            correctIndex: 2,
            explication: 'Power Automate (Microsoft), Zapier et Make sont des outils d\'automatisation no-code qui permettent de connecter des services entre eux et de créer des workflows automatisés, y compris l\'intégration d\'IA pour la classification.',
          },
        ],
      },
    ],
  },

  // --- Documents - Intermédiaire ---
  {
    id: 'doc-inter',
    slug: 'documents-intermediaire',
    titre: 'Techniques avancées de traitement documentaire par l\'IA',
    description: 'Maîtrisez les techniques avancées : OCR intelligent, analyse comparative de documents, extraction structurée complexe et intégration dans vos processus métier.',
    domaine: 'documents',
    niveau: 'intermediaire',
    duree: '3h00',
    objectifs: [
      'Utiliser l\'OCR assisté par IA pour traiter des documents numérisés',
      'Réaliser des analyses comparatives multi-documents',
      'Concevoir des pipelines d\'extraction structurée complexe',
      'Intégrer le traitement documentaire IA dans un workflow métier',
    ],
    modules: [
      {
        id: 'doc-inter-m1',
        titre: 'OCR intelligent et traitement de documents numérisés',
        duree: '45 min',
        contenu: `## Au-delà de l'OCR classique : l'OCR assisté par l'IA

L'OCR (Optical Character Recognition) classique se contente de **convertir une image en texte brut**. L'OCR intelligent, dopé à l'IA, va beaucoup plus loin : il **comprend la structure** du document, identifie les tableaux, les en-têtes, les listes et peut même interpréter des écritures manuscrites.

### Comment fonctionne l'OCR moderne

Les solutions d'OCR modernes combinent plusieurs technologies :

1. **Détection de zones** : identification des blocs de texte, images, tableaux
2. **Reconnaissance de caractères** : conversion pixels → texte avec des réseaux de neurones
3. **Compréhension structurelle** : reconstruction de la hiérarchie du document
4. **Correction contextuelle** : l'IA corrige les erreurs de lecture grâce au contexte

### Outils d'OCR intelligent disponibles

| Outil | Forces | Cas d'usage idéal |
|---|---|---|
| **Azure Document Intelligence** | Modèles pré-entraînés pour factures, reçus, ID | Traitement de factures en volume |
| **Google Document AI** | Excellente gestion multilingue | Documents internationaux |
| **AWS Textract** | Extraction de tableaux performante | Documents financiers structurés |
| **Claude (vision)** | Analyse contextuelle avancée, pas de setup | Analyse ponctuelle, documents variés |

### Utiliser Claude pour l'OCR contextuel

Les modèles multimodaux comme Claude ou GPT-4 Vision peuvent analyser directement des images de documents. L'avantage est qu'ils **comprennent le contexte** :

\`\`\`
[Image d'une facture jointe]

Analyse cette facture numérisée et extrais les informations
dans un format structuré JSON. Si certains caractères sont
difficiles à lire, indique ton degré de certitude pour chaque
champ. Reconstitue le tableau des lignes de facturation avec
les colonnes : référence, description, quantité, prix unitaire,
montant.
\`\`\`

### Gérer les documents de mauvaise qualité

Les documents numérisés posent souvent des problèmes de qualité :

- **Texte flou ou pixelisé** : demandez à l'IA d'indiquer les passages incertains
- **Documents inclinés** : les outils modernes corrigent automatiquement l'orientation
- **Annotations manuscrites** : précisez dans votre prompt que le document peut contenir des notes manuscrites
- **Multi-colonnes** : indiquez la structure attendue pour aider la reconstruction

\`\`\`
Ce document scanné est un formulaire rempli à la main.
La qualité du scan est moyenne. Pour chaque champ :
1. Transcris le texte tel que tu le lis
2. Indique ta confiance : haute / moyenne / faible
3. Si faible, propose une interprétation alternative
\`\`\`

> **Point clé** : L'OCR intelligent ne remplace pas la vérification humaine, mais il réduit considérablement le travail de saisie manuelle et de correction. Sur un lot de 100 documents, il peut faire passer le temps de traitement de 8 heures à 1 heure.`,
        quiz: [
          {
            id: 'doc-inter-m1-q1',
            question: 'Quelle est la différence principale entre l\'OCR classique et l\'OCR intelligent ?',
            options: [
              'L\'OCR intelligent est plus rapide',
              'L\'OCR intelligent comprend la structure et le contexte du document, pas seulement les caractères',
              'L\'OCR intelligent fonctionne uniquement en ligne',
              'L\'OCR classique est plus précis sur les caractères individuels',
            ],
            correctIndex: 1,
            explication: 'L\'OCR classique se limite à la conversion pixels-texte. L\'OCR intelligent ajoute la compréhension structurelle (tableaux, en-têtes, listes) et la correction contextuelle, ce qui le rend bien plus utile pour des documents complexes.',
          },
          {
            id: 'doc-inter-m1-q2',
            question: 'Quelle approche est recommandée pour traiter un document numérisé de mauvaise qualité ?',
            options: [
              'Refuser de traiter le document et demander un meilleur scan',
              'Demander à l\'IA d\'indiquer son niveau de confiance pour chaque champ extrait',
              'Utiliser uniquement l\'OCR classique qui est plus fiable',
              'Agrandir l\'image à 300% avant de la soumettre',
            ],
            correctIndex: 1,
            explication: 'En demandant un niveau de confiance, vous pouvez cibler votre vérification sur les champs incertains. Cette approche est plus efficace que de tout vérifier ou de rejeter le document.',
          },
          {
            id: 'doc-inter-m1-q3',
            question: 'Quel outil est recommandé pour une analyse ponctuelle de documents variés sans configuration technique ?',
            options: [
              'AWS Textract',
              'Azure Document Intelligence',
              'Claude (vision) ou GPT-4 Vision',
              'Google Document AI',
            ],
            correctIndex: 2,
            explication: 'Les modèles multimodaux comme Claude (vision) permettent d\'analyser des documents directement sans aucune configuration préalable. Ils sont idéaux pour des analyses ponctuelles ou des documents au format variable.',
          },
        ],
      },
      {
        id: 'doc-inter-m2',
        titre: 'Analyse comparative multi-documents',
        duree: '45 min',
        contenu: `## Comparer et croiser des informations entre plusieurs documents

L'une des tâches les plus complexes et chronophages en entreprise est la **comparaison de documents**. L'IA permet d'automatiser cette analyse et de repérer des différences ou incohérences en quelques minutes.

### Cas d'usage courants

- **Comparaison de versions** : identifier les modifications entre deux versions d'un contrat
- **Consolidation** : regrouper les informations de plusieurs rapports en un seul
- **Vérification de conformité** : comparer un document à un référentiel de règles
- **Benchmark** : comparer des offres de fournisseurs sur des critères communs

### Technique : la matrice de comparaison

Pour comparer efficacement plusieurs documents, utilisez une **matrice de comparaison** :

\`\`\`
J'ai 3 offres de fournisseurs pour un service de cloud.
Compare-les selon ces critères et présente le résultat
dans un tableau comparatif :

- Prix mensuel (pour 10 utilisateurs)
- Espace de stockage inclus
- Support technique (horaires, canaux)
- Engagements SLA (disponibilité)
- Durée d'engagement minimum
- Clauses de résiliation
- Conformité RGPD

Pour chaque critère, indique quel fournisseur est le plus
avantageux et pourquoi.
\`\`\`

### Comparer des versions de documents

Pour l'analyse de modifications entre deux versions, structurez votre prompt :

\`\`\`
Voici deux versions d'un contrat de prestation :
- Version 1 (V1) : [texte de la V1]
- Version 2 (V2) : [texte de la V2]

Identifie TOUTES les différences entre V1 et V2 :
1. Articles ajoutés en V2
2. Articles supprimés de V1
3. Articles modifiés (cite le texte avant/après)
4. Changements de formulation qui modifient le sens juridique

Classe chaque modification par niveau d'impact :
- CRITIQUE : change les obligations ou responsabilités
- IMPORTANT : modifie les conditions financières ou délais
- MINEUR : correction de forme sans impact sur le fond
\`\`\`

### Consolidation multi-documents

Quand vous devez synthétiser des informations provenant de plusieurs sources :

\`\`\`
Voici 4 comptes rendus de réunions d'équipe du mois de mars.
Produis une synthèse consolidée qui identifie :

1. Les décisions prises (avec la date de la réunion)
2. Les actions en cours et leur responsable
3. Les points de blocage récurrents
4. Les sujets abordés dans plusieurs réunions (tendances)

Signale toute incohérence entre les comptes rendus.
\`\`\`

### Limites et bonnes pratiques

- **Taille du contexte** : si les documents sont trop longs pour tenir dans une seule conversation, traitez-les par sections
- **Précision des citations** : demandez toujours à l'IA de citer les passages exacts pour faciliter la vérification
- **Biais de récence** : l'IA peut accorder plus d'importance au dernier document fourni. Variez l'ordre si vous suspectez un biais

> **Astuce professionnelle** : Pour des comparaisons de contrats à fort enjeu, utilisez l'IA comme premier filtre pour identifier les zones de différence, puis faites valider par un juriste. L'IA ne remplace pas l'expertise juridique, elle l'accélère.`,
        quiz: [
          {
            id: 'doc-inter-m2-q1',
            question: 'Qu\'est-ce que le "biais de récence" dans le contexte de la comparaison multi-documents par l\'IA ?',
            options: [
              'L\'IA ne peut traiter que des documents récents',
              'L\'IA peut accorder plus d\'importance au dernier document fourni',
              'L\'IA préfère les formats de documents les plus modernes',
              'L\'IA oublie les premiers documents si la conversation est longue',
            ],
            correctIndex: 1,
            explication: 'Le biais de récence signifie que l\'IA peut donner plus de poids au dernier document soumis dans la conversation. Pour contrer ce biais, il est conseillé de varier l\'ordre des documents lors de comparaisons.',
          },
          {
            id: 'doc-inter-m2-q2',
            question: 'Lors de la comparaison de deux versions d\'un contrat, comment classer les modifications ?',
            options: [
              'Par ordre alphabétique des articles modifiés',
              'Par date de modification',
              'Par niveau d\'impact : critique, important, mineur',
              'Par nombre de mots modifiés',
            ],
            correctIndex: 2,
            explication: 'Classer les modifications par niveau d\'impact (critique, important, mineur) permet de prioriser la relecture sur les changements qui ont un réel impact juridique ou financier.',
          },
          {
            id: 'doc-inter-m2-q3',
            question: 'Pourquoi faut-il demander à l\'IA de citer les passages exacts lors d\'une comparaison ?',
            options: [
              'Pour allonger la réponse de l\'IA',
              'Pour faciliter la vérification humaine et retrouver les passages dans le document original',
              'Parce que l\'IA ne peut pas paraphraser',
              'Pour économiser du temps de traitement',
            ],
            correctIndex: 1,
            explication: 'Les citations exactes permettent de retrouver rapidement les passages concernés dans les documents originaux et de vérifier que l\'IA a correctement identifié les différences.',
          },
        ],
      },
      {
        id: 'doc-inter-m3',
        titre: 'Pipelines d\'extraction structurée complexe',
        duree: '45 min',
        contenu: `## Construire des pipelines d'extraction robustes

Quand vous devez traiter régulièrement des documents complexes, un simple prompt ne suffit plus. Il faut construire un **pipeline d'extraction** : une séquence d'étapes structurées qui garantit des résultats cohérents et fiables.

### Architecture d'un pipeline d'extraction

Un pipeline typique comprend quatre étapes :

1. **Pré-traitement** : nettoyage et préparation du document
2. **Extraction brute** : identification de toutes les informations pertinentes
3. **Validation** : vérification de la cohérence des données extraites
4. **Structuration** : mise en forme finale des données

### Étape 1 : le prompt système (system prompt)

Le prompt système définit le **rôle et les règles** que l'IA doit suivre pour tout le pipeline :

\`\`\`
Tu es un assistant spécialisé dans l'extraction de données
à partir de rapports financiers annuels. Tu dois :

- Toujours extraire les données au format JSON
- Indiquer un score de confiance (0-100) pour chaque donnée
- Ne jamais inventer de données : si une information est absente,
  utiliser null
- Signaler toute incohérence détectée dans le document
- Respecter strictement le schéma de données fourni
\`\`\`

### Étape 2 : le schéma de données

Définissez un **schéma JSON** précis que l'IA doit remplir :

\`\`\`json
{
  "entreprise": {
    "nom": "string",
    "siren": "string",
    "exercice_fiscal": "string"
  },
  "resultats": {
    "chiffre_affaires": { "valeur": "number", "unite": "string", "confiance": "number" },
    "resultat_net": { "valeur": "number", "unite": "string", "confiance": "number" },
    "ebitda": { "valeur": "number", "unite": "string", "confiance": "number" }
  },
  "effectifs": {
    "total": { "valeur": "number", "confiance": "number" },
    "variation": { "valeur": "string", "confiance": "number" }
  },
  "anomalies_detectees": ["string"]
}
\`\`\`

### Étape 3 : la validation croisée

Après l'extraction, demandez à l'IA de **vérifier la cohérence** des données :

\`\`\`
Vérifie la cohérence des données extraites :
1. Le résultat net est-il cohérent avec le CA et les charges ?
2. Les pourcentages de variation sont-ils mathématiquement corrects ?
3. Les totaux correspondent-ils à la somme des sous-éléments ?
4. Y a-t-il des valeurs aberrantes par rapport au secteur d'activité ?

Liste toutes les anomalies détectées.
\`\`\`

### Étape 4 : l'itération et l'amélioration

Un pipeline robuste s'améliore avec le temps :

- **Journalisez les erreurs** : notez chaque erreur d'extraction pour améliorer vos prompts
- **Créez des cas de test** : gardez un jeu de documents dont vous connaissez les résultats attendus
- **Versionnez vos prompts** : comme du code, gardez un historique de vos modifications

> **Principe clé** : Un bon pipeline d'extraction est **reproductible** et **testable**. Deux exécutions sur le même document doivent produire le même résultat.`,
        quiz: [
          {
            id: 'doc-inter-m3-q1',
            question: 'Quelles sont les quatre étapes d\'un pipeline d\'extraction structuré ?',
            options: [
              'Lecture, écriture, envoi, archivage',
              'Pré-traitement, extraction brute, validation, structuration',
              'Scan, OCR, traduction, résumé',
              'Import, analyse, export, notification',
            ],
            correctIndex: 1,
            explication: 'Un pipeline robuste comprend le pré-traitement (nettoyage), l\'extraction brute (identification des données), la validation (vérification de cohérence) et la structuration (mise en forme finale).',
          },
          {
            id: 'doc-inter-m3-q2',
            question: 'Pourquoi utiliser un schéma JSON prédéfini pour l\'extraction ?',
            options: [
              'Pour que l\'IA travaille plus vite',
              'Parce que le JSON est le seul format que l\'IA comprend',
              'Pour garantir une structure de sortie cohérente et exploitable par d\'autres systèmes',
              'Pour réduire le coût d\'utilisation de l\'IA',
            ],
            correctIndex: 2,
            explication: 'Un schéma JSON prédéfini garantit que chaque extraction produit des données dans le même format, ce qui permet leur intégration automatique dans des bases de données, tableurs ou applications métier.',
          },
          {
            id: 'doc-inter-m3-q3',
            question: 'Quel est le principe clé d\'un bon pipeline d\'extraction ?',
            options: [
              'Il doit être le plus rapide possible',
              'Il doit être reproductible et testable',
              'Il doit fonctionner sans aucune intervention humaine',
              'Il doit pouvoir traiter tous les types de documents sans configuration',
            ],
            correctIndex: 1,
            explication: 'La reproductibilité (même résultat pour le même document) et la testabilité (possibilité de vérifier avec des cas connus) sont les piliers d\'un pipeline fiable en production.',
          },
        ],
      },
      {
        id: 'doc-inter-m4',
        titre: 'Intégrer l\'IA documentaire dans vos processus métier',
        duree: '45 min',
        contenu: `## De l'expérimentation à la production

Utiliser l'IA ponctuellement pour traiter un document est utile. L'intégrer dans un **processus métier automatisé** est transformateur. Ce module vous guide dans cette transition.

### Les trois niveaux d'intégration

**Niveau 1 — Manuel assisté** : Vous copiez-collez manuellement les documents dans l'IA et récupérez les résultats. C'est le point de départ, utile pour tester et valider vos prompts.

**Niveau 2 — Semi-automatisé** : Un outil d'automatisation (Zapier, Make, Power Automate) connecte vos applications à l'IA. Les documents sont envoyés automatiquement, les résultats reviennent dans votre système.

**Niveau 3 — Entièrement automatisé** : L'IA est intégrée via API dans votre système d'information. Le traitement est transparent pour les utilisateurs finaux.

### Concevoir un workflow documentaire

Prenons l'exemple d'un **processus de traitement de factures fournisseurs** :

\`\`\`
1. RÉCEPTION
   → La facture arrive par email ou courrier scanné

2. EXTRACTION (IA)
   → Extraction automatique : fournisseur, montant, date,
     lignes de facturation

3. RAPPROCHEMENT
   → Comparaison automatique avec le bon de commande
     correspondant

4. VALIDATION
   → Si écart < 5% : validation automatique
   → Si écart > 5% : alerte au responsable achats

5. COMPTABILISATION
   → Écriture comptable automatique dans l'ERP

6. ARCHIVAGE
   → Classement automatique avec métadonnées
\`\`\`

### Connecter l'IA via API

Pour une intégration de niveau 2 ou 3, vous utiliserez des **API** (interfaces de programmation). Voici un exemple simplifié avec l'API Claude :

\`\`\`python
import anthropic

client = anthropic.Anthropic()

def extraire_facture(texte_facture):
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system="Tu extrais les données de factures au format JSON.",
        messages=[
            {"role": "user", "content": texte_facture}
        ]
    )
    return message.content
\`\`\`

### Mesurer le ROI de l'automatisation

Pour justifier l'investissement, mesurez :

| Indicateur | Avant IA | Après IA |
|---|---|---|
| Temps de traitement par document | 15 min | 2 min |
| Taux d'erreur de saisie | 5% | < 1% |
| Coût de traitement | 12 € / doc | 2 € / doc |
| Délai de traitement | 3 jours | 4 heures |

### Gestion des erreurs et cas limites

Tout workflow automatisé doit prévoir des **circuits d'exception** :

- Documents dans une langue non supportée
- Formats inhabituels (fax, document manuscrit)
- Données incohérentes détectées par la validation
- Pannes de l'API ou temps de réponse excessif

Prévoyez toujours un **chemin de secours** vers un traitement manuel pour ces cas. L'objectif n'est pas d'automatiser 100% des cas, mais de traiter automatiquement les 80% de cas standards pour concentrer l'expertise humaine sur les 20% restants.

> **Règle d'or** : Automatisez les tâches répétitives et à faible valeur ajoutée. Gardez l'humain pour les décisions complexes, les exceptions et la supervision.`,
        quiz: [
          {
            id: 'doc-inter-m4-q1',
            question: 'Quel est l\'objectif réaliste d\'un workflow documentaire automatisé ?',
            options: [
              'Automatiser 100% des documents sans aucune intervention humaine',
              'Traiter automatiquement les ~80% de cas standards et réserver l\'humain pour les exceptions',
              'Remplacer entièrement l\'équipe de gestion documentaire',
              'Traiter uniquement les documents en français',
            ],
            correctIndex: 1,
            explication: 'L\'objectif réaliste est d\'automatiser les cas standards (environ 80%) pour concentrer l\'expertise humaine sur les cas complexes et les exceptions. Une automatisation à 100% n\'est ni réaliste ni souhaitable.',
          },
          {
            id: 'doc-inter-m4-q2',
            question: 'Dans l\'exemple du traitement de factures, que se passe-t-il quand l\'écart avec le bon de commande dépasse 5% ?',
            options: [
              'La facture est automatiquement rejetée',
              'L\'IA corrige le montant',
              'Une alerte est envoyée au responsable achats pour vérification',
              'La facture est renvoyée au fournisseur',
            ],
            correctIndex: 2,
            explication: 'Quand l\'écart dépasse le seuil de tolérance, le workflow prévoit une escalade humaine : le responsable achats est alerté pour vérifier et décider de la suite. C\'est un exemple de circuit d\'exception bien conçu.',
          },
          {
            id: 'doc-inter-m4-q3',
            question: 'Quels sont les trois niveaux d\'intégration de l\'IA dans les processus métier ?',
            options: [
              'Débutant, intermédiaire, expert',
              'Local, cloud, hybride',
              'Manuel assisté, semi-automatisé, entièrement automatisé',
              'Texte, image, multimodal',
            ],
            correctIndex: 2,
            explication: 'Les trois niveaux sont : manuel assisté (copier-coller), semi-automatisé (outils no-code comme Zapier/Make) et entièrement automatisé (intégration API dans le SI). Chaque niveau augmente l\'efficacité mais aussi la complexité de mise en oeuvre.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // DOMAINE : COMMUNICATION
  // ============================================================

  // --- Communication - Débutant ---
  {
    id: 'com-deb',
    slug: 'communication-debutant',
    titre: 'L\'IA au service de votre communication professionnelle',
    description: 'Découvrez comment l\'IA peut améliorer votre rédaction professionnelle : emails, présentations, chatbots et communication multilingue.',
    domaine: 'communication',
    niveau: 'debutant',
    duree: '2h30',
    objectifs: [
      'Rédiger des emails professionnels efficaces avec l\'aide de l\'IA',
      'Adapter le ton et le style d\'un texte selon l\'audience',
      'Utiliser l\'IA pour la traduction et la communication multilingue',
      'Créer des contenus de communication structurés et percutants',
    ],
    modules: [
      {
        id: 'com-deb-m1',
        titre: 'Rédiger des emails professionnels avec l\'IA',
        duree: '35 min',
        contenu: `## L'IA comme assistant de rédaction d'emails

L'email reste le canal de communication numéro un en entreprise. Un professionnel envoie en moyenne **40 emails par jour**. L'IA peut vous aider à les rédiger plus rapidement, avec un meilleur impact et moins d'erreurs.

### Quand utiliser l'IA pour vos emails ?

L'IA est particulièrement utile pour :

- **Les emails délicats** : réclamations, refus, mauvaises nouvelles
- **Les emails formels** : à la direction, aux clients, aux partenaires
- **Les emails répétitifs** : relances, confirmations, suivis
- **Les emails en langue étrangère** : quand vous n'êtes pas à l'aise

### La structure d'un prompt d'email efficace

Pour obtenir un email de qualité, précisez toujours :

\`\`\`
Contexte : [Situation et relation avec le destinataire]
Objectif : [Ce que vous voulez obtenir]
Ton souhaité : [Formel / cordial / direct / diplomatique]
Contraintes : [Longueur, informations à inclure ou éviter]
\`\`\`

#### Exemple concret

\`\`\`
Rédige un email professionnel avec les paramètres suivants :

Contexte : Je suis chef de projet chez un éditeur de logiciels.
Un client important (M. Bertrand, DSI de TechCorp) a signalé
un bug critique vendredi soir. Notre équipe a travaillé tout
le week-end et le correctif est déployé.

Objectif : Informer le client que le problème est résolu,
s'excuser pour la gêne, et renforcer la confiance.

Ton : Professionnel mais chaleureux, empathique sans être
excessivement apologétique.

Contraintes : Maximum 150 mots. Inclure une proposition
de call de suivi cette semaine.
\`\`\`

### Les erreurs courantes à éviter

1. **Copier-coller sans relire** : l'IA peut générer des formulations qui ne vous ressemblent pas
2. **Oublier les détails personnels** : vérifiez les noms, dates et faits spécifiques
3. **Ton inadapté** : un email généré peut être trop formel ou trop décontracté pour votre culture d'entreprise
4. **Contenu confidentiel** : ne partagez pas d'informations sensibles dans votre prompt si vous utilisez un outil en ligne

### Personnaliser le style de l'IA

Vous pouvez entraîner l'IA à reproduire votre style personnel :

\`\`\`
Voici 3 exemples d'emails que j'ai écrits récemment.
Analyse mon style d'écriture (longueur des phrases,
niveau de formalité, expressions récurrentes, structure).
Puis rédige le prochain email en imitant ce style.
\`\`\`

> **Conseil** : Gardez un fichier avec vos meilleurs prompts d'email. Avec le temps, vous constituerez une bibliothèque de modèles qui vous fera gagner énormément de temps.`,
        quiz: [
          {
            id: 'com-deb-m1-q1',
            question: 'Quels sont les quatre éléments clés à préciser dans un prompt de rédaction d\'email ?',
            options: [
              'Destinataire, objet, pièce jointe, signature',
              'Contexte, objectif, ton souhaité, contraintes',
              'Date, heure, lieu, participants',
              'Introduction, développement, conclusion, PS',
            ],
            correctIndex: 1,
            explication: 'Un prompt d\'email efficace précise le contexte (situation), l\'objectif (résultat attendu), le ton (formel, cordial, etc.) et les contraintes (longueur, informations obligatoires). Ces éléments permettent à l\'IA de produire un email pertinent et adapté.',
          },
          {
            id: 'com-deb-m1-q2',
            question: 'Comment faire en sorte que l\'IA reproduise votre style d\'écriture personnel ?',
            options: [
              'Lui demander d\'écrire en français soutenu',
              'Lui fournir des exemples de vos emails précédents pour qu\'elle analyse votre style',
              'Utiliser toujours le même modèle d\'IA',
              'Écrire votre prompt en majuscules',
            ],
            correctIndex: 1,
            explication: 'En fournissant des exemples de vos propres emails, l\'IA peut analyser votre style (longueur de phrases, formalité, expressions favorites) et le reproduire. C\'est la méthode la plus efficace pour un résultat naturel.',
          },
          {
            id: 'com-deb-m1-q3',
            question: 'Pourquoi ne faut-il jamais copier-coller un email généré par l\'IA sans le relire ?',
            options: [
              'Parce que l\'IA fait toujours des fautes d\'orthographe',
              'Parce que l\'email peut contenir des formulations inadaptées, des erreurs factuelles ou ne pas refléter votre style',
              'Parce que le destinataire peut détecter que c\'est de l\'IA',
              'Parce que c\'est interdit par la loi',
            ],
            correctIndex: 1,
            explication: 'L\'IA peut générer des formulations qui ne vous ressemblent pas, inclure des erreurs sur des faits spécifiques (noms, dates) ou adopter un ton inadapté à votre contexte. La relecture reste indispensable.',
          },
        ],
      },
      {
        id: 'com-deb-m2',
        titre: 'Adapter le ton et le style d\'un texte',
        duree: '40 min',
        contenu: `## Maîtriser les registres de communication avec l'IA

La capacité à adapter le ton d'un message selon l'interlocuteur et la situation est une compétence essentielle en communication professionnelle. L'IA peut vous aider à **transformer un même message** en plusieurs versions adaptées à différentes audiences.

### Les registres de ton en communication professionnelle

| Registre | Caractéristiques | Usage type |
|---|---|---|
| **Formel** | Vouvoiement, phrases longues, vocabulaire soutenu | Direction, clients VIP, courriers officiels |
| **Professionnel** | Vouvoiement, phrases claires, ton neutre | Communication courante, emails B2B |
| **Cordial** | Vouvoiement souple, touche personnelle | Collègues d'autres services, partenaires |
| **Décontracté** | Tutoiement possible, phrases courtes, direct | Équipe proche, messages internes |

### Transformer le ton d'un texte

L'IA excelle dans la **réécriture avec changement de ton**. Voici comment formuler votre demande :

\`\`\`
Voici un message interne à mon équipe :
"Hey, le client a encore changé d'avis sur le design.
On refait tout pour vendredi, c'est chaud mais faisable."

Réécris ce message pour 3 audiences différentes :
1. Le comité de direction (ton formel et rassurant)
2. Le client (ton professionnel et positif)
3. L'équipe projet (ton motivant et factuel)
\`\`\`

### La technique du "persona"

Vous pouvez demander à l'IA d'adopter un **persona** spécifique pour calibrer le ton :

\`\`\`
Écris comme un directeur de la communication expérimenté
qui s'adresse au comité exécutif. Le style doit être :
- Concis et factuel (pas de superlatifs)
- Orienté résultats et chiffres
- Confiant sans être arrogant
\`\`\`

### Adapter le niveau de technicité

Au-delà du ton, l'IA peut adapter le **niveau technique** d'un texte :

\`\`\`
Voici une explication technique de notre nouvelle fonctionnalité :
[texte technique]

Réécris cette explication pour :
1. Le site web public (langage simple, bénéfices utilisateur)
2. La documentation technique (précis, avec termes techniques)
3. Le pitch commercial (axé valeur ajoutée et ROI)
\`\`\`

### Gérer les communications sensibles

Pour les situations délicates, l'IA peut vous proposer plusieurs options :

\`\`\`
Je dois annoncer un retard de 3 semaines sur un projet
à un client mécontent. Propose-moi 3 versions du message :

1. Version empathique (centrée sur la compréhension du client)
2. Version solution (centrée sur le plan d'action correctif)
3. Version transparente (centrée sur les causes et la prévention)

Pour chaque version, indique dans quel contexte elle serait
la plus appropriée.
\`\`\`

> **Règle importante** : Le ton d'un message est aussi important que son contenu. Un message bien formulé mais au ton inadapté peut créer des tensions ou des malentendus. Prenez le temps de choisir le bon registre.`,
        quiz: [
          {
            id: 'com-deb-m2-q1',
            question: 'Quelle technique permet de calibrer précisément le ton d\'un texte généré par l\'IA ?',
            options: [
              'Écrire le prompt en majuscules',
              'Utiliser la technique du persona (définir un rôle et un style précis)',
              'Utiliser un modèle d\'IA plus récent',
              'Ajouter des émojis dans le prompt',
            ],
            correctIndex: 1,
            explication: 'La technique du persona consiste à demander à l\'IA d\'adopter un rôle spécifique (ex. : directeur de communication expérimenté) avec des caractéristiques de style précises. Cela calibre efficacement le ton du texte produit.',
          },
          {
            id: 'com-deb-m2-q2',
            question: 'Pourquoi est-il utile de demander plusieurs versions d\'un message sensible ?',
            options: [
              'Pour choisir la version la plus longue',
              'Pour envoyer les trois versions au destinataire',
              'Pour pouvoir choisir l\'approche la plus adaptée au contexte et au destinataire',
              'Pour vérifier que l\'IA fonctionne correctement',
            ],
            correctIndex: 2,
            explication: 'Disposer de plusieurs versions (empathique, orientée solution, transparente) permet de choisir l\'approche la mieux adaptée à la situation spécifique et à la relation avec le destinataire.',
          },
          {
            id: 'com-deb-m2-q3',
            question: 'En plus du ton, quel autre aspect d\'un texte l\'IA peut-elle adapter selon l\'audience ?',
            options: [
              'La police de caractères',
              'Le niveau de technicité du vocabulaire',
              'La couleur du texte',
              'Le nombre de pages',
            ],
            correctIndex: 1,
            explication: 'L\'IA peut adapter le niveau technique d\'un même contenu : langage simple pour le grand public, vocabulaire technique pour les experts, langage orienté ROI pour les décideurs. C\'est essentiel pour une communication efficace.',
          },
        ],
      },
      {
        id: 'com-deb-m3',
        titre: 'Traduction et communication multilingue',
        duree: '35 min',
        contenu: `## L'IA pour une communication sans frontières linguistiques

La traduction automatique a fait des progrès spectaculaires grâce à l'IA. Mais traduire un texte professionnel ne se limite pas à convertir des mots d'une langue à l'autre : il faut **adapter le message** au contexte culturel et professionnel du destinataire.

### Traduction vs. localisation

- **Traduction** : conversion mot à mot d'une langue à l'autre
- **Localisation** : adaptation complète au contexte culturel (formules de politesse, références, conventions)

L'IA moderne est capable de faire les deux, à condition de lui donner les bonnes instructions.

### Prompt de traduction professionnelle

\`\`\`
Traduis ce texte du français vers l'anglais
(anglais britannique, registre professionnel formel).

Contexte : c'est un email de prospection commerciale
destiné à des directeurs financiers au Royaume-Uni.

Adaptations attendues :
- Utiliser les conventions britanniques (not American)
- Adapter les formules de politesse au contexte business UK
- Convertir les références culturelles françaises si nécessaire
- Conserver le ton persuasif mais non agressif

[Texte à traduire]
\`\`\`

### Les pièges de la traduction automatique

Même avec l'IA, certains pièges persistent :

1. **Les faux amis** : "actuellement" ne se traduit pas par "actually" en anglais
2. **Les expressions idiomatiques** : "poser un lapin" n'a aucun sens traduit littéralement
3. **Le registre de langue** : le tutoiement français n'a pas d'équivalent direct en anglais
4. **Les conventions de format** : dates (JJ/MM vs MM/JJ), monnaies, mesures

### Communication multilingue en temps réel

Pour les réunions internationales ou les échanges rapides, l'IA peut servir d'**interprète en temps réel** :

\`\`\`
Je participe à une réunion avec des collègues allemands.
Je vais t'envoyer mes messages en français.
Pour chaque message :
1. Traduis en allemand (registre professionnel, vouvoiement)
2. Ajoute une note culturelle si mon message pourrait
   être mal interprété dans le contexte professionnel allemand
\`\`\`

### Créer une terminologie d'entreprise

Pour garantir la cohérence de vos traductions, créez un **glossaire** :

\`\`\`
Voici notre glossaire d'entreprise (FR → EN) :
- "Solution de pilotage" → "Management platform" (pas "steering solution")
- "Accompagnement" → "Support & guidance" (pas "accompaniment")
- "Référentiel" → "Framework" (pas "repository" dans notre contexte)

Utilise systématiquement ce glossaire pour toutes les
traductions que je te soumettrai dans cette conversation.
\`\`\`

### Relecture multilingue

L'IA peut aussi relire des textes écrits dans une langue étrangère :

\`\`\`
Relis cet email que j'ai écrit en anglais. Je suis
francophone. Corrige les erreurs et indique les passages
qui sonnent "trop français" (calques, structures de phrase,
faux amis). Propose des alternatives plus naturelles.
\`\`\`

> **Bonne pratique** : Pour les documents importants, faites toujours relire la traduction par un locuteur natif. L'IA est excellente pour un premier jet et la communication courante, mais les nuances culturelles subtiles nécessitent parfois un regard humain.`,
        quiz: [
          {
            id: 'com-deb-m3-q1',
            question: 'Quelle est la différence entre traduction et localisation ?',
            options: [
              'La localisation est une traduction automatique, la traduction est manuelle',
              'La traduction convertit les mots, la localisation adapte le message au contexte culturel',
              'La localisation ne concerne que les sites web',
              'Il n\'y a aucune différence, ce sont des synonymes',
            ],
            correctIndex: 1,
            explication: 'La traduction se concentre sur la conversion linguistique. La localisation va plus loin en adaptant les formules de politesse, les références culturelles, les conventions de format (dates, monnaies) au contexte du destinataire.',
          },
          {
            id: 'com-deb-m3-q2',
            question: 'Pourquoi est-il utile de fournir un glossaire d\'entreprise à l\'IA pour les traductions ?',
            options: [
              'Pour que l\'IA traduise plus vite',
              'Parce que l\'IA ne connaît pas les mots courants',
              'Pour garantir la cohérence terminologique et éviter les traductions inappropriées au contexte métier',
              'Pour réduire le nombre de tokens utilisés',
            ],
            correctIndex: 2,
            explication: 'Un glossaire d\'entreprise assure que les termes métier spécifiques sont toujours traduits de la même manière et de façon adaptée au contexte professionnel, évitant les traductions littérales inappropriées.',
          },
          {
            id: 'com-deb-m3-q3',
            question: 'Que signifie l\'expression "sonner trop français" dans le contexte de la relecture d\'un texte en anglais ?',
            options: [
              'Le texte contient des mots français non traduits',
              'Le texte utilise des structures de phrases calquées du français qui ne sont pas naturelles en anglais',
              'Le texte est écrit en français par erreur',
              'Le texte utilise des guillemets français « »',
            ],
            correctIndex: 1,
            explication: 'Un texte qui "sonne français" utilise des calques syntaxiques (ordre des mots, longueur de phrases, constructions grammaticales) typiquement françaises qui, bien que grammaticalement corrects en anglais, ne sont pas naturels pour un locuteur natif.',
          },
        ],
      },
      {
        id: 'com-deb-m4',
        titre: 'Créer des contenus de communication structurés',
        duree: '40 min',
        contenu: `## Produire des contenus professionnels percutants avec l'IA

Au-delà des emails, l'IA peut vous aider à créer toute une gamme de contenus de communication : présentations, newsletters, posts LinkedIn, communiqués de presse, scripts vidéo et plus encore.

### Le framework AIDA pour des contenus percutants

Le framework **AIDA** est un classique de la communication que l'IA applique très bien :

- **A**ttention : accrocher le lecteur dès la première phrase
- **I**ntérêt : développer un angle qui interpelle
- **D**ésir : montrer la valeur et les bénéfices
- **A**ction : inciter à passer à l'action

\`\`\`
Rédige un post LinkedIn de 200 mots maximum pour annoncer
le lancement de notre nouvelle offre de conseil en IA.

Utilise le framework AIDA :
- Attention : commence par une statistique surprenante
- Intérêt : décris le problème que rencontrent les PME
- Désir : présente notre approche unique et ses résultats
- Action : invite à télécharger notre guide gratuit

Ton : expert mais accessible, pas commercial agressif.
\`\`\`

### Créer des présentations structurées

L'IA peut vous aider à structurer une présentation de A à Z :

\`\`\`
Crée le plan détaillé d'une présentation de 15 slides
pour le comité de direction.

Sujet : Bilan du projet de transformation digitale - T1 2026
Audience : DG, DAF, DRH, DSI
Durée : 30 minutes + 15 minutes de questions

Pour chaque slide, indique :
- Le titre
- Les points clés (3 maximum)
- Le type de visuel recommandé (graphique, tableau, image, icônes)
- Les notes du présentateur (ce qu'il doit dire)
\`\`\`

### Rédiger des newsletters internes

La newsletter interne est un outil de communication souvent négligé :

\`\`\`
Rédige une newsletter interne mensuelle pour les 200
collaborateurs de l'entreprise.

Rubriques :
1. Édito du DG (3 phrases inspirantes sur le thème du mois)
2. Projet à la une (250 mots sur le déploiement du nouvel ERP)
3. Chiffre du mois (un KPI marquant avec explication)
4. Bienvenue (présentation des 3 nouveaux collaborateurs)
5. Agenda (événements du mois prochain)

Ton : positif, fédérateur, transparent.
Inclure un appel à contribution pour la prochaine édition.
\`\`\`

### Communiqués de presse

Pour les communications externes formelles :

\`\`\`
Rédige un communiqué de presse de 400 mots maximum.

Annonce : Notre entreprise (TechSolutions, 150 salariés,
éditeur de logiciels SaaS) vient de lever 5M€ en série A.

Structure attendue :
- Titre accrocheur et informatif
- Chapô résumant l'essentiel en 2 phrases
- Corps avec contexte, détails de la levée, ambitions
- Citation du CEO (2-3 phrases)
- Citation d'un investisseur (2-3 phrases)
- Boilerplate (paragraphe "À propos")
\`\`\`

### La checklist avant publication

Avant de publier tout contenu généré par l'IA, vérifiez :

- [ ] Les faits et chiffres sont-ils exacts ?
- [ ] Le ton est-il cohérent avec votre charte éditoriale ?
- [ ] Y a-t-il des formulations typiquement "IA" à reformuler ?
- [ ] Le message est-il clair pour l'audience cible ?
- [ ] Les noms propres et données sensibles sont-ils corrects ?

> **Astuce** : Créez un prompt de "relecture critique" que vous appliquez systématiquement avant publication. Demandez à l'IA d'identifier les faiblesses de son propre texte.`,
        quiz: [
          {
            id: 'com-deb-m4-q1',
            question: 'Que signifie l\'acronyme AIDA dans le framework de communication ?',
            options: [
              'Analyse, Information, Discussion, Action',
              'Attention, Intérêt, Désir, Action',
              'Audience, Impact, Diffusion, Analyse',
              'Accroche, Idée, Développement, Appel',
            ],
            correctIndex: 1,
            explication: 'AIDA signifie Attention (accrocher), Intérêt (développer un angle), Désir (montrer la valeur) et Action (inciter à agir). C\'est un framework classique de communication et marketing que l\'IA applique très efficacement.',
          },
          {
            id: 'com-deb-m4-q2',
            question: 'Que sont les formulations "typiquement IA" qu\'il faut identifier avant publication ?',
            options: [
              'Les phrases contenant le mot "intelligence artificielle"',
              'Les formulations génériques, les superlatifs excessifs ou les structures de phrases répétitives que l\'IA produit fréquemment',
              'Les phrases en anglais mélangées au français',
              'Les phrases de plus de 20 mots',
            ],
            correctIndex: 1,
            explication: 'L\'IA a tendance à utiliser certaines formulations récurrentes (superlatifs excessifs, structures de phrases répétitives, tournures génériques comme "Dans un monde en constante évolution...") qu\'il faut repérer et reformuler pour un résultat plus naturel.',
          },
          {
            id: 'com-deb-m4-q3',
            question: 'Pourquoi est-il utile de demander à l\'IA d\'identifier les faiblesses de son propre texte ?',
            options: [
              'Pour que l\'IA se corrige automatiquement',
              'Pour générer du contenu supplémentaire',
              'Pour disposer d\'un regard critique qui aide à améliorer le texte avant publication',
              'Parce que l\'IA est toujours plus critique que les humains',
            ],
            correctIndex: 2,
            explication: 'Demander une auto-critique permet de repérer des faiblesses que l\'on pourrait ne pas voir soi-même : manque de clarté, ton incohérent, arguments faibles. C\'est une étape de relecture supplémentaire rapide et utile.',
          },
        ],
      },
    ],
  },

  // --- Communication - Intermédiaire ---
  {
    id: 'com-inter',
    slug: 'communication-intermediaire',
    titre: 'Stratégies avancées de communication assistée par l\'IA',
    description: 'Perfectionnez votre communication avec l\'IA : chatbots conversationnels, stratégie de contenu, gestion de crise et analyse de sentiment.',
    domaine: 'communication',
    niveau: 'intermediaire',
    duree: '3h00',
    objectifs: [
      'Concevoir un chatbot conversationnel pour le service client',
      'Élaborer une stratégie de contenu assistée par l\'IA',
      'Gérer la communication de crise avec l\'aide de l\'IA',
      'Analyser le sentiment et la perception de votre communication',
    ],
    modules: [
      {
        id: 'com-inter-m1',
        titre: 'Concevoir un chatbot conversationnel efficace',
        duree: '45 min',
        contenu: `## Créer un assistant conversationnel pour votre entreprise

Les chatbots alimentés par l'IA sont devenus un canal de communication incontournable. Bien conçus, ils peuvent traiter **60 à 80% des demandes courantes** tout en offrant une expérience utilisateur satisfaisante. Mal conçus, ils frustrent les utilisateurs et nuisent à votre image.

### Les composantes d'un bon chatbot

Un chatbot efficace repose sur trois piliers :

1. **Le prompt système** : les instructions permanentes qui définissent le comportement
2. **La base de connaissances** : les informations auxquelles le chatbot peut accéder
3. **Les garde-fous** : les limites et les règles de sécurité

### Rédiger un prompt système robuste

Le prompt système est le fondement de votre chatbot. Il doit couvrir :

\`\`\`
Tu es l'assistant virtuel de [Nom de l'entreprise],
spécialisé dans [domaine d'activité].

IDENTITÉ :
- Nom : [nom du chatbot]
- Ton : professionnel, empathique, orienté solution
- Langue : français (tu peux répondre en anglais si on
  te pose une question en anglais)

CAPACITÉS :
- Répondre aux questions sur nos produits et services
- Guider les utilisateurs dans leurs démarches
- Prendre des rendez-vous
- Transmettre les réclamations au service concerné

LIMITES :
- Ne jamais inventer d'information sur nos produits
- Ne jamais donner de conseil juridique ou médical
- Ne jamais partager d'information sur d'autres clients
- Si tu ne connais pas la réponse, diriger vers un humain

ESCALADE :
- Si le client est mécontent après 2 échanges → proposer
  un transfert vers un conseiller humain
- Si la demande concerne une réclamation financière →
  transfert immédiat vers le service client
\`\`\`

### Gérer les conversations difficiles

Programmez des réponses pour les situations délicates :

\`\`\`
SCÉNARIOS DE CRISE :
- Client très mécontent : "Je comprends votre frustration
  et je suis désolé pour cette situation. Permettez-moi
  de vous mettre en relation avec un responsable qui pourra
  traiter votre demande en priorité."

- Question hors périmètre : "Cette question dépasse mon
  domaine de compétence. Je vous invite à contacter
  [canal approprié] pour obtenir une réponse fiable."

- Tentative de manipulation : Rester factuel, ne pas
  s'engager dans un débat, rediriger vers le sujet.
\`\`\`

### Tester et améliorer

Un chatbot doit être **testé rigoureusement** avant déploiement :

- Testez avec des questions courantes et vérifiez la pertinence des réponses
- Testez les **cas limites** : questions ambiguës, hors sujet, provocatrices
- Analysez les conversations réelles pour identifier les points d'amélioration
- Mesurez le **taux de résolution** (% de demandes traitées sans escalade humaine)

> **Principe** : Un bon chatbot sait ce qu'il ne sait pas. La pire chose qu'un chatbot puisse faire est d'inventer une réponse fausse avec assurance. Mieux vaut rediriger vers un humain que de donner une information incorrecte.`,
        quiz: [
          {
            id: 'com-inter-m1-q1',
            question: 'Quels sont les trois piliers d\'un chatbot efficace ?',
            options: [
              'Design, hébergement, marketing',
              'Le prompt système, la base de connaissances et les garde-fous',
              'Vitesse, précision, disponibilité',
              'Intelligence artificielle, base de données, interface graphique',
            ],
            correctIndex: 1,
            explication: 'Un chatbot efficace repose sur un prompt système bien rédigé (comportement), une base de connaissances fiable (informations accessibles) et des garde-fous clairs (limites et sécurité).',
          },
          {
            id: 'com-inter-m1-q2',
            question: 'Que doit faire un chatbot quand il ne connaît pas la réponse à une question ?',
            options: [
              'Inventer une réponse plausible pour ne pas décevoir l\'utilisateur',
              'Ignorer la question et changer de sujet',
              'Reconnaître ses limites et rediriger vers un conseiller humain',
              'Demander à l\'utilisateur de reformuler sa question indéfiniment',
            ],
            correctIndex: 2,
            explication: 'Un chatbot fiable doit reconnaître quand il ne peut pas répondre et rediriger vers une assistance humaine. Inventer une réponse nuit à la confiance et peut avoir des conséquences graves.',
          },
          {
            id: 'com-inter-m1-q3',
            question: 'Quel indicateur mesure l\'efficacité d\'un chatbot ?',
            options: [
              'Le nombre de mots dans ses réponses',
              'Le taux de résolution (% de demandes traitées sans escalade humaine)',
              'Le nombre de conversations par jour',
              'La vitesse de réponse en millisecondes',
            ],
            correctIndex: 1,
            explication: 'Le taux de résolution indique le pourcentage de demandes que le chatbot traite avec succès sans avoir à transférer à un humain. C\'est l\'indicateur principal d\'efficacité d\'un chatbot.',
          },
        ],
      },
      {
        id: 'com-inter-m2',
        titre: 'Stratégie de contenu assistée par l\'IA',
        duree: '45 min',
        contenu: `## Construire une stratégie de contenu avec l'IA

L'IA ne sert pas seulement à rédiger des textes. Elle peut vous aider à **concevoir et piloter une stratégie de contenu complète** : de l'idéation à l'analyse des performances, en passant par la planification éditoriale.

### Phase 1 : Recherche et idéation

L'IA peut générer des idées de contenu basées sur votre contexte :

\`\`\`
Je suis responsable communication d'un cabinet de conseil
en transformation digitale (50 consultants, clients PME/ETI).

Génère un calendrier éditorial pour les 3 prochains mois
avec 2 contenus par semaine :

Formats à alterner :
- Articles de blog (800-1200 mots)
- Posts LinkedIn (150-250 mots)
- Infographies (liste de données à visualiser)
- Études de cas clients (avec structure type)

Thématiques prioritaires :
- IA en entreprise (usages concrets)
- Conduite du changement
- Cybersécurité pour les PME
- Témoignages clients

Pour chaque contenu, indique : titre, format, thématique,
angle, mots-clés SEO ciblés.
\`\`\`

### Phase 2 : Production de contenu structuré

Pour chaque contenu, utilisez des **briefs détaillés** :

\`\`\`
Rédige un article de blog optimisé SEO sur le sujet :
"Comment les PME peuvent utiliser l'IA pour automatiser
leur comptabilité"

Brief :
- Persona cible : DAF de PME (50-200 salariés)
- Intention de recherche : informationnelle
- Mot-clé principal : "IA comptabilité PME"
- Mots-clés secondaires : "automatisation comptable",
  "factures automatiques IA"
- Longueur : 1000 mots
- Structure : introduction + 4 sections + conclusion avec CTA
- Ton : expert mais accessible, pas de jargon technique
- Inclure : 1 exemple concret, 2-3 chiffres sourcés,
  1 citation d'expert
\`\`\`

### Phase 3 : Déclinaison multi-canal

Un même contenu peut être décliné sur plusieurs canaux :

\`\`\`
Voici un article de blog de 1000 mots sur l'IA en comptabilité.
Décline-le en :

1. Post LinkedIn (200 mots) - accroche + 3 insights + CTA
2. Thread Twitter/X (5 tweets) - format liste numérotée
3. Script vidéo courte (60 secondes) - pour YouTube Shorts
4. Newsletter (150 mots) - résumé + lien vers l'article
5. Carrousel Instagram (8 slides) - texte de chaque slide
\`\`\`

### Phase 4 : Analyse et optimisation

L'IA peut analyser vos contenus existants :

\`\`\`
Voici les performances de nos 10 derniers articles de blog :
[Titre | Vues | Temps moyen | Taux de rebond | Partages]

Analyse ces données et identifie :
1. Les caractéristiques communes des articles performants
2. Les sujets et formats qui fonctionnent le mieux
3. Les pistes d'amélioration pour les articles moins performants
4. Des recommandations pour la stratégie du trimestre prochain
\`\`\`

> **Rappel** : L'IA est un outil d'aide à la décision stratégique, pas un remplacement du jugement humain. Vos choix éditoriaux doivent rester alignés avec votre positionnement de marque et votre connaissance du terrain.`,
        quiz: [
          {
            id: 'com-inter-m2-q1',
            question: 'Quelles sont les quatre phases d\'une stratégie de contenu assistée par l\'IA ?',
            options: [
              'Écriture, correction, publication, suppression',
              'Recherche/idéation, production, déclinaison multi-canal, analyse/optimisation',
              'Brainstorming, validation, diffusion, archivage',
              'Briefing, rédaction, relecture, traduction',
            ],
            correctIndex: 1,
            explication: 'Une stratégie de contenu complète comprend la recherche et l\'idéation (trouver les bons sujets), la production structurée (rédaction de qualité), la déclinaison multi-canal (adapter le contenu) et l\'analyse des performances (optimiser).',
          },
          {
            id: 'com-inter-m2-q2',
            question: 'Pourquoi décline-t-on un même contenu sur plusieurs canaux ?',
            options: [
              'Pour augmenter artificiellement le volume de contenu',
              'Parce que chaque canal a son audience et son format, et un contenu adapté a plus d\'impact',
              'Parce que l\'IA ne peut produire qu\'un seul format à la fois',
              'Pour réduire le budget de création de contenu',
            ],
            correctIndex: 1,
            explication: 'Chaque canal (blog, LinkedIn, vidéo, newsletter) a son audience, son format et ses codes. Adapter un contenu à chaque canal maximise sa portée et son impact auprès de différentes audiences.',
          },
          {
            id: 'com-inter-m2-q3',
            question: 'Que doit inclure un brief de contenu pour obtenir un article de qualité de l\'IA ?',
            options: [
              'Uniquement le sujet et la longueur souhaitée',
              'Le persona cible, les mots-clés SEO, la structure, le ton et les éléments à inclure',
              'Le nom de l\'auteur et la date de publication',
              'La liste des concurrents à mentionner',
            ],
            correctIndex: 1,
            explication: 'Un brief complet (persona, mots-clés, structure, ton, éléments requis) permet à l\'IA de produire un contenu ciblé, bien structuré et optimisé. Plus le brief est précis, meilleur est le résultat.',
          },
        ],
      },
      {
        id: 'com-inter-m3',
        titre: 'Communication de crise assistée par l\'IA',
        duree: '45 min',
        contenu: `## Gérer la communication de crise avec l'IA

Une crise peut frapper n'importe quelle entreprise à tout moment : incident technique, bad buzz sur les réseaux sociaux, problème de qualité, fuite de données. La communication de crise exige **rapidité, précision et cohérence**. L'IA peut être un allié précieux à chaque étape.

### Les 3 phases de la communication de crise

**Phase 1 — Réaction immédiate (0 à 2 heures)**

L'IA vous aide à rédiger rapidement un premier message :

\`\`\`
SITUATION DE CRISE : Notre plateforme SaaS est en panne
depuis 45 minutes. 2000 clients impactés. Cause en cours
d'investigation.

Rédige immédiatement :
1. Un message de status page (factuel, technique, 50 mots)
2. Un email aux clients impactés (empathique, transparent, 150 mots)
3. Un post pour les réseaux sociaux (court, rassurant, 50 mots)
4. Un message interne aux équipes (clair, directives, 100 mots)

Ton : transparent, responsable, pas de minimisation.
Ne pas donner de délai de résolution si inconnu.
\`\`\`

**Phase 2 — Gestion active (2 heures à 48 heures)**

Pendant la crise, l'IA aide à maintenir une communication cohérente :

\`\`\`
Voici la chronologie de notre incident :
- 09h15 : Détection de la panne
- 09h30 : Premier message aux clients
- 10h45 : Cause identifiée (surcharge base de données)
- 11h30 : Correctif en cours de déploiement
- 12h00 : Service partiellement rétabli

Rédige une mise à jour complète pour les clients incluant :
- Ce qui s'est passé (sans jargon technique excessif)
- Ce que nous avons fait
- L'état actuel du service
- Les prochaines étapes
- Comment nous contacter en cas de problème persistant
\`\`\`

**Phase 3 — Post-crise (après résolution)**

Le message post-crise est crucial pour restaurer la confiance :

\`\`\`
La crise est résolue. Rédige un post-mortem public
destiné à nos clients. Structure :

1. Résumé de l'incident (quoi, quand, impact)
2. Analyse des causes (sans blâmer)
3. Actions correctives immédiates (ce qu'on a fait)
4. Actions préventives (ce qu'on met en place pour éviter
   que ça se reproduise)
5. Engagement de la direction

Ton : humble, transparent, orienté amélioration.
Pas d'excuses excessives ni de promesses irréalistes.
\`\`\`

### Préparer des templates de crise

N'attendez pas la crise pour préparer vos messages. Créez des **templates adaptables** :

\`\`\`
Crée des templates de communication de crise pour
5 scénarios types de notre entreprise :
1. Panne de service prolongée (> 4 heures)
2. Fuite de données personnelles
3. Bad buzz sur les réseaux sociaux
4. Problème de qualité produit
5. Départ controversé d'un dirigeant

Pour chaque scénario : message initial, mise à jour,
résolution, post-mortem.
\`\`\`

### Ce que l'IA ne remplace pas en communication de crise

- Le **jugement humain** sur la gravité et la stratégie globale
- L'**empathie authentique** lors des échanges directs
- La **responsabilité** des décisions de communication
- La **connaissance du terrain** et des parties prenantes

> **Règle d'or** : En crise, mieux vaut communiquer trop que pas assez. Le silence est interprété comme de l'indifférence ou de la dissimulation. L'IA vous aide à maintenir un rythme de communication soutenu sans sacrifier la qualité.`,
        quiz: [
          {
            id: 'com-inter-m3-q1',
            question: 'Quelles sont les trois phases de la communication de crise ?',
            options: [
              'Prévention, détection, punition',
              'Réaction immédiate, gestion active, post-crise',
              'Analyse, décision, exécution',
              'Alerte, évacuation, reconstruction',
            ],
            correctIndex: 1,
            explication: 'La communication de crise se déroule en trois phases : la réaction immédiate (premier message rapide), la gestion active (mises à jour régulières pendant la crise) et la post-crise (bilan et actions préventives).',
          },
          {
            id: 'com-inter-m3-q2',
            question: 'Pourquoi est-il recommandé de préparer des templates de crise à l\'avance ?',
            options: [
              'Pour éviter d\'utiliser l\'IA en situation de crise',
              'Pour gagner un temps précieux et garantir la cohérence quand la pression est forte',
              'Parce que les crises se produisent toujours de la même manière',
              'Pour automatiser complètement la communication de crise',
            ],
            correctIndex: 1,
            explication: 'En situation de crise, le temps est critique et le stress est élevé. Des templates préparés permettent de communiquer rapidement avec un message structuré et cohérent, qu\'on adapte ensuite au contexte spécifique.',
          },
          {
            id: 'com-inter-m3-q3',
            question: 'Quel est le risque principal du silence en situation de crise ?',
            options: [
              'Les médias inventent des informations positives',
              'Le silence est interprété comme de l\'indifférence ou de la dissimulation',
              'Les clients oublient le problème',
              'La crise se résout plus rapidement sans communication',
            ],
            correctIndex: 1,
            explication: 'Le silence en crise est toujours mal interprété : il suggère que l\'entreprise minimise le problème, cache des informations ou ne se soucie pas de ses clients. Communiquer régulièrement, même pour dire "nous y travaillons", est essentiel.',
          },
        ],
      },
      {
        id: 'com-inter-m4',
        titre: 'Analyse de sentiment et veille communicationnelle',
        duree: '45 min',
        contenu: `## Comprendre comment votre communication est perçue

L'analyse de sentiment permet de **mesurer la tonalité** des réactions à votre communication : positives, négatives ou neutres. L'IA rend cette analyse accessible sans outils spécialisés coûteux.

### Qu'est-ce que l'analyse de sentiment ?

L'analyse de sentiment classe un texte selon sa **polarité émotionnelle** :

- **Positif** : satisfaction, enthousiasme, approbation
- **Négatif** : frustration, colère, déception
- **Neutre** : factuel, informatif, sans charge émotionnelle
- **Mixte** : contient des éléments positifs et négatifs

### Analyser des retours clients avec l'IA

\`\`\`
Voici 20 avis clients reçus ce mois-ci sur notre service.
Pour chaque avis, analyse :

1. Sentiment global (positif / négatif / neutre / mixte)
2. Score de sentiment (-5 à +5)
3. Émotions détectées (satisfaction, frustration, confusion, etc.)
4. Sujets mentionnés (qualité produit, service client, prix,
   délai, interface)
5. Verbatim clé (la phrase la plus représentative)

Puis fournis une synthèse globale :
- Distribution des sentiments (% positif/négatif/neutre)
- Top 3 des points de satisfaction
- Top 3 des points d'insatisfaction
- Recommandations d'amélioration prioritaires
\`\`\`

### Veille sur les réseaux sociaux

L'IA peut analyser des mentions de votre marque sur les réseaux :

\`\`\`
Voici 50 mentions de notre marque collectées sur LinkedIn
et Twitter cette semaine.

Analyse :
1. Sentiment moyen et évolution par rapport à la semaine
   précédente
2. Les influenceurs qui parlent de nous (ton positif ou négatif)
3. Les sujets récurrents associés à notre marque
4. Les signaux faibles (sujets émergents, changements de
   perception)
5. Comparaison avec les mentions de nos 2 concurrents principaux

Alerte si : un sujet négatif est mentionné plus de 3 fois
ou si un influenceur majeur nous critique.
\`\`\`

### Évaluer l'impact de vos communications

Après chaque communication importante, mesurez son impact :

\`\`\`
Nous avons envoyé cette newsletter la semaine dernière :
[texte de la newsletter]

Voici les réactions reçues (réponses emails, commentaires,
messages) :
[liste des réactions]

Analyse :
1. Comment le message a-t-il été reçu globalement ?
2. Y a-t-il un décalage entre l'intention et la perception ?
3. Quels passages ont suscité le plus de réactions ?
4. Des malentendus ou mauvaises interprétations ont-ils émergé ?
5. Comment améliorer la prochaine communication sur ce sujet ?
\`\`\`

### Construire un tableau de bord de perception

Compilez vos analyses dans un **tableau de bord mensuel** :

| Indicateur | Ce mois | Mois précédent | Tendance |
|---|---|---|---|
| Sentiment moyen clients | +2.3 | +1.8 | Hausse |
| Mentions positives (%) | 62% | 55% | Hausse |
| Sujets négatifs récurrents | Délais (8x) | Prix (12x) | Changement |
| NPS estimé | 35 | 28 | Hausse |

### Limites de l'analyse de sentiment

- L'**ironie et le sarcasme** sont difficiles à détecter pour l'IA
- Le **contexte culturel** influence l'interprétation (ce qui est direct en France peut sembler agressif ailleurs)
- Les **nuances fines** (déception polie vs. mécontentement réel) restent complexes
- Un **échantillon trop petit** ne permet pas de conclusions fiables

> **Conseil** : Utilisez l'analyse de sentiment comme un **thermomètre**, pas comme un diagnostic. Elle indique la direction générale mais ne remplace pas l'écoute active et le contact direct avec vos clients et collaborateurs.`,
        quiz: [
          {
            id: 'com-inter-m4-q1',
            question: 'Quelles sont les quatre polarités d\'un sentiment dans l\'analyse de texte ?',
            options: [
              'Bon, mauvais, moyen, excellent',
              'Positif, négatif, neutre, mixte',
              'Heureux, triste, en colère, surpris',
              'Favorable, défavorable, indifférent, hostile',
            ],
            correctIndex: 1,
            explication: 'L\'analyse de sentiment classe les textes en quatre polarités : positif (satisfaction), négatif (frustration), neutre (factuel) et mixte (éléments positifs et négatifs coexistants).',
          },
          {
            id: 'com-inter-m4-q2',
            question: 'Qu\'est-ce qu\'un "signal faible" dans le contexte de la veille communicationnelle ?',
            options: [
              'Un message publié avec très peu de likes',
              'Un sujet émergent qui n\'est pas encore dominant mais pourrait le devenir',
              'Un bug dans l\'outil de veille',
              'Une mention de la marque par un petit compte',
            ],
            correctIndex: 1,
            explication: 'Un signal faible est une information émergente, encore peu visible, qui peut annoncer une tendance future. Détecter ces signaux tôt permet d\'anticiper et de réagir avant qu\'un sujet ne devienne critique.',
          },
          {
            id: 'com-inter-m4-q3',
            question: 'Pourquoi l\'ironie est-elle un défi pour l\'analyse de sentiment par l\'IA ?',
            options: [
              'L\'IA ne comprend pas le français familier',
              'L\'ironie exprime le contraire de ce que les mots disent littéralement, ce qui trompe l\'analyse textuelle',
              'L\'ironie n\'existe pas à l\'écrit',
              'L\'IA détecte toujours correctement l\'ironie',
            ],
            correctIndex: 1,
            explication: 'L\'ironie et le sarcasme expriment l\'opposé du sens littéral des mots. Par exemple, "Bravo, encore un retard, quel service impeccable !" serait analysé comme positif par les mots mais le sentiment réel est négatif. Ce décalage est difficile à détecter automatiquement.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // DOMAINE : DONNÉES
  // ============================================================

  // --- Données - Débutant ---
  {
    id: 'don-deb',
    slug: 'donnees-debutant',
    titre: 'Découvrir l\'analyse de données avec l\'IA',
    description: 'Apprenez à utiliser l\'IA pour analyser vos données sans compétences techniques : tableaux, graphiques, tendances et premiers insights.',
    domaine: 'donnees',
    niveau: 'debutant',
    duree: '2h30',
    objectifs: [
      'Préparer et nettoyer des données avec l\'aide de l\'IA',
      'Analyser un tableau de données et en extraire des insights',
      'Créer des visualisations pertinentes assistées par l\'IA',
      'Interpréter des tendances et formuler des recommandations',
    ],
    modules: [
      {
        id: 'don-deb-m1',
        titre: 'Introduction à l\'analyse de données assistée par l\'IA',
        duree: '35 min',
        contenu: `## L'IA démocratise l'analyse de données

Jusqu'à récemment, l'analyse de données était réservée aux **data analysts** et aux personnes maîtrisant des outils comme Excel avancé, SQL ou Python. L'IA change la donne : elle permet à n'importe quel professionnel de **poser des questions à ses données** en langage naturel.

### Ce que l'IA peut faire avec vos données

- **Décrire** : résumer un jeu de données, calculer des statistiques
- **Nettoyer** : détecter et corriger les erreurs, doublons, valeurs manquantes
- **Analyser** : identifier des tendances, corrélations, anomalies
- **Visualiser** : suggérer et créer des graphiques adaptés
- **Prédire** : estimer des tendances futures basées sur l'historique
- **Expliquer** : traduire des analyses complexes en langage compréhensible

### Les outils disponibles

| Outil | Niveau technique | Idéal pour |
|---|---|---|
| **ChatGPT + Code Interpreter** | Débutant | Analyses ponctuelles, graphiques |
| **Claude** | Débutant | Analyse textuelle de tableaux, interprétation |
| **Google Sheets + Gemini** | Débutant | Analyses intégrées dans vos tableurs |
| **Copilot dans Excel** | Débutant | Analyses dans votre environnement Microsoft |

### Comment soumettre des données à l'IA

Plusieurs méthodes selon le volume :

**Petit volume (< 100 lignes)** : Copiez-collez directement le tableau

\`\`\`
Voici les ventes du trimestre :
Mois | Produit A | Produit B | Produit C
Janvier | 45 000 € | 32 000 € | 18 000 €
Février | 52 000 € | 28 000 € | 22 000 €
Mars | 48 000 € | 35 000 € | 25 000 €

Analyse ces données et dis-moi quelles tendances tu observes.
\`\`\`

**Volume moyen (100-10 000 lignes)** : Uploadez un fichier CSV ou Excel dans les outils qui le supportent (ChatGPT Code Interpreter, par exemple).

**Grand volume (> 10 000 lignes)** : Travaillez par échantillonnage ou utilisez des outils spécialisés connectés à l'IA.

### La question, pas l'outil

Le plus important n'est pas l'outil que vous utilisez mais **la question que vous posez**. Une bonne question d'analyse est :

- **Spécifique** : "Quel produit a la plus forte croissance en mars ?" plutôt que "Analyse mes données"
- **Contextuelle** : "Notre objectif est 50 000 € par mois par produit. Lesquels sont en dessous ?"
- **Actionnable** : "Quels clients n'ont pas commandé depuis 3 mois ?" mène à une action concrète

> **Point clé** : L'IA est un outil d'analyse, pas un oracle. Elle trouve des **corrélations** dans les données, pas des **causalités**. C'est votre expertise métier qui transforme une observation statistique en décision éclairée.`,
        quiz: [
          {
            id: 'don-deb-m1-q1',
            question: 'Quelle est la différence entre corrélation et causalité dans l\'analyse de données ?',
            options: [
              'Ce sont des synonymes, il n\'y a pas de différence',
              'La corrélation signifie que deux choses varient ensemble, la causalité signifie que l\'une provoque l\'autre',
              'La corrélation est plus fiable que la causalité',
              'La causalité ne peut être mesurée que par l\'IA',
            ],
            correctIndex: 1,
            explication: 'Une corrélation indique que deux variables évoluent de manière liée, mais pas forcément que l\'une cause l\'autre. Par exemple, les ventes de glaces et les noyades sont corrélées (elles augmentent en été) mais les glaces ne causent pas les noyades. L\'IA détecte des corrélations ; c\'est l\'expertise humaine qui identifie les causalités.',
          },
          {
            id: 'don-deb-m1-q2',
            question: 'Pour analyser un tableau de moins de 100 lignes avec l\'IA, quelle est la méthode la plus simple ?',
            options: [
              'Installer un logiciel spécialisé de data science',
              'Copier-coller le tableau directement dans la conversation avec l\'IA',
              'Convertir les données en images avant de les envoyer',
              'Créer une base de données SQL',
            ],
            correctIndex: 1,
            explication: 'Pour de petits volumes de données, le plus simple est de copier-coller le tableau directement dans la conversation. L\'IA est capable de lire et d\'analyser des données tabulaires présentées en texte.',
          },
          {
            id: 'don-deb-m1-q3',
            question: 'Qu\'est-ce qui fait une bonne question d\'analyse de données ?',
            options: [
              'Elle doit être la plus vague possible pour laisser l\'IA explorer',
              'Elle doit être spécifique, contextuelle et mener à une action concrète',
              'Elle doit contenir des termes techniques de data science',
              'Elle doit être posée en anglais pour de meilleurs résultats',
            ],
            correctIndex: 1,
            explication: 'Une bonne question d\'analyse est spécifique (ciblée), contextuelle (en lien avec vos objectifs métier) et actionnable (mène à une décision ou une action concrète). Cela produit des résultats exploitables.',
          },
        ],
      },
      {
        id: 'don-deb-m2',
        titre: 'Nettoyer et préparer ses données',
        duree: '40 min',
        contenu: `## Le nettoyage de données : l'étape la plus importante

On estime que les data analysts passent **60 à 80% de leur temps** à nettoyer et préparer les données avant de pouvoir les analyser. L'IA peut considérablement accélérer cette étape.

### Pourquoi nettoyer ses données ?

Des données "sales" mènent à des analyses fausses. Les problèmes courants sont :

- **Doublons** : le même client apparaît plusieurs fois avec des variantes (Jean Dupont, J. DUPONT, jean dupont)
- **Valeurs manquantes** : des cellules vides dans votre tableau
- **Formats incohérents** : des dates en JJ/MM/AAAA et d'autres en MM-JJ-AAAA
- **Erreurs de saisie** : fautes de frappe, chiffres inversés
- **Valeurs aberrantes** : un montant de 999 999 € au lieu de 9 999 €

### Détecter les problèmes avec l'IA

\`\`\`
Voici un export de notre base clients (200 lignes).
Analyse la qualité des données et identifie :

1. Les doublons potentiels (lignes qui semblent concerner
   le même client malgré des variations d'écriture)
2. Les valeurs manquantes par colonne (nombre et pourcentage)
3. Les incohérences de format (dates, téléphones, codes postaux)
4. Les valeurs aberrantes ou suspectes
5. Les colonnes inutiles ou redondantes

Présente un rapport de qualité avec un score global sur 100.
\`\`\`

### Corriger automatiquement les problèmes courants

L'IA peut proposer des corrections :

\`\`\`
Dans ce fichier clients, j'ai détecté des doublons potentiels.
Pour chaque groupe de doublons, propose une version fusionnée
en appliquant ces règles :

- Nom : garder la version la plus complète
- Email : garder l'adresse la plus récente
- Téléphone : garder le numéro au format international
- Adresse : garder la plus complète et récente
- Si conflit : signaler pour vérification manuelle

Présente le résultat dans un tableau avec une colonne
"action" (fusionné / à vérifier / OK).
\`\`\`

### Standardiser les formats

La standardisation est essentielle pour des analyses fiables :

\`\`\`
Standardise les données de cette colonne "date"
au format ISO (AAAA-MM-JJ) :

- "15 mars 2025" → 2025-03-15
- "03/15/2025" → 2025-03-15
- "15/3/25" → 2025-03-15
- "Mars 2025" → 2025-03-01 (début de mois par défaut)
- "" → null (valeur manquante)

Signale les dates ambiguës (ex : 03/04/2025 pourrait être
le 3 avril ou le 4 mars selon la convention).
\`\`\`

### Gérer les valeurs manquantes

L'IA peut vous aider à décider quoi faire avec les trous dans vos données :

\`\`\`
Cette colonne "chiffre d'affaires" contient 15% de valeurs
manquantes. Analyse le pattern des données manquantes :

1. Sont-elles aléatoires ou concentrées sur certaines périodes ?
2. Propose 3 stratégies pour les traiter :
   a) Suppression des lignes incomplètes
   b) Remplacement par la moyenne/médiane
   c) Interpolation basée sur les valeurs voisines
3. Pour chaque stratégie, explique l'impact sur l'analyse

Recommande la meilleure approche pour notre cas.
\`\`\`

> **Règle d'or du nettoyage** : "Garbage in, garbage out." Si vos données d'entrée sont de mauvaise qualité, aucune IA aussi performante soit-elle ne produira une analyse fiable. Le nettoyage est un investissement, pas une perte de temps.`,
        quiz: [
          {
            id: 'don-deb-m2-q1',
            question: 'Quel pourcentage de temps les data analysts consacrent-ils typiquement au nettoyage de données ?',
            options: [
              '10 à 20%',
              '30 à 40%',
              '60 à 80%',
              '90 à 100%',
            ],
            correctIndex: 2,
            explication: 'Les data analysts passent généralement 60 à 80% de leur temps à nettoyer et préparer les données. C\'est l\'étape la plus longue mais aussi la plus importante pour garantir la fiabilité des analyses.',
          },
          {
            id: 'don-deb-m2-q2',
            question: 'Que signifie le principe "Garbage in, garbage out" ?',
            options: [
              'Il faut supprimer les données inutiles après l\'analyse',
              'Si les données d\'entrée sont mauvaises, l\'analyse produite sera mauvaise aussi',
              'L\'IA transforme automatiquement les mauvaises données en bonnes données',
              'Il faut toujours exporter les résultats dans un format propre',
            ],
            correctIndex: 1,
            explication: '"Garbage in, garbage out" signifie que la qualité de l\'analyse dépend directement de la qualité des données d\'entrée. Aucun outil, même l\'IA, ne peut produire des résultats fiables à partir de données erronées ou incohérentes.',
          },
          {
            id: 'don-deb-m2-q3',
            question: 'Pourquoi la date "03/04/2025" est-elle considérée comme ambiguë ?',
            options: [
              'Parce que 2025 n\'est pas encore passé',
              'Parce qu\'elle pourrait signifier le 3 avril OU le 4 mars selon la convention (JJ/MM ou MM/JJ)',
              'Parce qu\'il manque l\'heure',
              'Parce que le format avec des barres obliques est obsolète',
            ],
            correctIndex: 1,
            explication: 'La date 03/04/2025 est ambiguë car en format français (JJ/MM/AAAA) elle signifie le 3 avril, mais en format américain (MM/JJ/AAAA) elle signifie le 4 mars. Le format ISO (2025-04-03) élimine cette ambiguïté.',
          },
        ],
      },
      {
        id: 'don-deb-m3',
        titre: 'Créer des visualisations de données pertinentes',
        duree: '40 min',
        contenu: `## Visualiser ses données pour mieux les comprendre et les communiquer

Un bon graphique vaut mille lignes de tableau. La visualisation de données est l'art de **transformer des chiffres en images** qui révèlent des tendances, des comparaisons et des anomalies en un coup d'oeil.

### Choisir le bon type de graphique

Le choix du graphique dépend de ce que vous voulez montrer :

| Objectif | Type de graphique | Exemple |
|---|---|---|
| **Comparer** des valeurs | Barres (horizontales ou verticales) | CA par produit |
| **Montrer une évolution** | Ligne ou aire | Ventes mensuelles sur 2 ans |
| **Montrer des proportions** | Camembert ou donut | Répartition du budget |
| **Croiser 2 variables** | Nuage de points (scatter) | Prix vs. satisfaction |
| **Montrer une distribution** | Histogramme | Répartition des âges clients |
| **Comparer des catégories sur plusieurs axes** | Radar | Évaluation multi-critères |

### Demander un graphique à l'IA

\`\`\`
Voici les données de ventes mensuelles de 3 produits
sur 12 mois :
[tableau de données]

1. Quel type de graphique recommandes-tu pour visualiser
   ces données et pourquoi ?
2. Crée le graphique en Python (matplotlib ou plotly)
3. Ajoute : titre clair, légende, axe Y en euros,
   couleurs distinctes pour chaque produit
4. Mets en évidence le mois avec les meilleures ventes globales
\`\`\`

### Les principes d'une bonne visualisation

**1. Simplicité** : Un graphique doit faire passer UN message principal.

**2. Honnêteté** : Ne manipulez pas les axes pour exagérer les tendances. Un axe Y qui ne commence pas à zéro peut fausser la perception.

**3. Lisibilité** : Titres clairs, légendes visibles, pas trop de couleurs (5 maximum).

**4. Contexte** : Ajoutez des repères (objectifs, moyennes, seuils) pour donner du sens aux chiffres.

### Créer un tableau de bord avec l'IA

Un tableau de bord combine plusieurs visualisations pour une vue d'ensemble :

\`\`\`
Avec ces données de performance commerciale, crée un
tableau de bord comprenant :

1. KPI en haut : CA total, nombre de clients, panier moyen,
   taux de conversion (avec variation vs mois précédent)
2. Graphique en ligne : évolution du CA mensuel (12 mois)
3. Barres empilées : CA par catégorie de produit par mois
4. Camembert : répartition des ventes par canal (web, magasin,
   téléphone)
5. Tableau : Top 10 clients par CA avec évolution

Utilise une palette de couleurs professionnelle (bleus/gris).
\`\`\`

### Raconter une histoire avec ses données (data storytelling)

Les meilleurs analyses ne sont pas celles qui montrent le plus de données, mais celles qui **racontent une histoire** :

1. **Situation** : "Notre CA a progressé de 15% ce trimestre..."
2. **Complication** : "...mais cette croissance est portée par un seul produit."
3. **Résolution** : "Voici notre plan pour diversifier les sources de revenus."

\`\`\`
À partir de ces données, construis une narration en 3 temps
(situation, complication, résolution) avec les graphiques
appropriés pour illustrer chaque étape.
\`\`\`

> **Conseil** : Avant de créer un graphique, posez-vous la question : "Quelle décision ce graphique doit-il aider à prendre ?" Si vous ne trouvez pas de réponse, le graphique est probablement inutile.`,
        quiz: [
          {
            id: 'don-deb-m3-q1',
            question: 'Quel type de graphique est le plus adapté pour montrer l\'évolution des ventes sur 12 mois ?',
            options: [
              'Camembert',
              'Graphique en barres',
              'Graphique en ligne',
              'Nuage de points',
            ],
            correctIndex: 2,
            explication: 'Le graphique en ligne est idéal pour montrer l\'évolution d\'une valeur dans le temps. Il permet de visualiser clairement les tendances, les pics et les creux sur une période continue.',
          },
          {
            id: 'don-deb-m3-q2',
            question: 'Pourquoi un axe Y qui ne commence pas à zéro peut-il être problématique ?',
            options: [
              'Parce que les logiciels de graphiques ne le supportent pas',
              'Parce qu\'il peut exagérer visuellement les différences et fausser la perception des données',
              'Parce que c\'est une convention obligatoire en data science',
              'Parce que les valeurs négatives ne seraient pas visibles',
            ],
            correctIndex: 1,
            explication: 'Un axe Y qui ne commence pas à zéro peut faire paraître une petite variation comme un changement dramatique. C\'est une technique de manipulation visuelle (volontaire ou non) qui fausse l\'interprétation des données.',
          },
          {
            id: 'don-deb-m3-q3',
            question: 'Qu\'est-ce que le "data storytelling" ?',
            options: [
              'Inventer des données pour rendre un rapport plus intéressant',
              'Raconter une histoire structurée avec des données et des visualisations pour faciliter la compréhension et la décision',
              'Utiliser uniquement du texte sans graphique pour présenter des données',
              'Créer des animations avec des données',
            ],
            correctIndex: 1,
            explication: 'Le data storytelling est l\'art de structurer une analyse en narration (situation, complication, résolution) appuyée par des visualisations pertinentes. Il rend les données compréhensibles et mémorables pour les décideurs.',
          },
        ],
      },
      {
        id: 'don-deb-m4',
        titre: 'Interpréter des tendances et formuler des recommandations',
        duree: '35 min',
        contenu: `## De l'analyse à la décision : interpréter et recommander

L'analyse de données n'a de valeur que si elle mène à des **décisions éclairées**. Ce module vous apprend à aller au-delà des chiffres pour formuler des interprétations et des recommandations exploitables.

### Les trois niveaux d'analyse

**Niveau 1 — Descriptif** : Que s'est-il passé ?
\`\`\`
Analyse ces données de ventes du trimestre et décris :
- Les tendances principales
- Les variations significatives
- Les anomalies par rapport au trimestre précédent
\`\`\`

**Niveau 2 — Diagnostic** : Pourquoi est-ce arrivé ?
\`\`\`
Le produit B a chuté de 20% en mars. En croisant avec
les données suivantes (actions marketing, prix concurrents,
saisonnalité), identifie les causes probables de cette baisse.
\`\`\`

**Niveau 3 — Prescriptif** : Que devons-nous faire ?
\`\`\`
Sur la base de cette analyse, recommande 3 actions concrètes
pour le prochain trimestre, classées par impact attendu et
facilité de mise en oeuvre.
\`\`\`

### Formuler des insights exploitables

Un bon insight suit la structure **Observation → Interprétation → Recommandation** :

\`\`\`
Pour chaque tendance identifiée dans les données, formule
un insight en 3 parties :

1. OBSERVATION : le fait brut tiré des données
   (ex. : "Le taux de rebond sur mobile est de 72%")
2. INTERPRÉTATION : ce que cela signifie dans notre contexte
   (ex. : "L'expérience mobile est probablement insatisfaisante")
3. RECOMMANDATION : l'action à entreprendre
   (ex. : "Auditer le parcours mobile et prioriser l'optimisation responsive")
\`\`\`

### Éviter les pièges d'interprétation

L'IA peut vous aider à identifier les biais classiques :

\`\`\`
J'ai observé que nos ventes augmentent quand nous envoyons
plus de newsletters. Avant de conclure que les newsletters
causent les ventes, aide-moi à vérifier :

1. Y a-t-il une variable confondante ? (ex. : saisonnalité)
2. La corrélation est-elle statistiquement significative ?
3. Quelles autres explications sont possibles ?
4. Quel test pourrait confirmer ou infirmer cette hypothèse ?
\`\`\`

### Présenter ses recommandations

Pour convaincre les décideurs, structurez vos recommandations :

\`\`\`
Présente les recommandations sous forme de matrice
impact/effort :

| Recommandation | Impact attendu | Effort requis | Priorité |
|---|---|---|---|
| Action 1 | Élevé | Faible | QUICK WIN |
| Action 2 | Élevé | Élevé | PROJET STRATÉGIQUE |
| Action 3 | Faible | Faible | À PLANIFIER |
| Action 4 | Faible | Élevé | À ÉVITER |

Pour chaque recommandation, ajoute :
- L'indicateur de succès (KPI à suivre)
- Le délai estimé
- Les ressources nécessaires
\`\`\`

### Communiquer avec les décideurs

Les dirigeants n'ont pas le temps de lire des analyses détaillées. Résumez en utilisant la **règle du 1-3-1** :

- **1** constat principal
- **3** arguments qui le soutiennent
- **1** recommandation actionnable

> **Principe** : Les données racontent ce qui s'est passé. Votre expertise métier explique pourquoi. L'IA peut aider pour les deux, mais c'est vous qui décidez quoi faire. Ne déléguez jamais la décision finale à un algorithme.`,
        quiz: [
          {
            id: 'don-deb-m4-q1',
            question: 'Quels sont les trois niveaux d\'analyse de données ?',
            options: [
              'Simple, moyen, complexe',
              'Descriptif (que s\'est-il passé), diagnostic (pourquoi), prescriptif (que faire)',
              'Quantitatif, qualitatif, mixte',
              'Excel, SQL, Python',
            ],
            correctIndex: 1,
            explication: 'L\'analyse descriptive explique ce qui s\'est passé, l\'analyse diagnostic explique pourquoi, et l\'analyse prescriptive recommande ce qu\'il faut faire. Chaque niveau apporte plus de valeur que le précédent.',
          },
          {
            id: 'don-deb-m4-q2',
            question: 'Qu\'est-ce qu\'une "variable confondante" ?',
            options: [
              'Une variable qui contient des erreurs de saisie',
              'Une variable cachée qui influence à la fois la cause supposée et l\'effet observé, créant une fausse impression de causalité',
              'Une variable qui rend l\'analyse trop complexe',
              'Une variable qui a été supprimée lors du nettoyage',
            ],
            correctIndex: 1,
            explication: 'Une variable confondante est un facteur non pris en compte qui influence les deux variables étudiées. Par exemple, la saisonnalité peut augmenter à la fois l\'envoi de newsletters et les ventes, créant une corrélation sans causalité directe.',
          },
          {
            id: 'don-deb-m4-q3',
            question: 'Que signifie la règle "1-3-1" pour présenter des recommandations ?',
            options: [
              '1 page, 3 graphiques, 1 conclusion',
              '1 constat principal, 3 arguments de soutien, 1 recommandation actionnable',
              '1 minute de présentation, 3 slides, 1 question',
              '1 analyse, 3 scénarios, 1 budget',
            ],
            correctIndex: 1,
            explication: 'La règle 1-3-1 structure une communication concise pour les décideurs : un constat central, trois arguments qui l\'appuient et une recommandation d\'action claire. C\'est un format efficace pour obtenir des décisions rapides.',
          },
        ],
      },
    ],
  },

  // --- Données - Intermédiaire ---
  {
    id: 'don-inter',
    slug: 'donnees-intermediaire',
    titre: 'Analyse de données avancée avec l\'IA',
    description: 'Maîtrisez les techniques avancées d\'analyse de données : modèles prédictifs, analyse de cohortes, détection d\'anomalies et automatisation des rapports.',
    domaine: 'donnees',
    niveau: 'intermediaire',
    duree: '3h00',
    objectifs: [
      'Construire des analyses prédictives simples avec l\'IA',
      'Réaliser des analyses de cohortes et de segmentation',
      'Détecter des anomalies et des patterns cachés dans les données',
      'Automatiser la génération de rapports d\'analyse',
    ],
    modules: [
      {
        id: 'don-inter-m1',
        titre: 'Introduction aux analyses prédictives avec l\'IA',
        duree: '45 min',
        contenu: `## Prédire l'avenir avec ses données

L'analyse prédictive utilise les **données historiques** pour estimer ce qui va probablement se passer. Grâce à l'IA, cette discipline autrefois réservée aux statisticiens est désormais accessible à tout professionnel disposant de données.

### Les types de prédictions en entreprise

- **Prévision de ventes** : estimer le CA des prochains mois
- **Prédiction de churn** : identifier les clients susceptibles de partir
- **Estimation de la demande** : anticiper les besoins en stock ou ressources
- **Scoring de leads** : classer les prospects par probabilité de conversion
- **Prévision budgétaire** : projeter les coûts et revenus futurs

### Comment l'IA réalise des prédictions

L'IA détecte des **patterns récurrents** dans les données historiques et les projette dans le futur. Concrètement :

1. Vous fournissez un historique (ex. : 24 mois de ventes)
2. L'IA identifie les tendances (croissance, saisonnalité, cycles)
3. Elle projette ces patterns pour les mois à venir
4. Elle fournit un intervalle de confiance (marge d'erreur)

### Réaliser une prévision avec l'IA

\`\`\`
Voici 24 mois de données de ventes mensuelles :
[tableau avec mois et CA]

1. Identifie les patterns : tendance générale, saisonnalité,
   événements exceptionnels
2. Produis une prévision pour les 6 prochains mois
3. Pour chaque mois, donne :
   - Estimation basse (pessimiste)
   - Estimation centrale (probable)
   - Estimation haute (optimiste)
4. Indique le niveau de fiabilité global de la prévision
5. Liste les facteurs qui pourraient invalider cette prévision
\`\`\`

### Prédiction de churn (attrition client)

\`\`\`
Voici les données de 500 clients avec :
- Ancienneté (mois)
- Fréquence d'achat (derniers 6 mois)
- Montant moyen par commande
- Nombre de contacts avec le support
- Dernière date d'achat
- Statut : actif / churné

Analyse ces données et :
1. Identifie les caractéristiques communes des clients churnés
2. Attribue un score de risque de churn (0-100) aux clients actifs
3. Identifie les 20 clients actifs les plus à risque
4. Propose des actions de rétention adaptées au profil de risque
\`\`\`

### Les limites de l'analyse prédictive

- **Le passé ne prédit pas toujours l'avenir** : une crise, un nouveau concurrent ou une innovation peuvent rompre les patterns historiques
- **La qualité des prédictions dépend de la qualité et du volume des données** : en dessous de 12 mois d'historique, les prédictions sont fragiles
- **Les intervalles de confiance sont essentiels** : une prédiction sans marge d'erreur est trompeuse
- **Les prédictions doivent être mises à jour** régulièrement avec les nouvelles données

> **Rappel important** : L'analyse prédictive donne des **probabilités**, pas des certitudes. Utilisez-la pour éclairer vos décisions, pas pour les prendre à votre place. La meilleure approche combine prédiction IA et jugement humain.`,
        quiz: [
          {
            id: 'don-inter-m1-q1',
            question: 'Pourquoi les intervalles de confiance sont-ils essentiels dans une prédiction ?',
            options: [
              'Parce qu\'ils rendent le graphique plus joli',
              'Parce qu\'ils indiquent la marge d\'erreur et permettent de prendre des décisions en connaissance de la fiabilité',
              'Parce qu\'ils sont obligatoires dans les logiciels de statistiques',
              'Parce qu\'ils augmentent la précision de la prédiction',
            ],
            correctIndex: 1,
            explication: 'Les intervalles de confiance quantifient l\'incertitude de la prédiction. Une prévision de "50 000 € +/- 2 000 €" et une de "50 000 € +/- 20 000 €" n\'ont pas du tout la même fiabilité. Sans cette information, la prédiction peut être trompeuse.',
          },
          {
            id: 'don-inter-m2-q2',
            question: 'Quelle est la durée minimale d\'historique recommandée pour des prédictions fiables ?',
            options: [
              '1 mois',
              '3 mois',
              '12 mois',
              '10 ans',
            ],
            correctIndex: 2,
            explication: 'En dessous de 12 mois d\'historique, les prédictions sont fragiles car elles ne captent pas la saisonnalité complète. Idéalement, 24 mois permettent d\'identifier les cycles annuels et les tendances de fond.',
          },
          {
            id: 'don-inter-m1-q3',
            question: 'Qu\'est-ce que le "scoring de leads" en analyse prédictive ?',
            options: [
              'Compter le nombre de prospects dans la base',
              'Classer les prospects par probabilité de conversion grâce à l\'analyse de leurs caractéristiques',
              'Attribuer une note de satisfaction aux clients existants',
              'Calculer le coût d\'acquisition d\'un prospect',
            ],
            correctIndex: 1,
            explication: 'Le scoring de leads attribue un score de probabilité de conversion à chaque prospect en analysant ses caractéristiques (secteur, taille, comportement web, etc.) par rapport aux profils des clients qui ont déjà converti.',
          },
        ],
      },
      {
        id: 'don-inter-m2',
        titre: 'Segmentation et analyse de cohortes',
        duree: '45 min',
        contenu: `## Comprendre vos données par la segmentation

La segmentation consiste à **diviser un ensemble de données en groupes homogènes** partageant des caractéristiques communes. L'analyse de cohortes ajoute une dimension temporelle en suivant ces groupes dans le temps.

### Pourquoi segmenter ?

La moyenne est souvent trompeuse. Si votre panier moyen est de 100 €, cela peut masquer deux réalités très différentes :

- **Segment A** : Beaucoup de clients à 30 € (acheteurs occasionnels)
- **Segment B** : Peu de clients à 500 € (comptes stratégiques)

La stratégie pour ces deux segments sera radicalement différente.

### Demander une segmentation à l'IA

\`\`\`
Voici les données de 1000 clients avec : âge, localisation,
fréquence d'achat, panier moyen, canal d'acquisition,
ancienneté, catégories de produits achetés.

Réalise une segmentation en identifiant des groupes de
clients aux comportements similaires :

1. Propose 4 à 6 segments distincts
2. Pour chaque segment, indique :
   - Nom parlant (ex. : "Fidèles premium", "Occasionnels sensibles au prix")
   - Caractéristiques principales
   - Taille du segment (nombre et % du total)
   - Contribution au CA
   - Comportement d'achat typique
3. Recommande une stratégie marketing adaptée à chaque segment
\`\`\`

### L'analyse de cohortes

Une cohorte est un groupe de clients partageant une **caractéristique temporelle commune** (ex. : tous les clients acquis en janvier 2025).

\`\`\`
Voici 12 mois de données clients avec la date de premier
achat et les achats suivants.

Réalise une analyse de cohortes mensuelle :

1. Crée un tableau de rétention : pour chaque mois
   d'acquisition, quel % de clients a racheté au mois 1,
   mois 2, mois 3... jusqu'au mois 12
2. Visualise ce tableau sous forme de heatmap
3. Identifie :
   - Le mois critique de perte (le plus fort taux de churn)
   - Les cohortes les plus fidèles et leurs caractéristiques
   - L'évolution de la qualité des cohortes dans le temps
4. Recommande des actions pour améliorer la rétention au
   moment critique identifié
\`\`\`

### La méthode RFM (Récence, Fréquence, Montant)

La segmentation RFM est un classique du marketing analytique :

\`\`\`
Applique la méthode RFM à cette base clients :

- Récence : combien de jours depuis le dernier achat
- Fréquence : nombre d'achats sur les 12 derniers mois
- Montant : total dépensé sur les 12 derniers mois

Pour chaque dimension, attribue un score de 1 à 5
(5 = meilleur). Puis crée les segments suivants :

- Champions (R=5, F=5, M=5) : meilleurs clients
- Loyaux (R≥3, F≥4) : clients fidèles
- À risque (R≤2, F≥3) : bons clients qui s'éloignent
- Perdus (R=1, F≤2) : anciens clients inactifs
- Nouveaux prometteurs (R=5, F=1, M≥3) : premier achat élevé

Quantifie chaque segment et propose des actions prioritaires.
\`\`\`

### Piège courant : la sur-segmentation

Trop de segments rendent l'analyse inutilisable. Un bon système de segmentation est :

- **Actionnable** : chaque segment permet une action distincte
- **Mesurable** : chaque segment est quantifiable
- **Significatif** : chaque segment est assez grand pour justifier une stratégie dédiée

> **Astuce** : Commencez avec 3-4 segments et affinez progressivement. Il vaut mieux des segments larges mais actionnables que des segments fins mais inexploitables.`,
        quiz: [
          {
            id: 'don-inter-m2-q1',
            question: 'Que représentent les trois lettres de la méthode RFM ?',
            options: [
              'Résultat, Fiabilité, Marge',
              'Récence, Fréquence, Montant',
              'Rendement, Fidélité, Moyenne',
              'Rapport, Facturation, Marketing',
            ],
            correctIndex: 1,
            explication: 'RFM signifie Récence (date du dernier achat), Fréquence (nombre d\'achats) et Montant (total dépensé). C\'est une méthode de segmentation qui classe les clients selon leur comportement d\'achat récent.',
          },
          {
            id: 'don-inter-m2-q2',
            question: 'Qu\'est-ce qu\'une cohorte dans l\'analyse de données ?',
            options: [
              'Un type de graphique statistique',
              'Un groupe de clients partageant une caractéristique temporelle commune (ex. : mois de premier achat)',
              'Une technique de nettoyage de données',
              'Un indicateur de performance financière',
            ],
            correctIndex: 1,
            explication: 'Une cohorte regroupe des individus ayant vécu un même événement à la même période (premier achat, inscription, etc.). Suivre les cohortes dans le temps permet de mesurer la rétention et d\'identifier les tendances d\'évolution.',
          },
          {
            id: 'don-inter-m2-q3',
            question: 'Pourquoi la moyenne peut-elle être trompeuse sans segmentation ?',
            options: [
              'Parce que la moyenne est toujours fausse',
              'Parce qu\'elle masque des réalités très différentes au sein du groupe global',
              'Parce que l\'IA ne sait pas calculer les moyennes',
              'Parce que les décideurs ne comprennent pas les moyennes',
            ],
            correctIndex: 1,
            explication: 'La moyenne agrège des réalités potentiellement très différentes. Un panier moyen de 100 € peut cacher un segment à 30 € et un autre à 500 €. Sans segmentation, vous risquez de prendre des décisions inadaptées à chaque groupe.',
          },
        ],
      },
      {
        id: 'don-inter-m3',
        titre: 'Détection d\'anomalies et patterns cachés',
        duree: '45 min',
        contenu: `## Trouver ce qui sort de l'ordinaire dans vos données

La détection d'anomalies consiste à identifier des **données qui s'écartent significativement du comportement attendu**. L'IA est particulièrement douée pour cette tâche car elle peut analyser simultanément de nombreuses variables.

### Types d'anomalies

- **Anomalie ponctuelle** : une valeur isolée très différente (ex. : une facture de 100 000 € alors que la moyenne est de 500 €)
- **Anomalie contextuelle** : une valeur normale en soi mais anormale dans son contexte (ex. : 500 ventes un lundi alors que la moyenne du lundi est de 50)
- **Anomalie collective** : un groupe de valeurs qui, ensemble, forment un pattern inhabituel (ex. : 5 transactions du même client en 10 minutes)

### Détecter des anomalies avec l'IA

\`\`\`
Voici 6 mois de transactions financières (5000 lignes) :
date, montant, client, catégorie, moyen_paiement

Analyse ces données et identifie les anomalies :

1. Anomalies de montant : transactions significativement
   au-dessus ou en dessous de la normale pour leur catégorie
2. Anomalies temporelles : pics ou creux inhabituels
   (heure, jour, semaine)
3. Anomalies comportementales : clients dont le pattern
   d'achat a soudainement changé
4. Anomalies de fréquence : nombre inhabituel de transactions
   sur une courte période

Pour chaque anomalie, indique :
- Gravité (haute / moyenne / faible)
- Explication possible (erreur, fraude, événement exceptionnel)
- Recommandation (investiguer, surveiller, ignorer)
\`\`\`

### Cas d'usage : détection de fraude

\`\`\`
Voici les données de notes de frais des 50 collaborateurs
sur les 3 derniers mois.

Identifie les comportements suspects :
1. Montants juste en dessous du seuil de validation (ex. :
   si le seuil est 200 €, beaucoup de notes à 195-199 €)
2. Fréquence anormale de certaines catégories (taxis, repas)
3. Notes de frais les week-ends ou jours fériés
4. Mêmes montants exacts qui se répètent
5. Patterns différents d'un collaborateur par rapport à ses
   pairs de même niveau/poste

Classe les collaborateurs par niveau de risque.
IMPORTANT : ces signaux ne prouvent pas une fraude, ils
identifient des cas à investiguer.
\`\`\`

### Découvrir des patterns cachés

Au-delà des anomalies, l'IA peut révéler des **patterns non évidents** :

\`\`\`
Voici les données de ventes avec 15 variables par transaction.
Cherche des patterns intéressants que nous n'aurions pas
repérés intuitivement :

1. Associations de produits : quels produits sont souvent
   achetés ensemble ?
2. Séquences d'achat : y a-t-il un parcours d'achat type
   (produit A → produit B → produit C) ?
3. Facteurs cachés : quelles variables semblent influencer
   le montant d'achat de manière non évidente ?
4. Clusters naturels : les transactions se regroupent-elles
   naturellement en catégories non prédéfinies ?

Pour chaque pattern, explique sa pertinence business
et comment l'exploiter.
\`\`\`

### Bonnes pratiques

- **Définissez le "normal"** : avant de chercher l'anormal, il faut comprendre ce qui est normal dans votre contexte
- **Évitez les faux positifs** : mieux vaut rater quelques anomalies que de signaler trop de fausses alertes
- **Contextualiser toujours** : une anomalie statistique n'est pas forcément un problème métier

> **Important** : La détection d'anomalies est un outil d'**alerte**, pas de jugement. Une anomalie identifiée nécessite toujours une investigation humaine avant toute conclusion ou action.`,
        quiz: [
          {
            id: 'don-inter-m3-q1',
            question: 'Quelle est la différence entre une anomalie ponctuelle et une anomalie contextuelle ?',
            options: [
              'L\'anomalie ponctuelle est plus grave que l\'anomalie contextuelle',
              'L\'anomalie ponctuelle est une valeur extrême en soi, l\'anomalie contextuelle est une valeur normale en soi mais anormale dans son contexte',
              'L\'anomalie ponctuelle concerne un seul client, l\'anomalie contextuelle concerne un groupe',
              'Il n\'y a pas de différence, ce sont des synonymes',
            ],
            correctIndex: 1,
            explication: 'Une anomalie ponctuelle est une valeur clairement extrême (100 000 € au lieu de 500 €). Une anomalie contextuelle est une valeur normale en soi mais anormale dans son contexte (500 ventes un lundi alors que la moyenne du lundi est 50).',
          },
          {
            id: 'don-inter-m3-q2',
            question: 'Dans la détection de fraude aux notes de frais, pourquoi surveille-t-on les montants juste sous le seuil de validation ?',
            options: [
              'Parce que ces montants sont toujours frauduleux',
              'Parce que cela peut indiquer un fractionnement volontaire pour éviter le contrôle',
              'Parce que les petits montants sont plus souvent erronés',
              'Parce que le seuil de validation est toujours trop bas',
            ],
            correctIndex: 1,
            explication: 'Un pattern de montants systématiquement juste en dessous du seuil de validation peut indiquer que quelqu\'un fractionne ses dépenses ou ajuste les montants pour éviter le contrôle. C\'est un signal à investiguer, pas une preuve.',
          },
          {
            id: 'don-inter-m3-q3',
            question: 'Pourquoi faut-il éviter les faux positifs dans la détection d\'anomalies ?',
            options: [
              'Parce que les faux positifs coûtent de l\'argent en électricité',
              'Parce que trop de fausses alertes mènent à ignorer les vraies anomalies (effet "crier au loup")',
              'Parce que les faux positifs sont illégaux',
              'Parce que l\'IA ne peut pas produire de faux positifs',
            ],
            correctIndex: 1,
            explication: 'Si le système génère trop de fausses alertes, les utilisateurs finissent par les ignorer toutes, y compris les vraies anomalies. C\'est l\'effet "crier au loup" : calibrer la sensibilité est essentiel pour maintenir la confiance dans le système.',
          },
        ],
      },
      {
        id: 'don-inter-m4',
        titre: 'Automatiser la génération de rapports d\'analyse',
        duree: '45 min',
        contenu: `## Des rapports automatisés, toujours à jour

La production de rapports est une tâche chronophage que l'IA peut largement automatiser. L'objectif est de passer d'un rapport ponctuel à un **système de reporting automatisé** qui génère des analyses à la demande ou sur un calendrier régulier.

### Les composantes d'un rapport automatisé

Un bon rapport automatisé comprend :

1. **L'acquisition des données** : connexion aux sources (base de données, API, fichiers)
2. **L'analyse** : calculs, comparaisons, détection de tendances
3. **La narration** : texte explicatif généré par l'IA
4. **La visualisation** : graphiques et tableaux
5. **La distribution** : envoi par email, publication sur un dashboard

### Créer un template de rapport récurrent

\`\`\`
Crée un template de rapport mensuel de performance
commerciale. Ce rapport sera généré automatiquement
chaque mois avec les nouvelles données.

Structure du rapport :

1. RÉSUMÉ EXÉCUTIF (5 lignes max)
   - CA du mois vs objectif vs mois précédent
   - Fait marquant positif
   - Point d'attention principal

2. KPIs CLÉS (tableau)
   - CA total | Objectif | Réalisé | % | Variation M-1
   - Nombre de ventes | Objectif | Réalisé | % | Variation M-1
   - Panier moyen | Objectif | Réalisé | % | Variation M-1
   - Nouveaux clients | Objectif | Réalisé | % | Variation M-1

3. ANALYSE DES VENTES
   - Graphique : évolution du CA quotidien
   - Top 5 produits (avec variation vs mois précédent)
   - Bottom 5 produits (avec recommandation)

4. ANALYSE CLIENTS
   - Répartition nouveaux vs existants
   - Taux de rétention
   - Top 10 clients du mois

5. PRÉVISIONS
   - Projection pour le mois suivant
   - Risques identifiés

6. RECOMMANDATIONS (3 actions prioritaires)
\`\`\`

### Générer la narration automatiquement

L'IA peut transformer des données brutes en texte explicatif :

\`\`\`
Voici les KPIs du mois de mars :
[données]

Génère le paragraphe de résumé exécutif en respectant
ces règles :
- Commencer par le fait le plus important (positif ou négatif)
- Comparer au mois précédent ET à l'objectif
- Utiliser des adjectifs mesurés (pas de superlatifs)
- Mentionner un risque ou un point d'attention
- Terminer par la perspective pour le mois suivant
- Maximum 5 phrases
\`\`\`

### Automatiser avec des outils no-code

Pour une automatisation complète, combinez plusieurs outils :

\`\`\`
WORKFLOW DE REPORTING AUTOMATISÉ :

1. DÉCLENCHEUR : Le 1er de chaque mois à 8h00

2. DONNÉES :
   → Google Sheets / Excel récupère les données du CRM
   → Calculs automatiques (formules)

3. ANALYSE IA :
   → Envoi des données à l'API Claude
   → Prompt : "Analyse ces données et génère le rapport
     mensuel selon le template suivant..."
   → Récupération du texte + recommandations

4. MISE EN FORME :
   → Injection dans un template Google Docs / PowerPoint
   → Génération des graphiques

5. DISTRIBUTION :
   → Email automatique au comité de direction
   → Publication sur l'intranet
   → Notification Slack à l'équipe commerciale
\`\`\`

### Itérer et personnaliser

Un système de reporting s'améliore continuellement :

- **Collectez les retours** : demandez aux lecteurs ce qui manque ou est superflu
- **Ajoutez des alertes conditionnelles** : si un KPI passe sous un seuil, ajoutez une alerte rouge
- **Personnalisez par audience** : le DG ne lit pas le même rapport que le manager commercial
- **Archivez les rapports** : pour pouvoir comparer d'un mois à l'autre

> **Vision** : L'objectif final est que vos rapports se génèrent seuls, que les bonnes personnes les reçoivent au bon moment, et que votre temps soit consacré à **agir** sur les insights plutôt qu'à **produire** le rapport.`,
        quiz: [
          {
            id: 'don-inter-m4-q1',
            question: 'Quelles sont les cinq composantes d\'un rapport automatisé ?',
            options: [
              'Titre, introduction, corps, conclusion, annexes',
              'Acquisition des données, analyse, narration, visualisation, distribution',
              'Excel, Word, PowerPoint, Email, Intranet',
              'Collecte, stockage, traitement, publication, archivage',
            ],
            correctIndex: 1,
            explication: 'Un rapport automatisé complet comprend l\'acquisition des données (connexion aux sources), l\'analyse (calculs), la narration (texte IA), la visualisation (graphiques) et la distribution (envoi aux destinataires).',
          },
          {
            id: 'don-inter-m4-q2',
            question: 'Pourquoi personnaliser les rapports par audience ?',
            options: [
              'Pour augmenter le nombre de rapports générés',
              'Parce que chaque audience a des besoins d\'information et un niveau de détail différents',
              'Pour justifier l\'investissement dans l\'outil de reporting',
              'Parce que l\'IA ne peut pas créer un rapport universel',
            ],
            correctIndex: 1,
            explication: 'Un DG a besoin d\'un résumé stratégique concis, un manager commercial veut le détail par produit et par vendeur, un analyste souhaite les données brutes. Un rapport unique ne satisfait aucune audience pleinement.',
          },
          {
            id: 'don-inter-m4-q3',
            question: 'Quel est l\'objectif final d\'un système de reporting automatisé ?',
            options: [
              'Remplacer entièrement l\'équipe d\'analyse de données',
              'Produire le plus grand nombre possible de rapports',
              'Libérer du temps pour agir sur les insights plutôt que produire le rapport',
              'Impressionner la direction avec des graphiques complexes',
            ],
            correctIndex: 2,
            explication: 'L\'automatisation du reporting vise à éliminer le temps passé à produire manuellement des rapports récurrents, pour que les équipes se concentrent sur ce qui crée de la valeur : analyser les résultats, prendre des décisions et agir.',
          },
        ],
      },
    ],
  },
];
