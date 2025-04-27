import { NextResponse } from "next/server";

import { getLoggedInUser } from "@/utils/supabase/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getLoggedInUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // user_settings テーブルからユーザー設定を取得
    const supabase = createSupabaseServerClient();
    const { data: userSettings, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user settings:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    if (!userSettings) {
      // 初期値を登録
      const { error: insertError } = await supabase
        .from("user_settings")
        .insert([{ theme_count: 10, time_limit: 60, user_id: userId }]);

      if (insertError) {
        console.error("Error inserting initial user settings:", insertError);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }

      return NextResponse.json({ message: "Initial settings created" }, { status: 201 });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error("Error in GET /api/settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const user = await supabase.auth.getUser();
    if (user) {
      const userId = user?.data?.user?.id;

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
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error in PUT /api/settings:", error as Error);
    return NextResponse.json({ details: (error as Error).message, error: "Internal Server Error" }, { status: 500 });
  }
}
