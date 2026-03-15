import React, { useState } from 'react';
import { ChevronDown, Scale } from 'lucide-react';

const FAQS = [
  { question: 'Qual é o prazo para entrar com uma ação de consumidor?', answer: 'O prazo prescricional para ações de responsabilidade civil do consumidor é de 5 anos, conforme o Art. 27 do Código de Defesa do Consumidor.' },
  { question: 'Quanto custa uma consultoria?', answer: 'A consultoria inicial é sempre gratuita. Após análise do caso, definimos os honorários de forma justa e transparente, geralmente com opção de êxito.' },
  { question: 'Posso processar uma empresa grande?', answer: 'Sim! Atuamos contra empresas de qualquer porte. O Código de Defesa do Consumidor protege você independentemente do tamanho da empresa.' },
  { question: 'O que é honorário de êxito?', answer: 'É quando o advogado recebe um percentual do valor obtido apenas se ganhar o caso. Ideal para quem não pode pagar antecipadamente.' },
];

export function JuridicalFaqBlock() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="w-full py-16 px-8 bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale size={32} className="text-blue-400" />
          <h2 className="text-3xl font-bold">Dúvidas Sobre Seu Direito?</h2>
        </div>
        <p className="text-slate-400 text-center mb-10">Respondemos as perguntas mais frequentes dos nossos clientes</p>
        <div className="space-y-3">
          {FAQS.map(({ question, answer }, i) => (
            <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-800 transition"
              >
                <span className="font-medium text-white">{question}</span>
                <ChevronDown size={20} className={`text-slate-400 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-slate-300 text-sm leading-relaxed border-t border-slate-700 pt-3">
                  {answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Falar com um Especialista
          </button>
        </div>
      </div>
    </div>
  );
}
