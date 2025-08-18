'use client'

import { Folders, Frame, HomeIcon, Settings } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavMenu } from './nav-menu'
import { useUser } from '@/hooks/use-user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin } = useUser()
  const { setOpen } = useSidebar()

  const menuData = [
    { title: 'Início', url: '/', icon: HomeIcon },
    { title: 'Plano de Aula', url: '/plano-de-aula', icon: Frame },
    {
      title: 'Repositório',
      url: '#',
      icon: Folders,
      items: [
        { title: 'Exemplos', url: '#' },
        { title: 'Planos de Aula', url: '#' },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'Painel Administrador',
            url: '#',
            icon: Settings,
            items: [
              { title: 'Usuários', url: '/painel-administrador/usuarios' },
              { title: 'Abordagens', url: '/painel-administrador/abordagens' },
              { title: 'Exemplos', url: '/painel-administrador/exemplos' },
            ],
          },
        ]
      : []),
  ]

  return (
    <Sidebar
      className="top-16"
      collapsible="icon"
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      <SidebarContent>
        <NavMenu items={menuData} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
