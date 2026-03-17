import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TESTIMONIALS = [
  { text: 'Excelente atendimento! Resolveram meu caso em tempo recorde. Muito satisfeito com o resultado.', author: 'João Silva', role: 'Empresário', rating: 5 },
  { text: 'Profissionais extremamente competentes. Me senti seguro em todas as etapas do processo.', author: 'Maria Santos', role: 'Professora', rating: 5 },
  { text: 'Recomendo muito! Conseguiram o que outros escritórios não conseguiram em anos.', author: 'Carlos Ferreira', role: 'Engenheiro', rating: 5 },
];

export function TestimonialsBlock() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];

  return (
    <div className="w-full py-16 px-8 bg-slate-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">O Que Nossos Clientes Dizem</h2>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-lg text-slate-700 italic mb-6">"{t.text}"</p>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600 font-bold text-lg">{t.author[0]}</span>
          </div>
          <p className="font-bold text-slate-900">{t.author}</p>
          <p className="text-slate-500 text-sm">{t.role}</p>
        </div>
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="p-2 rounded-full bg-white border border-slate-300 hover:bg-slate-100 transition">
            <ChevronLeft size={20} />
          </button>
          <span className="text-slate-500 text-sm">{idx + 1} / {TESTIMONIALS.length}</span>
          <button onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)} className="p-2 rounded-full bg-white border border-slate-300 hover:bg-slate-100 transition">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
