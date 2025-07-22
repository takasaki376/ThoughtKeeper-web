@echo off
REM Supabase セキュリティポリシー適用スクリプト (Windows用)
REM このスクリプトは、SQLで管理されたポリシーをSupabaseに適用します

echo 🔒 Supabase セキュリティポリシーを適用中...

REM 現在のディレクトリを確認
if not exist "supabase\config.toml" (
    echo ❌ エラー: supabase\config.toml が見つかりません。
    echo    このスクリプトは、Supabaseプロジェクトのルートディレクトリで実行してください。
    pause
    exit /b 1
)

REM ポリシーファイルの存在確認
if not exist "supabase\policies.sql" (
    echo ❌ エラー: supabase\policies.sql が見つかりません。
    pause
    exit /b 1
)

REM Supabaseにポリシーを適用
echo 📝 ポリシーを適用中...
supabase db reset --linked

if %errorlevel% neq 0 (
    echo ❌ エラー: ポリシーの適用に失敗しました。
    pause
    exit /b 1
)

echo ✅ セキュリティポリシーが正常に適用されました！
echo.
echo 📋 適用されたポリシー:
echo    - memos: ユーザーは自分のメモのみアクセス可能
echo    - user_settings: ユーザーは自分の設定のみアクセス可能
echo    - themes: 認証ユーザーのみ読み取り可能
echo.
echo 🔍 ポリシーの確認方法:
echo    supabase db reset --linked  # 開発環境でポリシーを再適用
echo    supabase db push            # 本番環境にポリシーをデプロイ

pause
