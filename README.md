# SchoolShop

Site de paiement en ligne pour une école. Angular + Netlify Functions + Supabase + Stripe.

## Get Started

### Prerequis

- Node.js 18+
- Netlify CLI : `npm install -g netlify-cli`

### 1. Installer les dependances

```bash
npm install
cd netlify/functions && npm install && cd ../..
```

### 2. Configurer Supabase

1. Creer un projet sur [supabase.com](https://supabase.com) (gratuit)
2. Aller dans **SQL Editor** et executer le contenu de `supabase/init.sql`
3. Aller dans **Storage**, creer un bucket nomme `product-images` :
   - Public : oui
   - Taille max : 2 MB
   - Types autorises : `image/jpeg`, `image/png`, `image/webp`
4. Aller dans **Authentication > Users** et creer un utilisateur admin (email + mot de passe)
5. Noter les cles dans **Settings > API** :
   - `Project URL` → `SUPABASE_URL`
   - `Publishable key` (ou `anon` legacy) → `SUPABASE_ANON_KEY`
   - `Secret key` (ou `service_role` legacy) → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Remplir les variables d'environnement

Creer un fichier `.env` a la racine :

```
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SITE_URL=http://localhost:8888
```

Mettre a jour `src/environments/environment.ts` :

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://votre-projet.supabase.co',
  supabaseAnonKey: 'sb_publishable_...',
  stripePublishableKey: 'pk_test_...', // a remplir a l'etape 5
};
```

### 4. Lancer en local

```bash
netlify dev
```

Le site tourne sur `http://localhost:8888`. La boutique affiche les produits et le dashboard admin est accessible sur `/admin/login`.

> **Note** : `ng serve` seul (port 4200) ne lance pas les Netlify Functions. Utiliser `netlify dev` pour avoir le front + l'API.

### 5. Configurer Stripe

1. Creer un compte sur [stripe.com](https://stripe.com)
2. Rester en **mode test** (toggle en haut a droite)
3. Aller dans **Developers > API keys** et noter :
   - `Publishable key` → `STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
4. Ajouter dans `.env` :
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
5. Mettre a jour `stripePublishableKey` dans `src/environments/environment.ts`

### 6. Tester les webhooks Stripe en local

Installer le [Stripe CLI](https://docs.stripe.com/stripe-cli), puis dans un second terminal :

```bash
stripe listen --forward-to localhost:8888/api/stripe-webhook
```

Cette commande affiche un `whsec_...` temporaire → le copier dans `.env` comme `STRIPE_WEBHOOK_SECRET`.

Carte de test : `4242 4242 4242 4242` (date future, CVC quelconque).

## Tests

```bash
npx ng test --no-watch
```

## Build

```bash
npx ng build
```
