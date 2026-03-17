import { Check, X as XIcon } from 'lucide-react';

const PLANS = [
  { name: 'Essencial', price: 'R$ 1.990', features: [true, true, false, false, false] },
  { name: 'Profissional', price: 'R$ 4.990', features: [true, true, true, true, false], featured: true },
  { name: 'Corporativo', price: 'Consulta', features: [true, true, true, true, true] },
];
const FEATURES = ['Consultoria inicial', 'Análise jurídica', 'Acompanhamento processual', 'Audiências inclusas', 'Advogado dedicado'];

export function PricingTableBlock() {
  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Comparativo de Planos</h2>
      <div className="max-w-4xl mx-auto overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow overflow-hidden">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-4 text-left text-slate-500 font-medium text-sm">Recurso</th>
              {PLANS.map((p) => (
                <th key={p.name} className={`p-4 text-center ${p.featured ? 'bg-blue-50' : ''}`}>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-blue-600 font-bold text-lg">{p.price}</div>
                  {p.featured && <div className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full inline-block mt-1">Recomendado</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((feature, fi) => (
              <tr key={feature} className="border-b border-slate-100 last:border-0">
                <td className="p-4 text-sm text-slate-700">{feature}</td>
                {PLANS.map((p) => (
                  <td key={p.name} className={`p-4 text-center ${p.featured ? 'bg-blue-50/50' : ''}`}>
                    {p.features[fi]
                      ? <Check size={18} className="text-green-500 mx-auto" />
                      : <XIcon size={18} className="text-slate-300 mx-auto" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="p-4" />
              {PLANS.map((p) => (
                <td key={p.name} className={`p-4 ${p.featured ? 'bg-blue-50/50' : ''}`}>
                  <button className={`w-full py-2 rounded-lg font-semibold text-sm transition ${p.featured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-blue-600 text-blue-600 hover:bg-blue-50'}`}>
                    Escolher
                  </button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
