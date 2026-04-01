# LEX_SITE04 — Fase 3a: Layout Full-Screen do Editor

## Título
LEX_SITE04 — Fase 3a: Layout Full-Screen do Editor

## Objetivo
Montar o layout principal do editor visual (100vw × 100vh) com TopBar, Sidebar hover-only, Canvas central e RightPanel colapsável. Implementar controles flutuantes de bloco, AddBlockPanel com ColumnLayoutSelector, SaveToggle, PublishButton com confirmação.

## Dependência
- Requer: **Fase 2** (Galeria + Templates)
- Bloqueia: Fase 3b (Blocos Inteligentes)

---

## Arquivos a Criar

### Page Component
- [ ] `frontend/src/page/editor/PageEditor.tsx` (novo)

### Layout Components
- [ ] `frontend/src/page/editor/TopBar/TopBar.tsx` (novo)
- [ ] `frontend/src/page/editor/TopBar/PublishButton.tsx` (novo)
- [ ] `frontend/src/page/editor/TopBar/DeviceSelector.tsx` (novo)
- [ ] `frontend/src/page/editor/TopBar/SaveToggle.tsx` (novo)
- [ ] `frontend/src/page/editor/TopBar/SaveIndicator.tsx` (novo)
- [ ] `frontend/src/page/editor/Sidebar/Sidebar.tsx` (novo)
- [ ] `frontend/src/page/editor/Sidebar/ElementsSearch.tsx` (novo)
- [ ] `frontend/src/page/editor/Sidebar/ElementCategory.tsx` (novo)
- [ ] `frontend/src/page/editor/Canvas/Canvas.tsx` (novo)
- [ ] `frontend/src/page/editor/Canvas/CanvasAddButton.tsx` (novo)
- [ ] `frontend/src/page/editor/Canvas/AddBlockPanel.tsx` (novo)
- [ ] `frontend/src/page/editor/Canvas/ColumnLayoutSelector.tsx` (novo)
- [ ] `frontend/src/page/editor/RightPanel/RightPanel.tsx` (novo)

### Hooks
- [ ] `frontend/src/hooks/useEditorLayout.ts` (novo)
- [ ] `frontend/src/hooks/useEditorState.ts` (novo)

### Types (update)
- [ ] `frontend/src/types/editor.types.ts` (novo)

### Stores
- [ ] `frontend/src/stores/editorReducer.ts` (novo)

---

## Detalhamento

### 1. Types — `frontend/src/types/editor.types.ts`

```typescript
// frontend/src/types/editor.types.ts

export type EditorAction =
  | { type: 'SET_DEVICE'; device: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SET_SIDEBAR_VISIBLE'; visible: boolean }
  | { type: 'SET_RIGHT_PANEL_OPEN'; open: boolean }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_AUTO_SAVE'; enabled: boolean }
  | { type: 'SET_DIRTY'; isDirty: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_HISTORY'; history: any[] }
  | { type: 'SET_SELECTED_ELEMENT'; element: any | null }
  | { type: 'ADD_BLOCK'; block: any; afterIndex?: number }
  | { type: 'REMOVE_BLOCK'; blockIndex: number }
  | { type: 'UPDATE_ELEMENT'; elementId: string; data: any }
  | { type: 'REORDER_BLOCKS'; fromIndex: number; toIndex: number };

export interface EditorState {
  device: 'desktop' | 'tablet' | 'mobile';
  sidebarVisible: boolean;
  rightPanelOpen: boolean;
  zoom: number;
  autoSave: boolean;
  isDirty: boolean;
  selectedElement: any | null;
  history: any[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export const DEVICE_WIDTHS: Record<EditorState['device'], number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
};
```

---

### 2. Reducer — `frontend/src/stores/editorReducer.ts`

```typescript
// frontend/src/stores/editorReducer.ts

import type { EditorState, EditorAction } from '@/types/editor.types';

const initialState: EditorState = {
  device: 'desktop',
  sidebarVisible: false,
  rightPanelOpen: false,
  zoom: 100,
  autoSave: true,
  isDirty: false,
  selectedElement: null,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
};

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_DEVICE':
      return { ...state, device: action.device };

    case 'SET_SIDEBAR_VISIBLE':
      return { ...state, sidebarVisible: action.visible };

    case 'SET_RIGHT_PANEL_OPEN':
      // Ao abrir painel direito, fechar sidebar
      return {
        ...state,
        rightPanelOpen: action.open,
        sidebarVisible: action.open ? false : state.sidebarVisible,
      };

    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom };

    case 'SET_AUTO_SAVE':
      return { ...state, autoSave: action.enabled };

    case 'SET_DIRTY':
      return { ...state, isDirty: action.isDirty };

    case 'SET_SELECTED_ELEMENT':
      return { ...state, selectedElement: action.element };

    case 'UNDO':
      if (state.historyIndex <= 0) return state;
      return {
        ...state,
        historyIndex: state.historyIndex - 1,
        canRedo: true,
        canUndo: state.historyIndex - 1 > 0,
      };

    case 'REDO':
      if (state.historyIndex >= state.history.length - 1) return state;
      return {
        ...state,
        historyIndex: state.historyIndex + 1,
        canRedo: state.historyIndex + 1 < state.history.length - 1,
        canUndo: true,
      };

    case 'SET_HISTORY':
      return {
        ...state,
        history: action.history,
        historyIndex: action.history.length - 1,
        canUndo: action.history.length > 1,
        canRedo: false,
      };

    default:
      return state;
  }
}

export { initialState };
```

---

### 3. Hook — `frontend/src/hooks/useEditorLayout.ts`

```typescript
// frontend/src/hooks/useEditorLayout.ts

import { useReducer, useCallback } from 'react';
import { editorReducer, initialState } from '@/stores/editorReducer';
import type { EditorState, EditorAction } from '@/types/editor.types';

export function useEditorLayout() {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const setDevice = useCallback((device: EditorState['device']) => {
    dispatch({ type: 'SET_DEVICE', device });
  }, []);

  const setSidebarVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_VISIBLE', visible });
  }, []);

  const setRightPanelOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_RIGHT_PANEL_OPEN', open });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', zoom });
  }, []);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', enabled });
  }, []);

  const setDirty = useCallback((isDirty: boolean) => {
    dispatch({ type: 'SET_DIRTY', isDirty });
  }, []);

  const setSelectedElement = useCallback((element: any | null) => {
    dispatch({ type: 'SET_SELECTED_ELEMENT', element });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  return {
    ...state,
    setDevice,
    setSidebarVisible,
    setRightPanelOpen,
    setZoom,
    setAutoSave,
    setDirty,
    setSelectedElement,
    undo,
    redo,
  };
}
```

---

### 4. Hook — `frontend/src/hooks/useEditorState.ts`

```typescript
// frontend/src/hooks/useEditorState.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import pageApi from '@/services/pageApi';
import type { Page } from '@/types/page.types';

export function useEditorState(pageId: string) {
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await pageApi.getPageById(pageId);
        setPage(response.data);
      } catch (error) {
        setSaveError('Falha ao carregar página');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [pageId]);

  const savePage = useCallback(
    async (schema: any) => {
      if (!page) return;

      setIsSaving(true);
      setSaveError(null);

      try {
        const response = await pageApi.updatePage(page.id, { schema });
        setPage(response.data);
      } catch (error) {
        setSaveError('Erro ao salvar página');
      } finally {
        setIsSaving(false);
      }
    },
    [page]
  );

  const debouncedSave = useCallback(
    (schema: any) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(() => {
        savePage(schema);
      }, 2000); // 2 segundos
    },
    [savePage]
  );

  return {
    page,
    isLoading,
    isSaving,
    saveError,
    savePage,
    debouncedSave,
  };
}
```

---

### 5. Component — `frontend/src/page/editor/TopBar/SaveIndicator.tsx`

```typescript
// frontend/src/page/editor/TopBar/SaveIndicator.tsx

import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface SaveIndicatorProps {
  isSaving: boolean;
  hasError: boolean;
}

export function SaveIndicator({ isSaving, hasError }: SaveIndicatorProps) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-slate-600">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-xs">Salvando...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle size={16} />
        <span className="text-xs">Erro ao salvar</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-600">
      <Check size={16} />
      <span className="text-xs">Salvo</span>
    </div>
  );
}
```

---

### 6. Component — `frontend/src/page/editor/TopBar/SaveToggle.tsx`

```typescript
// frontend/src/page/editor/TopBar/SaveToggle.tsx

import React from 'react';
import { Save } from 'lucide-react';

interface SaveToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onManualSave?: () => void;
}

export function SaveToggle({ enabled, onToggle, onManualSave }: SaveToggleProps) {
  return (
    <div className="flex items-center gap-2">
      {!enabled && (
        <button
          onClick={onManualSave}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          <Save size={16} />
          Salvar
        </button>
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded"
        />
        <span className="text-xs text-slate-600">Auto-save</span>
      </label>
    </div>
  );
}
```

---

### 7. Component — `frontend/src/page/editor/TopBar/DeviceSelector.tsx`

```typescript
// frontend/src/page/editor/TopBar/DeviceSelector.tsx

import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import type { EditorState } from '@/types/editor.types';

interface DeviceSelectorProps {
  device: EditorState['device'];
  onDeviceChange: (device: EditorState['device']) => void;
}

const devices = [
  { id: 'desktop' as const, label: 'Desktop', icon: Monitor },
  { id: 'tablet' as const, label: 'Tablet', icon: Tablet },
  { id: 'mobile' as const, label: 'Mobile', icon: Smartphone },
];

export function DeviceSelector({ device, onDeviceChange }: DeviceSelectorProps) {
  return (
    <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-1">
      {devices.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onDeviceChange(id)}
          title={label}
          className={`p-2 rounded transition ${
            device === id
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}
```

---

### 8. Component — `frontend/src/page/editor/TopBar/PublishButton.tsx`

```typescript
// frontend/src/page/editor/TopBar/PublishButton.tsx

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import type { Page } from '@/types/page.types';

interface PublishButtonProps {
  page: Page | null;
  isDirty: boolean;
  onPublish: () => Promise<void>;
}

export function PublishButton({ page, isDirty, onPublish }: PublishButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!page) return null;

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
      setShowModal(false);
    } finally {
      setIsPublishing(false);
    }
  };

  const isPublished = page.status === 'published';

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
          isPublished
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <Globe size={18} />
        {isPublished ? 'Publicada' : 'Publicar'}
      </button>

      {/* Confirmation Modal */}
      {showModal && isDirty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h2 className="text-lg font-bold mb-4">Publicar Página</h2>
            <p className="text-slate-600 mb-6">
              Você tem alterações não salvas. Deseja salvar e publicar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isPublishing ? 'Salvando...' : 'Salvar e Publicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

---

### 9. Component — `frontend/src/page/editor/TopBar/TopBar.tsx`

```typescript
// frontend/src/page/editor/TopBar/TopBar.tsx

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Page } from '@/types/page.types';
import type { EditorState } from '@/types/editor.types';
import { DeviceSelector } from './DeviceSelector';
import { SaveToggle } from './SaveToggle';
import { SaveIndicator } from './SaveIndicator';
import { PublishButton } from './PublishButton';

interface TopBarProps {
  page: Page | null;
  device: EditorState['device'];
  onDeviceChange: (device: EditorState['device']) => void;
  autoSave: boolean;
  onAutoSaveToggle: (enabled: boolean) => void;
  isSaving: boolean;
  saveError: boolean;
  isDirty: boolean;
  onPublish: () => Promise<void>;
  onManualSave?: () => void;
}

export function TopBar({
  page,
  device,
  onDeviceChange,
  autoSave,
  onAutoSaveToggle,
  isSaving,
  saveError,
  isDirty,
  onPublish,
  onManualSave,
}: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      {/* Left: Back Button + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/page')}
          className="p-2 hover:bg-slate-100 rounded transition"
          title="Voltar"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <p className="text-xs text-slate-500">Editando</p>
          <p className="font-semibold text-slate-900">{page?.title || 'Carregando...'}</p>
        </div>
      </div>

      {/* Center: Device Selector */}
      <div>
        <DeviceSelector device={device} onDeviceChange={onDeviceChange} />
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        <SaveIndicator isSaving={isSaving} hasError={saveError} />
        <SaveToggle
          enabled={autoSave}
          onToggle={onAutoSaveToggle}
          onManualSave={onManualSave}
        />
        <PublishButton page={page} isDirty={isDirty} onPublish={onPublish} />
      </div>
    </div>
  );
}
```

---

### 10. Component — `frontend/src/page/editor/Sidebar/ElementCategory.tsx`

```typescript
// frontend/src/page/editor/Sidebar/ElementCategory.tsx

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ElementCategoryProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function ElementCategory({ title, isOpen, onToggle }: ElementCategoryProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition text-left"
    >
      <ChevronDown
        size={16}
        className={`transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`}
      />
      <span className="text-sm font-medium text-slate-700">{title}</span>
    </button>
  );
}
```

---

### 11. Component — `frontend/src/page/editor/Sidebar/ElementsSearch.tsx`

```typescript
// frontend/src/page/editor/Sidebar/ElementsSearch.tsx

import React from 'react';
import { Search, X } from 'lucide-react';

interface ElementsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ElementsSearch({ value, onChange }: ElementsSearchProps) {
  return (
    <div className="relative mb-4">
      <Search size={16} className="absolute left-3 top-3 text-slate-400" />
      <input
        type="text"
        placeholder="Buscar elementos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-3 p-1 hover:bg-slate-100 rounded transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
```

---

### 12. Component — `frontend/src/page/editor/Sidebar/Sidebar.tsx`

```typescript
// frontend/src/page/editor/Sidebar/Sidebar.tsx

import React, { useState } from 'react';
import { ElementsSearch } from './ElementsSearch';
import { ElementCategory } from './ElementCategory';

const ELEMENT_CATEGORIES = [
  { id: 'text', label: 'Texto' },
  { id: 'media', label: 'Mídia' },
  { id: 'interaction', label: 'Interação' },
  { id: 'form', label: 'Formulário' },
  { id: 'layout', label: 'Layout' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'social', label: 'Social' },
  { id: 'advanced', label: 'Avançado' },
];

interface SidebarProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function Sidebar({ isVisible, onMouseEnter, onMouseLeave }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([ELEMENT_CATEGORIES[0].id])
  );

  const toggleCategory = (categoryId: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(categoryId)) {
      newOpen.delete(categoryId);
    } else {
      newOpen.add(categoryId);
    }
    setOpenCategories(newOpen);
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-slate-200 overflow-y-auto transition-all duration-200 z-30 ${
        isVisible ? 'w-72' : 'w-0'
      }`}
    >
      <div className="p-4">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Elementos</h3>

        <ElementsSearch value={searchTerm} onChange={setSearchTerm} />

        <div className="space-y-1">
          {ELEMENT_CATEGORIES.map((cat) => (
            <ElementCategory
              key={cat.id}
              title={cat.label}
              isOpen={openCategories.has(cat.id)}
              onToggle={() => toggleCategory(cat.id)}
            />
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-6 px-3">
          ℹ️ Use o botão "+" no canvas para adicionar blocos
        </p>
      </div>
    </div>
  );
}
```

---

### 13. Component — `frontend/src/page/editor/Canvas/ColumnLayoutSelector.tsx`

```typescript
// frontend/src/page/editor/Canvas/ColumnLayoutSelector.tsx

import React from 'react';
import { X } from 'lucide-react';

interface ColumnLayoutSelectorProps {
  onSelect: (layout: number[]) => void;
  onClose: () => void;
}

// 6 layouts: [12], [6, 6], [4, 4, 4], [3, 3, 3, 3], [7, 5], [8, 4]
const LAYOUTS = [
  { name: '1 Coluna', columns: [12] },
  { name: '2 Colunas (50/50)', columns: [6, 6] },
  { name: '3 Colunas (1/3 cada)', columns: [4, 4, 4] },
  { name: '4 Colunas (1/4 cada)', columns: [3, 3, 3, 3] },
  { name: '2 Colunas (60/40)', columns: [7, 5] },
  { name: '2 Colunas (66/33)', columns: [8, 4] },
];

export function ColumnLayoutSelector({
  onSelect,
  onClose,
}: ColumnLayoutSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Escolha um Layout</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {LAYOUTS.map((layout, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(layout.columns);
                onClose();
              }}
              className="p-4 border-2 border-slate-200 rounded hover:border-blue-500 transition text-left"
            >
              {/* Visual representation */}
              <div className="flex gap-1 mb-3 h-16 bg-slate-50 rounded p-2">
                {layout.columns.map((width, colIdx) => (
                  <div
                    key={colIdx}
                    className="bg-blue-100 border-2 border-blue-300 rounded flex-1"
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-slate-900">{layout.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 14. Component — `frontend/src/page/editor/Canvas/CanvasAddButton.tsx`

```typescript
// frontend/src/page/editor/Canvas/CanvasAddButton.tsx

import React from 'react';
import { Plus } from 'lucide-react';

interface CanvasAddButtonProps {
  onClick: () => void;
  position?: 'between' | 'end';
  visible?: boolean;
}

export function CanvasAddButton({
  onClick,
  position = 'end',
  visible = true,
}: CanvasAddButtonProps) {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 border-2 border-dashed border-slate-300 rounded-lg transition text-slate-600 hover:text-slate-900 my-2"
      title="Adicionar bloco"
    >
      <Plus size={20} />
    </button>
  );
}
```

---

### 15. Component — `frontend/src/page/editor/Canvas/AddBlockPanel.tsx`

```typescript
// frontend/src/page/editor/Canvas/AddBlockPanel.tsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ColumnLayoutSelector } from './ColumnLayoutSelector';

const BLOCK_CATEGORIES = [
  { id: 'hero', label: 'Hero' },
  { id: 'content', label: 'Conteúdo' },
  { id: 'form', label: 'Formulário' },
  { id: 'media', label: 'Mídia' },
];

interface AddBlockPanelProps {
  onClose: () => void;
  onAddBlock: (type: string) => void;
  onCreateFromLayout: (columns: number[]) => void;
}

export function AddBlockPanel({
  onClose,
  onAddBlock,
  onCreateFromLayout,
}: AddBlockPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState('hero');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);

  return (
    <>
      <div className="fixed left-0 top-16 w-72 h-[calc(100vh-64px)] bg-white border-r border-slate-200 shadow-lg z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900">Adicionar Bloco</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 py-3 border-b border-slate-200 overflow-x-auto">
          {BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-sm font-medium rounded transition whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Blocos (placeholder) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs text-slate-500">Blocos aparecem em Fase 3b</p>
        </div>

        {/* Create from Layout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => setShowLayoutSelector(true)}
            className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded hover:border-slate-400 transition text-sm font-medium text-slate-700"
          >
            ✦ Criar do Zero
          </button>
        </div>
      </div>

      {/* Layout Selector Modal */}
      {showLayoutSelector && (
        <ColumnLayoutSelector
          onSelect={onCreateFromLayout}
          onClose={() => setShowLayoutSelector(false)}
        />
      )}

      {/* Overlay para fechar ao clicar fora */}
      <div
        className="fixed inset-0 z-30"
        onClick={onClose}
      />
    </>
  );
}
```

---

### 16. Component — `frontend/src/page/editor/Canvas/Canvas.tsx`

```typescript
// frontend/src/page/editor/Canvas/Canvas.tsx

import React, { useState } from 'react';
import { DEVICE_WIDTHS } from '@/types/editor.types';
import { CanvasAddButton } from './CanvasAddButton';
import { AddBlockPanel } from './AddBlockPanel';
import type { EditorState } from '@/types/editor.types';
import type { Page } from '@/types/page.types';

interface CanvasProps {
  page: Page | null;
  device: EditorState['device'];
  showAddBlockPanel: boolean;
  onAddBlockPanelClose: () => void;
  onAddBlock: (type: string) => void;
  onCreateFromLayout: (columns: number[]) => void;
}

export function Canvas({
  page,
  device,
  showAddBlockPanel,
  onAddBlockPanelClose,
  onAddBlock,
  onCreateFromLayout,
}: CanvasProps) {
  const [addButtonVisible, setAddButtonVisible] = useState(true);

  const width = DEVICE_WIDTHS[device];

  return (
    <div className="flex-1 bg-slate-100 overflow-auto flex items-start justify-center py-8">
      <div
        className="bg-white rounded-lg shadow-lg min-h-screen"
        style={{
          width: `${width}px`,
        }}
      >
        {/* Canvas Content */}
        {page ? (
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-slate-600">
              Conteúdo será renderizado aqui em Fase 3b
            </p>

            {/* Add buttons between blocks */}
            <CanvasAddButton
              onClick={() => setAddButtonVisible(true)}
              position="end"
              visible={addButtonVisible}
            />
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center">
            <p className="text-slate-500">Carregando página...</p>
          </div>
        )}
      </div>

      {/* Add Block Panel */}
      {showAddBlockPanel && (
        <AddBlockPanel
          onClose={onAddBlockPanelClose}
          onAddBlock={onAddBlock}
          onCreateFromLayout={onCreateFromLayout}
        />
      )}
    </div>
  );
}
```

---

### 17. Component — `frontend/src/page/editor/RightPanel/RightPanel.tsx`

```typescript
// frontend/src/page/editor/RightPanel/RightPanel.tsx

import React from 'react';
import { X } from 'lucide-react';

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElement: any | null;
}

export function RightPanel({ isOpen, onClose, selectedElement }: RightPanelProps) {
  return (
    <div
      className={`fixed right-0 top-16 h-[calc(100vh-64px)] bg-white border-l border-slate-200 shadow-lg transition-all duration-200 z-40 overflow-y-auto ${
        isOpen ? 'w-80' : 'w-0'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">Propriedades</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        {selectedElement ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <p className="text-xs text-slate-500">{selectedElement.type}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Conteúdo</label>
              <textarea
                defaultValue={selectedElement.content || ''}
                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
              <input
                type="color"
                defaultValue="#ffffff"
                className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
              />
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
              Salvar Alterações
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Clique em um elemento para editar suas propriedades
          </p>
        )}
      </div>
    </div>
  );
}
```

---

### 18. Page — `frontend/src/page/editor/PageEditor.tsx`

```typescript
// frontend/src/page/editor/PageEditor.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useEditorLayout } from '@/hooks/useEditorLayout';
import { useEditorState } from '@/hooks/useEditorState';
import pageApi from '@/services/pageApi';
import { TopBar } from './TopBar/TopBar';
import { Sidebar } from './Sidebar/Sidebar';
import { Canvas } from './Canvas/Canvas';
import { RightPanel } from './RightPanel/RightPanel';

export function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const layout = useEditorLayout();
  const { page, isLoading, isSaving, saveError, savePage, debouncedSave } =
    useEditorState(id!);
  const [showAddBlockPanel, setShowAddBlockPanel] = useState(false);

  const handlePublish = useCallback(async () => {
    if (!page) return;
    try {
      await pageApi.publishPage(page.id);
      layout.setDirty(false);
    } catch (error) {
      console.error('Failed to publish page');
    }
  }, [page, layout]);

  const handleAddBlock = useCallback((type: string) => {
    console.log('Add block:', type);
    layout.setDirty(true);
    setShowAddBlockPanel(false);
  }, [layout]);

  const handleCreateFromLayout = useCallback((columns: number[]) => {
    console.log('Create from layout:', columns);
    layout.setDirty(true);
    setShowAddBlockPanel(false);
  }, [layout]);

  const handleAutoSave = useCallback(() => {
    if (layout.autoSave && layout.isDirty && page) {
      debouncedSave(page.schema);
    }
  }, [layout.autoSave, layout.isDirty, page, debouncedSave]);

  // Auto-save effect
  useEffect(() => {
    handleAutoSave();
  }, [layout.isDirty, handleAutoSave]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top Bar */}
      <TopBar
        page={page}
        device={layout.device}
        onDeviceChange={layout.setDevice}
        autoSave={layout.autoSave}
        onAutoSaveToggle={layout.setAutoSave}
        isSaving={isSaving}
        saveError={!!saveError}
        isDirty={layout.isDirty}
        onPublish={handlePublish}
        onManualSave={() => page && savePage(page.schema)}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (hover-only) */}
        <Sidebar
          isVisible={layout.sidebarVisible}
          onMouseEnter={() => layout.setSidebarVisible(true)}
          onMouseLeave={() => layout.setSidebarVisible(false)}
        />

        {/* Canvas */}
        <Canvas
          page={page}
          device={layout.device}
          showAddBlockPanel={showAddBlockPanel}
          onAddBlockPanelClose={() => setShowAddBlockPanel(false)}
          onAddBlock={handleAddBlock}
          onCreateFromLayout={handleCreateFromLayout}
        />

        {/* Right Panel */}
        <RightPanel
          isOpen={layout.rightPanelOpen}
          onClose={() => layout.setRightPanelOpen(false)}
          selectedElement={layout.selectedElement}
        />
      </div>
    </div>
  );
}
```

---

## Routing

Adicionar em `frontend/src/App.tsx`:

```typescript
import { PageEditor } from '@/page/editor/PageEditor';

// Em Routes:
<Route path="/editor/:id" element={<PageEditor />} />
```

---

## Critérios de Aceite

### ✅ Fase 3a Completa Quando:

1. **Layout 100vw × 100vh**:
   - [ ] TopBar 60px no topo
   - [ ] Sidebar hover (0→280px), fecha imediatamente ao mouseleave
   - [ ] Canvas área central branca
   - [ ] RightPanel 320px direita (colapsável)

2. **TopBar funcional**:
   - [ ] Botão "← Voltar" navega para `/page`
   - [ ] Título "Editando: [Page Title]"
   - [ ] DeviceSelector (Desktop, Tablet, Mobile)
   - [ ] SaveIndicator mostra "Salvando...", "Salvo", "Erro ao salvar"
   - [ ] SaveToggle (auto-save toggle + botão manual)
   - [ ] PublishButton com modal confirmação se isDirty

3. **Sidebar (hover-only)**:
   - [ ] Colapsado por padrão (width=0)
   - [ ] Expande ao mouseenter (280px em 200ms)
   - [ ] Fecha ao mouseleave (imediatamente, sem delay)
   - [ ] Categorias: Texto, Mídia, Interação, etc
   - [ ] Primeira categoria aberta, restantes fechadas

4. **Canvas com CanvasAddButton**:
   - [ ] "+" entre blocos (hover) + fixo no final
   - [ ] Clique abre AddBlockPanel

5. **AddBlockPanel funcional**:
   - [ ] Tabs por categoria
   - [ ] Botão "✦ Criar do Zero" abre ColumnLayoutSelector

6. **ColumnLayoutSelector (6 layouts)**:
   - [ ] Grid 3x2 com 6 layouts visuais
   - [ ] Clique seleciona layout, abre coluna no canvas

7. **RightPanel colapsável**:
   - [ ] Colapsado por padrão (width=0)
   - [ ] Abre ao clicar elemento (320px)
   - [ ] Mostra propriedades do elemento selecionado
   - [ ] Botão "← Fechar" ou clique fora fecha

### ✅ Output Esperado:
- Editor renderiza sem erros
- Layout responsivo (desktop, tablet, mobile)
- Sidebar hover-only funcional
- Canvas com "+" entre blocos
- AddBlockPanel + ColumnLayoutSelector funcionam
- RightPanel colapsável
- SaveToggle + PublishButton com modal
- Navegação entre /page e /editor funciona

---

## Próxima Fase

**Fase 3b**: Blocos Inteligentes (30 Blocos)
- Implementar 30 blocos pré-montados
- BlockWrapper com controles flutuantes
- BlockSettings para customização
- Blocos jurídicos especializados

