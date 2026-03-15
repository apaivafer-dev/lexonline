import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function HeroUrgencyBlock() {
  const target = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const { days, hours, minutes, seconds } = useCountdown(target);

  return (
    <div className="w-full py-16 px-8 bg-red-600 text-white text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <AlertCircle size={20} />
        <span className="font-semibold text-red-100 uppercase tracking-wider text-sm">Vagas Limitadas</span>
      </div>
      <h1 className="text-4xl font-bold mb-3">Oferta Especial — Últimas Vagas</h1>
      <p className="text-xl text-red-100 mb-8">3 primeiros clientes recebem 30% de desconto na consultoria</p>
      <div className="flex justify-center gap-4 mb-8">
        {[{ v: days, l: 'Dias' }, { v: hours, l: 'Horas' }, { v: minutes, l: 'Min' }, { v: seconds, l: 'Seg' }].map(({ v, l }) => (
          <div key={l} className="bg-red-700 rounded-xl px-6 py-4 min-w-[80px]">
            <div className="text-3xl font-bold">{String(v).padStart(2, '0')}</div>
            <div className="text-red-200 text-xs mt-1">{l}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock size={16} className="text-red-200" />
        <span className="text-red-100">Restam apenas <strong>3 vagas</strong></span>
      </div>
      <button className="px-10 py-4 bg-white text-red-600 border-2 border-white rounded-xl font-semibold hover:bg-red-50 hover:border-red-50 transition-colors text-lg shadow-lg">
        Garantir Minha Vaga
      </button>
    </div>
  );
}
