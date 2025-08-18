import { IsNotEmpty, IsString } from 'class-validator'

export class EditApproachDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
