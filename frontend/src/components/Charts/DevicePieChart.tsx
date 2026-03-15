import React from 'react';

interface DeviceData { desktop: number; mobile: number; tablet: number; }

interface DevicePieChartProps {
  data: DeviceData;
  size?: number;
}

const COLORS = {
  desktop: '#3b82f6',
  mobile: '#22c55e',
  tablet: '#f59e0b',
};

const LABELS = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
};

export function DevicePieChart({ data, size = 120 }: DevicePieChartProps) {
  const total = data.desktop + data.mobile + data.tablet;
  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: size }}>
        Sem dados
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;
  const innerR = r * 0.6;

  // Build arcs
  const segments = (Object.entries(data) as [keyof DeviceData, number][])
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ key, value, pct: value / 100 }));

  let currentAngle = -Math.PI / 2;
  const arcs = segments.map(seg => {
    const angle = seg.pct * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      'Z',
    ].join(' ');

    return { ...seg, d };
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {arcs.map(arc => (
          <path key={arc.key} d={arc.d} fill={COLORS[arc.key]} />
        ))}
        {/* Center text */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="#64748b">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">
          {total}%
        </text>
      </svg>

      <div className="space-y-2 flex-1">
        {(Object.entries(data) as [keyof DeviceData, number][]).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[key] }}
              />
              <span className="text-slate-600">{LABELS[key]}</span>
            </div>
            <span className="font-semibold text-slate-800">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
