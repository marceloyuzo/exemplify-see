import { useState } from 'react'
import AccordionMultiLevel, {
  AccordionItemData,
} from '../ui/accordion-multi-level'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'

interface ApproachStepsItemProps {
  label: string
  items: AccordionItemData[]
}

export default function ApproachStepsItem({
  label,
  items,
}: ApproachStepsItemProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [description, setDescription] = useState<string>('')

  return (
    <>
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant={'outline'}
            className="bg-card text-2xl p-8 w-fit min-w-3xs cursor-default"
          >
            {label}
          </Button>
        </HoverCardTrigger>

        <HoverCardContent
          side="top"
          className="bg-card min-w-sm flex flex-col gap-4 max-h-[450px] overflow-y-auto"
        >
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">
            {label}
          </h4>

          <div>
            <AccordionMultiLevel items={items} />
          </div>

          <div>
            <Button
              variant={'outline'}
              size={'lg'}
              className="w-full"
              onClick={() => setOpen(true)}
            >
              Mais informações
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!w-[1200px] !max-w-[1200px] max-h-[90vh] h-[800px] overflow-y-auto">
          <div className="flex gap-6">
            {/* Sidebar Accordion */}
            <div className="w-1/3 max-h-[80vh] overflow-y-auto">
              <AccordionMultiLevel
                items={items}
                setDescription={setDescription}
              />
            </div>

            {/* Main Content */}
            <div className="w-2/3">
              <DialogHeader>
                <DialogTitle className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  {label}
                </DialogTitle>
              </DialogHeader>

              <p className="whitespace-break-spaces mt-4">{description}</p>
            </div>
          </div>

          <DialogFooter className="mt-auto">
            <DialogClose asChild>
              <Button variant="outline" size={'lg'}>
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
