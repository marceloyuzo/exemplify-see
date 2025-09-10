'use client'

import { ThemeProvider } from '@/theme/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import Header from '@/components/interface/header'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/interface/app-sidebar'
import { ReactFlowProvider } from '@xyflow/react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <QueryClientProvider client={queryClient}>
          <ReactFlowProvider>
            <TooltipProvider>
              <Toaster />
              <div className="flex flex-col min-h-screen w-full">
                <Header />
                <AppSidebar />

                <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                  <main className="flex-1 overflow-y-auto">
                    <div className="w-full max-w-[1400px] mx-auto pl-20 pr-10 my-10">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </TooltipProvider>
          </ReactFlowProvider>
        </QueryClientProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
}
