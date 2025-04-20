import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
