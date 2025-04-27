'use server';

import { createSupabaseServerClient } from '@/app/utils/supabase/server';

export async function updateSettings(settings: { theme_count: number; time_limit: string }) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from('user_settings')
    .upsert(settings);

  if (error) {
    throw new Error('Failed to update settings');
  }
}
