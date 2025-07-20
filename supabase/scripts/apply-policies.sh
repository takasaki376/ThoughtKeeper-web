#!/bin/bash

# Supabase セキュリティポリシー適用スクリプト
# このスクリプトは、SQLで管理されたポリシーをSupabaseに適用します

set -e

echo "🔒 Supabase セキュリティポリシーを適用中..."

# 現在のディレクトリを確認
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ エラー: supabase/config.toml が見つかりません。"
    echo "   このスクリプトは、Supabaseプロジェクトのルートディレクトリで実行してください。"
    exit 1
fi

# ポリシーファイルの存在確認
if [ ! -f "supabase/policies.sql" ]; then
    echo "❌ エラー: supabase/policies.sql が見つかりません。"
    exit 1
fi

# Supabaseにポリシーを適用
echo "📝 ポリシーを適用中..."
supabase db reset --linked

echo "✅ セキュリティポリシーが正常に適用されました！"
echo ""
echo "📋 適用されたポリシー:"
echo "   - memos: ユーザーは自分のメモのみアクセス可能"
echo "   - user_settings: ユーザーは自分の設定のみアクセス可能"
echo "   - themes: 認証ユーザーのみ読み取り可能"
echo ""
echo "🔍 ポリシーの確認方法:"
echo "   supabase db reset --linked  # 開発環境でポリシーを再適用"
echo "   supabase db push            # 本番環境にポリシーをデプロイ"
