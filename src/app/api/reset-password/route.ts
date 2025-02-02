import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const { newPassword, userId } = await request.json();

  // パスワードのバリデーション（例: 最小文字数）
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json(
      { message: 'パスワードは6文字以上である必要があります。' },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      console.error("パスワード更新中にエラーが発生しました:", error);
      return NextResponse.json(
        { message: 'パスワードの更新に失敗しました。' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'パスワードが更新されました。' });
  } catch (error) {
    console.error("パスワード更新中にエラーが発生しました:", error);
    return NextResponse.json(
      { message: 'サーバーエラーが発生しました。' },
      { status: 500 }
    );
  }
}
