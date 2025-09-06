'use client'

import {
  AlertCircleIcon,
  FileArchiveIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileUpIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react'
import { forwardRef, useRef } from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'

import {
  formatBytes,
  useFileUpload,
  FileWithPreview,
} from '@/hooks/use-file-upload'
import { Button } from '@/components/ui/button'

// Create some dummy initial files
const initialFiles = [
  {
    name: 'document.pdf',
    size: 528737,
    type: 'application/pdf',
    url: 'https://example.com/document.pdf',
    id: 'document.pdf-1744638436563-8u5xuls',
  },
  {
    name: 'intro.zip',
    size: 252873,
    type: 'application/zip',
    url: 'https://example.com/intro.zip',
    id: 'intro.zip-1744638436563-8u5xuls',
  },
  {
    name: 'conclusion.xlsx',
    size: 352873,
    type: 'application/xlsx',
    url: 'https://example.com/conclusion.xlsx',
    id: 'conclusion.xlsx-1744638436563-8u5xuls',
  },
]

const getFileIcon = (file: { file: File | { type: string; name: string } }) => {
  const fileType = file.file instanceof File ? file.file.type : file.file.type
  const fileName = file.file instanceof File ? file.file.name : file.file.name

  if (
    fileType.includes('pdf') ||
    fileName.endsWith('.pdf') ||
    fileType.includes('word') ||
    fileName.endsWith('.doc') ||
    fileName.endsWith('.docx')
  ) {
    return <FileTextIcon className="size-4 opacity-60" />
  } else if (
    fileType.includes('zip') ||
    fileType.includes('archive') ||
    fileName.endsWith('.zip') ||
    fileName.endsWith('.rar')
  ) {
    return <FileArchiveIcon className="size-4 opacity-60" />
  } else if (
    fileType.includes('excel') ||
    fileName.endsWith('.xls') ||
    fileName.endsWith('.xlsx')
  ) {
    return <FileSpreadsheetIcon className="size-4 opacity-60" />
  } else if (fileType.includes('video/')) {
    return <VideoIcon className="size-4 opacity-60" />
  } else if (fileType.includes('audio/')) {
    return <HeadphonesIcon className="size-4 opacity-60" />
  } else if (fileType.startsWith('image/')) {
    return <ImageIcon className="size-4 opacity-60" />
  }
  return <FileIcon className="size-4 opacity-60" />
}

export interface FileUploaderInputProps {
  value?: FileWithPreview[]
  onChange?: (files: FileWithPreview[]) => void
  error?: FieldError
  maxSize?: number
  maxFiles?: number
  accept?: string
  multiple?: boolean
  className?: string
  disabled?: boolean
}

// Componente base do FileUploader
const FileUploaderInputBase = forwardRef<
  HTMLInputElement,
  FileUploaderInputProps
>(
  (
    {
      value = [],
      onChange,
      error,
      maxSize = 100 * 1024 * 1024, // 100MB default
      maxFiles = 10,
      accept = '*',
      multiple = true,
      className,
      disabled = false,
    },
    ref,
  ) => {
    const internalInputRef = useRef<HTMLInputElement>(null)
    const inputRef =
      (ref as React.RefObject<HTMLInputElement>) || internalInputRef

    // Determinar se estamos em modo controlado (com value e onChange)
    const isControlled = onChange !== undefined

    const [
      { files, isDragging, errors },
      {
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        removeFile,
        clearFiles,
        addFiles,
      },
    ] = useFileUpload({
      multiple,
      maxFiles,
      maxSize,
      accept,
      initialFiles: [],
    })

    // Usar value do React Hook Form se fornecido (modo controlado),
    // caso contrário usar o estado interno (modo não controlado)
    const displayFiles = isControlled ? value : files

    const handleRemoveFile = (id: string) => {
      if (isControlled) {
        // Modo controlado (React Hook Form)
        const updatedFiles = value.filter((file) => file.id !== id)
        onChange(updatedFiles)
      } else {
        // Modo não controlado (estado interno)
        removeFile(id)
      }
    }

    const handleClearFiles = () => {
      if (isControlled) {
        onChange([])
      } else {
        clearFiles()
      }
    }

    const handleFileDialogOpen = () => {
      if (!disabled && inputRef.current) {
        inputRef.current.click()
      }
    }

    const createFileWithPreview = (file: File): FileWithPreview => ({
      file,
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      preview: file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : undefined,
    })

    const handleFilesAdded = (newFiles: FileList | File[]) => {
      const filesArray = Array.from(newFiles)

      if (isControlled) {
        // Modo controlado - criar FileWithPreview e chamar onChange
        const newFilesPreviews = filesArray.map(createFileWithPreview)
        const updatedFiles = multiple
          ? [...value, ...newFilesPreviews]
          : newFilesPreviews
        onChange(updatedFiles)
      } else {
        // Modo não controlado - usar o hook
        addFiles(newFiles)
      }
    }

    const handleDropFiles = (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (
        disabled ||
        !e.dataTransfer.files ||
        e.dataTransfer.files.length === 0
      ) {
        return
      }

      handleFilesAdded(e.dataTransfer.files)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFilesAdded(e.target.files)
        // Limpar o input
        e.target.value = ''
      }
    }

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {/* Drop area */}
        <div
          role="button"
          onClick={handleFileDialogOpen}
          onDragEnter={disabled ? undefined : handleDragEnter}
          onDragLeave={disabled ? undefined : handleDragLeave}
          onDragOver={disabled ? undefined : handleDragOver}
          onDrop={handleDropFiles}
          data-dragging={isDragging || undefined}
          data-disabled={disabled || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 cursor-pointer"
        >
          <input
            type="file"
            className="sr-only"
            aria-label="Upload files"
            disabled={disabled}
            ref={inputRef}
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <FileUpIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Upload de arquivo</p>
            <p className="text-muted-foreground mb-2 text-xs">
              Arraste os arquivos ou clique para procurar
            </p>
            <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
              <span>Todos os arquivos</span>
              <span>∙</span>
              <span>Máx. {maxFiles} arquivos</span>
              <span>∙</span>
              <span>Até {formatBytes(maxSize)}</span>
            </div>
          </div>
        </div>

        {/* Display errors from React Hook Form or internal validation */}
        {(error?.message || errors.length > 0) && (
          <div
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{error?.message || errors[0]}</span>
          </div>
        )}

        {/* File list */}
        {displayFiles.length > 0 && (
          <div className="space-y-2">
            {displayFiles.map((file) => (
              <div
                key={file.id}
                className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate text-[13px] font-medium">
                      {file.file instanceof File
                        ? file.file.name
                        : file.file.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatBytes(
                        file.file instanceof File
                          ? file.file.size
                          : file.file.size,
                      )}
                    </p>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                  onClick={() => handleRemoveFile(file.id)}
                  aria-label="Remove file"
                  disabled={disabled}
                  type="button"
                >
                  <XIcon className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))}

            {/* Remove all files button */}
            {displayFiles.length > 1 && (
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearFiles}
                  disabled={disabled}
                  type="button"
                >
                  Remover todos
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  },
)

FileUploaderInputBase.displayName = 'FileUploaderInputBase'

// Wrapper para usar com Controller do React Hook Form
export interface FileUploaderControllerProps {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  maxSize?: number
  maxFiles?: number
  accept?: string
  multiple?: boolean
  className?: string
  disabled?: boolean
  label?: string
}

export function FileUploaderController({
  name,
  control,
  label,
  ...props
}: FileUploaderControllerProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          {label && (
            <label className="scroll-m-20 text-xl font-semibold tracking-tight">
              {label}
            </label>
          )}
          <FileUploaderInputBase
            {...props}
            value={field.value || []}
            onChange={field.onChange}
            error={fieldState.error}
          />
        </div>
      )}
    />
  )
}

// Componente padrão (para compatibilidade com código existente)
export default function FileUploaderInput(
  props: Omit<FileUploaderInputProps, 'value' | 'onChange'>,
) {
  const maxSize = 100 * 1024 * 1024 // 100MB default
  const maxFiles = 10

  const [{ files }] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    initialFiles,
  })

  return (
    <FileUploaderInputBase
      value={files}
      maxSize={maxSize}
      maxFiles={maxFiles}
      multiple={true}
      {...props}
    />
  )
}

// Exportar ambos os componentes
export { FileUploaderInputBase }
