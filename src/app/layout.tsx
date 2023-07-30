import '@/styles/globals.css'

import { Navigation } from '@/component/Navigation'

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
     <body>
        <div className='flex'>
          <div className=' bg-tomato/5'><Navigation/></div>
          <div className='min-h-screen flex-1'>{children}</div>
      </div>
      </body>
    </html>
  )
}
