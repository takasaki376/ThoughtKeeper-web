'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function getUser() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return { user };
  } catch (error) {
    console.error('Failed to get user:', error);
    return { user: null };
  }
}
