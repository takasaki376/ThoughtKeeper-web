# Supabase セキュリティポリシー適用スクリプト (Windows用)
# このスクリプトは、SQLで管理されたポリシーをSupabaseに適用します

param(
    [switch]$Help
)

if ($Help) {
    Write-Host "🔒 Supabase セキュリティポリシー適用スクリプト (Windows用)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "使用方法:" -ForegroundColor Yellow
    Write-Host "  .\apply-policies.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "オプション:" -ForegroundColor Yellow
    Write-Host "  -Help    このヘルプメッセージを表示" -ForegroundColor White
    exit 0
}

Write-Host "🔒 Supabase セキュリティポリシーを適用中..." -ForegroundColor Cyan

# 現在のディレクトリを確認
if (-not (Test-Path "supabase\config.toml")) {
    Write-Host "❌ エラー: supabase\config.toml が見つかりません。" -ForegroundColor Red
    Write-Host "   このスクリプトは、Supabaseプロジェクトのルートディレクトリで実行してください。" -ForegroundColor Red
    exit 1
}

# ポリシーファイルの存在確認
if (-not (Test-Path "supabase\policies.sql")) {
    Write-Host "❌ エラー: supabase\policies.sql が見つかりません。" -ForegroundColor Red
    exit 1
}

# Supabaseにポリシーを適用
Write-Host "📝 ポリシーを適用中..." -ForegroundColor Yellow
try {
    supabase db reset --linked
    Write-Host "✅ セキュリティポリシーが正常に適用されました！" -ForegroundColor Green
} catch {
    Write-Host "❌ エラー: ポリシーの適用に失敗しました。" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 適用されたポリシー:" -ForegroundColor Cyan
Write-Host "   - memos: ユーザーは自分のメモのみアクセス可能" -ForegroundColor White
Write-Host "   - user_settings: ユーザーは自分の設定のみアクセス可能" -ForegroundColor White
Write-Host "   - themes: 認証ユーザーのみ読み取り可能" -ForegroundColor White
Write-Host ""
Write-Host "🔍 ポリシーの確認方法:" -ForegroundColor Cyan
Write-Host "   supabase db reset --linked  # 開発環境でポリシーを再適用" -ForegroundColor White
Write-Host "   supabase db push            # 本番環境にポリシーをデプロイ" -ForegroundColor White
