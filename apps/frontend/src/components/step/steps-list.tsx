import { Dispatch, SetStateAction, useState } from 'react'
import { Label } from '../ui/label'
import { Trash2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import StepDialog from './step-dialog'
import { Step } from '../question/question-dialog'

interface StepsListProps {
  steps: Step[]
  setSteps: Dispatch<SetStateAction<Step[]>>
}

export default function StepsList({ setSteps, steps }: StepsListProps) {
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)

  function handleDeleteStep(stepId: string) {
    setSteps((prev) =>
      prev
        .filter((step) => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index })),
    )
  }

  return (
    <>
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex items-center justify-between"
          onClick={() => setSelectedStep(step)}
        >
          <div className="w-full overflow-hidden">
            <Label>{step.title}</Label>
            <p className="line-clamp-3 break-words text-sm font-thin">
              {step.description}
            </p>
          </div>

          <Button
            variant={'link'}
            className="text-secondary-foreground cursor-pointer hover:text-red-500"
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteStep(step.id)
            }}
          >
            <Trash2Icon size={18} />
          </Button>
        </div>
      ))}
      <StepDialog
        step={selectedStep}
        steps={steps}
        setSteps={setSteps}
        open={!!selectedStep}
        setOpen={(isOpen) => !isOpen && setSelectedStep(null)}
      />
    </>
  )
}
