-- セキュリティポリシー確認用SQLクエリ
-- Supabase StudioのSQL Editorで実行してください

-- 1. 現在のポリシー一覧を確認
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 2. RLSが有効になっているテーブルを確認
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

-- 3. テーブルの権限を確認
SELECT
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name IN ('memos', 'user_settings', 'themes')
ORDER BY table_name, privilege_type, grantee;

-- 4. 認証ユーザーの確認（テスト用）
SELECT
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 5. テーブルの構造確認
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name IN ('memos', 'user_settings', 'themes')
ORDER BY table_name, ordinal_position;
