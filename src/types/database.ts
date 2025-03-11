export type Theme = { id: string; title: string; theme: string };

export type Themes = Theme[];

export type Memo = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  date: string;
  theme: Theme;
  time: Theme;
}

export type Setting = {
  theme_count: number,
  time_limit :string,
}
