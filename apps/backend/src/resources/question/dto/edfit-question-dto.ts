import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'

class StepDTO {
  @IsString()
  id: string

  @IsString()
  title: string

  @IsString()
  description: string

  @IsNumber()
  order: number
}

export class EditQuestionDTO {
  @IsString()
  optionIdA: string

  @IsString()
  optionIdB: string

  @IsString()
  optionValueA: string

  @IsString()
  optionValueB: string

  @IsString()
  @IsOptional()
  optionIdC?: string

  @IsString()
  @IsOptional()
  optionValueC?: string

  @IsString()
  title: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDTO)
  stepsA: StepDTO[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDTO)
  stepsB: StepDTO[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDTO)
  @IsOptional()
  stepsC?: StepDTO[]
}
