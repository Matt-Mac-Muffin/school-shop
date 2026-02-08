import type { Context } from '@netlify/functions';
import { supabase } from './lib/supabase.js';
import { verifyAdmin } from './lib/auth.js';
import { json, error, cors } from './lib/response.js';

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors();
  if (req.method !== 'GET') return error('Méthode non autorisée', 405);

  const isAdmin = await verifyAdmin(req.headers.get('authorization') ?? undefined);
  if (!isAdmin) return error('Non autorisé', 401);

  const { data, error: dbError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (dbError) return error(dbError.message, 500);

  return json(data);
};
