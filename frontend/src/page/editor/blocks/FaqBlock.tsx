import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { question: 'Qual é o valor da consultoria inicial?', answer: 'A consultoria inicial é gratuita. Realizamos uma análise completa do seu caso sem nenhum custo.' },
  { question: 'Quanto tempo leva para resolver meu caso?', answer: 'Depende da complexidade do caso. Casos simples podem ser resolvidos em semanas, enquanto processos judiciais podem levar meses.' },
  { question: 'Vocês atuam em todo o Brasil?', answer: 'Sim! Atuamos em todo o território nacional com equipe especializada em cada região.' },
  { question: 'Qual é a taxa de sucesso do escritório?', answer: 'Mantemos uma taxa de sucesso de 95% em nossos casos, com mais de 500 processos resolvidos nos últimos 5 anos.' },
];

export function FaqBlock() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Perguntas Frequentes</h2>
      <div className="max-w-3xl mx-auto space-y-3">
        {FAQS.map(({ question, answer }, i) => (
          <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition"
            >
              <span className="font-medium text-slate-900">{question}</span>
              <ChevronDown size={20} className={`text-slate-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                {answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
