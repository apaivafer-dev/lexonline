import React, { useEffect, useState } from 'react';

interface CountdownElementProps {
  targetDate?: string;
  title?: string;
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

export function CountdownElement({ targetDate, title = 'A oferta termina em:', styles, onSelect }: CountdownElementProps) {
  const target = targetDate ? new Date(targetDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles} className="text-center py-8" onClick={onSelect}>
      <p className="text-slate-600 font-medium mb-4">{title}</p>
      <div className="flex justify-center gap-3">
        {[{ v: timeLeft.days, l: 'Dias' }, { v: timeLeft.hours, l: 'Horas' }, { v: timeLeft.minutes, l: 'Min' }, { v: timeLeft.seconds, l: 'Seg' }].map(({ v, l }) => (
          <div key={l} className="bg-slate-900 text-white rounded-xl px-4 py-3 min-w-[70px]">
            <div className="text-2xl font-bold">{String(v).padStart(2, '0')}</div>
            <div className="text-xs text-slate-400">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
