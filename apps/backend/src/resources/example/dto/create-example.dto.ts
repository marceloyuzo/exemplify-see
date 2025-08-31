import { IsArray, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { Transform, Type } from 'class-transformer'
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

  @IsArray()
  @IsUUID(4, { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value]
    }
    return Array.isArray(value) ? value : []
  })
  modelsId: string[]

  @IsEnum(Example)
  exampleType: Example

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  references: string[]
}
