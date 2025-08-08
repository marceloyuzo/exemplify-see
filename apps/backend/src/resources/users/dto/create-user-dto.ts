import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firebaseUid: string

  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  photoURL?: string
}
