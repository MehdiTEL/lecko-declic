export const PREMADE_GUIDES: Record<string, string> = {
  "Workflow N8N": `## Automatiser avec N8N

### Prérequis
- Un compte N8N Cloud (gratuit jusqu'à 5 workflows actifs) : **https://n8n.io**
- Accès au service source (Gmail, Notion, Airtable, etc.)
- ~20 minutes de mise en place

### Structure type d'un workflow N8N

#### Nœud 1 : Trigger
- **Type** : Trigger (déclencheur)
- **Options** : Schedule (planification), Webhook (événement externe), Email Trigger
- **Configuration** : Définissez la fréquence ou l'URL du webhook

#### Nœud 2 : Traitement des données
- **Type** : Function / Code
- **Configuration** : Transformez et filtrez les données reçues du trigger
- **Expression** : \`{{$json["champ_source"]}}\`

#### Nœud 3 : Action finale
- **Type** : Action (Gmail, Slack, Google Sheets, Notion, etc.)
- **Configuration** : Mappez les champs de sortie

### Temps de mise en place estimé
20–45 minutes selon la complexité

---

**Pour un workflow JSON personnalisé prêt à importer**, configurez votre clé API dans les paramètres. Le coach génèrera le JSON exact pour votre cas d'usage.`,

  "Agent IA": `## Déployer un Agent IA

### Prérequis
- Une clé API OpenAI ou Anthropic (Claude)
- Un compte Make ou N8N pour orchestrer les appels
- ~30 minutes de mise en place

### Architecture type d'un Agent IA

#### Étape 1 : Définir le system prompt
Rédigez les instructions précises de votre agent : rôle, contraintes, format de sortie attendu.

#### Étape 2 : Connecter la source de données
L'agent reçoit les données à traiter (email, formulaire, document) via un trigger.

#### Étape 3 : Appel API IA
- **OpenAI** : POST https://api.openai.com/v1/chat/completions
- **Anthropic** : POST https://api.anthropic.com/v1/messages
- Modèle recommandé : GPT-4o ou Claude 3.5 Sonnet

#### Étape 4 : Traitement de la réponse
Parsez la réponse JSON et déclenchez l'action suivante (envoi email, mise à jour BDD, etc.)

### Temps de mise en place estimé
30–60 minutes

---

**Pour un guide complet avec le code exact**, configurez votre clé API dans les paramètres.`,

  "Automatisation No-Code": `## Automatisation No-Code (Make / Zapier)

### Prérequis
- Un compte Make (gratuit jusqu'à 1 000 opérations/mois) : **https://make.com**
- Ou un compte Zapier (gratuit jusqu'à 100 tâches/mois) : **https://zapier.com**
- Accès aux applications à connecter

### Structure type Make

#### Module 1 : Watch (Déclencheur)
Surveille un événement dans une application source (nouvel email, nouveau formulaire, etc.)

#### Module 2 : Filtre (optionnel)
Condition pour ne traiter que certains éléments.

#### Module 3 : Action
Crée, met à jour ou envoie des données vers l'application cible.

### Conseils
- Commencez par cartographier votre process sur papier avant de l'automatiser
- Testez avec des données réelles avant de mettre en production
- Activez les notifications d'erreur par email

### Temps de mise en place estimé
15–30 minutes

---

**Pour un scénario Make/JSON personnalisé**, configurez votre clé API dans les paramètres.`,

  "Copilot / Assistant IA": `## Intégrer Copilot / Assistant IA dans votre quotidien

### Prérequis
- Licence Microsoft 365 Copilot OU accès à Claude.ai / ChatGPT
- ~15 minutes pour configurer vos prompts types

### Meilleures pratiques

#### 1. Créer une bibliothèque de prompts
Rédigez et sauvegardez vos prompts les plus utilisés. Un bon prompt contient :
- Le rôle attendu : "Tu es un expert en..."
- Le contexte : "Voici le document / la situation..."
- La tâche précise : "Génère / Résume / Rédige..."
- Le format souhaité : "En bullet points / En tableau / En email..."

#### 2. Intégrer dans votre workflow
- **Emails** : Utilisez Copilot dans Outlook pour rédiger des réponses
- **Réunions** : Teams Copilot pour les comptes-rendus automatiques
- **Documents** : Word Copilot pour la rédaction et la mise en forme

#### 3. Mesurer le gain de temps
Notez le temps avant/après sur 1 semaine pour quantifier le ROI.

### Temps de mise en place estimé
15–30 minutes par type de tâche

---

**Pour des prompts personnalisés à votre métier**, configurez votre clé API dans les paramètres.`,

  "Script personnalisé": `## Automatiser avec un Script Python/JS

### Prérequis
- Python 3.8+ installé (https://python.org) OU Node.js 18+ (https://nodejs.org)
- Un éditeur de code (VS Code recommandé)
- ~1 heure pour le premier script

### Structure type d'un script Python d'automatisation

\`\`\`python
import requests
import json
from datetime import datetime

# Configuration
API_KEY = "votre_clé_api"
SOURCE_URL = "https://api.source.com/data"
OUTPUT_FILE = "output.json"

def fetch_data():
    """Récupère les données depuis la source"""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    response = requests.get(SOURCE_URL, headers=headers)
    response.raise_for_status()
    return response.json()

def process_data(data):
    """Traite et transforme les données"""
    # Votre logique de traitement ici
    return data

def save_output(data):
    """Sauvegarde les résultats"""
    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"OK — {len(data)} éléments traités — {datetime.now()}")

if __name__ == "__main__":
    data = fetch_data()
    processed = process_data(data)
    save_output(processed)
\`\`\`

### Temps de mise en place estimé
1–3 heures selon la complexité

---

**Pour un script complet adapté à votre cas**, configurez votre clé API dans les paramètres.`,
};

export const FREE_GUIDE_LIMIT = 3;
