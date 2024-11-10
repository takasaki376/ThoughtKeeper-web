import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ここに実際のデータ取得ロジックを実装
    // 仮のレスポンス
    return NextResponse.json({
      theme_count: 5,  // デフォルト値
      time_limit: 60,  // デフォルト値（秒）
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { theme_count, time_limit } = body;

    // ここに実際の保存ロジックを実装
    // 例：データベースに保存など

    return NextResponse.json({
      message: "Settings updated successfully",
      theme_count,
      time_limit,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
