create table themes (
  id uuid default uuid_generate_v4(),
  title text,
  theme text,
  primary key (id)
);

create table user_settings (
  user_id uuid references auth.users (id) on delete cascade,
  theme_count integer not null default 10,
  time_limit text not null default '60',
  primary key (user_id)
);
