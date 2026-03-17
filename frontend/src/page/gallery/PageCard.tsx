import { useState } from 'react';
import { MoreVertical, Copy, Trash2, Settings, Eye } from 'lucide-react';
import type { Page } from '@/types/page.types';
import { PageStatusBadge } from './PageStatusBadge';

interface PageCardProps {
  page: Page;
  onEdit: (page: Page) => void;
  onDuplicate: (page: Page) => void;
  onDelete: (page: Page) => void;
  onPublish?: (page: Page) => void;
}

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 30) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  return date.toLocaleDateString('pt-BR');
}

export function PageCard({ page, onEdit, onDuplicate, onDelete, onPublish }: PageCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition">
      {/* Thumbnail */}
      <button
        onClick={() => onEdit(page)}
        className="w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative group"
      >
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition">
          <Eye size={32} />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 truncate flex-1 mr-2">{page.title}</h3>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 hover:bg-slate-100 rounded transition"
            >
              <MoreVertical size={18} className="text-slate-400" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg w-44 py-1">
                  <button
                    onClick={() => { onEdit(page); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => { onDuplicate(page); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Copy size={14} /> Duplicar
                  </button>
                  <button
                    onClick={() => { onPublish?.(page); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition"
                  >
                    {page.status === 'published' ? '🔒 Despublicar' : '🌐 Publicar'}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition flex items-center gap-2"
                  >
                    <Settings size={14} /> Configurações
                  </button>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => { onDelete(page); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mb-3">
          <PageStatusBadge status={page.status} />
        </div>

        {page.published_url && (
          <p className="text-xs text-blue-600 mb-2 truncate">{page.published_url}</p>
        )}

        <p className="text-xs text-slate-500">Editada {formatRelativeTime(page.updated_at)}</p>
      </div>
    </div>
  );
}
