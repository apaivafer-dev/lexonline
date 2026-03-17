import { useState } from 'react';

export function HeroBlock() {
  const [content] = useState({
    title: 'Seu Título Aqui',
    subtitle: 'Subtítulo que descreve sua proposta de valor',
    cta_text: 'Começar Agora',
    bg_color: '#f8fafc',
  });

  return (
    <div className="w-full py-24 px-8 text-center" style={{ backgroundColor: content.bg_color }}>
      <h1 className="text-5xl font-bold mb-4 text-slate-900">{content.title}</h1>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">{content.subtitle}</p>
      <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg transition">
        {content.cta_text}
      </button>
    </div>
  );
}
