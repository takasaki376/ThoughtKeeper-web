import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    
    // ユーザーセッションの取得
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ユーザーの設定を取得
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;

    // データが存在しない場合はデフォルト値を返す
    if (!data) {
      return NextResponse.json({
        theme_count: 5,
        time_limit: 60,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    
    // ユーザーセッションの取得
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { theme_count, time_limit } = body;

    // upsertを使用して、レコードが存在しない場合は挿入、存在する場合は更新
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        theme_count,
        time_limit,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Settings updated successfully",
      ...data
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
