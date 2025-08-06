import { Compass, Folders, GraduationCap, HomeIcon } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

// Links de navegação
export const navigationLinks = [
  { href: '#', label: 'Home', icon: HomeIcon, active: true },
  { href: '#', label: 'Plano de Aula', icon: Compass },
  { href: '#', label: 'Ensino da Teoria', icon: GraduationCap },
  { href: '#', label: 'Repositório', icon: Folders },
]

interface SidebarProps {
  expanded: boolean
}

export default function Sidebar({ expanded }: SidebarProps) {
  return (
    <nav
      className={`hidden md:absolute md:mt-16 md:flex md:flex-col md:bg-muted md:border-r md:p-4 md:h-[calc(100vh-64px)] md:transition-all md:duration-200 ${
        expanded ? 'md:w-56' : 'md:w-[74px]'
      }`}
    >
      <NavigationMenu className="flex w-full">
        <NavigationMenuList className="flex flex-col gap-4 w-full">
          {navigationLinks.map((link) => (
            <NavigationMenuItem key={link.label} className="w-full flex-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavigationMenuLink
                    href={link.href}
                    className={`w-full flex flex-row items-center gap-2 p-3 rounded-md transition-colors`}
                  >
                    <link.icon size={20} />
                    {expanded && <span>{link.label}</span>}
                  </NavigationMenuLink>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className={`px-3 py-1 text-xs ${expanded ? 'hidden' : 'block'}  `}
                >
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}
