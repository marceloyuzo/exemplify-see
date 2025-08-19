import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'

export class LessonPlanStepDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNotEmpty()
  order: number
}

export class LessonPlanAnswerDto {
  @IsUUID()
  @IsNotEmpty()
  questionId: string

  @IsUUID()
  @IsNotEmpty()
  answerId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonPlanStepDto)
  steps: LessonPlanStepDto[]
}

export class LessonPlanAxisDto {
  @IsUUID()
  @IsNotEmpty()
  axisId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonPlanAnswerDto)
  answers: LessonPlanAnswerDto[]
}

export class CreateLessonPlanDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsUUID()
  @IsNotEmpty()
  approachId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonPlanAxisDto)
  axes: LessonPlanAxisDto[]
}
