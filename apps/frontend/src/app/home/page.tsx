'use client'

import About from '@/components/home/about'
import FeatureCard from '@/components/home/feature-card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { Brain, ClipboardList, Database, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const user = useUser()
  const router = useRouter()

  function handleStart() {
    if (user) {
      router.push('/plano-de-aula')
    } else {
      router.push('/login')
    }
  }

  const smoothScrollTo = (targetY: number, duration = 600) => {
    const startY = window.pageYOffset
    const difference = targetY - startY
    const startTime = performance.now()

    function step() {
      const progress = Math.min((performance.now() - startTime) / duration, 1)
      const ease = 0.5 * (1 - Math.cos(progress * Math.PI))
      window.scrollTo(0, startY + difference * ease)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  const handleAbout = () => {
    const section = document.getElementById('sobre')
    if (section) {
      smoothScrollTo(section.offsetTop - 80, 800)
    }
  }
  return (
    <>
      <section className="flex w-full min-h-[calc(100vh-160px)]">
        <div className="flex-1 flex flex-col justify-center items-center gap-4 bg-card rounded-lg border">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance bg-[linear-gradient(to_right,var(--primary),var(--secondary))] bg-clip-text text-transparent">
            Portal Exemplify-SEE
          </h1>

          <p className="max-w-3xl text-center text-lg">
            Facilitando o ensino de Engenharia de Software com a Aprendizagem
            Baseada em Exemplos: um portal feito para apoiar e inspirar
            professores.
          </p>

          <div className="mt-4 flex gap-6">
            <Button
              variant={'outline'}
              className="cursor-pointer rounded-2xl"
              size={'lg'}
              onClick={() => handleAbout()}
            >
              Saber mais
            </Button>

            <Button
              className="cursor-pointer rounded-2xl px-6 bg-[linear-gradient(to_right,var(--primary),var(--secondary))]"
              size={'lg'}
              onClick={() => handleStart()}
            >
              Começar
            </Button>
          </div>
        </div>
      </section>
      <section className="min-h-[75vh] flex justify-center items-center  gap-8 py-16 px-4">
        <FeatureCard
          title="Planejamento de Aulas Simplificado"
          description="Estruture suas aulas passo a passo, incorporando a metodologia de Aprendizagem Baseada em Exemplos de forma intuitiva."
          icon={<ClipboardList size={42} className="text-secondary" />}
        />
        <FeatureCard
          title="Explore um Banco de Exemplos"
          description="Acesse uma biblioteca crescente de exemplos, incluindo casos corretos e com erros propositais (errôneos) para estimular o debate."
          icon={<Database size={42} className="text-secondary" />}
        />
        <FeatureCard
          title="Comunidade e Colaboração"
          description="Faça parte de uma comunidade de educadores. Compartilhe planos de aula e descubra materiais criados por outros professores."
          icon={<Users size={42} className="text-secondary" />}
        />
        <FeatureCard
          title="Metodologia com Base Científica"
          description="Baseie seu ensino em uma abordagem pedagógica sólida, potencializando a absorção do conhecimento e a autoconfiança dos alunos."
          icon={<Brain size={42} className="text-secondary" />}
        />
      </section>
      <section
        className="min-h-[85vh] flex justify-around items-center"
        id="sobre"
      >
        <About />
      </section>
    </>
  )
}
