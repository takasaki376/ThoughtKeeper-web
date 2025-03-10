import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables for Supabase client');
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
