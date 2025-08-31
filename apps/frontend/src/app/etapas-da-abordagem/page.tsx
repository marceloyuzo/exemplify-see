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
        content:
          'Aluno iniciante é aquele que ainda não realizou exercícios sobre o conteúdo.\nNo caso de alunos iniciantes, é sugerido uma abordagem que se inicia com o professor demonstrando a construção do modelo.\nApós essa etapa, o professor apresenta aos alunos um domínio e solicita que os alunos realizem a construção do modelo para o domínio apresentado.\nDepois da modelagem realizada pelos alunos, o professor apresenta como seria a modelagem correta e solicita que os alunos façam a correção dos seus próprios modelos. Após a correção dos modelos, os alunos enviam para o professor o resultado.\nPara finalizar a atividade o professor pode optar por um dos tipos de feedbacks sugeridos',
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
        content:
          'O aluno intermediário é aquele que já realizou algum tipo de exercício que aborde o conteúdo a ser explorado.\nO professor começa ensinando aos alunos exemplos positivos do modelo escolhido.\nEm seguida, o professor apresenta um domínio para que os alunos possam construir um modelo de acordo com os padrões apresentados.\nPara finalizar a atividade o professor pode optar por um dos tipos de feedbacks sugeridos.',
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
        items: [
          {
            title: 'Modelagem de domínio',
            content:
              'Aluno iniciante é aquele que ainda não realizou exercícios sobre o conteúdo.\nO professor inicia apresentando um domínio para que os alunos realizem a modelagem.\nDepois da modelagem realizada pelos alunos, o professor apresenta alguns anti-padrões e como é possível solucioná-los.\nO próximo passo será a correção dos modelos construídos. Para isso, o professor pode optar por disponibilizar um artefato que auxilie os alunos nessa etapa. Esse artefato pode ser um checklist com os anti-padrões ensinados ou um artefato de inspeção.\nEm relação à correção dos diagramas, o professor pode escolher entre o aluno corrigir o seu próprio diagrama ou fazer com que ele corrija o diagrama de um outro colega.\nPara finalizar a atividade o professor pode optar por um dos tipos de feedbacks sugeridos.',
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
            content:
              'Aluno iniciante é aquele que ainda não realizou exercícios sobre o conteúdo.\nPara alunos iniciantes, a sugestão é que sejam utilizados modelos mais simples.\nO professor apresenta um modelo que contenha erros, explica os erros existentes e faz o passo a passo para corrigir esses erros.\nO professor apresenta um outro modelo e solicita que os alunos localizem os erros e construam um novo modelo que apresente a solução dos erros encontrados.\nPara finalizar a atividade o professor pode optar por um dos tipos de feedbacks sugeridos.',
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
            content:
              'O aluno intermediário é aquele que já realizou algum tipo de exercício que aborde o conteúdo a ser explorado.\nPara alunos intermediários, a sugestão é que sejam utilizados modelos mais complexos.\nO professor apresenta um modelo que contenha erros, explica os erros existentes e faz o passo a passo para corrigir esses erros.\nO professor apresenta um outro modelo e solicita que os alunos localizem os erros e construam um novo modelo que apresente a solução dos erros encontrados.\nPara finalizar a atividade o professor pode optar por um dos tipos de feedbacks sugeridos.',
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
            content:
              'O aluno intermediário é aquele que já realizou algum tipo de exercício que aborde o conteúdo a ser explorado.\nO professor inicia as atividades apresentando um modelo com sete erros e explicando as regras do jogo.\nSugestão de regras:\nErro encontrado corretamente e explicação do motivo correta: 10 pontos\nErro encontrado corretamente, porém, explicação incorreta: 5 pontos\nPódio: Os três alunos com maior pontuação.\nEm seguida, a atividade entra em um loop no qual os alunos tentam localizar os erros presentes no modelo. Cada erro localizado precisa ser justificado pelo aluno perante a sala e logo em seguida o professor realiza a validação da explicação. Isso se repete até que mais nenhum erro seja apontado pelos alunos.\nPor fim, o professor verifica se algum erro existente não foi localizado pelos alunos. Caso exista, o professor explica o erro e encerra a atividade demonstrando a correção do modelo.',
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
            content:
              'A atividade começa com o professor apresentando um modelo com erros.\nNa sequência, o professor estabelece um tempo para que os alunos possam identificar os erros existentes.\nApós os alunos relatarem os erros, o professor faz a correção dos erros identificados.\nO professor pode escolher entre apresentar ou não uma aula com os anti-padrões relacionados aos erros do modelo e mostra como solucioná-los.\nPara finalizar a atividade, o professor mostra os erros não encontrados (caso existam) e demonstra a correção do diagrama.',
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
    content:
      'Os alunos realizam uma entrega por escrito e o professor envia um feedback individual realizado também por escrito.',
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
    content:
      'Os alunos realizam uma entrega por escrito.\nO feedback pode ser feito de forma coletiva, apresentando a solução correta do modelo ou utilizando os modelos dos próprios alunos para exemplificar os erros e acertos cometidos.',
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
    content:
      'Solicitar aos alunos que apresentem os seus modelos por meio de seminários.\nApós a apresentação dos seminários, o professor fornece um feedback aos alunos a respeito do que foi apresentado.',
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
