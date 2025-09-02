import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsNumber,
  IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'

enum Complexity {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
}

enum Modality {
  IN_PERSON = 'inPerson',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
}

enum ExampleType {
  CORRECT = 'correct',
  ERRONEOUS = 'erroneous',
  BOTH = 'both',
}

class StepDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  order: number
}

class AnswerDto {
  @IsUUID()
  questionId: string

  @IsUUID()
  answerId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StepDto)
  steps: StepDto[]
}

class AxisDto {
  @IsUUID()
  axisId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[]
}

export class LessonPlanDto {
  @IsUUID()
  lessonPlanId: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsUUID()
  subjectId: string

  @IsUUID()
  topicId: string

  @IsOptional()
  @IsEnum(Complexity)
  complexity?: Complexity

  @IsString()
  @IsNotEmpty()
  year: string

  @IsString()
  @IsNotEmpty()
  workload: string

  @IsOptional()
  @IsEnum(Modality)
  modality?: Modality

  @IsArray()
  @IsString({ each: true })
  contents: string[]

  @IsArray()
  @IsString({ each: true })
  materials: string[]

  @IsOptional()
  @IsString()
  priorKnowledge?: string

  @IsOptional()
  @IsEnum(ExampleType)
  example?: ExampleType

  @IsBoolean()
  isPublic: boolean

  @IsUUID()
  approachId: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AxisDto)
  axes: AxisDto[]
}

export class ExtractPlanDataDto {
  @ValidateNested()
  @Type(() => LessonPlanDto)
  payload: LessonPlanDto
}
