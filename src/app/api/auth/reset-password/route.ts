import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const origin = headers().get("origin");
    const supabase = createSupabaseServerClient();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("Attempting to send reset password email to:", { email });

    // カスタムパスワードリセットフロー
    // 1. パスワードリセットメールを送信
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/reset-password/confirm`,
    });

    if (error) {
      console.error("Reset password error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("Password reset email sent successfully to:", email);

    return NextResponse.json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Unexpected error during password reset:", error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
