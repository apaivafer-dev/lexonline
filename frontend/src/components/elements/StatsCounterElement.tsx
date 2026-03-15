import React, { useEffect, useState, useRef } from 'react';

interface Stat { label: string; value: number; suffix?: string; }

interface StatsCounterElementProps {
  stats?: Stat[];
  styles?: React.CSSProperties;
  onSelect?: () => void;
}

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
}

function StatItem({ stat }: { stat: Stat }) {
  const count = useCountUp(stat.value);
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-blue-600">{count}{stat.suffix ?? '+'}</div>
      <div className="text-slate-600 text-sm mt-1">{stat.label}</div>
    </div>
  );
}

export function StatsCounterElement({ stats = [{ label: 'Cases', value: 500 }, { label: 'Clientes', value: 98, suffix: '%' }, { label: 'Anos', value: 15 }], styles, onSelect }: StatsCounterElementProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 24, padding: 24, ...styles }} onClick={onSelect}>
      {stats.map((stat, i) => <StatItem key={i} stat={stat} />)}
    </div>
  );
}
