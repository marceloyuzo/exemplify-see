import { useQuery } from '@tanstack/react-query'
import { DataTablePagination } from '../table/pagination'
import ExampleRatingItem from './example-rating-item'
import { findRatings } from '@/api/rating/find-ratings'
import { useParams, useSearchParams } from 'next/navigation'
import { useSingleParam } from '@/utils/single-param'

export default function ExampleRatingList() {
  const params = useParams()
  const exampleId = useSingleParam(params.exemploId)
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('perPage')) || 10

  const {
    data: ratingList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ratings', exampleId, page, perPage],
    queryFn: () =>
      findRatings({
        exampleId,
        page,
        perPage,
      }),
  })

  if (isLoading) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Carregando avaliações...
      </p>
    )
  }

  if (isError) {
    return (
      <p className="text-center text-sm text-red-500">
        Ocorreu um erro ao carregar as avaliações: {(error as Error).message}
      </p>
    )
  }

  if (!ratingList || ratingList.data.length === 0) {
    return (
      <p className="text-center text-lg text-muted-foreground mt-4">
        Nenhuma avaliação registrada.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {ratingList.data.map((rating) => (
        <ExampleRatingItem
          key={rating.id}
          ratingId={rating.id}
          rate={rating.rate}
          user={rating.user}
          comment={rating.comment}
          createdAt={rating.createdAt}
        />
      ))}

      <DataTablePagination
        currentPage={ratingList.meta.page}
        totalPages={ratingList.meta.totalPages}
        perPage={perPage}
      />
    </div>
  )
}
