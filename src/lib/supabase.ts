// Cliente Supabase para Server-Side (API Routes, Server Components)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Cliente para Browser-Side (Client Components)
import { createBrowserClient } from "@supabase/ssr";

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export function createSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
