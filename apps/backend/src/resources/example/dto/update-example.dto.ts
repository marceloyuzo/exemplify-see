import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { Example } from 'src/resources/lesson-plan/dto/create-lesson-plan.dto'

export class UpdateExampleDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  topicId?: string

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }) => {
    if (!value) return []
    if (typeof value === 'string') return [value]
    return Array.isArray(value) ? value : []
  })
  modelsId?: string[]

  @IsOptional()
  @IsEnum(Example)
  exampleType?: Example

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  })
  references?: string[]

  // IDs dos attachments a serem removidos
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  })
  removeAttachmentIds?: string[]
}
