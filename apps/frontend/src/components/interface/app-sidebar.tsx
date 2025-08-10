'use client'

import * as React from 'react'
import { Bot, Frame, SquareTerminal } from 'lucide-react'
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
    { title: 'Início', url: '/', icon: Frame },
    { title: 'Plano de Aula', url: '#', icon: Frame },
    {
      title: 'Repositório',
      url: '#',
      icon: SquareTerminal,
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
            icon: Bot,
            items: [
              { title: 'Usuários', url: '/painel-administrador/usuarios' },
              { title: 'Abordagens', url: '#' },
              { title: 'Exemplos', url: '#' },
            ],
          },
        ]
      : []),
  ]

  return (
    <Sidebar
      className="top-16"
      collapsible="icon"
      {...props}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarContent>
        <NavMenu items={menuData} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
