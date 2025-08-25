// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const fixedApproachId = 'ce2fd7bd-a7bb-4438-86c3-98f4dcb0e105'

  const approach = await prisma.approach.create({
    data: {
      id: fixedApproachId,
      title: 'Exemplify - See',
    },
  })

  const axisTitles = ['Aula Teórica', 'Atividades', 'Feedback']

  for (const title of axisTitles) {
    await prisma.axis.create({
      data: {
        title,
        approachesId: approach.id,
      },
    })
  }

  const topicTitles = [
    'Requisitos de Software',
    'Desenho de Software',
    'Construção de Software',
    'Testes de Software',
    'Manutenção de Software',
    'Gestão de Configuração de Software',
    'Gestão de Engenharia de Software',
    'Processos de Engenharia de Software',
    'Ferramentas e Métodos',
    'Qualidade de Software',
    'Prática Profissional de Engenharia de Software',
    'Economia na Engenharia de Software',
    'Fundamentos de Computação',
    'Fundamentos de Matemática',
    'Fundamentos de Engenharia',
  ]

  for (const title of topicTitles) {
    await prisma.topic.create({
      data: { title },
    })
  }

  console.log('🎉 Seed concluído!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('🔌 Desconectado do banco')
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
