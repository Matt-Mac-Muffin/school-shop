-- ==============================================
-- Base de données pour le site de paiement école
-- À exécuter dans le SQL Editor de Supabase
-- ==============================================

-- Table produits
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  image_url TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table commandes
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  child_class TEXT NOT NULL DEFAULT '',
  stripe_session_id TEXT UNIQUE NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS : lecture publique des produits actifs uniquement
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produits actifs visibles par tous"
  ON products FOR SELECT
  USING (is_active = true);

-- Pas de politique publique sur orders : accès uniquement via service_role

-- ==============================================
-- Storage : bucket public pour les images produits
-- À créer dans le dashboard Supabase > Storage
-- Nom : product-images
-- Public : oui
-- Taille max : 2MB
-- Types autorisés : image/jpeg, image/png, image/webp
-- ==============================================
