import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { useRouter } from 'next/navigation'
import React from 'react'

interface BreadcrumbItemType {
  label: string
  href?: string
  icon?: React.ReactNode
  isCurrent?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItemType[]
}

export function Breadcrumbs({ items }: BreadcrumbProps) {
  const router = useRouter()

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-background rounded-md border px-3 py-2 shadow-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={item.label}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => router.push(item.href || '#')}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {item.icon && (
                      <span className="mr-1 inline-block">{item.icon}</span>
                    )}
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
