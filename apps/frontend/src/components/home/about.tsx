export default function About() {
  return (
    <div className="grid grid-cols-2 gap-10 bg-card p-10 border rounded-xl">
      <div className="bg-white col-span-1 m-10"></div>
      <div className="col-span-1">
        <h2
          className="text-center text-3xl font-semibold mb-10 bg-[linear-gradient(to_right,var(--primary),var(--secondary))] 
        bg-clip-text text-transparent"
        >
          Aprendizado Baseado em Exemplos
        </h2>

        <p className="text-justify indent-8 text-primary-foreground">
          A Aprendizagem Baseada em Exemplos é uma das metodologias ativas que
          podem ser adotadas pelos professores no ensino de Engenharia de
          Software. Segundo Van Gog (2018), essa metodologia de aprendizado se
          alicerça na demonstração de como realizar determinada tarefa ou
          habilidade a ser assimilada. Quando um aluno pode observar um exemplo
          de uma execução bem sucedida de uma tarefa sua crença em ser capaz de
          realizar o mesmo feito aumenta (HUANG, 2017).
        </p>
        <p className="text-justify indent-8 text-primary-foreground">
          Há várias maneiras de executar as demonstrações nesse processo de
          aprendizagem. Van Gog e Rummel (2010) citam a utilização de Exemplos
          Trabalhados (Worked Examples) e Exemplos de Modelagem (Modeling
          Examples). Com o objetivo de ampliar a visão dos efeitos da utilização
          de exemplos no processo de aprendizagem, Huang (2017) examinou quatro
          tipos diferentes de exemplos. Além dos dois já citados, foram
          examinados Exemplos Trabalhados Errôneos (Erroneous Worked Examples) e
          Exemplos de Modelagem por Pares (Peer Modeling Examples). A Figura 1
          mostra uma classificação dos tipos de exemplos de acordo com a
          perspectiva pedagógica de cada um deles.
        </p>
      </div>
    </div>
  )
}
