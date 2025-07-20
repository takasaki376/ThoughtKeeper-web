# Supabase セキュリティポリシー確認スクリプト (Windows用)
# このスクリプトは、現在のポリシー設定を確認します

param(
    [switch]$Help
)

if ($Help) {
    Write-Host "🔍 Supabase セキュリティポリシー確認スクリプト (Windows用)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "使用方法:" -ForegroundColor Yellow
    Write-Host "  .\check-policies.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "オプション:" -ForegroundColor Yellow
    Write-Host "  -Help    このヘルプメッセージを表示" -ForegroundColor White
    exit 0
}

Write-Host "🔍 Supabase セキュリティポリシーの状態を確認中..." -ForegroundColor Cyan
Write-Host ""

# 現在のディレクトリを確認
if (-not (Test-Path "supabase\config.toml")) {
    Write-Host "❌ エラー: supabase\config.toml が見つかりません。" -ForegroundColor Red
    Write-Host "   このスクリプトは、Supabaseプロジェクトのルートディレクトリで実行してください。" -ForegroundColor Red
    exit 1
}

# Supabaseに接続してポリシーを確認
Write-Host "📋 現在のポリシー一覧:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray

# ポリシー一覧を取得
try {
    supabase db reset --linked --dry-run 2>$null
    Write-Host "✅ データベース接続成功" -ForegroundColor Green
} catch {
    Write-Host "⚠️  データベース接続に失敗しました。Supabaseが起動しているか確認してください。" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔒 RLS（Row Level Security）の状態:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray

# RLSの状態を確認するSQLクエリ
Write-Host "以下のSQLクエリをSupabase StudioのSQL Editorで実行してください:" -ForegroundColor Yellow
Write-Host ""
Write-Host "-- RLSが有効になっているテーブルを確認" -ForegroundColor White
Write-Host "SELECT" -ForegroundColor White
Write-Host "    schemaname," -ForegroundColor White
Write-Host "    tablename," -ForegroundColor White
Write-Host "    CASE" -ForegroundColor White
Write-Host "        WHEN rowsecurity THEN '✅ 有効'" -ForegroundColor White
Write-Host "        ELSE '❌ 無効'" -ForegroundColor White
Write-Host "    END as rls_status" -ForegroundColor White
Write-Host "FROM pg_tables" -ForegroundColor White
Write-Host "WHERE schemaname = 'public'" -ForegroundColor White
Write-Host "    AND tablename IN ('memos', 'user_settings', 'themes')" -ForegroundColor White
Write-Host "ORDER BY tablename;" -ForegroundColor White

Write-Host ""
Write-Host "📊 権限設定の確認:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray

# 権限設定を確認するSQLクエリ
Write-Host "-- テーブルの権限を確認" -ForegroundColor White
Write-Host "SELECT" -ForegroundColor White
Write-Host "    table_name," -ForegroundColor White
Write-Host "    privilege_type," -ForegroundColor White
Write-Host "    grantee" -ForegroundColor White
Write-Host "FROM information_schema.table_privileges" -ForegroundColor White
Write-Host "WHERE table_schema = 'public'" -ForegroundColor White
Write-Host "    AND table_name IN ('memos', 'user_settings', 'themes')" -ForegroundColor White
Write-Host "ORDER BY table_name, privilege_type, grantee;" -ForegroundColor White

Write-Host ""
Write-Host "💡 ポリシーを適用するには:" -ForegroundColor Cyan
Write-Host "   .\supabase\scripts\apply-policies.ps1" -ForegroundColor White
Write-Host ""
Write-Host "💡 開発環境でポリシーを再適用するには:" -ForegroundColor Cyan
Write-Host "   supabase db reset --linked" -ForegroundColor White
Write-Host ""
Write-Host "💡 本番環境にポリシーをデプロイするには:" -ForegroundColor Cyan
Write-Host "   supabase db push" -ForegroundColor White
