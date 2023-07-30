const buildSuffix = (url?: {query?: Record<string, string>, hash?: string}) => {
  const query = url?.query
  const hash = url?.hash
  if (!query && !hash) return ''
  const search = query ? `?${new URLSearchParams(query)}` : ''
  return `${search}${hash ? `#${hash}` : ''}`
}

export const pagesPath = {
  "MemoEditor": {
    $url: (url?: { hash?: string }) => ({ pathname: '/MemoEditor' as const, hash: url?.hash, path: `/MemoEditor${buildSuffix(url)}` })
  },
  "MemoList": {
    $url: (url?: { hash?: string }) => ({ pathname: '/MemoList' as const, hash: url?.hash, path: `/MemoList${buildSuffix(url)}` })
  },
  "MemoViewer": {
    $url: (url?: { hash?: string }) => ({ pathname: '/MemoViewer' as const, hash: url?.hash, path: `/MemoViewer${buildSuffix(url)}` })
  },
  "ThemeSelect": {
    $url: (url?: { hash?: string }) => ({ pathname: '/ThemeSelect' as const, hash: url?.hash, path: `/ThemeSelect${buildSuffix(url)}` })
  },
  "auth": {
    "signin": {
      $url: (url?: { hash?: string }) => ({ pathname: '/auth/signin' as const, hash: url?.hash, path: `/auth/signin${buildSuffix(url)}` })
    },
    "signup": {
      $url: (url?: { hash?: string }) => ({ pathname: '/auth/signup' as const, hash: url?.hash, path: `/auth/signup${buildSuffix(url)}` })
    }
  },
  "setting": {
    "privacy": {
      $url: (url?: { hash?: string }) => ({ pathname: '/setting/privacy' as const, hash: url?.hash, path: `/setting/privacy${buildSuffix(url)}` })
    },
    $url: (url?: { hash?: string }) => ({ pathname: '/setting' as const, hash: url?.hash, path: `/setting${buildSuffix(url)}` })
  },
  "top": {
    $url: (url?: { hash?: string }) => ({ pathname: '/top' as const, hash: url?.hash, path: `/top${buildSuffix(url)}` })
  },
  $url: (url?: { hash?: string }) => ({ pathname: '/' as const, hash: url?.hash, path: `/${buildSuffix(url)}` })
}

export type PagesPath = typeof pagesPath

export const staticPath = {
  favicon_ico: '/favicon.ico',
  next_svg: '/next.svg',
  thirteen_svg: '/thirteen.svg',
  vercel_svg: '/vercel.svg'
} as const

export type StaticPath = typeof staticPath
