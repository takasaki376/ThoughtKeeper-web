export type themes = { id: string; title: string; theme: string }[];
export type Memo = {
    id: string;
    content: string;
    created_at: string;
    theme_id: string;
  }

  export type Setting = {
    theme_count: number,
    time_limit :string,
  }