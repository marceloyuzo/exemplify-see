import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class RateExampleDTO {
  @IsNumber()
  @Min(1, { message: 'O rate deve ser no mínimo 1' })
  @Max(10, { message: 'O rate deve ser no máximo 10' })
  rate: number

  @IsString()
  @IsOptional()
  comment?: string
}
