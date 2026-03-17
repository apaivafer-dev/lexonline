
interface SourcePoint { source: string; visits: number; }

interface SourcesBarChartProps {
  data: SourcePoint[];
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#64748b', '#10b981'];

export function SourcesBarChart({ data }: SourcesBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-slate-400 py-6">
        Sem dados para o período selecionado
      </div>
    );
  }

  const maxVal = Math.max(...data.map(d => d.visits), 1);

  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const pct = (item.visits / maxVal) * 100;
        return (
          <div key={item.source} className="flex items-center gap-3">
            <span className="text-sm text-slate-600 w-24 shrink-0 truncate text-right">{item.source}</span>
            <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
              <div
                className="h-full rounded transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700 w-10 text-right shrink-0">
              {item.visits}
            </span>
          </div>
        );
      })}
    </div>
  );
}
