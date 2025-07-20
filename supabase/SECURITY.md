# Supabase セキュリティ設定

このドキュメントでは、ThoughtKeeper-webプロジェクトのSupabaseセキュリティ設定について説明します。

## 🔒 セキュリティ対策の概要

### 1. Row Level Security (RLS)
- 全てのテーブルでRLSを有効化
- ユーザーは自分のデータのみアクセス可能
- 認証されていないユーザーはデータにアクセス不可

### 2. テーブルアクセス権限の制限
- `anon`と`public`ロールからのアクセスを完全に制限
- `authenticated`ロールのみに必要な権限を付与

### 3. SQLベースのポリシー管理
- GUIに依存せず、SQLでポリシーを管理
- バージョン管理可能なポリシー設定

## 📋 テーブル別セキュリティポリシー

### memos テーブル
- **SELECT**: ユーザーは自分のメモのみ読み取り可能
- **INSERT**: ユーザーは自分のメモのみ作成可能
- **UPDATE**: ユーザーは自分のメモのみ更新可能
- **DELETE**: ユーザーは自分のメモのみ削除可能

### user_settings テーブル
- **SELECT**: ユーザーは自分の設定のみ読み取り可能
- **INSERT**: ユーザーは自分の設定のみ作成可能
- **UPDATE**: ユーザーは自分の設定のみ更新可能
- **DELETE**: ユーザーは自分の設定のみ削除可能

### themes テーブル
- **SELECT**: 認証されたユーザーのみ読み取り可能（メモ作成時に必要）
- **INSERT/UPDATE/DELETE**: 制限（管理者のみ）

## 🛠️ ポリシー管理コマンド

### ポリシーの適用
```bash
# 開発環境でポリシーを適用
./supabase/scripts/apply-policies.sh

# または直接Supabaseコマンドを使用
supabase db reset --linked
```

### ポリシーの確認
```bash
# 現在のポリシー設定を確認
./supabase/scripts/check-policies.sh
```

### 本番環境へのデプロイ
```bash
# 本番環境にポリシーをデプロイ
supabase db push
```

## 📁 ファイル構成

```
supabase/
├── migrations/
│   ├── 20240929131313_create_themes_table.sql
│   ├── 20241030100000_create_user_settings_table.sql
│   ├── 20241229100000_create_memo_table.sql
│   └── 20241230000000_add_security_policies.sql
├── scripts/
│   ├── apply-policies.sh
│   └── check-policies.sh
├── policies.sql
└── SECURITY.md
```

## 🔍 ポリシーの確認方法

### SQLでポリシーを確認
```sql
-- 現在のポリシー一覧を確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- RLSが有効になっているテーブルを確認
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename IN ('memos', 'user_settings', 'themes');
```

### 権限設定の確認
```sql
-- テーブルの権限を確認
SELECT table_name, privilege_type, grantee
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name IN ('memos', 'user_settings', 'themes')
ORDER BY table_name, privilege_type, grantee;
```

## ⚠️ 注意事項

1. **ポリシーの変更時**: 必ず`policies.sql`を更新し、マイグレーションを実行してください
2. **本番環境**: ポリシーの変更は慎重に行い、事前にテストしてください
3. **バックアップ**: 重要なデータがある場合は、ポリシー変更前にバックアップを取得してください

## 🚀 次のステップ

1. 開発環境でポリシーをテスト
2. アプリケーションの動作確認
3. 本番環境へのデプロイ
4. 定期的なセキュリティ監査

## 📞 サポート

セキュリティ設定に関する質問や問題がある場合は、プロジェクトのメンテナーに連絡してください。
