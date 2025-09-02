import { api } from '@/lib/axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generatePdf(payload: any) {
  const response = await api.post(
    '/pdf/generate',
    { payload },
    {
      responseType: 'blob',
      headers: {
        Accept: 'application/pdf',
      },
    },
  )

  const pdfBlob = new Blob([response.data], { type: 'application/pdf' })

  const pdfUrl = window.URL.createObjectURL(pdfBlob)

  const downloadLink = document.createElement('a')
  downloadLink.href = pdfUrl
  downloadLink.download = `plano-de-aula-${new Date().toISOString().split('T')[0]}.pdf`

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)

  window.URL.revokeObjectURL(pdfUrl)

  return response
}
