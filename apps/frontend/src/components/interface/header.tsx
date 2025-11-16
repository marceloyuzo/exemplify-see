'use client'

// import { useId } from 'react'
// import { GlobeIcon } from 'lucide-react'

import Logo from '@/components/icon/logo'
import UserMenu from '@/components/interface/user-menu'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/theme/theme-toggle'
import { SidebarTrigger } from '../ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

// const languages = [
//   { value: 'pt-BR', label: 'Pt-BR' },
//   { value: 'en', label: 'En' },
// ]

export default function Header() {
  // const id = useId()
  const router = useRouter()

  return (
    <div className="sticky top-0 left-0 w-full z-40">
      <header className="bg-muted border-b px-4 md:pr-6 md:pl-[10px]">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            {/* Logo e botão de expandir menu */}
            <div className="flex items-center gap-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Painel lateral
                </TooltipContent>
              </Tooltip>

              <a
                href="/"
                onMouseDown={(e) => {
                  if (e.button === 1) {
                    window.open('/', '_blank')
                  }
                }}
                onClick={(e) => {
                  if (e.button !== 0) return
                  e.preventDefault()
                  router.push('/')
                }}
                className="cursor-pointer text-primary flex gap-2 items-center hover:text-primary/90"
              >
                <Logo />
                <span className="font-bold tracking-wide bg-[linear-gradient(to_right,var(--primary),var(--secondary))] bg-clip-text text-transparent">
                  PORTAL EXEMPLIFY-SEE
                </span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* <Select defaultValue="en">
              <SelectTrigger
                id={`language-${id}`}
                className="cursor-pointer [&>svg]:text-muted-foreground/80 hover:bg-accent hover:text-accent-foreground h-8 border-none px-2 shadow-none [&>svg]:shrink-0"
                aria-label="Select language"
              >
                <GlobeIcon size={16} aria-hidden="true" />
                <SelectValue className="hidden sm:inline-flex" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <UserMenu />
          </div>
        </div>
      </header>
    </div>
  )
}
