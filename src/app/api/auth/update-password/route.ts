import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const { confirmPassword, password } = await request.json();
    const supabase = createSupabaseServerClient();

    // バリデーション
    if (!password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Password and confirm password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // パスワードの強度チェック（オプション）
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' },
        { status: 400 }
      );
    }

    console.log("Attempting to update password");

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Update password error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error("Unexpected error during password update:", error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
