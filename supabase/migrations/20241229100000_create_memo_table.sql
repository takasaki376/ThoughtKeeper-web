-- user_settingsテーブルの作成
create table memos (
  id uuid default uuid_generate_v4(),
  user_id uuid references auth.users (id) on delete cascade,
  theme_id uuid references themes (id),
  content text,
  created_at timestamp default current_timestamp,
  primary key (id)
);
