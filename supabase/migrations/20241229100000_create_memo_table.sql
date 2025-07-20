-- memosテーブルの作成
create table memos (
  id uuid default uuid_generate_v4(),
  user_id uuid references auth.users (id) on delete cascade,
  theme_id uuid references themes (id),
  content text,
  created_at timestamp with time zone default (now() at time zone 'utc'),
  primary key (id)
);

-- RLSを有効化
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- デフォルト権限を制限
REVOKE ALL ON memos FROM anon, public;
GRANT SELECT, INSERT, UPDATE, DELETE ON memos TO authenticated;
