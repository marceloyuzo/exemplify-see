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
import AccordionMultiLevelDetailed from '../ui/accordion-multi-level-detailed'

interface ApproachStepsItemProps {
  label: string
  items: AccordionItemData[]
}

export default function ApproachStepsItem({
  label,
  items,
}: ApproachStepsItemProps) {
  const [open, setOpen] = useState<boolean>(false)

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
            {/* Main Content */}
            <div className="w-full">
              <DialogHeader>
                <DialogTitle className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  {label}
                </DialogTitle>
              </DialogHeader>

              <AccordionMultiLevelDetailed items={items} />
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
