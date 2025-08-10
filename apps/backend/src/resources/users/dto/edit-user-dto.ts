import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsIn,
} from 'class-validator'

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: 'user' | 'admin'
}
