import { Target, Eye, Star } from 'lucide-react';

export function MissionBlock() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Nossos Valores</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border-t-4 border-blue-600">
          <Target size={36} className="text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-3">Missão</h3>
          <p className="text-slate-600 leading-relaxed">Garantir acesso à justiça de forma eficiente, ética e acessível para todos os cidadãos brasileiros.</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border-t-4 border-purple-600">
          <Eye size={36} className="text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-3">Visão</h3>
          <p className="text-slate-600 leading-relaxed">Ser referência nacional em advocacia especializada, reconhecida pela excelência e inovação.</p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border-t-4 border-green-600">
          <Star size={36} className="text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-3">Valores</h3>
          <ul className="text-slate-600 space-y-1 text-sm">
            {['Ética profissional', 'Transparência total', 'Excelência nos resultados', 'Dedicação ao cliente'].map((v) => (
              <li key={v} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
