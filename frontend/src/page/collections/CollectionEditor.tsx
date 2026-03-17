import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Loader2, Zap } from 'lucide-react';
import type { Field, TemplateBinding } from '@/services/collectionsApi';
import type { CollectionDetail } from '@/services/collectionsApi';
import { ItemsTable } from './ItemsTable';

const FIELD_TYPES: { value: Field['type']; label: string }[] = [
  { value: 'text', label: 'Texto curto' },
  { value: 'textarea', label: 'Texto longo' },
  { value: 'number', label: 'Número' },
  { value: 'email', label: 'E-mail' },
  { value: 'url', label: 'URL' },
  { value: 'date', label: 'Data' },
  { value: 'image', label: 'Imagem (URL)' },
  { value: 'select', label: 'Seleção' },
];

interface PublishDialogProps {
  bindings: TemplateBinding[];
  collectionId: string;
  onPublish: (pageId: string, bindingId: string) => Promise<void>;
  onClose: () => void;
}

function PublishDialog({ bindings, onPublish, onClose }: PublishDialogProps) {
  const [bindingId, setBindingId] = useState(bindings[0]?.id ?? '');
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ pages_generated: number; duration_ms: number } | null>(null);

  async function handlePublish() {
    const binding = bindings.find((b) => b.id === bindingId);
    if (!binding) return;
    setPublishing(true);
    try {
      await onPublish(binding.page_id, bindingId);
      setResult({ pages_generated: 0, duration_ms: 0 }); // atualizado pelo hook
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Publicar todas as páginas</h3>

        {bindings.length === 0 ? (
          <p className="text-sm text-slate-500 mb-4">
            Nenhum template binding configurado. Adicione um binding primeiro.
          </p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Template binding</label>
              <select
                value={bindingId}
                onChange={(e) => setBindingId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {bindings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.url_pattern}
                  </option>
                ))}
              </select>
            </div>

            {result && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                {result.pages_generated} páginas publicadas em {result.duration_ms}ms
              </div>
            )}
          </>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Fechar
          </button>
          {bindings.length > 0 && (
            <button
              onClick={handlePublish}
              disabled={publishing || !bindingId}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {publishing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              {publishing ? 'Publicando...' : 'Publicar todas'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface CollectionEditorProps {
  collection: CollectionDetail;
  onBack: () => void;
  onUpdate: (data: { name?: string; description?: string; fields?: Field[] }) => Promise<void>;
  onAddItem: (data: Record<string, unknown>) => Promise<void>;
  onUpdateItem: (itemId: string, data: Record<string, unknown>) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onReorderItems: (newOrder: { id: string; order_index: number }[]) => Promise<void>;
  onPublishAll: (pageId: string, bindingId: string) => Promise<void>;
  items: import('@/services/collectionsApi').CollectionItem[];
}

export function CollectionEditor({
  collection,
  onBack,
  onUpdate,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onReorderItems,
  onPublishAll,
  items,
}: CollectionEditorProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'fields'>('items');
  const [fields, setFields] = useState<Field[]>([...(collection.fields as Field[])]);
  const [savingFields, setSavingFields] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  useEffect(() => {
    setFields([...(collection.fields as Field[])]);
  }, [collection.fields]);

  function addField() {
    setFields((prev) => [
      ...prev,
      { name: '', slug: '', type: 'text', required: false },
    ]);
  }

  function removeField(idx: number) {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateField(idx: number, patch: Partial<Field>) {
    setFields((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      // Auto-gerar slug a partir do nome
      if (patch.name !== undefined) {
        next[idx].slug = patch.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_|_$/g, '');
      }
      return next;
    });
  }

  async function saveFields() {
    setSavingFields(true);
    try {
      await onUpdate({ fields });
    } finally {
      setSavingFields(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800">{collection.name}</h1>
          <p className="text-sm text-slate-500">/{collection.slug}</p>
        </div>
        <button
          onClick={() => setShowPublishDialog(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <Zap size={16} />
          Publicar todas
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {(['items', 'fields'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'items' ? 'Itens' : 'Campos'}
          </button>
        ))}
      </div>

      {/* Tab: Items */}
      {activeTab === 'items' && (
        <ItemsTable
          collectionName={collection.name}
          fields={collection.fields as Field[]}
          items={items}
          onAdd={onAddItem}
          onUpdate={onUpdateItem}
          onDelete={onDeleteItem}
          onReorder={onReorderItems}
        />
      )}

      {/* Tab: Fields */}
      {activeTab === 'fields' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">Campos da collection</h3>
            <button
              onClick={addField}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Adicionar campo
            </button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">
              Nenhum campo. Clique em "Adicionar campo" para começar.
            </p>
          )}

          <div className="space-y-3">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[1fr_1fr_auto_auto] gap-3 items-center p-3 bg-slate-50 rounded-lg"
              >
                <input
                  placeholder="Nome do campo (ex: Título)"
                  value={field.name}
                  onChange={(e) => updateField(idx, { name: e.target.value })}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={field.type}
                  onChange={(e) => updateField(idx, { type: e.target.value as Field['type'] })}
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(idx, { required: e.target.checked })}
                    className="rounded"
                  />
                  Obrig.
                </label>
                <button
                  onClick={() => removeField(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {fields.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={saveFields}
                disabled={savingFields}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {savingFields ? <Loader2 size={14} className="animate-spin" /> : null}
                {savingFields ? 'Salvando...' : 'Salvar campos'}
              </button>
            </div>
          )}
        </div>
      )}

      {showPublishDialog && (
        <PublishDialog
          bindings={collection.template_bindings}
          collectionId={collection.id}
          onPublish={onPublishAll}
          onClose={() => setShowPublishDialog(false)}
        />
      )}
    </div>
  );
}
