import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsBoolean,
  IsEnum,
} from 'class-validator'
import { Type } from 'class-transformer'

export enum Complexity {
  beginner = 'beginner',
  intermediate = 'intermediate',
}

export enum Example {
  correct = 'correct',
  erroneous = 'erroneous',
  both = 'both',
}

export enum ModalityType {
  inPerson = 'inPerson',
  hybrid = 'hybrid',
  remote = 'remote',
}

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
  subjectId: string

  @IsUUID()
  @IsOptional()
  topicId?: string

  @IsEnum(Complexity)
  @IsOptional()
  complexity?: Complexity

  @IsEnum(ModalityType)
  @IsNotEmpty()
  modality: ModalityType

  @IsString()
  @IsNotEmpty()
  workload: string

  @IsString()
  @IsNotEmpty()
  year: string

  @IsArray()
  @IsString({ each: true })
  contents: string[]

  @IsArray()
  @IsString({ each: true })
  materials: string[]

  @IsString()
  @IsOptional()
  priorKnowledge?: string

  @IsEnum(Example)
  @IsOptional()
  example?: Example

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean

  @IsUUID()
  @IsNotEmpty()
  approachId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonPlanAxisDto)
  axes: LessonPlanAxisDto[]
}
