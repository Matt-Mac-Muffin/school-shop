# Netlify Functions (API backend)

Toutes les fonctions vivent dans `netlify/functions/` et sont exposées via le préfixe `/api/`.

## get-products.ts — Lister les produits (public)

- **Route** : `GET /api/get-products`
- **Auth** : aucune (public)
- Récupère les produits actifs (`is_active = true`) depuis Supabase, triés par date de création décroissante.
- Utilise la clé `anon` via le client Supabase, donc le RLS filtre automatiquement les produits inactifs.

## create-checkout.ts — Créer une session Stripe (public)

- **Route** : `POST /api/create-checkout`
- **Auth** : aucune (public)
- **Body attendu** : `{ product_id, quantity, customer_name, customer_email, child_class? }`
- **Validations** : champs obligatoires présents, quantité entre 1 et 100, produit existant et actif.
- Calcule `totalCents = price_cents * quantity` côté serveur (le prix ne vient jamais du client).
- Crée une session Stripe Checkout et y attache toutes les infos de commande dans les `metadata` Stripe.
- Renvoie `{ url }` : l'URL Stripe vers laquelle rediriger le client.

Les metadata Stripe servent de "pont" : elles transportent les données de commande jusqu'au webhook, sans qu'on ait besoin de stocker un état intermédiaire en base.

## stripe-webhook.ts — Recevoir la confirmation de paiement

- **Route** : `POST /api/stripe-webhook`
- **Auth** : signature Stripe (`stripe-signature` header + `STRIPE_WEBHOOK_SECRET`)
- Appelé automatiquement par Stripe après un paiement.
- Vérifie la signature pour garantir que la requête vient bien de Stripe.
- Ignore tous les événements sauf `checkout.session.completed`.
- Récupère les metadata de la session et insère la commande dans `orders` via `upsert` sur `stripe_session_id` (idempotent : si Stripe renvoie le webhook, pas de doublon).

## admin-products.ts — CRUD produits (admin)

- **Route** : `/api/admin-products`
- **Auth** : token JWT Supabase via `verifyAdmin()`
- **GET** : liste tous les produits (y compris inactifs), triés par date décroissante.
- **POST** : crée un produit. Body : `{ name, price_cents, description?, image_url?, is_active? }`.
- **PUT** : met à jour un produit. Body : `{ id, ...champs à modifier }`.
- **DELETE** : supprime un produit. Body : `{ id }`.

## admin-orders.ts — Lister les commandes (admin)

- **Route** : `GET /api/admin-orders`
- **Auth** : token JWT Supabase via `verifyAdmin()`
- Renvoie toutes les commandes triées par date décroissante.
