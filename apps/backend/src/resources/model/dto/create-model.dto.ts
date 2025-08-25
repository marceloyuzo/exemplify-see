import { IsNotEmpty, IsString } from 'class-validator'

export class CreateModelDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
