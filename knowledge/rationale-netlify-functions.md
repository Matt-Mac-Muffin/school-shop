# Pourquoi Netlify Functions comme backend serverless

## Contexte

Plusieurs options existent pour héberger des fonctions serverless : Supabase Edge Functions, Vercel Functions, AWS Lambda, Cloudflare Workers, etc.

## Choix : Netlify Functions

1. **Colocalisation avec le front** — Le site Angular est hébergé sur Netlify. Les fonctions sont déployées automatiquement avec le front, sur le même domaine, via un simple `git push`. Zéro infra supplémentaire.
2. **Runtime Node.js** — Les SDK npm de Stripe et Supabase s'utilisent directement, sans adaptation.
3. **Toutes les méthodes HTTP supportées** — L'API admin utilise GET, POST, PUT et DELETE. Certaines alternatives (notamment Supabase Edge Functions) limitent les méthodes à POST/OPTIONS.
4. **Un seul pipeline de déploiement** — Front + back dans le même repo, déployés ensemble, configurés au même endroit (variables d'environnement Netlify).
