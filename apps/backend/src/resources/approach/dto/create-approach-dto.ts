import { IsNotEmpty, IsString } from 'class-validator'

export class CreateApproachDto {
  @IsString()
  @IsNotEmpty()
  title: string
}
