import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (user) {
      const userId = user?.data?.user?.id;

      const { data: memos, error } = await supabase
        .from('memos')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // メモが存在しない場合は空配列を返す
      return NextResponse.json(memos || []);
    }
    return NextResponse.json({ error: "no user" }, { status: 401 });
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
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (user) {
      const userId = user?.data?.user?.id;

      const body = await request.json();
      const { content, theme_id } = body;

      // upsertを使用して、レコードが存在しない場合は挿入、存在する場合は更新
      const { data, error } = await supabase
        .from('memos')
        .upsert({
          content: content,
          theme_id: theme_id,
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
