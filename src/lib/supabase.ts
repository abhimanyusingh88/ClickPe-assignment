import { createClient } from '@supabase/supabase-js';

// We add .trim() here to remove accidental spaces from copy-pasting
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Key");
}

export const supabase = createClient(supabaseUrl, supabaseKey);