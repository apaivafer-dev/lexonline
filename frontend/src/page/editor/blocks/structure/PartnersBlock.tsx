
const PARTNERS = [
  { name: 'OAB — Ordem dos Advogados' },
  { name: 'Associação de Direito Digital' },
  { name: 'Instituto Brasileiro de Defesa do Consumidor' },
  { name: 'Câmara de Arbitragem' },
  { name: 'Associação Jurídica Nacional' },
  { name: 'Instituto de Mediação' },
];

export function PartnersBlock() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-3 text-slate-900">Nossos Parceiros</h2>
      <p className="text-slate-600 text-center mb-12">Institucional e reconhecido pelas principais entidades do setor</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PARTNERS.map((p) => (
          <div key={p.name} className="bg-white rounded-xl p-6 flex items-center justify-center shadow-sm border border-slate-200 hover:shadow-md transition min-h-[80px]">
            <p className="text-slate-600 text-sm font-medium text-center">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
