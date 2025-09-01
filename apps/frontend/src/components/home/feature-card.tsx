import { ReactNode } from 'react'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
}

export default function FeatureCard({
  description,
  title,
  icon,
}: FeatureCardProps) {
  return (
    <div className="w-full max-w-80 bg-card rounded-xl border p-6 flex flex-col items-center text-center h-full min-h-80 max-h-80">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight text-balance bg-[linear-gradient(to_right,var(--primary),var(--secondary))] bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
