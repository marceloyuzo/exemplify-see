import { Type } from 'class-transformer'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

class StepDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @IsNotEmpty()
  order: number
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  axisId: string

  @IsString()
  @IsOptional()
  parentTransitionId: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  optionA: string

  @IsString()
  @IsNotEmpty()
  optionB: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  stepsA: StepDto[] = []

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  stepsB: StepDto[] = []
}
