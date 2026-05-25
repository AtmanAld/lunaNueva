import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en tu archivo .env.local. ' +
    'Por favor verifica que las variables estén definidas y tengan el prefijo VITE_.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');