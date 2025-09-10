export default function About() {
  return (
    <div className="flex flex-col gap-10 bg-card p-10 border rounded-xl">
      <h2
        className="col-span-2 text-center text-3xl font-semibold bg-[linear-gradient(to_right,var(--primary),var(--secondary))] 
        bg-clip-text text-transparent"
      >
        Aprendizado Baseado em Exemplos
      </h2>
      <div className="grid grid-cols-2 gap-10 ">
        <div className="col-span-1 flex flex-col justify-center items-center pt-10">
          <img
            src="/image-about.png"
            alt="Tipos de Exemplos"
            style={{ width: '600px', borderRadius: '8px' }}
          />

          <span className="mt-2 text-sm text-primary-foreground">
            Figura 1 - Tipos de Exemplos
          </span>
          <span className="text-sm text-primary-foreground">
            Adaptado de Huang (2017)
          </span>
        </div>
        <div className="col-span-1">
          <p className="text-justify indent-8 text-primary-foreground">
            A Aprendizagem Baseada em Exemplos é uma das metodologias ativas que
            podem ser adotadas pelos professores no ensino de Engenharia de
            Software. Segundo Van Gog (2018), essa metodologia de aprendizado se
            alicerça na demonstração de como realizar determinada tarefa ou
            habilidade a ser assimilada. Quando um aluno pode observar um
            exemplo de uma execução bem sucedida de uma tarefa sua crença em ser
            capaz de realizar o mesmo feito aumenta (HUANG, 2017).
          </p>
          <p className="text-justify indent-8 text-primary-foreground">
            Há várias maneiras de executar as demonstrações nesse processo de
            aprendizagem. Van Gog e Rummel (2010) citam a utilização de Exemplos
            Trabalhados (Worked Examples) e Exemplos de Modelagem (Modeling
            Examples). Com o objetivo de ampliar a visão dos efeitos da
            utilização de exemplos no processo de aprendizagem, Huang (2017)
            examinou quatro tipos diferentes de exemplos. Além dos dois já
            citados, foram examinados Exemplos Trabalhados Errôneos (Erroneous
            Worked Examples) e Exemplos de Modelagem por Pares (Peer Modeling
            Examples). A Figura 1 mostra uma classificação dos tipos de exemplos
            de acordo com a perspectiva pedagógica de cada um deles.
          </p>
        </div>
      </div>

      <div className="col-span-2 mx-auto">
        <video
          src="https://pub-b84e4041f94e485aa689661e397a0353.r2.dev/exemplify-see/ABE-Novo.mp4"
          controls
          className="rounded-lg shadow-lg max-w-3xl"
        />
      </div>
    </div>
  )
}
