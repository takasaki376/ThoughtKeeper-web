import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    console.log("Supabase client created");

    // テーマを取得
    const { data, error } = await supabase
      .from('themes')
      .select('*');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/themes:", error as Error);
    return NextResponse.json({ details: (error as Error).message, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    console.log("Supabase client created");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("User fetched:", user);
    if (userError) {
      console.error("User fetch error:", userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!user) {
      console.error("No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { theme_name } = body; // 例としてテーマ名を取得

    // 新しいテーマをデータベースに挿入
    const { data, error } = await supabase
      .from('themes')
      .insert({
        theme_name,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Theme created successfully",
      ...data
    });
  } catch (error) {
    console.error("Error in POST /api/themes:", error as Error);
    return NextResponse.json({ details: (error as Error).message, error: "Internal Server Error" }, { status: 500 });
  }
}
