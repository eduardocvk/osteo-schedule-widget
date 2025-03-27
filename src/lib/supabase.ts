
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase.types';

// Obtiene las variables de entorno que Supabase proporciona automáticamente al integrar
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase. Por favor, asegúrate de que la integración está configurada correctamente.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
