import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let query = supabase
      .from('memos')
      .select(`
        *,
        theme:themes(id, title, theme)
      `)
      .eq('user_id', user.id);

    // 日付フィルターが指定されている場合
    if (start && end) {
      query = query
        .gte('created_at', start)
        .lte('created_at', end);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching memos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (user) {
      const userId = user?.data?.user?.id;

      const body = await request.json();
      const { content, theme_id } = body;

      // themesテーブルからtheme_idを取得
      const { data: theme, error: themeError } = await supabase
        .from('themes')
        .select('id')
        .eq('id', theme_id)
        .single();

      if (themeError || !theme) throw new Error("Theme not found");

      // upsertを使用して、レコードが存在しない場合は挿入、存在する場合は更新
      const { data, error } = await supabase
        .from('memos')
        .upsert({
          content: content,
          theme_id: theme.id, // themesから取得したtheme_idを使用
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        message: "Memos updated successfully",
        ...data
      });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("Error in PUT /api/memos:", error as Error);
    return NextResponse.json({ details: (error as Error).message, error: "Internal Server Error" }, { status: 500 });
  }
}
