// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const fixedApproachId = 'ce2fd7bd-a7bb-4438-86c3-98f4dcb0e105' // UUID fixo

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

  console.log('Seed concluído ✅')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
