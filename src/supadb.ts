import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const sb_url = import.meta.env.VITE_SUPABASE_URL;
const sb_key = import.meta.env.VITE_SUPABASE_ANNON_KEY;
const supabase = createClient(sb_url, sb_key);
