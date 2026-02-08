# Guide de mise en route

## Prérequis

- Node.js 18+
- Compte Supabase (gratuit)
- Compte Stripe (mode test)
- Netlify CLI : `npm install -g netlify-cli`

## 1. Configurer Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et exécuter le contenu de `supabase/init.sql`
3. Aller dans **Storage** et créer un bucket public nommé `product-images` (taille max 2MB, types : jpeg, png, webp)
4. Aller dans **Authentication > Users** et créer un utilisateur admin (email/password)
5. Récupérer les clés dans **Settings > API** : URL, anon key, service_role key

## 2. Configurer Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. En mode test, récupérer les clés dans **Developers > API keys** : publishable key, secret key
3. Le webhook secret sera configuré lors du déploiement (étape 5)

## 3. Variables d'environnement

Remplir le fichier `.env` à la racine :

```
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=http://localhost:8888
```

Mettre à jour aussi `src/environments/environment.ts` avec `supabaseUrl`, `supabaseAnonKey`, et `stripePublishableKey`.

## 4. Développement local

```bash
npm install
cd netlify/functions && npm install && cd ../..
netlify dev
```

Le site tourne sur `http://localhost:8888`.

Pour tester les webhooks Stripe localement :
```bash
stripe listen --forward-to localhost:8888/api/stripe-webhook
```

Carte de test Stripe : `4242 4242 4242 4242` (date future, CVC quelconque).

## 5. Déploiement Netlify

1. Connecter le repo Git à Netlify
2. Ajouter les variables d'environnement dans **Site settings > Environment variables**
3. Mettre `SITE_URL` à l'URL de production (ex: `https://mon-site.netlify.app`)
4. Dans Stripe, ajouter un webhook pointant vers `https://mon-site.netlify.app/api/stripe-webhook` avec l'événement `checkout.session.completed`
5. Copier le webhook secret dans les variables Netlify

## 6. Tests

```bash
npx ng test --no-watch
```
