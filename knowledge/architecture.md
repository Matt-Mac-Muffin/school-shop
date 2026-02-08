# Architecture du projet

## Stack

- **Frontend** : Angular 21 (standalone components, signals, lazy loading)
- **Backend** : Netlify Functions (Node.js serverless, TypeScript)
- **Base de données** : Supabase (PostgreSQL avec RLS)
- **Paiement** : Stripe Checkout
- **Storage** : Supabase Storage (images produits)
- **Auth** : Supabase Auth (admin uniquement)

## Structure des dossiers

```
netlify/functions/        → Fonctions serverless (API backend)
  lib/                    → Utilitaires partagés (supabase, stripe, auth, response)
  get-products.ts         → GET public : produits actifs
  create-checkout.ts      → POST public : crée session Stripe
  stripe-webhook.ts       → POST Stripe : confirmation paiement
  admin-products.ts       → CRUD admin : produits
  admin-orders.ts         → GET admin : commandes

src/app/
  models/                 → Interfaces TypeScript (Product, Order)
  services/               → Services Angular (API, Auth, Storage)
  guards/                 → Route guard (auth)
  pages/                  → Composants par page
    shop/                 → Page publique (liste produits + formulaire)
    success/              → Page post-paiement réussi
    cancel/               → Page paiement annulé
    admin/login/          → Connexion admin
    admin/dashboard/      → Gestion produits + commandes
```

## Flux de données

1. Les produits sont chargés via `GET /api/get-products` (lecture Supabase avec RLS)
2. La commande est envoyée à `POST /api/create-checkout` qui vérifie le prix en DB et crée une session Stripe
3. Le webhook Stripe (`POST /api/stripe-webhook`) enregistre la commande en DB avec upsert idempotent
4. L'admin se connecte via Supabase Auth, le token JWT est envoyé dans les headers des appels admin

## Sécurité

- Prix vérifié côté serveur (jamais côté client)
- Signature webhook Stripe vérifiée
- Upsert idempotent sur `stripe_session_id`
- Token admin vérifié côté serveur via Supabase Auth
- Clé `service_role` jamais exposée côté frontend
