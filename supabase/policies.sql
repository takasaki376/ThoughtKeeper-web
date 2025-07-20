-- Supabase セキュリティポリシー管理スクリプト
-- このファイルはGUIに依存せず、SQLでポリシーを管理するためのものです

-- ========================================
-- ポリシー削除（リセット用）
-- ========================================

-- memosテーブルのポリシー削除
DROP POLICY IF EXISTS "Users can view own memos" ON memos;
DROP POLICY IF EXISTS "Users can insert own memos" ON memos;
DROP POLICY IF EXISTS "Users can update own memos" ON memos;
DROP POLICY IF EXISTS "Users can delete own memos" ON memos;

-- user_settingsテーブルのポリシー削除
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;

-- themesテーブルのポリシー削除
DROP POLICY IF EXISTS "Authenticated users can view themes" ON themes;

-- ========================================
-- RLS有効化
-- ========================================

ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- ========================================
-- memosテーブルのポリシー
-- ========================================

-- ユーザーは自分のメモのみ読み取り可能
CREATE POLICY "Users can view own memos" ON memos
  FOR SELECT USING (auth.uid() = user_id);

-- ユーザーは自分のメモのみ作成可能
CREATE POLICY "Users can insert own memos" ON memos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のメモのみ更新可能
CREATE POLICY "Users can update own memos" ON memos
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザーは自分のメモのみ削除可能
CREATE POLICY "Users can delete own memos" ON memos
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- user_settingsテーブルのポリシー
-- ========================================

-- ユーザーは自分の設定のみ読み取り可能
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- ユーザーは自分の設定のみ作成可能
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の設定のみ更新可能
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- ユーザーは自分の設定のみ削除可能
CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- themesテーブルのポリシー
-- ========================================

-- 認証されたユーザーは全てのテーマを読み取り可能（メモ作成時に必要）
CREATE POLICY "Authenticated users can view themes" ON themes
  FOR SELECT USING (auth.role() = 'authenticated');

-- ========================================
-- 権限設定
-- ========================================

-- memosテーブル
REVOKE ALL ON memos FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON memos TO authenticated;

-- user_settingsテーブル
REVOKE ALL ON user_settings FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_settings TO authenticated;

-- themesテーブル
REVOKE ALL ON themes FROM anon, public;
GRANT SELECT ON themes TO authenticated;

-- UUID生成関数の権限
GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO authenticated;
REVOKE EXECUTE ON FUNCTION uuid_generate_v4() FROM anon, public;

-- ========================================
-- ポリシー確認用クエリ
-- ========================================

-- 現在のポリシー一覧を確認
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- RLSが有効になっているテーブルを確認
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('memos', 'user_settings', 'themes');
