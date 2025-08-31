import { IsString, IsOptional } from 'class-validator'

export class CreateAttachmentDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  customPath?: string
}
