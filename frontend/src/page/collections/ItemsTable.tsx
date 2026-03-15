import React, { useState } from 'react';
import { Pencil, Trash2, Plus, GripVertical } from 'lucide-react';
import type { CollectionItem, Field } from '@/services/collectionsApi';

interface ItemFormModalProps {
  fields: Field[];
  item: CollectionItem | null;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

function ItemFormModal({ fields, item, onSave, onClose }: ItemFormModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(
    item?.data ?? {}
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    for (const f of fields) {
      if (f.required && !formData[f.slug]) {
        errs[f.slug] = `${f.name} é obrigatório`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  function renderInput(field: Field) {
    const value = String(formData[field.slug] ?? '');
    const onChange = (val: string) => setFormData((prev) => ({ ...prev, [field.slug]: val }));

    if (field.type === 'textarea') {
      return (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      );
    }
    if (field.type === 'select' && field.options) {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecione...</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={field.type === 'image' ? 'url' : field.type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.type === 'image' ? 'URL da imagem' : `Digite ${field.name.toLowerCase()}`}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {item ? 'Editar item' : 'Novo item'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.slug}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderInput(field)}
              {errors[field.slug] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.slug]}</p>
              )}
            </div>
          ))}

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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ItemsTableProps {
  collectionName: string;
  fields: Field[];
  items: CollectionItem[];
  onAdd: (data: Record<string, unknown>) => Promise<void>;
  onUpdate: (itemId: string, data: Record<string, unknown>) => Promise<void>;
  onDelete: (itemId: string) => Promise<void>;
  onReorder: (newOrder: { id: string; order_index: number }[]) => Promise<void>;
}

export function ItemsTable({
  collectionName,
  fields,
  items,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
}: ItemsTableProps) {
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const displayFields = fields.slice(0, 3); // Máx 3 colunas na tabela

  function getCellValue(item: CollectionItem, field: Field): string {
    const val = item.data[field.slug];
    if (val === undefined || val === null) return '—';
    if (field.type === 'image') return '[imagem]';
    return String(val).slice(0, 60);
  }

  // Drag & drop simples via índice
  function handleDragStart(idx: number) {
    setDragIndex(idx);
  }

  function handleDrop(targetIdx: number) {
    if (dragIndex === null || dragIndex === targetIdx) return;
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIdx, 0, moved);
    const newOrder = reordered.map((item, i) => ({ id: item.id, order_index: i }));
    onReorder(newOrder);
    setDragIndex(null);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div>
          <h3 className="font-semibold text-slate-800">{collectionName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Novo item
        </button>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div className="px-6 py-12 text-center text-slate-400 text-sm">
          Nenhum item ainda. Clique em "Novo item" para começar.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="w-8 px-4 py-3" />
                {displayFields.map((f) => (
                  <th key={f.slug} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {f.name}
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${dragIndex === idx ? 'opacity-50' : ''}`}
                >
                  <td className="px-4 py-3 cursor-grab text-slate-300">
                    <GripVertical size={16} />
                  </td>
                  {displayFields.map((f) => (
                    <td key={f.slug} className="px-4 py-3 text-slate-700">
                      {f.type === 'image' && item.data[f.slug] ? (
                        <img
                          src={String(item.data[f.slug])}
                          alt=""
                          className="h-8 w-12 object-cover rounded"
                        />
                      ) : (
                        <span className="truncate max-w-xs block">{getCellValue(item, f)}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(item.id)}
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
      {showAddModal && (
        <ItemFormModal
          fields={fields}
          item={null}
          onSave={onAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingItem && (
        <ItemFormModal
          fields={fields}
          item={editingItem}
          onSave={(data) => onUpdate(editingItem.id, data)}
          onClose={() => setEditingItem(null)}
        />
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Excluir item?</h3>
            <p className="text-sm text-slate-500 mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await onDelete(confirmDeleteId);
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
