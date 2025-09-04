import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline'

interface Step {
  title: string
  description?: string
  order: number
}

interface VerticalTimelineProps {
  steps: Step[]
}

export default function VerticalTimeline({ steps }: VerticalTimelineProps) {
  return (
    <Timeline defaultValue={20}>
      {steps.map((step) => (
        <TimelineItem key={step.order} step={step.order}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineTitle className="-mt-0.5 font-bold text-primary">
              {step.title}
            </TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{step.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
