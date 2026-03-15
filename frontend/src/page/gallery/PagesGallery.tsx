import React, { useState } from 'react';
import { Plus, Search, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePages } from '@/hooks/usePages';
import { usePageLimits } from '@/hooks/usePageLimits';
import { PageCard } from './PageCard';
import { CreatePageModal } from './CreatePageModal';
import type { Page, PageStatus, CreatePageInput } from '@/types/page.types';

type FilterOption = PageStatus | 'all';

const FILTER_LABELS: Record<FilterOption, string> = {
  all: 'Todas',
  published: 'Publicadas',
  draft: 'Rascunhos',
  archived: 'Arquivadas',
};

export function PagesGallery() {
  const navigate = useNavigate();
  const { pages, isLoading, error, createPage, deletePage, duplicatePage, publishPage } = usePages();
  const { isAtLimit, remaining } = usePageLimits(pages);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPages = pages.filter((page) => {
    const matchesFilter = filter === 'all' || page.status === filter;
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreatePage = async (data: CreatePageInput) => {
    console.log('[PagesGallery] handleCreatePage chamado:', data);
    const newPage = await createPage(data);
    console.log('[PagesGallery] página criada:', newPage, 'navegando para /editor/' + newPage.id);
    setShowCreateModal(false);
    navigate(`/editor/${newPage.id}`);
    return newPage;
  };

  const handleDeletePage = async (page: Page) => {
    if (confirm(`Deseja arquivar a página "${page.title}"?`)) {
      await deletePage(page.id);
    }
  };

  const handleDuplicatePage = async (page: Page) => {
    await duplicatePage(page.id);
  };

  const handlePublishPage = async (page: Page) => {
    await publishPage(page.id);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Carregando páginas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 bg-slate-50 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Minhas Páginas</h1>
        <p className="text-slate-500 text-sm">
          {remaining === Infinity
            ? 'Páginas ilimitadas no seu plano'
            : remaining > 0
            ? `${remaining} página(s) restante(s) no seu plano`
            : 'Limite de páginas atingido — faça upgrade'}
        </p>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={isAtLimit}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
        >
          <Plus size={18} />
          Nova Página
        </button>

        <div className="flex-1 relative max-w-sm">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título ou slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(FILTER_LABELS) as FilterOption[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={(p) => navigate(`/editor/${p.id}`)}
              onDuplicate={handleDuplicatePage}
              onDelete={handleDeletePage}
              onPublish={handlePublishPage}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Layout size={48} className="text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            {searchTerm ? 'Nenhuma página encontrada' : 'Nenhuma página ainda'}
          </h2>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={16} />
              Criar primeira página
            </button>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreatePageModal
          onClose={() => setShowCreateModal(false)}
          onCreatePage={handleCreatePage}
        />
      )}
    </div>
  );
}
