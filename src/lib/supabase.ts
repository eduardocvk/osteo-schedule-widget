
import { createClient } from '@supabase/supabase-js';
import { type Database } from '@/types/supabase.types';

// Usamos las claves publicables directamente en el código para desarrollo
// En producción, estas claves vendrían de las variables de entorno
const supabaseUrl = 'https://bprvtbzhgdnxmnkbmdcq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcnZ0YnpoZ2RueG1ua2JtZGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4OTI3OTgsImV4cCI6MjAzMjQ2ODc5OH0.SYas-gSfAfaRHwTDiSqTNyJu9BTQ4wBB2FN0vA_HLN8';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
