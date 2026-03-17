import { useState, useEffect } from 'react';
import {
  Search, Filter, Download, ChevronLeft, ChevronRight,
  MoreHorizontal, CheckCircle, Phone, XCircle, RefreshCw,
} from 'lucide-react';
import type { Lead } from '@/services/analyticsApi';

interface LeadsTableProps {
  pageId: string;
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  period: string;
  onFetch: (filters: {
    page?: number; search?: string; status?: string;
    area?: string; source?: string; period?: string;
  }) => void;
  onUpdateStatus: (leadId: string, status: string) => Promise<void>;
  onExport: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

const STATUS_COLORS: Record<string, string> = {
  novo: 'bg-blue-100 text-blue-700',
  contatado: 'bg-yellow-100 text-yellow-700',
  convertido: 'bg-green-100 text-green-700',
  perdido: 'bg-red-100 text-red-700',
};

const STATUS_OPTIONS = ['novo', 'contatado', 'convertido', 'perdido'];

const AREA_OPTIONS = [
  'Direito de Família', 'Direito do Trabalho', 'Direito Criminal', 'Direito Cível',
  'Direito Empresarial', 'Direito Tributário', 'Previdenciário', 'Outro',
];

const SOURCE_OPTIONS = ['Google', 'Facebook', 'Instagram', 'LinkedIn', 'Direto', 'Outro'];

export function LeadsTable({
  leads, total, page, pageSize, loading, period,
  onFetch, onUpdateStatus, onExport,
}: LeadsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    onFetch({ page: 1, search, status: statusFilter, area: areaFilter, source: sourceFilter, period });
  }, [search, statusFilter, areaFilter, sourceFilter, period]);

  const handlePageChange = (p: number) => {
    onFetch({ page: p, search, status: statusFilter, area: areaFilter, source: sourceFilter, period });
  };

  const handleStatusChange = async (leadId: string, status: string) => {
    setUpdatingId(leadId);
    try {
      await onUpdateStatus(leadId, status);
    } finally {
      setUpdatingId(null);
      setActionMenuId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700 mr-auto">Leads</h2>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg transition-colors ${
            showFilters || statusFilter || areaFilter || sourceFilter
              ? 'border-blue-300 bg-blue-50 text-blue-700'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter size={14} />
          Filtros
        </button>

        {/* Export CSV */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Download size={14} />
          CSV
        </button>
      </div>

      {/* Filters row */}
      {showFilters && (
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-100">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>

          <select
            value={areaFilter}
            onChange={e => setAreaFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todas as áreas</option>
            {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todas as origens</option>
            {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {(statusFilter || areaFilter || sourceFilter) && (
            <button
              onClick={() => { setStatusFilter(''); setAreaFilter(''); setSourceFilter(''); }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Limpar
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['Nome', 'E-mail', 'Telefone', 'Área', 'Data', 'Origem', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <RefreshCw size={20} className="animate-spin mx-auto mb-2" />
                  Carregando...
                </td>
              </tr>
            )}
            {!loading && leads.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  Nenhum lead encontrado
                </td>
              </tr>
            )}
            {!loading && leads.map(lead => (
              <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{lead.name ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">{lead.email}</td>
                <td className="px-4 py-3 text-slate-600">{lead.phone ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600 max-w-32 truncate">{lead.area ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(lead.created_at)}</td>
                <td className="px-4 py-3 text-slate-600">{lead.source ?? 'Direto'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => setActionMenuId(actionMenuId === lead.id ? null : lead.id)}
                    className="p-1 rounded hover:bg-slate-200 transition-colors"
                    disabled={updatingId === lead.id}
                  >
                    {updatingId === lead.id
                      ? <RefreshCw size={14} className="animate-spin text-slate-400" />
                      : <MoreHorizontal size={16} className="text-slate-500" />
                    }
                  </button>

                  {actionMenuId === lead.id && (
                    <div className="absolute right-4 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-44">
                      <div className="px-3 py-1.5 text-xs font-medium text-slate-400 uppercase">Mudar status</div>
                      {STATUS_OPTIONS.map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(lead.id, s)}
                          className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors ${lead.status === s ? 'text-blue-600 font-medium' : 'text-slate-700'}`}
                        >
                          {s === 'convertido' && <CheckCircle size={13} className="text-green-500" />}
                          {s === 'contatado' && <Phone size={13} className="text-yellow-500" />}
                          {s === 'perdido' && <XCircle size={13} className="text-red-400" />}
                          {s === 'novo' && <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />}
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} de {total} leads
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded text-sm transition-colors ${p === page ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
