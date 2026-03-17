
const FEATURES = [
  {
    title: 'Consultoria Estratégica',
    description: 'Análise profunda do seu caso com identificação de todas as possibilidades legais disponíveis para garantir o melhor resultado.',
    reverse: false,
  },
  {
    title: 'Defesa Especializada',
    description: 'Atuação cirúrgica com profissionais altamente qualificados em cada área do direito, garantindo a melhor estratégia processual.',
    reverse: true,
  },
];

export function FeaturesBlock() {
  return (
    <div className="w-full py-16 px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {FEATURES.map(({ title, description, reverse }) => (
          <div key={title} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}>
            <div className={reverse ? 'md:order-2' : ''}>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{description}</p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition">
                Saiba Mais →
              </button>
            </div>
            <div className={`bg-slate-100 rounded-2xl ${reverse ? 'md:order-1' : ''}`} style={{ height: 240 }}>
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Imagem</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
