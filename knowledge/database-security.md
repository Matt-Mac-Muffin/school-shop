# Base de données et sécurité (RLS)

## Schema

Deux tables dans Supabase (PostgreSQL). Voir `supabase/init.sql` pour le DDL complet.

### products

| Colonne | Type | Contraintes |
|---|---|---|
| id | UUID | PK, auto-généré |
| name | TEXT | NOT NULL |
| description | TEXT | NOT NULL, défaut `''` |
| price_cents | INTEGER | NOT NULL, `> 0` |
| image_url | TEXT | NOT NULL, défaut `''` |
| is_active | BOOLEAN | NOT NULL, défaut `true` |
| created_at | TIMESTAMPTZ | NOT NULL, défaut `now()` |

### orders

| Colonne | Type | Contraintes |
|---|---|---|
| id | UUID | PK, auto-généré |
| product_id | UUID | FK vers `products(id)` |
| product_name | TEXT | NOT NULL |
| unit_price_cents | INTEGER | NOT NULL, `> 0` |
| quantity | INTEGER | NOT NULL, `> 0` |
| total_cents | INTEGER | NOT NULL, `> 0` |
| customer_name | TEXT | NOT NULL |
| customer_email | TEXT | NOT NULL |
| child_class | TEXT | NOT NULL, défaut `''` |
| stripe_session_id | TEXT | UNIQUE, NOT NULL |
| payment_status | TEXT | NOT NULL, défaut `'pending'`, valeurs : `pending`, `paid`, `cancelled` |
| created_at | TIMESTAMPTZ | NOT NULL, défaut `now()` |

## Convention `_cents`

Tous les montants sont en **centimes d'euro** (INTEGER). Raisons :
- Pas d'erreurs d'arrondi (les calculs sur entiers sont exacts).
- Compatible Stripe directement (Stripe attend les montants en centimes).
- Plus performant en base qu'un DECIMAL.

Exemples : 12,50 EUR = `1250`, 100,00 EUR = `10000`.

## Row Level Security (RLS)

Le RLS est activé sur les deux tables. Il contrôle ce que chaque type de clé API peut faire.

### Clé `anon` (front Angular, navigateur)

C'est la clé publique de Supabase, utilisée pour les requêtes non authentifiées.

- **products** : SELECT uniquement, filtré par `is_active = true` (via la policy `"Produits actifs visibles par tous"`). Aucun INSERT/UPDATE/DELETE.
- **orders** : aucun accès. RLS activé sans policy = tout bloqué par défaut.

### Clé `service_role` (Netlify Functions, serveur)

Cette clé **contourne le RLS** complètement. Elle est utilisée côté serveur uniquement.

- **products** : accès total (CRUD admin).
- **orders** : accès total (insertion par le webhook, lecture par l'admin).

### Résumé des accès

| Table | `anon` (front) | `service_role` (back) |
|---|---|---|
| products | SELECT (actifs uniquement) | Accès total |
| orders | Aucun accès | Accès total |
