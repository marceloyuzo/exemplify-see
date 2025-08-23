// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const fixedApproachId = 'ce2fd7bd-a7bb-4438-86c3-98f4dcb0e105'

  console.log('📝 Criando approach...')
  const approach = await prisma.approach.create({
    data: {
      id: fixedApproachId,
      title: 'Exemplify - See',
    },
  })
  console.log('✅ Approach criado:', approach)

  const axisTitles = ['Aula Teórica', 'Atividades', 'Feedback']

  console.log('📊 Criando axes...')
  for (const title of axisTitles) {
    const axis = await prisma.axis.create({
      data: {
        title,
        approachesId: approach.id,
      },
    })
    console.log('✅ Axis criado:', axis)
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
