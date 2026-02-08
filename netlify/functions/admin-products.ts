import type { Context } from '@netlify/functions';
import { supabase } from './lib/supabase.js';
import { verifyAdmin } from './lib/auth.js';
import { json, error, cors } from './lib/response.js';

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors();

  const isAdmin = await verifyAdmin(req.headers.get('authorization') ?? undefined);
  if (!isAdmin) return error('Non autorisé', 401);

  if (req.method === 'GET') {
    const { data, error: dbError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) return error(dbError.message, 500);
    return json(data);
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const { name, description, price_cents, image_url, is_active } = body;

    if (!name || !price_cents) return error('Nom et prix obligatoires');

    const { data, error: dbError } = await supabase
      .from('products')
      .insert({ name, description: description || '', price_cents, image_url: image_url || '', is_active: is_active ?? true })
      .select()
      .single();

    if (dbError) return error(dbError.message, 500);
    return json(data, 201);
  }

  if (req.method === 'PUT') {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) return error('ID obligatoire');

    const { data, error: dbError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (dbError) return error(dbError.message, 500);
    return json(data);
  }

  if (req.method === 'DELETE') {
    const body = await req.json();
    if (!body.id) return error('ID obligatoire');

    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', body.id);

    if (dbError) return error(dbError.message, 500);
    return json({ deleted: true });
  }

  return error('Méthode non autorisée', 405);
};
