import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { Example } from 'src/resources/lesson-plan/dto/create-lesson-plan.dto'

export class ReferenceDto {
  @IsString()
  value: string
}

export class CreateExampleDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  topicId: string

  @IsArray()
  modelsId: string[]

  @IsEnum(Example)
  exampleType: Example

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceDto)
  references: ReferenceDto[]
}
