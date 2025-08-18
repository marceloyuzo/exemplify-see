'use client'

import { Handle, Position } from '@xyflow/react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import QuestionDialog from './question-dialog'
import { QuestionNodeProps } from '@/app/painel-administrador/abordagens/[abordagemId]/eixos/[eixoId]/page'
import QuestionDeleteDialog from './question-delete-dialog'
import { useState } from 'react'

export default function QuestionNode({ data, id }: QuestionNodeProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)
  const isRoot = !data.parentId

  return (
    <Card className="min-w-80 cursor-default">
      {!isRoot && <Handle type="target" position={Position.Top} />}

      <CardHeader className="text-center">
        <CardTitle className="flex items-center gap-2">{data.title}</CardTitle>
      </CardHeader>

      <CardContent></CardContent>
      <CardFooter className="mx-auto gap-8">
        <QuestionDeleteDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          title={data.title}
          questionId={id}
        />

        <QuestionDialog key={id} questionId={id} />
      </CardFooter>
      <Handle type="source" position={Position.Bottom} />
    </Card>
  )
}
