create table themes (
  id uuid default uuid_generate_v4(),
  title text,
  theme text,
  primary key (id)
);
