export type Theme = { id: string; title: string; theme: string };

export type Themes = Theme[];

export type Memo = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  theme: Theme;
}

export type Setting = {
  theme_count: number,
  time_limit :string,
}
