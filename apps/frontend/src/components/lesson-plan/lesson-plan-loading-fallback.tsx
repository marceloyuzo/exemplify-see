import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function LessonPlanLoadingFallback() {
  return (
    <div className="w-full h-[calc(100vh-280px)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="space-y-2 text-center">
              <h3 className="font-semibold text-lg">
                Carregando plano de aula
              </h3>
              <p className="text-sm text-muted-foreground">
                Reconstruindo as perguntas e respostas salvas...
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Isso pode levar alguns segundos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
