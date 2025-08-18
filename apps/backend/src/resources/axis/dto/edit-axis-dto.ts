import { IsNotEmpty, IsString } from 'class-validator'

export class EditAxisDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
