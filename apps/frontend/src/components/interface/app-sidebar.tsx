'use client'

import * as React from 'react'
import { Bot, Frame, SquareTerminal } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar'
import { NavMenu } from './nav-menu'
import { useUser } from '@/hooks/use-user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isAdmin } = useUser()

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
    <Sidebar className="top-16" collapsible="icon" {...props}>
      <SidebarContent>
        <NavMenu items={menuData} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
