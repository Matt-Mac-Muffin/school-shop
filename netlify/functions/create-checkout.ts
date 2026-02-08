import type { Context } from '@netlify/functions';
import { supabase } from './lib/supabase.js';
import { stripe } from './lib/stripe.js';
import { json, error, cors } from './lib/response.js';

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors();
  if (req.method !== 'POST') return error('Méthode non autorisée', 405);

  const body = await req.json();
  const { product_id, quantity, customer_name, customer_email, child_class } = body;

  if (!product_id || !quantity || !customer_name || !customer_email) {
    return error('Champs obligatoires manquants');
  }

  if (quantity < 1 || quantity > 100) {
    return error('Quantité invalide');
  }

  const { data: product, error: dbError } = await supabase
    .from('products')
    .select('*')
    .eq('id', product_id)
    .eq('is_active', true)
    .single();

  if (dbError || !product) return error('Produit introuvable', 404);

  const totalCents = product.price_cents * quantity;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${process.env.SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.SITE_URL}/cancel`,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
        },
        quantity,
      },
    ],
    metadata: {
      product_id: product.id,
      product_name: product.name,
      unit_price_cents: String(product.price_cents),
      quantity: String(quantity),
      total_cents: String(totalCents),
      customer_name,
      customer_email,
      child_class: child_class || '',
    },
  });

  return json({ url: session.url });
};
