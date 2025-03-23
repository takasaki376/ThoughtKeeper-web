import { NextResponse } from "next/server";

import { create_ServerClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = create_ServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: memos, error } = await supabase
      .from('memos')
      .select(`
        *,
        theme:themes(id, title, theme)
      `)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json(memos || []);
  } catch (error) {
    console.error("Error in GET /api/memos:", error as Error);
    return NextResponse.json(
      { details: (error as Error).message, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = create_ServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, theme_id } = body;

    // themesテーブルからtheme_idを取得
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('id')
      .eq('id', theme_id)
      .single();

    if (themeError || !theme) {
      throw new Error("Theme not found");
    }

    // upsertを使用して、レコードが存在しない場合は挿入、存在する場合は更新
    const { data, error } = await supabase
      .from('memos')
      .upsert({
        content,
        theme_id: theme.id,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Memos updated successfully",
      ...data
    });
  } catch (error) {
    console.error("Error in PUT /api/memos:", error as Error);
    return NextResponse.json(
      { details: (error as Error).message, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
