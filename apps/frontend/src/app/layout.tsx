import './globals.css'
import { type ReactNode } from 'react'
import { Providers } from './providers'

export const metadata = {
  title: 'Exemplify SEE',
  description: 'Portal Exemplify SEE',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="dist/frappe-gantt.css" />
      </head>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
