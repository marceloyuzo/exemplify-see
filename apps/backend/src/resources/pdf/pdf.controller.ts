// pdf.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common'
import { PdfService } from './pdf.service'
import type { Response } from 'express'
import { ExtractPlanDataDto } from './generate-pdf.dto'

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate')
  generatePdf(@Body() { payload }: ExtractPlanDataDto, @Res() res: Response) {
    return this.pdfService.generatePdf(payload, res)
  }
}
