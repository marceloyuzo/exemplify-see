import './globals.css'
import { type ReactNode } from 'react'
import { ThemeProvider } from '@/theme/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import Interface from '@/components/interface'

export const metadata = {
  title: 'Exemplify SEE',
  description: 'Portal Exemplify SEE',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              {/* Header + Side Menu */}
              <Interface />
              <main className="flex flex-1 flex-col pt-16">
                <div className="container mx-auto flex flex-1 items-center justify-center pt-8 max-w-7xl">
                  {children}
                </div>
              </main>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
