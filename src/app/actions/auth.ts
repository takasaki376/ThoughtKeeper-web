'use server';

import { createSupabaseServerClient } from "@/app/utils/supabase/server";

export async function getUser() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth error:', error);
      return { error: 'Authentication failed', user: null };
    }

    if (!data?.user) {
      return { error: 'User not found', user: null };
    }

    return { user: data.user };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'Internal server error', user: null };
  }
}
