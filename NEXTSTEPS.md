# Prochaines étapes

## 1. Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com) et créer un nouveau projet (gratuit)
2. Aller dans **SQL Editor** et coller le contenu de `supabase/init.sql`, puis exécuter
3. Aller dans **Storage**, créer un bucket nommé `product-images` :
   - Public : oui
   - Taille max : 2 MB
   - Types autorisés : `image/jpeg`, `image/png`, `image/webp`
4. Aller dans **Authentication > Users** et créer un utilisateur admin avec email + mot de passe
5. Noter les clés dans **Settings > API** :
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Créer le compte Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Rester en **mode test** (toggle en haut à droite du dashboard)
3. Aller dans **Developers > API keys** et noter :
   - `Publishable key` → `STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

## 3. Remplir les variables d'environnement

Mettre à jour le fichier `.env` à la racine avec les vraies valeurs :

```
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SITE_URL=http://localhost:8888
```

Mettre aussi à jour `src/environments/environment.ts` :

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://votre-projet.supabase.co',
  supabaseAnonKey: 'eyJ...',
  stripePublishableKey: 'pk_test_...',
};
```

## 4. Installer Netlify CLI

```bash
npm install -g netlify-cli
```

## 5. Lancer en local

```bash
npm install
cd netlify/functions && npm install && cd ../..
netlify dev
```

Le site tourne sur `http://localhost:8888`.

## 6. Tester les webhooks Stripe en local

Dans un second terminal :

```bash
stripe listen --forward-to localhost:8888/api/stripe-webhook
```

Cette commande affiche un `whsec_...` temporaire → le copier dans `.env` comme `STRIPE_WEBHOOK_SECRET`.

## 7. Tester le flux complet

1. Aller sur `http://localhost:8888/admin/login` et se connecter avec le compte admin
2. Créer un produit (nom, prix, image, actif)
3. Aller sur `http://localhost:8888` (page publique)
4. Cliquer "Commander" sur le produit, remplir le formulaire
5. Payer avec la carte de test : `4242 4242 4242 4242` (date future, CVC quelconque)
6. Vérifier la redirection vers `/success`
7. Vérifier la commande dans le dashboard admin (onglet Commandes)

## 8. Déployer sur Netlify

1. Initialiser un repo Git et push le code
2. Connecter le repo à Netlify (New site > Import from Git)
3. Ajouter toutes les variables d'environnement dans **Site settings > Environment variables**
4. Mettre `SITE_URL` à l'URL de production (ex: `https://mon-site.netlify.app`)
5. Netlify build et déploie automatiquement

## 9. Configurer le webhook Stripe en production

1. Aller dans **Stripe > Developers > Webhooks**
2. Ajouter un endpoint : `https://mon-site.netlify.app/api/stripe-webhook`
3. Sélectionner l'événement `checkout.session.completed`
4. Copier le **Signing secret** (`whsec_...`) dans les variables d'environnement Netlify comme `STRIPE_WEBHOOK_SECRET`

## 10. Mettre à jour l'environnement de production

Mettre à jour `src/environments/environment.prod.ts` avec les clés de production (ou les clés test si on reste en mode test Stripe).
