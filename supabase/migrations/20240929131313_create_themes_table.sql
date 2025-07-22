create table themes (
  id uuid default uuid_generate_v4(),
  title text,
  theme text,
  primary key (id)
);

-- RLSを有効化
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- デフォルト権限を制限
REVOKE ALL ON themes FROM anon, public;
GRANT SELECT ON themes TO authenticated;
