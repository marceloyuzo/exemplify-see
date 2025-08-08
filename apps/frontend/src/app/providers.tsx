'use client'

import { ThemeProvider } from '@/theme/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import Interface from '@/components/interface'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
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
      </QueryClientProvider>
    </ThemeProvider>
  )
}
