import { Injectable } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import { Response } from 'express'

@Injectable()
export class PdfService {
  async convertHtmlToPdf(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()

      // Define o conteúdo HTML
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      })

      // Gera o PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
      })

      return Buffer.from(pdfBuffer)
    } finally {
      await browser.close()
    }
  }

  async convertUrlToPdf(url: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle0' })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
      })

      return Buffer.from(pdfBuffer)
    } finally {
      await browser.close()
    }
  }

  sendPdfResponse(res: Response, pdfBuffer: Buffer, filename: string) {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', pdfBuffer.length)
    res.end(pdfBuffer)
  }

  generateReportTemplate(type: string, data: any): any {
    if (type === 'approach') {
      return this.generateApproachTemplate(data);
    }
  }

  generateApproachTemplate(data: any): string {
    const { title, approachId, axes, isPublic } = data;
    
    // Processa cada eixo para pegar os steps da última questão respondida
    const processedAxes = axes.map((axis, axisIndex) => {
      // Pega a última resposta que tem steps
      const lastAnswerWithSteps = axis.answers
        .filter(answer => answer.steps && answer.steps.length > 0)
        .pop();

      return {
        axisNumber: axisIndex + 1,
        axisId: axis.axisId,
        steps: lastAnswerWithSteps ? lastAnswerWithSteps.steps.sort((a, b) => a.order - b.order) : []
      };
    }).filter(axis => axis.steps.length > 0); // Remove eixos sem steps

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.6;
              background: #f8f9fa;
            }
            
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            
            .header h1 {
              margin: 0;
              font-size: 2.2rem;
              font-weight: 300;
              margin-bottom: 10px;
            }
            
            .header .subtitle {
              opacity: 0.9;
              font-size: 1rem;
              margin: 0;
            }
            
            .meta-info {
              background: #f8f9fa;
              padding: 20px 30px;
              border-bottom: 1px solid #dee2e6;
            }
            
            .meta-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            
            .meta-item {
              display: flex;
              align-items: center;
            }
            
            .meta-label {
              font-weight: 600;
              color: #495057;
              margin-right: 10px;
            }
            
            .meta-value {
              color: #6c757d;
              font-family: 'Courier New', monospace;
              font-size: 0.85rem;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 0.8rem;
              font-weight: 600;
              ${isPublic ? 
                'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;'
              }
            }
            
            .content {
              padding: 30px;
            }
            
            .axis-section {
              margin-bottom: 40px;
              border: 1px solid #e9ecef;
              border-radius: 8px;
              overflow: hidden;
            }
            
            .axis-header {
              background: #f8f9fa;
              padding: 20px 25px;
              border-bottom: 1px solid #dee2e6;
            }
            
            .axis-title {
              margin: 0;
              color: #495057;
              font-size: 1.3rem;
              font-weight: 600;
            }
            
            .steps-container {
              padding: 25px;
            }
            
            .step {
              display: flex;
              margin-bottom: 25px;
              align-items: flex-start;
            }
            
            .step:last-child {
              margin-bottom: 0;
            }
            
            .step-number {
              flex-shrink: 0;
              width: 35px;
              height: 35px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 600;
              margin-right: 20px;
              margin-top: 2px;
            }
            
            .step-content {
              flex: 1;
            }
            
            .step-title {
              margin: 0 0 8px 0;
              color: #2c3e50;
              font-size: 1.1rem;
              font-weight: 600;
              line-height: 1.4;
            }
            
            .step-description {
              margin: 0;
              color: #555;
              line-height: 1.6;
              text-align: justify;
            }
            
            .empty-state {
              text-align: center;
              padding: 40px;
              color: #6c757d;
            }
            
            .footer {
              background: #f8f9fa;
              padding: 20px 30px;
              border-top: 1px solid #dee2e6;
              text-align: center;
              color: #6c757d;
              font-size: 0.9rem;
            }
            
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent 0%, #dee2e6 20%, #dee2e6 80%, transparent 100%);
              margin: 30px 0;
            }
            
            @media print {
              .container {
                box-shadow: none;
              }
              .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}</h1>
              <p class="subtitle">Plano de Abordagem Educacional</p>
            </div>
            
            <div class="meta-info">
              <div class="meta-info-grid">
                <div class="meta-item">
                  <span class="meta-label">ID da Abordagem:</span>
                  <span class="meta-value">${approachId}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Status:</span>
                  <span class="status-badge">${isPublic ? 'Público' : 'Privado'}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Data de Geração:</span>
                  <span class="meta-value">${new Date().toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Total de Eixos:</span>
                  <span class="meta-value">${processedAxes.length}</span>
                </div>
              </div>
            </div>
            
            <div class="content">
              ${processedAxes.length > 0 ? processedAxes.map((axis, index) => `
                <div class="axis-section">
                  <div class="axis-header">
                    <h2 class="axis-title">Eixo ${axis.axisNumber}</h2>
                  </div>
                  
                  <div class="steps-container">
                    ${axis.steps.map((step, stepIndex) => `
                      <div class="step">
                        <div class="step-number">${stepIndex + 1}</div>
                        <div class="step-content">
                          <h3 class="step-title">${step.title}</h3>
                          <p class="step-description">${step.description}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                ${index < processedAxes.length - 1 ? '<div class="divider"></div>' : ''}
              `).join('') : `
                <div class="empty-state">
                  <p>Nenhum passo encontrado para exibir neste relatório.</p>
                </div>
              `}
            </div>
            
            <div class="footer">
              <p>Este documento foi gerado automaticamente pelo sistema de abordagens educacionais</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}