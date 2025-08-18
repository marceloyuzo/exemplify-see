import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAxisDto {
  @IsString()
  @IsNotEmpty()
  approachId: string

  @IsString()
  @IsNotEmpty()
  title: string
}
