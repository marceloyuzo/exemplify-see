export default function FeatureCard() {
  return (
    <div className="w-full h-fit max-w-80 bg-card rounded-xl border p-6 flex flex-col items-center text-center">
      <div className="bg-white w-30 h-30"></div>
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight text-primary">
        Monte seus planos de aulas
      </h3>
      <p className="mt-4 text-sm leading-7 [&:not(:first-child)]:mt-6">
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old.
      </p>
    </div>
  )
}
