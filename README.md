# lecko-declic (Application)

Application DÉCLIC by Lecko — diagnostic IA par métier.

## Ce repo contient

- Diagnostic express (base de 15 métiers)
- Diagnostic personnalisé (formulaire + clé API OpenAI/Anthropic)
- Résultats + dashboard ROI
- Chat Copilot IA
- Mode équipe
- Historique + tracker de tâches
- Profil utilisateur + gamification

## Ce repo NE contient PAS

Les pages marketing (landing vitrine, méthode détaillée, notre histoire, FAQ) sont dans le repo **lecko-vitrine**.

## Variables d'environnement

Copie `.env.example` en `.env` :

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_VITRINE_URL=https://lecko.fr`

## Développement

```bash
npm install
npm run dev
```

## Déploiement

Vercel. Domaine cible : `app.declic.lecko.fr`
