import { useEffect } from 'react';
import { Trophy, TrendingUp, Loader2, FlaskConical, AlertCircle } from 'lucide-react';
import { useAbTest } from '@/hooks/useAbTest';
import type { DayPoint } from '@/hooks/useAbTest';

// ─── Mini gráfico de linhas (sem dependências externas) ───────────────────────

function LineChart({ data, height = 80 }: { data: DayPoint[]; height?: number }) {
  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center text-xs text-slate-400"
        style={{ height }}
      >
        Dados insuficientes para o gráfico
      </div>
    );
  }

  const width = 400;
  const pad = { t: 8, r: 8, b: 20, l: 30 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;

  const maxVal = Math.max(...data.flatMap((d) => [d.variantA, d.variantB]), 1);
  const xStep = w / (data.length - 1);

  function xOf(i: number) { return pad.l + i * xStep; }
  function yOf(v: number) { return pad.t + h - (v / maxVal) * h; }

  function polyline(key: 'variantA' | 'variantB') {
    return data.map((d, i) => `${xOf(i)},${yOf(d[key])}`).join(' ');
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
      {/* Grid */}
      {[0, 0.5, 1].map((r) => (
        <line
          key={r}
          x1={pad.l} y1={pad.t + h * (1 - r)}
          x2={pad.l + w} y2={pad.t + h * (1 - r)}
          stroke="#f1f5f9" strokeWidth="1"
        />
      ))}
      {/* Linha A (azul) */}
      <polyline points={polyline('variantA')} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      {/* Linha B (verde) */}
      <polyline points={polyline('variantB')} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" />
      {/* Labels eixo X */}
      {data.filter((_, i) => i === 0 || i === data.length - 1).map((d, idx) => {
        const i = idx === 0 ? 0 : data.length - 1;
        return (
          <text key={i} x={xOf(i)} y={height - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {d.date.slice(5)}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Badge de status ──────────────────────────────────────────────────────────

function StatusBadge({ winner, confidence, status }: {
  winner: 'A' | 'B' | null;
  confidence: number;
  status: string;
}) {
  if (status === 'concluded' && winner) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
        <Trophy size={14} />
        {winner === 'A' ? 'Variante A venceu' : 'Variante B venceu'} ({Math.round(confidence)}% confiança)
      </span>
    );
  }
  if (confidence >= 95 && winner) {
    const color = winner === 'B' ? 'green' : 'blue';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-${color}-100 text-${color}-700`}>
        <TrendingUp size={14} />
        {winner === 'B' ? 'B está vencendo' : 'A está vencendo'} ({Math.round(confidence)}% confiança)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
      <FlaskConical size={14} />
      Teste em andamento
    </span>
  );
}

// ─── Card de métricas ─────────────────────────────────────────────────────────

function MetricCard({ label, metrics, highlight }: {
  label: string;
  metrics: { impressions: number; conversions: number; conversionRate: number };
  highlight?: boolean;
}) {
  return (
    <div className={`flex-1 p-4 rounded-xl border ${highlight ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-white'}`}>
      <div className={`text-xs font-bold mb-3 ${highlight ? 'text-green-700' : 'text-slate-500'}`}>
        {label}
        {highlight && <span className="ml-1">★</span>}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Impressões</span>
          <span className="font-semibold">{metrics.impressions.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Conversões</span>
          <span className="font-semibold">{metrics.conversions.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex justify-between text-sm pt-1 border-t border-slate-100">
          <span className="text-slate-500">Taxa</span>
          <span className={`font-bold text-base ${highlight ? 'text-green-600' : 'text-slate-800'}`}>
            {metrics.conversionRate.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface AbResultsDashboardProps {
  testId: string;
  onDeclareWinner: (winner: 'A' | 'B') => void;
  onEndTest: () => void;
}

export function AbResultsDashboard({ testId, onDeclareWinner, onEndTest }: AbResultsDashboardProps) {
  const { currentTest, results, series, loading, fetchTestResults, enableAutoRefresh } = useAbTest();

  useEffect(() => {
    fetchTestResults(testId);
    const stop = enableAutoRefresh(testId, 30_000);
    return stop;
  }, [testId, fetchTestResults, enableAutoRefresh]);

  if (loading && !results) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={32} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (!results || !currentTest) return null;

  const isActive = currentTest.status === 'active';
  const isConcluded = currentTest.status === 'concluded';
  const canDeclare = results.confidence >= 95 && results.winner !== null && isActive;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{currentTest.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Iniciado em {new Date(currentTest.started_at ?? currentTest.created_at).toLocaleDateString('pt-BR')}
            {currentTest.ends_at && (
              <> · Encerra em {new Date(currentTest.ends_at).toLocaleDateString('pt-BR')}</>
            )}
          </p>
        </div>
        <StatusBadge
          winner={results.winner}
          confidence={results.confidence}
          status={currentTest.status}
        />
      </div>

      {/* Aviso de amostra insuficiente */}
      {!results.sufficientData && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            Amostra insuficiente (mínimo 100 impressões por variante).
            Aguarde mais dados para resultados confiáveis.
          </span>
        </div>
      )}

      {/* Métricas lado a lado */}
      <div className="flex gap-4">
        <MetricCard
          label="Variante A (Original)"
          metrics={results.variantA}
          highlight={results.winner === 'A'}
        />
        <MetricCard
          label="Variante B (Teste)"
          metrics={results.variantB}
          highlight={results.winner === 'B'}
        />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Confiança</p>
          <p className="text-xl font-bold text-slate-800">{results.confidence.toFixed(1)}%</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Z-Score</p>
          <p className="text-xl font-bold text-slate-800">{results.zScore.toFixed(3)}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Amostra total</p>
          <p className="text-xl font-bold text-slate-800">{results.sampleSize.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {/* Recomendação */}
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
        {results.recommendation}
      </div>

      {/* Gráfico */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-4 mb-3 text-xs">
          <h3 className="font-medium text-slate-700 flex-1">Conversões por dia</h3>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> A</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-500 inline-block" /> B</span>
        </div>
        <LineChart data={series} height={100} />
      </div>

      {/* Ações */}
      {!isConcluded && (
        <div className="flex gap-3">
          {canDeclare && results.winner && (
            <button
              onClick={() => onDeclareWinner(results.winner!)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Trophy size={16} />
              Declarar Vencedor ({results.winner})
            </button>
          )}
          <button
            onClick={onEndTest}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Encerrar Teste
          </button>
        </div>
      )}

      {isConcluded && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Trophy size={16} className="text-amber-500" />
          Teste encerrado em {new Date(currentTest.concluded_at ?? currentTest.ended_at ?? '').toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  );
}
