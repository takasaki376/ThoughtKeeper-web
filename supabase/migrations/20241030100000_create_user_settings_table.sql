-- user_settingsテーブルの作成
create table user_settings (
  user_id uuid references auth.users (id) on delete cascade primary key,
  theme_count integer default 10,
  time_limit text default '60'
);
