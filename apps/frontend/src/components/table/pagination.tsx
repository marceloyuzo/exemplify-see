// components/ui/data-table-pagination.tsx
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { useId, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface DataTablePaginationUrlProps {
  currentPage: number
  totalPages: number
  perPage: number
  pageSizeOptions?: number[]
}

export function DataTablePagination(props: DataTablePaginationUrlProps) {
  const {
    currentPage,
    totalPages,
    perPage,
    pageSizeOptions = [5, 10, 25, 50],
  } = props

  const id = useId()
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateURL = useCallback(
    (params: Record<string, string | number>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(params).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })

      router.push(`?${current.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage })
  }

  const handlePerPageChange = (newPerPage: string) => {
    updateURL({ perPage: newPerPage, page: 1 })
  }

  const handleFirstPage = () => {
    handlePageChange(1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handleLastPage = () => {
    handlePageChange(totalPages)
  }

  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-3">
        <Label htmlFor={id} className="max-sm:sr-only">
          Linhas por página
        </Label>
        <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
          <SelectTrigger id={id} className="w-fit whitespace-nowrap">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
        <p
          className="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span className="text-foreground">{currentPage}</span> de{' '}
          <span className="text-foreground">{totalPages}</span>
        </p>
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                aria-label="Ir para primeira página"
                disabled={currentPage <= 1}
                onClick={handleFirstPage}
              >
                <ChevronFirstIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                aria-label="Ir para página anterior"
                disabled={currentPage <= 1}
                onClick={handlePreviousPage}
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                aria-label="Ir para próxima página"
                disabled={currentPage >= totalPages}
                onClick={handleNextPage}
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                className="disabled:pointer-events-none disabled:opacity-50"
                aria-label="Ir para última página"
                disabled={currentPage >= totalPages}
                onClick={handleLastPage}
              >
                <ChevronLastIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
