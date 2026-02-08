import type { Context } from '@netlify/functions';
import { stripe } from './lib/stripe.js';
import { supabase } from './lib/supabase.js';
import { json, error } from './lib/response.js';

export default async (req: Request, _context: Context) => {
  if (req.method !== 'POST') return error('Méthode non autorisée', 405);

  const signature = req.headers.get('stripe-signature');
  if (!signature) return error('Signature manquante', 400);

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return error('Signature invalide', 400);
  }

  if (event.type !== 'checkout.session.completed') {
    return json({ received: true });
  }

  const session = event.data.object;
  const meta = session.metadata!;

  const { error: dbError } = await supabase.from('orders').upsert(
    {
      product_id: meta.product_id,
      product_name: meta.product_name,
      unit_price_cents: Number(meta.unit_price_cents),
      quantity: Number(meta.quantity),
      total_cents: Number(meta.total_cents),
      customer_name: meta.customer_name,
      customer_email: meta.customer_email,
      child_class: meta.child_class,
      stripe_session_id: session.id,
      payment_status: 'paid',
    },
    { onConflict: 'stripe_session_id' },
  );

  if (dbError) return error(dbError.message, 500);

  return json({ received: true });
};
