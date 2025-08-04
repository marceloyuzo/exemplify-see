import Header from '@/components/header'
import './globals.css'
import type { ReactNode } from 'react'
import SideMenu from '@/components/side-menu'

export const metadata = {
  title: 'Exemplify SEE',
  description: 'Portal Exemplify SEE',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <SideMenu />
        <main className="mx-96 flex justify-center">{children}</main>
      </body>
    </html>
  )
}
