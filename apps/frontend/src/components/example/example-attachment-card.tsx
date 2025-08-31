import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FileImage, FileVideo, FileAudio, File } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export interface ExampleAttachmentCardProps {
  title: string
  type: string
  url: string
}

function getFileIcon(type: string) {
  if (type.startsWith('image/'))
    return <FileImage className="size-16 text-secondary-foreground" />
  if (type.startsWith('video/'))
    return <FileVideo className="size-16 text-secondary-foreground" />
  if (type.startsWith('audio/'))
    return <FileAudio className="size-16 text-secondary-foreground" />
  if (type === 'application/pdf')
    return <FileText className="size-16 text-secondary-foreground" />
  return <File className="size-16 text-secondary-foreground" />
}

export default function ExampleAttachmentCard({
  title,
  type,
  url,
}: ExampleAttachmentCardProps) {
  return (
    <Card
      className="w-full max-w-[200px] cursor-pointer hover:bg-background hover:scale-[102%] transition-all duration-300"
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      <CardHeader className="flex flex-col items-center gap-4">
        {getFileIcon(type)}
        <CardTitle className="text-center font-medium text-xs">
          <Tooltip>
            <TooltipTrigger className="line-clamp-2">{title}</TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}
