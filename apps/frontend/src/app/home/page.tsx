'use client'

import About from '@/components/home/about'
import FeatureCard from '@/components/home/feature-card'
import { Button } from '@/components/ui/button'

export default function Home() {
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
            >
              Saber mais
            </Button>

            <Button
              className="cursor-pointer rounded-2xl px-6 bg-[linear-gradient(to_right,var(--primary),var(--secondary))] "
              size={'lg'}
            >
              Começar
            </Button>
          </div>
        </div>
      </section>
      <section className="min-h-screen flex justify-around items-center">
        <FeatureCard />
        <FeatureCard />
        <FeatureCard />
      </section>
      <section className="min-h-screen flex justify-around items-center">
        <About />
      </section>
    </>
  )
}
