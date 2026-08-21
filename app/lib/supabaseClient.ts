import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Em dev isso aparece no console; em produção a Vercel precisa ter as duas
  // variáveis configuradas em Project Settings > Environment Variables.
  console.warn(
    "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local"
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
