'use client'

import ApproachStepsItem from '@/components/approach-steps/approach-steps-item'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import { Button } from '@/components/ui/button'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const itemsEnsinoDaTeoria = [
  {
    id: '1',
    title: 'Aula Expositiva',
    content:
      'Essa etapa é sugerida para casos em que os alunos ainda não tenham tipo contato com o conteúdo.\nEsse tipo de abordagem se mostrou efetiva quando utilizada como ponto inicial do processo de ensino. \nA última etapa do processo consiste na utilização de exemplos para ajudar os alunos a relacionar o conteúdo com uma situação concreta.',
    collapsibles: [
      { title: 'Palestra' },
      { title: 'Explicar exemplos dos conceitos ensinados' },
    ],
  },
  {
    id: '2',
    title: 'Sala de Aula Invertida',
    content:
      'Essa etapa é sugerida para casos em que os alunos ainda não tenham tipo contato com o conteúdo.\nA utilização da Sala de Aula Invertida consiste em transpor a exposição do conteúdo para antes do período da aula por meio de vídeos, artigos ou livros. Isso contribui para tornar a absorção de conteúdo mais eficaz e envolvente. \nA última etapa do processo consiste na utilização de exemplos para ajudar os alunos a relacionar o conteúdo com uma situação concreta.\nPara mais informações a respeito deste método de ensino, acessar as referências a seguir: \nActivity Oriented Teaching Strategy for Software Engineering Course: An Experience Report \nWhat, why, and how to implement a flipped classroom model',
    collapsibles: [
      { title: 'Compartilhar o material' },
      { title: 'Revisão dos conceitos e tira dúvidas' },
      { title: 'Explicar exemplos dos conceitos ensinados' },
    ],
  },
  {
    id: '3',
    title: 'Outras Metodologias',
    content: 'Em construção',
    collapsibles: [{ title: 'Não há informações.' }],
  },
]

const itemsAtividades = [
  {
    id: '1',
    title: 'Exemplo correto',
    collapsibles: [
      {
        title: 'Aluno Iniciante',
        items: [
          { title: 'Escolher o exemplo' },
          { title: 'Professor realiza a demonstração' },
          { title: 'Apresentar um domínio' },
          { title: 'Alunos realizam a modelagem' },
          { title: 'Professor realiza a demonstração' },
          { title: 'Alunos corrigem o modelo' },
          { title: 'Feedback' },
        ],
      },
      {
        title: 'Aluno Intermediário',
        items: [
          { title: 'Escolher um exemplo positivo' },
          { title: 'Professor ensina o exemplo' },
          { title: 'Apresentar um domínio' },
          { title: 'Alunos realizam a modelagem' },
          { title: 'Feedback' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Exemplo errôneo',
    collapsibles: [
      {
        title: 'Aluno Iniciante',
        content:
          'Aluno iniciante é aquele que ainda não realizou exercícios sobre o conteúdo.\nNo caso de alunos iniciantes, é sugerido uma abordagem que se inicia com o professor demonstrando a construção do modelo.\nApós essa etapa, o professor apresenta aos alunos um domínio e solicita que os alunos realizem a construção do modelo para o domínio apresentado.\nDepois da modelagem realizada pelos alunos, o professor apresenta como seria a modelagem correta e solicita que os alunos façam a correção dos seus próprios modelos. Após a correção dos modelos, os alunos enviam para o professor o resultado.\nPara finalizar a atividade o professor pode optar por um dos tipos de feedbacks sugeridos',
        items: [
          {
            title: 'Modelagem de domínio',
            items: [
              { title: 'Apresentar um domínio' },
              { title: 'Alunos realizam a modelagem' },
              { title: 'Selecionar anti-padrões' },
              { title: 'Explicação dos anti-padrões' },
              { title: 'Alunos corrigem seus diagramas' },
              { title: 'Alunos criam uma nova versão dos diagramas' },
              { title: 'Feedback' },
            ],
          },
          {
            title: 'Modelo com erros',
            items: [
              { title: 'Apresentar um modelo com erros' },
              { title: 'Professor explica os erros do modelo' },
              { title: 'Professor demonstra a correção' },
              { title: 'Professor apresenta outro modelo' },
              { title: 'Alunos identificam os erros' },
              { title: 'Alunos corrigem o modelo' },
              { title: 'Feedback' },
            ],
          },
        ],
      },
      {
        title: 'Aluno Intermediário',
        items: [
          {
            title: 'Modelo com erros',
            items: [
              { title: 'Apresentar um modelo com erros' },
              { title: 'Professor explica os erros modelo' },
              { title: 'Professor demonstra a correção' },
              { title: 'Professor apresenta outro modelo' },
              { title: 'Alunos identificam os erros' },
              { title: 'Alunos corrigem o modelo' },
              { title: 'Feedback' },
            ],
          },
          {
            title: 'Jogo dos 7 erros',
            items: [
              { title: 'Professor apresenta um modelo com 7 erros' },
              { title: 'Alunos tentam encontrar encontrar os erros' },
              { title: 'Aluno explica o motivo do erro encontrado' },
              { title: 'Professor faz a validação do erro encontrado' },
              {
                title:
                  'Se algum erro não for localizado, o professor faz a explicação do erro',
              },
              {
                title:
                  'Professor faz a demonstração das correções dos erros do modelo',
              },
            ],
          },
          {
            title: 'Alunos identificando erros',
            items: [
              { title: 'Professor apresenta um modelo com erros' },
              {
                title:
                  'Professor estabelece um tempo para os alunos identificarem os erros',
              },
              { title: 'Alunos relatam os erros encontrados' },
              { title: 'Professor faz a correção dos erros encontrados' },
              { title: 'Professor mostra os erros não localizados' },
              { title: 'Opcional: Apresentação de anti-padrões' },
              {
                title:
                  'Professor faz a demonstração das correções dos erros do modelo',
              },
            ],
          },
        ],
      },
    ],
  },
]

const itemsFeedback = [
  {
    id: '1',
    title: 'Entrega por escrito com feedback individual',
    collapsibles: [
      {
        title: 'Alunos realizam a entrega por escrito',
      },
      {
        title: 'Professor devolve feedback escrito individual',
      },
    ],
  },
  {
    id: '2',
    title: 'Entrega por escrito com feedback coletivo',
    collapsibles: [
      {
        title: 'Alunos realizam a entrega por escrito',
      },
      {
        title: 'Professor realiza o feedback das apresentações',
      },
    ],
  },
  {
    id: '3',
    title: 'Apresentação de seminários',
    collapsibles: [
      {
        title: 'Alunos apresentam os seminários',
      },
      {
        title: 'Professor realiza o feedback das apresentações',
      },
    ],
  },
]

export default function EtapasDaAbordagemPage() {
  const router = useRouter()

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    {
      label: 'Etapas da Abordagem',
      isCurrent: true,
    },
  ]

  return (
    <>
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() => router.push('/')}
          className="cursor-pointer"
        >
          Voltar
        </Button>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <section className="h-[calc(100vh-240px)] mt-8 flex items-center justify-center">
        <div className="w-full flex justify-between">
          <ApproachStepsItem
            label="Ensino da Teoria"
            items={itemsEnsinoDaTeoria}
          />
          <ApproachStepsItem label="Atividades" items={itemsAtividades} />
          <ApproachStepsItem label="Feedbacks" items={itemsFeedback} />
        </div>
      </section>
    </>
  )
}
