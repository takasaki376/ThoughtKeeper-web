export const pagesPath = {
  $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/' as const }),
  "about": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/about' as const })
  },
  "MemoEditor": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/MemoEditor' as const })
  },
  "MemoList": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/MemoList' as const })
  },
  "MemoViewer": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/MemoViewer' as const })
  },
  "privacy": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/setting/privacy' as const })
  },
  "setting": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/setting' as const })
  },
  "ThemeSelect": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/ThemeSelect' as const })
  },
  "top": {
    $url: (url?: { hash?: string }) => ({ hash: url?.hash, pathname: '/top' as const })
  },
}

export type PagesPath = typeof pagesPath

export const staticPath = {
  favicon_ico: '/favicon.ico'
} as const

export type StaticPath = typeof staticPath
