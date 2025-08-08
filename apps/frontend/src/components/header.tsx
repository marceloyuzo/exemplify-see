'use client'

import { Dispatch, SetStateAction, useId } from 'react'
import { GlobeIcon, PanelLeft } from 'lucide-react'

import Logo from '@/components/logo'
import UserMenu from '@/components/user-menu'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ThemeToggle from '../theme/theme-toggle'
import { navigationLinks } from './sidebar'
import { useRouter } from 'next/navigation'

const languages = [
  { value: 'pt-BR', label: 'Pt-BR' },
  { value: 'en', label: 'En' },
]

interface HeaderProps {
  expanded: boolean
  setExpanded: Dispatch<SetStateAction<boolean>>
}

export default function Header({ expanded, setExpanded }: HeaderProps) {
  const id = useId()
  const router = useRouter()

  return (
    <div className="absolute top-0 left-0 w-full">
      <header className="bg-muted border-b px-4 md:pr-6 md:pl-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="group size-8 md:hidden"
                  variant="ghost"
                  size="icon"
                >
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-36 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, index) => {
                      const Icon = link.icon
                      return (
                        <NavigationMenuItem key={index} className="w-full">
                          <NavigationMenuLink
                            href={link.href}
                            className="flex-row items-center gap-2 py-1.5"
                            active={link.active}
                          >
                            <Icon
                              size={16}
                              className="text-muted-foreground"
                              aria-hidden="true"
                            />
                            <span>{link.label}</span>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      )
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>

            {/* Logo e botão de expandir menu */}
            <div className="flex items-center gap-10">
              <div
                className="hover:bg-popover p-3 rounded-md cursor-pointer transition-colors duration-200 hidden md:flex"
                onClick={() => setExpanded(!expanded)}
              >
                <PanelLeft size={18} />
              </div>
              <a
                className="cursor-pointer text-primary flex gap-2 items-center hover:text-primary/90"
                onClick={() => router.push('/')}
              >
                <Logo />
                <span className="font-semibold tracking-wide">
                  PORTAL EXEMPLIFY-SEE
                </span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Select defaultValue="en">
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
            </Select>
            <UserMenu />
          </div>
        </div>
      </header>
    </div>
  )
}
