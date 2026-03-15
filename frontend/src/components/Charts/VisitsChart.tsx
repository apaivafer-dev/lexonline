import React from 'react';

interface VisitPoint { date: string; visits: number; }

interface VisitsChartProps {
  data: VisitPoint[];
  height?: number;
}

export function VisitsChart({ data, height = 160 }: VisitsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-400" style={{ height }}>
        Sem dados para o período selecionado
      </div>
    );
  }

  const W = 600;
  const pad = { t: 12, r: 12, b: 28, l: 40 };
  const w = W - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  const maxVal = Math.max(...data.map(d => d.visits), 1);
  const xStep = data.length > 1 ? w / (data.length - 1) : w;

  const xOf = (i: number) => pad.l + (data.length > 1 ? i * xStep : w / 2);
  const yOf = (v: number) => pad.t + h - (v / maxVal) * h;

  const points = data.map((d, i) => `${xOf(i)},${yOf(d.visits)}`).join(' ');
  const areaPoints = [
    `${xOf(0)},${pad.t + h}`,
    ...data.map((d, i) => `${xOf(i)},${yOf(d.visits)}`),
    `${xOf(data.length - 1)},${pad.t + h}`,
  ].join(' ');

  // Y-axis labels
  const yLabels = [0, Math.round(maxVal / 2), maxVal];

  // X-axis labels — show at most 7 evenly spaced
  const step = Math.max(1, Math.ceil(data.length / 7));
  const xLabels = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  const formatDate = (d: string) => {
    const [, m, day] = d.split('-');
    return `${day}/${m}`;
  };

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yLabels.map((v) => (
        <line
          key={v}
          x1={pad.l} y1={yOf(v)}
          x2={pad.l + w} y2={yOf(v)}
          stroke="#f1f5f9" strokeWidth="1"
        />
      ))}

      {/* Y-axis labels */}
      {yLabels.map((v) => (
        <text key={v} x={pad.l - 6} y={yOf(v) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
          {v}
        </text>
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#visitsFill)" />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data points */}
      {data.map((d, i) => (
        <circle key={i} cx={xOf(i)} cy={yOf(d.visits)} r="3" fill="#3b82f6" />
      ))}

      {/* X-axis labels */}
      {xLabels.map((d) => {
        const i = data.indexOf(d);
        return (
          <text key={i} x={xOf(i)} y={height - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">
            {formatDate(d.date)}
          </text>
        );
      })}
    </svg>
  );
}
