export const PREMADE_GUIDES: Record<string, string> = {
  "Workflow N8N": `## Automatiser avec N8N

### Prérequis
- Un compte N8N Cloud (gratuit jusqu'à 5 workflows actifs) : **https://n8n.io**
- Ou N8N self-hosted (Docker recommandé)
- Accès aux services à connecter (Gmail, Slack, CRM, etc.)
- Temps estimé : 10-15 minutes pour un premier workflow

### Conception DÉCLIC

#### Étape 1 — Le déclencheur
Le premier noeud de tout workflow N8N est un Trigger :
- **Webhook** : reçoit un appel HTTP externe
- **Cron** : planification horaire/journalière
- **Email Trigger** : nouveau mail dans une boîte
- **Formulaire** : soumission Google Forms, Typeform

#### Étape 2 — Pré-traitement des données
Utilisez les noeuds **Set** et **IF** pour structurer les données avant traitement.
Le noeud Set permet de renommer des champs, formater des dates, nettoyer du texte.

#### Étape 3 — Décisions et branches
Le noeud **IF** crée 2 branches (true/false). Le noeud **Switch** permet plusieurs branches.
Toujours prévoir une branche "cas par défaut" pour les données inattendues.

#### Étape 4 — Actions
N8N propose 400+ intégrations natives : Gmail, Slack, Notion, Airtable, HubSpot, etc.
Chaque noeud a ses paramètres spécifiques — le Copilot peut vous guider sur chacun.

#### Étape 5 — Filet de sécurité
- Activez les **Executions** dans Settings pour garder l'historique
- Ajoutez un noeud **Error Trigger** qui envoie une alerte en cas d'échec
- Testez avec le bouton "Execute Workflow" avant d'activer le trigger

### Temps de mise en place
Premier workflow simple : 30 minutes. Workflow avec 5+ noeuds : 2-4 heures.

Pour des configurations avancées ou un JSON importable sur-mesure, configurez votre clé API dans les paramètres pour accéder au Copilot interactif.`,

  "Agent IA": `## Déployer un Agent IA

### Prérequis
- Clé API Claude (Anthropic) ou OpenAI
- Un orchestrateur : N8N, LangChain, ou CrewAI
- Connaissance de base des prompts structurés

### Conception DÉCLIC

#### Étape 1 — Le déclencheur
L'agent est déclenché par un événement précis : email reçu, formulaire soumis, planification.
Ne créez pas un agent "toujours actif" — c'est coûteux et difficile à debugger.

#### Étape 2 — Pré-traitement des données
Avant d'envoyer au LLM : nettoyez le texte, extrayez les champs utiles, supprimez le bruit.
Un bon prompt commence par des données propres.

#### Étape 3 — Décisions et branches
Demandez au LLM de répondre en JSON avec un score de confiance (0.0 à 1.0).
Si confiance > 0.7 : action automatique. Sinon : validation humaine.

#### Étape 4 — Actions
L'agent exécute : créer un ticket, envoyer un email, mettre à jour un CRM.
Utilisez des catégories fermées ("positif/neutre/négatif") plutôt que du texte libre.

#### Étape 5 — Filet de sécurité
- Toujours un brouillon avant envoi pour les messages sensibles
- Logs de chaque appel LLM (prompt + réponse)
- Limite de coût par jour (configurable dans les paramètres API)

### Temps de mise en place
Agent simple (1 tâche) : 2-4 heures. Agent multi-tâches : 1-2 jours.

Pour un guide complet avec le code exact, configurez votre clé API dans les paramètres.`,

  "Automatisation No-Code": `## Automatisation No-Code (Make / Zapier)

### Prérequis
- Un compte Make (gratuit : 1000 opérations/mois) ou Zapier (gratuit : 100 tâches/mois)
- Accès aux applications à connecter
- Aucune compétence technique requise

### Conception DÉCLIC

#### Étape 1 — Le déclencheur
Dans Make : c'est le module **Watch** (ex: Watch Emails, Watch New Rows).
Dans Zapier : c'est le **Trigger** (ex: New Email, New Form Response).

#### Étape 2 — Pré-traitement des données
Make : utilisez les modules **Set Variable** et **Text Parser**.
Zapier : utilisez les **Formatter** et **Filter** steps.

#### Étape 3 — Décisions et branches
Make : le module **Router** crée des branches avec des filtres.
Zapier : les **Paths** permettent des branches conditionnelles.

#### Étape 4 — Actions
Make et Zapier proposent 1000+ intégrations. Les plus courantes :
Gmail, Slack, Google Sheets, Notion, HubSpot, Trello, Airtable.

#### Étape 5 — Filet de sécurité
- Make : activez les logs dans Scenario Settings
- Zapier : les Task History garde la trace de chaque exécution
- Testez manuellement avant de mettre en automatique

### Temps de mise en place
Zap/Scénario simple (2-3 étapes) : 15 minutes. Scénario complexe : 1-2 heures.

Pour un scénario personnalisé, configurez votre clé API dans les paramètres.`,

  "Copilot / Assistant IA": `## Intégrer un Assistant IA dans votre quotidien

### Prérequis
- Accès à un assistant IA : Microsoft Copilot (M365), Claude, ou ChatGPT
- Connaissance des tâches à optimiser

### Conception DÉCLIC

#### Étape 1 — Le déclencheur
L'assistant est sollicité à un moment précis de votre workflow :
avant une réunion, pendant la rédaction, après réception d'un email.

#### Étape 2 — Pré-traitement des données
Préparez un prompt structuré avec le contexte nécessaire.
Un bon prompt contient : le rôle, le contexte, la tâche, le format de sortie attendu.

#### Étape 3 — Décisions et branches
Le résultat de l'IA est un brouillon. Vous décidez :
- Utiliser tel quel (confiance haute)
- Ajuster et envoyer (confiance moyenne)
- Refaire avec un meilleur prompt (confiance basse)

#### Étape 4 — Actions
Cas d'usage les plus rentables :
- Rédaction d'emails / CR (gain : 50-70% du temps)
- Analyse de documents (gain : 60-80%)
- Traduction et adaptation (gain : 70-90%)
- Recherche et synthèse (gain : 40-60%)

#### Étape 5 — Filet de sécurité
- Ne jamais envoyer un contenu IA sans relecture pour les communications externes
- Vérifier les chiffres et les faits cités
- Ne pas partager de données sensibles dans les LLM publics

### Temps de mise en place
Premiers gains : immédiat. Optimisation des prompts : quelques jours.

Pour des prompts personnalisés à votre métier, configurez votre clé API dans les paramètres.`,

  "Script personnalisé": `## Automatiser avec un Script Python/JS

### Prérequis
- Python 3.9+ ou Node.js 18+
- Un éditeur de code (VS Code recommandé)
- Les bibliothèques : requests, pandas (Python) ou axios, node-fetch (JS)

### Conception DÉCLIC

#### Étape 1 — Le déclencheur
- **Cron job** : planification système (crontab Linux, Task Scheduler Windows)
- **Webhook** : endpoint HTTP qui reçoit les appels
- **Surveillance fichier** : watchdog (Python) ou chokidar (Node.js)

#### Étape 2 — Pré-traitement des données
\`\`\`python
import pandas as pd

# Charger et nettoyer les données
data = pd.read_csv("input.csv")
data = data.dropna(subset=["email"])
data["email"] = data["email"].str.strip().str.lower()
\`\`\`

#### Étape 3 — Décisions et branches
\`\`\`python
for row in data.itertuples():
    if row.score >= 3:
        process_high_priority(row)
    elif row.score >= 1:
        process_normal(row)
    else:
        log_skipped(row)
\`\`\`

#### Étape 4 — Actions
\`\`\`python
import requests

def send_notification(message):
    requests.post(SLACK_WEBHOOK, json={"text": message})

def update_crm(contact_id, data):
    requests.patch(f"{CRM_API}/contacts/{contact_id}", json=data)
\`\`\`

#### Étape 5 — Filet de sécurité
\`\`\`python
import logging

logging.basicConfig(filename="automation.log", level=logging.INFO)

try:
    main()
    print(f"{len(data)} éléments traités — OK")
except Exception as e:
    logging.error(f"Erreur : {e}")
    send_alert(f"Automatisation en échec : {e}")
\`\`\`

### Temps de mise en place
Script simple : 1-2 heures. Script avec API et gestion d'erreurs : 4-8 heures.

Pour un script complet adapté à votre cas, configurez votre clé API dans les paramètres.`,
};

export const FREE_GUIDE_LIMIT = 3;
