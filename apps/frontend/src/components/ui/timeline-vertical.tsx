import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline'
import ReactMarkdown from 'react-markdown'

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
          <TimelineContent className="break-words">
            <ReactMarkdown
              components={{
                a: ({ ...props }) => (
                  <a
                    {...props}
                    className="font-semibold text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  />
                ),
              }}
            >
              {step.description}
            </ReactMarkdown>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
