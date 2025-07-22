-- user_settingsテーブルの作成
create table user_settings (
  user_id uuid references auth.users (id) on delete cascade primary key,
  theme_count integer default 10,
  time_limit text default '60',
  last_selected_input_type text NOT NULL DEFAULT 'text'
);

-- RLSを有効化
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- デフォルト権限を制限
REVOKE ALL ON user_settings FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_settings TO authenticated;
