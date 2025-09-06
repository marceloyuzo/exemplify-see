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

export class CreateExampleDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsUUID()
  @IsNotEmpty()
  topicId: string

  @IsOptional()
  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }) => {
    if (!value) return []
    if (typeof value === 'string') return [value]
    return Array.isArray(value) ? value : []
  })
  modelsId?: string[]

  @IsEnum(Example)
  exampleType: Example

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  })
  references?: string[]
}
