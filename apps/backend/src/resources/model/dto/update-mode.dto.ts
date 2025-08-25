import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateModelDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
