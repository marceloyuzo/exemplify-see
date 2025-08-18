import { Handle, Position } from '@xyflow/react'
import QuestionDialog from './question-dialog'

interface AddNodeProps {
  data: {
    parentTransitionId: string
  }
}

export default function AddNode({ data }: AddNodeProps) {
  const isInitialQuestion = data.parentTransitionId === 'initial-question'

  return (
    <>
      {!isInitialQuestion && <Handle type="target" position={Position.Top} />}

      <QuestionDialog
        key={'create'}
        parentTransitionId={data.parentTransitionId}
      />
    </>
  )
}
