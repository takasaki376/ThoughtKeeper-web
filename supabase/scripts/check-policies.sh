#!/bin/bash

# Supabase セキュリティポリシー確認スクリプト
# このスクリプトは、現在のポリシー設定を確認します

set -e

echo "🔍 Supabase セキュリティポリシーの状態を確認中..."
echo ""

# 現在のディレクトリを確認
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ エラー: supabase/config.toml が見つかりません。"
    echo "   このスクリプトは、Supabaseプロジェクトのルートディレクトリで実行してください。"
    exit 1
fi

# Supabaseに接続してポリシーを確認
echo "📋 現在のポリシー一覧:"
echo "========================================"

# ポリシー一覧を取得
supabase db reset --linked --dry-run 2>/dev/null || echo "⚠️  データベース接続に失敗しました。Supabaseが起動しているか確認してください。"

echo ""
echo "🔒 RLS（Row Level Security）の状態:"
echo "========================================"

# RLSの状態を確認するSQLクエリ
cat << 'EOF' | supabase db reset --linked --dry-run 2>/dev/null || echo "⚠️  データベース接続に失敗しました。"
-- RLSが有効になっているテーブルを確認
SELECT
    schemaname,
    tablename,
    CASE
        WHEN rowsecurity THEN '✅ 有効'
        ELSE '❌ 無効'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('memos', 'user_settings', 'themes')
ORDER BY tablename;
EOF

echo ""
echo "📊 権限設定の確認:"
echo "========================================"

# 権限設定を確認するSQLクエリ
cat << 'EOF' | supabase db reset --linked --dry-run 2>/dev/null || echo "⚠️  データベース接続に失敗しました。"
-- テーブルの権限を確認
SELECT
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name IN ('memos', 'user_settings', 'themes')
ORDER BY table_name, privilege_type, grantee;
EOF

echo ""
echo "💡 ポリシーを適用するには:"
echo "   ./supabase/scripts/apply-policies.sh"
echo ""
echo "💡 開発環境でポリシーを再適用するには:"
echo "   supabase db reset --linked"
echo ""
echo "💡 本番環境にポリシーをデプロイするには:"
echo "   supabase db push"
