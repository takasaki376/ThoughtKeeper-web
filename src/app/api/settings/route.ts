import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user?.id;

    // user_settings テーブルからユーザー設定を取得
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

      // ユーザー設定が存在しない場合、初期値を登録
      if (!userSettings) {
        const { error: insertError } = await supabase
        .from('user_settings')
        .insert([{ theme_count: 10, time_limit: 60, user_id: userId }]);

        if (insertError) {
          console.error("Error inserting initial user settings:", insertError);
          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
        if (settingsError) {
          console.error("Error fetching user settings:", settingsError);
          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }


      return NextResponse.json({ message: "Initial settings created" }, { status: 201 });
    }

    // ユーザー設定が存在する場合はそれを返す
    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Error in GET /api/settings:", error as Error);
    return NextResponse.json({ details: (error as Error).message, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user?.id;

    // user_settings テーブルからユーザー設定を取得
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
      // ユーザー設定が存在しない場合、初期値を登録
      if (!userSettings) {
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert([{ theme_count: 10, time_limit:60, user_id: userId }]);

        if (insertError) {
          console.error("Error inserting initial user settings:", insertError);
          return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }

        return NextResponse.json({ message: "Initial settings created" }, { status: 201 });
      }

    if (settingsError) {
      console.error("Error fetching user settings:", settingsError);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


    const body = await request.json();
    const { theme_count, time_limit } = body;

    // upsertを使用して、レコードが存在しない場合は挿入、存在する場合は更新
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        theme_count,
        time_limit,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Settings updated successfully",
      ...data
    });
  } catch (error) {
    console.error("Error in PUT /api/settings:", error as any);
    return NextResponse.json({ details: (error as Error).message, error: "Internal Server Error" }, { status: 500 });
  }
}
