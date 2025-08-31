import { ChevronDownIcon } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

type CollapsibleItem = {
  title: string
  content?: string
  open?: boolean
  items?: CollapsibleItem[]
}

export type AccordionItemData = {
  id: string
  title: string
  content?: string
  collapsibles: CollapsibleItem[]
}

interface AccordionMultiLevelProps {
  items: AccordionItemData[]
}

export default function AccordionMultiLevel({
  items,
}: AccordionMultiLevelProps) {
  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full -space-y-px">
        {items.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative border outline-none first:rounded-t-md last:rounded-b-md last:border-b has-focus-visible:z-10 has-focus-visible:ring-[3px]"
          >
            <AccordionTrigger className="rounded-md px-4 py-3 text-[15px] leading-6 outline-none hover:no-underline focus-visible:ring-0">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="p-0 ">
              {item.collapsibles.map((collapsible, index) => (
                <CollapsibleDemo
                  key={index}
                  title={collapsible.title}
                  items={collapsible.items}
                  open={collapsible.open}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function CollapsibleDemo({ title, items, open }: CollapsibleItem) {
  const hasItems = Boolean(items && items.length > 0)

  if (!hasItems) {
    // só título estático
    return (
      <div className="bg-card border-t px-4 py-3 text-[15px] leading-6 font-semibold">
        {title}
      </div>
    )
  }

  return (
    <Collapsible className="bg-card border-t px-4 py-3" defaultOpen={open}>
      <CollapsibleTrigger className="flex gap-2 text-[15px] leading-6 font-semibold [&[data-state=open]>svg]:rotate-180">
        <ChevronDownIcon
          size={16}
          className="mt-1 shrink-0 opacity-60 transition-transform duration-200"
          aria-hidden="true"
        />
        {title}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 overflow-hidden ps-6 text-sm transition-all">
        <div className="space-y-2">
          {items?.map((child, idx) => (
            <CollapsibleDemo key={idx} {...child} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
