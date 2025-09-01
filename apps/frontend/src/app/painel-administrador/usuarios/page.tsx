import UsersTable from '@/client/users-table'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando usuários...</div>}>
      <UsersTable />
    </Suspense>
  )
}
