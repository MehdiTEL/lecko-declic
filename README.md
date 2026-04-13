# DÉCLIC — Cartographie IA pour les métiers

Plateforme de diagnostic et d'accompagnement IA pour les métiers.

## Ce repo contient

- Diagnostic express (base de 15 métiers)
- Diagnostic personnalisé (formulaire + clé API OpenAI/Anthropic)
- Résultats + dashboard ROI
- Espace consultant (missions, entretiens, chantiers, feuille de route)
- Portail client
- Bibliothèque de questionnaires
- Mode équipe
- Historique + tracker de tâches

## Variables d'environnement

Copie `.env.example` en `.env` :

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_VITRINE_URL=https://declic.fr`

## Développement

```bash
npm install
npm run dev
```

## Déploiement

Vercel. Domaine cible : `declic.fr`
