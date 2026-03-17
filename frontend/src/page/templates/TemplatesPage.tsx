import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import pageApi from '@/services/pageApi';
import type { PageTemplate, TemplateCategory, CreatePageInput } from '@/types/page.types';
import { TemplateCard } from './TemplateCard';
import { TemplatePreview } from './TemplatePreview';
import { CreatePageModal } from '@/page/gallery/CreatePageModal';

type FilterOption = TemplateCategory | 'all';

const CATEGORY_LABELS: { id: FilterOption; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'landing_page', label: 'Landing Page' },
  { id: 'institutional', label: 'Site Institucional' },
  { id: 'capture', label: 'Captura' },
  { id: 'sales', label: 'Vendas' },
  { id: 'legal', label: 'Jurídico' },
];

export function TemplatesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pageDataFromModal = location.state as { title: string; slug: string } | null;

  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>('all');
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    pageApi.getTemplates()
      .then((res) => setTemplates(res.data))
      .catch(() => console.error('Falha ao carregar templates'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleUseTemplate = async (template: PageTemplate) => {
    setPreviewTemplate(null);
    if (pageDataFromModal?.title && pageDataFromModal?.slug) {
      setIsCreating(true);
      try {
        const res = await pageApi.createFromTemplate(template.id, {
          title: pageDataFromModal.title,
          slug: pageDataFromModal.slug,
        });
        navigate(`/editor/${res.data.id}`);
      } catch {
        alert('Erro ao criar página. Tente novamente.');
      } finally {
        setIsCreating(false);
      }
    } else {
      setSelectedTemplate(template);
      setShowCreateModal(true);
    }
  };

  const handleCreateFromTemplate = async (data: CreatePageInput) => {
    if (!selectedTemplate) return { id: '' };
    const res = await pageApi.createFromTemplate(selectedTemplate.id, data);
    navigate(`/editor/${res.data.id}`);
    return res.data;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Carregando templates...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 bg-slate-50 overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/page')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition text-sm"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Escolha um Template</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_LABELS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredTemplates.length > 0 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${isCreating ? 'opacity-50 pointer-events-none' : ''}`}>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={setPreviewTemplate}
              onUse={handleUseTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          Nenhum template nesta categoria.
        </div>
      )}

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={handleUseTemplate}
        />
      )}

      {showCreateModal && selectedTemplate && (
        <CreatePageModal
          onClose={() => { setShowCreateModal(false); setSelectedTemplate(null); }}
          onCreatePage={handleCreateFromTemplate}
        />
      )}
    </div>
  );
}
