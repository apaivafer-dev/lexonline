import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Zap, Loader2, Database } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { CollectionEditor } from './CollectionEditor';
import type { Field } from '@/services/collectionsApi';

// ── Modal: Nova Collection ─────────────────────────────────────────────────────

interface CreateCollectionModalProps {
  onSave: (name: string, slug: string) => Promise<void>;
  onClose: () => void;
}

function CreateCollectionModal({ onSave, onClose }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleNameChange(val: string) {
    setName(val);
    if (!slugEdited) {
      setSlug(
        val
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError('Nome e slug são obrigatórios');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave(name.trim(), slug.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar collection');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Nova Collection</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="ex: Áreas de Atuação"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 text-sm text-slate-400 bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg">
                /
              </span>
              <input
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
                placeholder="areas-de-atuacao"
                className="flex-1 border border-slate-300 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              Criar collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────────

export function CollectionsPage() {
  const {
    collections,
    currentCollection,
    items,
    loading,
    error,
    publishingProgress,
    fetchCollections,
    fetchCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    publishAllPages,
  } = useCollections();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'editor'>('list');

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  async function handleCreateCollection(name: string, slug: string) {
    await createCollection(name, slug, []);
  }

  async function handleOpenEditor(id: string) {
    await fetchCollection(id);
    setView('editor');
  }

  function handleBackToList() {
    setView('list');
  }

  if (view === 'editor' && currentCollection) {
    return (
      <CollectionEditor
        collection={currentCollection}
        items={items}
        onBack={handleBackToList}
        onUpdate={(data) => updateCollection(currentCollection.id, data)}
        onAddItem={(data) => addItem(currentCollection.id, data)}
        onUpdateItem={(itemId, data) => updateItem(currentCollection.id, itemId, data)}
        onDeleteItem={(itemId) => deleteItem(currentCollection.id, itemId)}
        onReorderItems={(order) => reorderItems(currentCollection.id, order)}
        onPublishAll={(pageId, bindingId) => publishAllPages(currentCollection.id, pageId, bindingId)}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Collections</h1>
          <p className="text-sm text-slate-500 mt-1">
            Crie e gerencie dados estruturados para páginas dinâmicas
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nova Collection
        </button>
      </div>

      {/* Estado de publicação */}
      {publishingProgress.status === 'publishing' && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">
            Publicando páginas... {publishingProgress.completed}/{publishingProgress.total}
          </span>
        </div>
      )}
      {publishingProgress.status === 'done' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {publishingProgress.completed} páginas publicadas com sucesso.
        </div>
      )}

      {/* Conteúdo */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-slate-300" />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && collections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Database size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">Nenhuma collection ainda</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm">
            Collections permitem criar páginas dinâmicas a partir de dados estruturados,
            como áreas de atuação, equipe ou jurisprudência.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus size={16} />
            Criar primeira collection
          </button>
        </div>
      )}

      {!loading && collections.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Nome
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Slug
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Campos
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Itens
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{col.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">/{col.slug}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{col.fieldCount}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{col.itemCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditor(col.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={13} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleOpenEditor(col.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                        title="Publicar"
                      >
                        <Zap size={13} />
                        Publicar
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(col.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modais */}
      {showCreateModal && (
        <CreateCollectionModal
          onSave={handleCreateCollection}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Excluir collection?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Todos os itens e bindings serão removidos. Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await deleteCollection(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
