import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/app/utils/supabase/server';

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Auth error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    if (!data?.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
