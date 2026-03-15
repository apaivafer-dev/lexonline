import React, { useEffect, useState, useCallback } from 'react';
import {
  BarChart2, Users, TrendingUp, Clock, ArrowUpRight, ArrowDownRight,
  Minus, RefreshCw, ChevronDown,
} from 'lucide-react';
import { useAnalytics, type Period } from '@/hooks/useAnalytics';
import { pageApi } from '@/services/pageApi';
import { VisitsChart } from '@/components/Charts/VisitsChart';
import { DevicePieChart } from '@/components/Charts/DevicePieChart';
import { SourcesBarChart } from '@/components/Charts/SourcesBarChart';
import { LeadsTable } from './LeadsTable';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Page { id: string; title: string; }

// ─── Period selector ──────────────────────────────────────────────────────────

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Hoje', value: 'today' },
  { label: '7 dias', value: '7d' },
  { label: '30 dias', value: '30d' },
  { label: '90 dias', value: '90d' },
  { label: 'Customizado', value: 'custom' },
];

function PeriodSelector({
  period, onSelect, customStart, customEnd, onCustom,
}: {
  period: Period;
  onSelect: (p: Period) => void;
  customStart: string;
  customEnd: string;
  onCustom: (start: string, end: string) => void;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const [s, setS] = useState(customStart);
  const [e, setE] = useState(customEnd);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {PERIODS.filter(p => p.value !== 'custom').map(p => (
        <button
          key={p.value}
          onClick={() => { onSelect(p.value); setShowCustom(false); }}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            period === p.value && !showCustom
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {p.label}
        </button>
      ))}

      <button
        onClick={() => setShowCustom(v => !v)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          period === 'custom'
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
      >
        Customizado
        <ChevronDown size={14} />
      </button>

      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={s}
            onChange={ev => setS(ev.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-slate-400 text-sm">até</span>
          <input
            type="date"
            value={e}
            onChange={ev => setE(ev.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => { if (s && e) { onSelect('custom'); onCustom(s, e); setShowCustom(false); } }}
            disabled={!s || !e}
            className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg disabled:opacity-40"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  sub?: string;
}

function MetricCard({ label, value, trend, icon, sub }: MetricCardProps) {
  const trendColor = trend === undefined ? '' : trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-slate-400';
  const TrendIcon = trend === undefined ? null : trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Minus;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-slate-400">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      {(trend !== undefined || sub) && (
        <div className="flex items-center gap-1">
          {trend !== undefined && TrendIcon && (
            <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
              <TrendIcon size={12} />
              {Math.abs(trend)}%
            </span>
          )}
          {sub && <span className="text-xs text-slate-400">{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Format helpers ───────────────────────────────────────────────────────────

function fmtDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function fmtNum(n: number): string {
  return n.toLocaleString('pt-BR');
}

// ─── Page Analytics ───────────────────────────────────────────────────────────

export function PageAnalytics() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [pagesLoading, setPagesLoading] = useState(true);

  const {
    metrics, chartVisits, chartDevice, chartSources,
    leads, leadsTotal, leadsPage, leadsPageSize,
    period, customStart, customEnd,
    loading, loadingLeads, error,
    setPeriod, setCustomRange, fetchAll, fetchLeads, updateLeadStatus, exportLeads,
  } = useAnalytics();

  // Load pages list
  useEffect(() => {
    pageApi.getPages().then(res => {
      const list = (res.data as Page[]).filter((p: Page) => p.id);
      setPages(list);
      if (list.length > 0) setSelectedPageId(list[0].id);
    }).finally(() => setPagesLoading(false));
  }, []);

  // Fetch analytics when page or period changes
  const doFetchAll = useCallback(() => {
    if (!selectedPageId) return;
    fetchAll(
      selectedPageId,
      period,
      period === 'custom' ? customStart : undefined,
      period === 'custom' ? customEnd : undefined,
    );
  }, [selectedPageId, period, customStart, customEnd, fetchAll]);

  useEffect(() => {
    doFetchAll();
  }, [doFetchAll]);

  // Fetch leads
  const doFetchLeads = useCallback((filters: {
    page?: number; search?: string; status?: string; area?: string; source?: string; period?: string;
  }) => {
    if (!selectedPageId) return;
    fetchLeads(selectedPageId, {
      page: filters.page ?? 1,
      limit: 20,
      search: filters.search,
      status: filters.status,
      area: filters.area,
      source: filters.source,
      period: filters.period ?? period,
    });
  }, [selectedPageId, period, fetchLeads]);

  useEffect(() => {
    if (selectedPageId) doFetchLeads({});
  }, [selectedPageId, period]);

  const handleExport = () => {
    exportLeads(
      selectedPageId,
      period,
      period === 'custom' ? customStart : undefined,
      period === 'custom' ? customEnd : undefined,
    );
  };

  if (pagesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <BarChart2 size={40} className="text-slate-300" />
        <p className="text-slate-500">Nenhuma página encontrada. Crie e publique uma página primeiro.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">Métricas de desempenho das suas páginas</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Page selector */}
          <select
            value={selectedPageId}
            onChange={e => setSelectedPageId(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white max-w-56"
          >
            {pages.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {/* Refresh */}
          <button
            onClick={doFetchAll}
            disabled={loading}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Atualizar"
          >
            <RefreshCw size={16} className={`text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Period selector */}
      <PeriodSelector
        period={period}
        onSelect={setPeriod}
        customStart={customStart}
        customEnd={customEnd}
        onCustom={setCustomRange}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      {loading && !metrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-24 animate-pulse">
              <div className="h-3 bg-slate-100 rounded w-16 mb-3" />
              <div className="h-6 bg-slate-100 rounded w-12" />
            </div>
          ))}
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            label="Visitas"
            value={fmtNum(metrics.visits)}
            trend={metrics.visitsTrend}
            icon={<BarChart2 size={18} />}
            sub="vs. período anterior"
          />
          <MetricCard
            label="Leads"
            value={fmtNum(metrics.leads)}
            trend={metrics.leadsTrend}
            icon={<Users size={18} />}
          />
          <MetricCard
            label="Conversão"
            value={`${metrics.conversionRate.toFixed(2)}%`}
            icon={<TrendingUp size={18} />}
          />
          <MetricCard
            label="Tempo médio"
            value={fmtDuration(metrics.avgDuration)}
            icon={<Clock size={18} />}
          />
          <MetricCard
            label="Rejeição"
            value={`${metrics.bounceRate.toFixed(1)}%`}
            icon={<ArrowDownRight size={18} />}
          />
          <MetricCard
            label="Top Origem"
            value={metrics.topSource}
            sub={`${metrics.topSourcePct}% do tráfego`}
            icon={<TrendingUp size={18} />}
          />
        </div>
      ) : null}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Visits line chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Visitas ao longo do período</h3>
          <VisitsChart data={chartVisits} height={160} />
        </div>

        {/* Device pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Dispositivos</h3>
          {chartDevice ? (
            <DevicePieChart data={chartDevice} size={130} />
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              Sem dados
            </div>
          )}
        </div>
      </div>

      {/* Sources bar chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Tráfego por Origem</h3>
        <SourcesBarChart data={chartSources} />
      </div>

      {/* Leads Table */}
      <LeadsTable
        pageId={selectedPageId}
        leads={leads}
        total={leadsTotal}
        page={leadsPage}
        pageSize={leadsPageSize}
        loading={loadingLeads}
        period={period}
        onFetch={doFetchLeads}
        onUpdateStatus={updateLeadStatus}
        onExport={handleExport}
      />
    </div>
  );
}
