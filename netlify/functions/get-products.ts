import type { Context } from '@netlify/functions';
import { supabase } from './lib/supabase.js';
import { json, error, cors } from './lib/response.js';

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return cors();

  const { data, error: dbError } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (dbError) return error(dbError.message, 500);

  return json(data);
};
