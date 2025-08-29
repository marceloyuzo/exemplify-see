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
    { title: 'Etapas da Abordagem', url: '/etapas-da-abordagem', icon: Frame },
    { title: 'Plano de Aula', url: '/plano-de-aula', icon: Frame },
    {
      title: 'Repositório',
      url: '#',
      icon: Folders,
      items: [
        { title: 'Exemplos', url: '/repositorio/exemplos' },
        { title: 'Planos de Aula', url: '/repositorio/planos-de-aula' },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'Painel Administrador',
            url: '#',
            icon: Settings,
            items: [
              { title: 'Abordagens', url: '/painel-administrador/abordagens' },
              { title: 'Disciplina', url: '/painel-administrador/disciplinas' },
              { title: 'Exemplos', url: '/painel-administrador/exemplos' },
              { title: 'Modelo', url: '/painel-administrador/modelos' },
              { title: 'Tema', url: '/painel-administrador/temas' },
              { title: 'Usuários', url: '/painel-administrador/usuarios' },
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
