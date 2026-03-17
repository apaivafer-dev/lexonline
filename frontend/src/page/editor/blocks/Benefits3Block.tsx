import { Briefcase, Eye, CheckCircle } from 'lucide-react';

const ITEMS = [
  { title: 'Especialização', description: 'Equipe experiente em direito do consumidor com mais de 15 anos de atuação no mercado.', Icon: Briefcase },
  { title: 'Transparência', description: 'Comunicação clara e honesta desde o primeiro contato até a resolução do caso.', Icon: Eye },
  { title: 'Resultados', description: '95% de taxa de sucesso em nossas ações judiciais e extrajudiciais.', Icon: CheckCircle },
];

export function Benefits3Block() {
  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Por Que Nos Escolher</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {ITEMS.map(({ title, description, Icon }) => (
          <div key={title} className="text-center p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-blue-300 transition">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon size={28} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
