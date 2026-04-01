# LEX_SITE03 — Fase 2: Galeria de Páginas + Página de Templates

## Título
LEX_SITE03 — Fase 2: Galeria de Páginas + Página de Templates

## Objetivo
Construir a interface de gerenciamento de páginas (PagesGallery com filtros, cards, status badge) e a página de templates separada (`/page/templates`) com preview full-screen, atendendo às regras de interface da Fase 0.

## Dependência
- Requer: **Fase 1** (Menu + Banco de Dados)
- Bloqueia: Fase 3a (Layout do Editor)

---

## Arquivos a Criar

### Frontend Components
- [ ] `frontend/src/page/gallery/PagesGallery.tsx` (reescrever)
- [ ] `frontend/src/page/gallery/PageCard.tsx` (novo)
- [ ] `frontend/src/page/gallery/PageStatusBadge.tsx` (novo)
- [ ] `frontend/src/page/gallery/CreatePageModal.tsx` (novo)
- [ ] `frontend/src/page/templates/TemplatesPage.tsx` (novo)
- [ ] `frontend/src/page/templates/TemplateCard.tsx` (novo)
- [ ] `frontend/src/page/templates/TemplatePreview.tsx` (novo)

### Hooks
- [ ] `frontend/src/hooks/usePages.ts` (novo)
- [ ] `frontend/src/hooks/usePageLimits.ts` (novo)

### Types
- [ ] `frontend/src/types/page.types.ts` (novo)

---

## Detalhamento

### 1. Types — `frontend/src/types/page.types.ts`

```typescript
// frontend/src/types/page.types.ts

export type PageStatus = 'draft' | 'published' | 'archived';

export interface Page {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  status: PageStatus;
  schema: PageSchema[];
  published_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  domain_id?: string;
}

export interface PageSchema {
  id: string;
  type: 'section';
  styles: Record<string, string>;
  columns: PageColumn[];
}

export interface PageColumn {
  id: string;
  width: number; // 1-12 em grid de 12 colunas
  elements: PageElement[];
}

export interface PageElement {
  id: string;
  type: string;
  content?: string;
  styles: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface PageTemplate {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  thumbnail_url?: string;
  schema: PageSchema[];
  is_premium: boolean;
  preview_url?: string;
  created_at: string;
}

export type TemplateCategory =
  | 'landing_page'
  | 'institutional'
  | 'capture'
  | 'sales'
  | 'legal'
  | 'services'
  | 'portfolio'
  | 'event'
  | 'blog'
  | 'contact';

export interface CreatePageInput {
  title: string;
  slug: string;
  template_id?: string;
}
```

---

### 2. Hooks — `frontend/src/hooks/usePages.ts`

```typescript
// frontend/src/hooks/usePages.ts

import { useState, useEffect, useCallback } from 'react';
import type { Page } from '@/types/page.types';
import pageApi from '@/services/pageApi';

export function usePages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await pageApi.getPages();
      setPages(response.data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar páginas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const createPage = useCallback(
    async (data: { title: string; slug: string; template_id?: string }) => {
      try {
        const response = await pageApi.createPage(data);
        setPages([response.data, ...pages]);
        return response.data;
      } catch (err) {
        throw new Error('Falha ao criar página');
      }
    },
    [pages]
  );

  const deletePage = useCallback(
    async (id: string) => {
      try {
        await pageApi.deletePage(id);
        setPages(pages.filter((p) => p.id !== id));
      } catch (err) {
        throw new Error('Falha ao deletar página');
      }
    },
    [pages]
  );

  const duplicatePage = useCallback(
    async (id: string) => {
      try {
        const response = await pageApi.duplicatePage(id);
        setPages([response.data, ...pages]);
        return response.data;
      } catch (err) {
        throw new Error('Falha ao duplicar página');
      }
    },
    [pages]
  );

  const publishPage = useCallback(
    async (id: string) => {
      try {
        const response = await pageApi.publishPage(id);
        setPages(pages.map((p) => (p.id === id ? response.data : p)));
        return response.data;
      } catch (err) {
        throw new Error('Falha ao publicar página');
      }
    },
    [pages]
  );

  return {
    pages,
    isLoading,
    error,
    createPage,
    deletePage,
    duplicatePage,
    publishPage,
    refetch: fetchPages,
  };
}
```

---

### 3. Hook — `frontend/src/hooks/usePageLimits.ts`

```typescript
// frontend/src/hooks/usePageLimits.ts

import { useMemo } from 'react';
import type { Page } from '@/types/page.types';

export type UserPlan = 'essential' | 'professional' | 'agency';

const PLAN_LIMITS: Record<UserPlan, number> = {
  essential: 5,
  professional: 20,
  agency: Infinity,
};

export function usePageLimits(pages: Page[], userPlan: UserPlan = 'essential') {
  return useMemo(() => {
    const limit = PLAN_LIMITS[userPlan];
    const count = pages.filter((p) => p.status !== 'archived').length;
    const remaining = Math.max(0, limit - count);
    const isAtLimit = count >= limit;

    return {
      limit,
      count,
      remaining,
      isAtLimit,
      canCreatePage: !isAtLimit,
    };
  }, [pages, userPlan]);
}
```

---

### 4. Component — `frontend/src/page/gallery/PageStatusBadge.tsx`

```typescript
// frontend/src/page/gallery/PageStatusBadge.tsx

import React from 'react';
import type { PageStatus } from '@/types/page.types';
import { cn } from '@/utils/cn';

interface PageStatusBadgeProps {
  status: PageStatus;
}

const statusColors: Record<PageStatus, string> = {
  draft: 'bg-slate-200 text-slate-800',
  published: 'bg-green-200 text-green-800',
  archived: 'bg-gray-200 text-gray-800',
};

const statusLabels: Record<PageStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicada',
  archived: 'Arquivada',
};

export function PageStatusBadge({ status }: PageStatusBadgeProps) {
  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusColors[status])}>
      {statusLabels[status]}
    </span>
  );
}
```

---

### 5. Component — `frontend/src/page/gallery/PageCard.tsx`

```typescript
// frontend/src/page/gallery/PageCard.tsx

import React, { useState } from 'react';
import { MoreVertical, Copy, Trash2, Settings, Eye } from 'lucide-react';
import type { Page } from '@/types/page.types';
import { PageStatusBadge } from './PageStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PageCardProps {
  page: Page;
  onEdit: (page: Page) => void;
  onDuplicate: (page: Page) => void;
  onDelete: (page: Page) => void;
  onPublish?: (page: Page) => void;
}

export function PageCard({
  page,
  onEdit,
  onDuplicate,
  onDelete,
  onPublish,
}: PageCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const relativeTime = formatDistanceToNow(new Date(page.updated_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition">
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <Eye size={32} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-900 truncate flex-1">{page.title}</h3>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 hover:bg-slate-100 rounded transition"
          >
            <MoreVertical size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <PageStatusBadge status={page.status} />
        </div>

        {/* URL Published */}
        {page.published_url && (
          <p className="text-xs text-blue-600 mb-2 truncate">{page.published_url}</p>
        )}

        {/* Updated time */}
        <p className="text-xs text-slate-500">{relativeTime}</p>

        {/* Menu */}
        {menuOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <button
              onClick={() => {
                onEdit(page);
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => {
                onDuplicate(page);
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2"
            >
              <Copy size={16} /> Duplicar
            </button>
            <button
              onClick={() => {
                onDelete(page);
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
            >
              <Trash2 size={16} /> Excluir
            </button>
            <button
              onClick={() => {
                onPublish?.(page);
                setMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded"
            >
              {page.status === 'published' ? '🔒 Despublicar' : '🌐 Publicar'}
            </button>
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded flex items-center gap-2"
            >
              <Settings size={16} /> Configurações
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 6. Component — `frontend/src/page/gallery/CreatePageModal.tsx`

```typescript
// frontend/src/page/gallery/CreatePageModal.tsx

import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreatePageModalProps {
  onClose: () => void;
  onCreatePage: (data: { title: string; slug: string; template_id?: string }) => Promise<any>;
}

export function CreatePageModal({ onClose, onCreatePage }: CreatePageModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', slug: '' });
  const [slugError, setSlugError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateSlug = (slug: string) => {
    const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return pattern.test(slug) && slug.length > 0;
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toLowerCase();
    value = value.replace(/[^a-z0-9-]/g, '');
    if (value.startsWith('-')) value = value.slice(1);

    setFormData({ ...formData, slug: value });
    setSlugError(validateSlug(value) ? '' : 'Slug inválido');
  };

  const handleNextStep = () => {
    if (!formData.title || !validateSlug(formData.slug)) {
      setSlugError('Preencha os campos corretamente');
      return;
    }
    setStep(2);
  };

  const handleCreateFromTemplate = async (templateId?: string) => {
    setIsLoading(true);
    try {
      const newPage = await onCreatePage({
        title: formData.title,
        slug: formData.slug,
        template_id: templateId,
      });
      navigate(`/editor/${newPage.id}`);
    } catch (error) {
      alert('Erro ao criar página');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-w-96 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold">Nova Página</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título da Página</label>
                <input
                  type="text"
                  placeholder="Ex: Homepage Consultoria"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL (Slug)</label>
                <input
                  type="text"
                  placeholder="homepage-consultoria"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {slugError && <p className="text-xs text-red-600 mt-1">{slugError}</p>}
                <p className="text-xs text-slate-500 mt-1">
                  URL: https://seusite.com/<strong>{formData.slug || 'slug'}</strong>
                </p>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                Próximo <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-4">Escolha como começar:</p>

              <button
                onClick={() => handleCreateFromTemplate()}
                disabled={isLoading}
                className="w-full border-2 border-slate-300 p-4 rounded text-left hover:border-slate-400 transition disabled:opacity-50"
              >
                <div className="font-medium">Começar em Branco</div>
                <div className="text-xs text-slate-500">Crie sua página do zero</div>
              </button>

              <button
                onClick={() => navigate(`/page/templates`)}
                className="w-full bg-blue-50 border-2 border-blue-200 p-4 rounded text-left hover:border-blue-300 transition"
              >
                <div className="font-medium text-blue-900">Escolher Template</div>
                <div className="text-xs text-blue-600">Selecione um modelo pronto</div>
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-sm text-slate-600 hover:text-slate-900 py-2"
              >
                ← Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### 7. Component — `frontend/src/page/gallery/PagesGallery.tsx` (REESCREVER)

```typescript
// frontend/src/page/gallery/PagesGallery.tsx

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePages } from '@/hooks/usePages';
import { usePageLimits } from '@/hooks/usePageLimits';
import { PageCard } from './PageCard';
import { CreatePageModal } from './CreatePageModal';
import type { Page, PageStatus } from '@/types/page.types';

export function PagesGallery() {
  const navigate = useNavigate();
  const { pages, createPage, deletePage, duplicatePage, publishPage } = usePages();
  const { isAtLimit, remaining } = usePageLimits(pages);
  const [filter, setFilter] = useState<PageStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPages = pages.filter((page) => {
    const matchesFilter = filter === 'all' || page.status === filter;
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreatePage = async (data: any) => {
    const newPage = await createPage(data);
    setShowCreateModal(false);
    return newPage;
  };

  const handleEditPage = (page: Page) => {
    navigate(`/editor/${page.id}`);
  };

  const handleDeletePage = async (page: Page) => {
    if (confirm(`Deseja arquivar a página "${page.title}"?`)) {
      await deletePage(page.id);
    }
  };

  const handleDuplicatePage = async (page: Page) => {
    const newPage = await duplicatePage(page.id);
    alert(`Página duplicada: ${newPage.title}`);
  };

  const handlePublishPage = async (page: Page) => {
    await publishPage(page.id);
  };

  return (
    <div className="w-full h-full p-8 bg-slate-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Minhas Páginas</h1>
        <p className="text-slate-600">
          {remaining > 0
            ? `${remaining} página(s) restante(s) no seu plano`
            : 'Limite de páginas atingido'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={isAtLimit}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Nova Página
        </button>

        {/* Search */}
        <div className="flex-1 relative max-w-md">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar página..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {f === 'all' ? 'Todas' : f === 'published' ? 'Publicadas' : f === 'draft' ? 'Rascunhos' : 'Arquivadas'}
          </button>
        ))}
      </div>

      {/* Pages Grid */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredPages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={handleEditPage}
              onDuplicate={handleDuplicatePage}
              onDelete={handleDeletePage}
              onPublish={handlePublishPage}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-slate-500 mb-4">
            {searchTerm ? 'Nenhuma página encontrada' : 'Nenhuma página criada'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Crie sua primeira página →
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePageModal onClose={() => setShowCreateModal(false)} onCreatePage={handleCreatePage} />
      )}
    </div>
  );
}
```

---

### 8. Component — `frontend/src/page/templates/TemplateCard.tsx`

```typescript
// frontend/src/page/templates/TemplateCard.tsx

import React, { useState } from 'react';
import type { PageTemplate } from '@/types/page.types';

interface TemplateCardProps {
  template: PageTemplate;
  onPreview: (template: PageTemplate) => void;
  onUse: (template: PageTemplate) => void;
}

export function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer transition-all"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Thumbnail */}
      <div
        className={`aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative transition-transform ${
          isHovering ? 'scale-110' : 'scale-100'
        }`}
      >
        {template.thumbnail_url && (
          <img
            src={template.thumbnail_url}
            alt={template.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Title */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{template.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{template.description}</p>

        {/* Buttons (show on hover) */}
        {isHovering && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onPreview(template)}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded hover:bg-slate-50 transition font-medium"
            >
              👁️ Preview
            </button>
            <button
              onClick={() => onUse(template)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
            >
              ✓ Usar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 9. Component — `frontend/src/page/templates/TemplatePreview.tsx`

```typescript
// frontend/src/page/templates/TemplatePreview.tsx

import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import type { PageTemplate } from '@/types/page.types';

interface TemplatePreviewProps {
  template: PageTemplate;
  onClose: () => void;
  onUse: (template: PageTemplate) => void;
}

export function TemplatePreview({ template, onClose, onUse }: TemplatePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={20} />
          Voltar aos templates
        </button>

        <button
          onClick={() => onUse(template)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Usar este template
        </button>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-4xl h-full max-h-screen rounded-lg shadow-lg">
          {template.preview_url ? (
            <iframe src={template.preview_url} className="w-full h-full rounded-lg" />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>Preview não disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white rounded-lg hover:bg-slate-50 transition"
      >
        <X size={24} />
      </button>
    </div>
  );
}
```

---

### 10. Page — `frontend/src/page/templates/TemplatesPage.tsx`

```typescript
// frontend/src/page/templates/TemplatesPage.tsx

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pageApi from '@/services/pageApi';
import type { PageTemplate, TemplateCategory } from '@/types/page.types';
import { TemplateCard } from './TemplateCard';
import { TemplatePreview } from './TemplatePreview';
import { CreatePageModal } from '../gallery/CreatePageModal';

const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'landing_page', label: 'Landing Page' },
  { id: 'institutional', label: 'Site Institucional' },
  { id: 'capture', label: 'Captura' },
  { id: 'sales', label: 'Vendas' },
  { id: 'legal', label: 'Jurídico' },
];

export function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await pageApi.getTemplates();
        setTemplates(response.data);
      } catch (error) {
        console.error('Failed to fetch templates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleUseTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    setPreviewTemplate(null);
    setShowCreateModal(true);
  };

  const handleCreateFromTemplate = async (data: any) => {
    if (!selectedTemplate) return;

    try {
      const newPage = await pageApi.createFromTemplate(selectedTemplate.id, data);
      navigate(`/editor/${newPage.data.id}`);
    } catch (error) {
      alert('Erro ao criar página a partir do template');
    }
  };

  if (isLoading) {
    return <div className="p-8">Carregando templates...</div>;
  }

  return (
    <div className="w-full h-full p-8 bg-slate-50">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/page')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Escolha um Template</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Todos
        </button>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={setPreviewTemplate}
            onUse={handleUseTemplate}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleUseTemplate}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && selectedTemplate && (
        <CreatePageModal
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTemplate(null);
          }}
          onCreatePage={handleCreateFromTemplate}
        />
      )}
    </div>
  );
}
```

---

## Routing

Adicionar rotas em `frontend/src/App.tsx`:

```typescript
import { TemplatesPage } from '@/page/templates/TemplatesPage';
import { PagesGallery } from '@/page/gallery/PagesGallery';

// Em Routes:
<Route path="/page" element={<PagesGallery />} />
<Route path="/page/templates" element={<TemplatesPage />} />
```

---

## Critérios de Aceite

### ✅ Fase 2 Completa Quando:

1. **PagesGallery renderiza**:
   - [ ] Header "Minhas Páginas" com contador de páginas restantes
   - [ ] Botão "+ Nova Página" (desabilitado se isAtLimit)
   - [ ] Barra de busca funcional
   - [ ] Filtros (Todas, Publicadas, Rascunhos, Arquivadas)
   - [ ] Grid 3 colunas com PageCard

2. **PageCard funcional**:
   - [ ] Exibe thumbnail, título, badge status
   - [ ] Menu 3 pontos com: Editar, Duplicar, Excluir, Publicar/Despublicar, Configurações
   - [ ] "Editada há X" com tempo relativo

3. **CreatePageModal (2 passos)**:
   - [ ] Passo 1: Título + Slug com preview URL e validação unicidade
   - [ ] Passo 2: "Começar em branco" OU "Escolher Template"
   - [ ] "Escolher Template" navega para `/page/templates`
   - [ ] Criar redireciona `/editor/:id`

4. **TemplatesPage separada**:
   - [ ] URL `/page/templates` funciona
   - [ ] Header "← Voltar" + "Escolha um Template"
   - [ ] Filtros por categoria (Todos, Landing Page, Site Institucional, etc)
   - [ ] Grid 3 colunas com TemplateCard

5. **TemplateCard com hover**:
   - [ ] Hover expande thumbnail (scale 110%)
   - [ ] Botões [👁️ Preview] [✓ Usar] aparecem no hover

6. **TemplatePreview full-screen**:
   - [ ] Barra "← Voltar aos templates" + "Usar este template"
   - [ ] Esc fecha preview
   - [ ] "Usar este template" abre CreatePageModal

### ✅ Output Esperado:
- Galeria renderiza com cards
- Todos os filtros funcionam
- CreatePageModal 2 passos completos
- TemplatesPage em `/page/templates`
- Preview full-screen implementado
- Navegação entre páginas sem erros

---

## Próxima Fase

**Fase 3a**: Layout Full-Screen do Editor
- Montar layout 100vw × 100vh com TopBar, Sidebar, Canvas, RightPanel
- Implementar controles flutuantes
- AddBlockPanel com 6 layouts de coluna

