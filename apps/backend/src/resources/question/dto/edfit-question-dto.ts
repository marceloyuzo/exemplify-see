import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator'
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
  title: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDTO)
  stepsA: StepDTO[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDTO)
  stepsB: StepDTO[]
}
