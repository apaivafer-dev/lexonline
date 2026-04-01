# LEX_SITE08 — Fase 3e: Histórico + Auto-save + Preview

## Objetivo
Qualidade profissional com desfazer/refazer, auto-save inteligente e preview full-screen.

## Dependência
- Fase 3d (Canvas Livre + Redimensionamento)

## Estrutura de Arquivos

### Hooks Avançados
- `hooks/useHistory.ts` - Gerenciamento de histórico com Ctrl+Z/Y
- `hooks/useAutoSave.ts` - Auto-save com debounce 2000ms
- `hooks/useKeyboardShortcuts.ts` - Atalhos globais
- `Canvas/PreviewModal.tsx` - Modal preview full-screen

## Implementação Detalhada

### useHistory.ts - Desfazer/Refazer

```typescript
interface HistoryState {
  history: PageJSON[];
  historyIndex: number;
}

export const useHistory = () => {
  const dispatch = useDispatch();
  const pageState = useSelector((state) => state.editor.page);
  const [history, setHistory] = useState<HistoryState>({
    history: [pageState],
    historyIndex: 0,
  });

  // Adicionar novo estado ao histórico (máx 50)
  const push = (newState: PageJSON) => {
    setHistory((prev) => {
      // Remove estados futuros se não estiver no final
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newState);

      // Limitar a 50 estados
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  };

  // Desfazer (Ctrl+Z)
  const undo = () => {
    setHistory((prev) => {
      if (prev.historyIndex <= 0) return prev;

      const newIndex = prev.historyIndex - 1;
      const previousState = prev.history[newIndex];

      // Restaurar estado anterior
      dispatch(RESTORE_PAGE_STATE, previousState);

      return {
        ...prev,
        historyIndex: newIndex,
      };
    });
  };

  // Refazer (Ctrl+Y ou Ctrl+Shift+Z)
  const redo = () => {
    setHistory((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;

      const newIndex = prev.historyIndex + 1;
      const nextState = prev.history[newIndex];

      // Restaurar estado próximo
      dispatch(RESTORE_PAGE_STATE, nextState);

      return {
        ...prev,
        historyIndex: newIndex,
      };
    });
  };

  // Atualizar histórico quando página muda
  useEffect(() => {
    const timer = setTimeout(() => {
      const lastState = history.history[history.historyIndex];
      if (JSON.stringify(lastState) !== JSON.stringify(pageState)) {
        push(pageState);
      }
    }, 500); // Aguardar 500ms de inatividade

    return () => clearTimeout(timer);
  }, [pageState]);

  return {
    undo,
    redo,
    canUndo: history.historyIndex > 0,
    canRedo: history.historyIndex < history.history.length - 1,
    historyCount: history.history.length,
  };
};
```

**Características:**
- Stack de máx 50 estados
- `push()` adiciona novo estado
- `undo()` volta para estado anterior (Ctrl+Z)
- `redo()` avança para próximo estado (Ctrl+Y)
- `canUndo`/`canRedo` habilitam/desabilitam botões
- Debounce 500ms antes de adicionar ao histórico
- Sincronização automática quando página muda

### useAutoSave.ts - Auto-save Inteligente

```typescript
export const useAutoSave = () => {
  const dispatch = useDispatch();
  const pageState = useSelector((state) => state.editor.page);
  const autoSaveEnabled = useSelector((state) => state.editor.autoSave);
  const pageId = useSelector((state) => state.editor.pageId);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedState, setLastSavedState] = useState(JSON.stringify(pageState));

  // Auto-save com debounce 2000ms
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const currentState = JSON.stringify(pageState);

    // Apenas salvar se houver mudanças
    if (currentState === lastSavedState) return;

    const timer = setTimeout(async () => {
      try {
        setSaveStatus('saving');

        const response = await fetch(`/api/page/${pageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageState),
        });

        if (!response.ok) throw new Error('Save failed');

        setSaveStatus('saved');
        setLastSavedState(currentState);

        // Mostrar "Salvo ✓" por 2 segundos
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        console.error('Auto-save error:', error);

        // Retry após 5 segundos
        setTimeout(() => setSaveStatus('idle'), 5000);
      }
    }, 2000); // Debounce 2000ms

    return () => clearTimeout(timer);
  }, [pageState, autoSaveEnabled, pageId, lastSavedState]);

  // Salvar manualmente (Ctrl+S)
  const saveManually = async () => {
    try {
      setSaveStatus('saving');

      const response = await fetch(`/api/page/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageState),
      });

      if (!response.ok) throw new Error('Save failed');

      setSaveStatus('saved');
      setLastSavedState(JSON.stringify(pageState));

      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Manual save error:', error);
    }
  };

  return {
    saveStatus, // 'idle' | 'saving' | 'saved' | 'error'
    saveManually,
    autoSaveEnabled,
  };
};
```

**Características:**
- Respeita flag `autoSave` do useEditorLayout
- Debounce 2000ms antes de enviar PUT
- Só salva se houver mudanças
- `saveStatus`: idle → saving → saved → idle
- Retry automático em caso de erro
- SaveIndicator exibe status
- Salvar manual com Ctrl+S força save imediato

### SaveIndicator Componente

```typescript
const SaveIndicator = ({ status }: { status: SaveStatus }) => {
  const messages = {
    idle: '',
    saving: 'Salvando...',
    saved: 'Salvo ✓',
    error: 'Erro ao salvar',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`text-sm font-medium px-3 py-1 rounded
        ${status === 'saving' ? 'text-blue-600 bg-blue-50' : ''}
        ${status === 'saved' ? 'text-green-600 bg-green-50' : ''}
        ${status === 'error' ? 'text-red-600 bg-red-50' : ''}
      `}
    >
      {messages[status]}

      {status === 'saving' && (
        <Spinner className="inline-block ml-2 w-4 h-4" />
      )}
    </motion.div>
  );
};
```

### useKeyboardShortcuts.ts - Atalhos Globais

```typescript
export const useKeyboardShortcuts = () => {
  const { undo, redo } = useHistory();
  const { saveManually } = useAutoSave();
  const dispatch = useDispatch();
  const selectedIds = useSelector((state) => state.editor.selectedIds);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl+Y ou Ctrl+Shift+Z = Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Ctrl+S = Save manual
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveManually();
        return;
      }

      // Ctrl+D = Duplicar elemento selecionado
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedIds.length > 0) {
          dispatch(DUPLICATE_ELEMENTS, { ids: selectedIds });
        }
        return;
      }

      // Delete/Backspace = Deletar selecionados
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds.length > 0) {
        e.preventDefault();
        dispatch(DELETE_ELEMENTS, { ids: selectedIds });
        return;
      }

      // Escape = Desselecionar/Fechar painel
      if (e.key === 'Escape') {
        e.preventDefault();
        dispatch(CLEAR_SELECTION);
        setPreviewOpen(false);
        return;
      }

      // Ctrl+P = Preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setPreviewOpen(true);
        return;
      }

      // Setas = Mover elemento 1px (ou 10px com Shift)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (selectedIds.length === 0) return;

        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;

        let movement = { x: 0, y: 0 };
        switch (e.key) {
          case 'ArrowUp':
            movement = { x: 0, y: -delta };
            break;
          case 'ArrowDown':
            movement = { x: 0, y: delta };
            break;
          case 'ArrowLeft':
            movement = { x: -delta, y: 0 };
            break;
          case 'ArrowRight':
            movement = { x: delta, y: 0 };
            break;
        }

        dispatch(MOVE_ELEMENTS, { ids: selectedIds, delta: movement });
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveManually, selectedIds, dispatch]);

  return { previewOpen, setPreviewOpen };
};
```

**Atalhos Suportados:**
- `Ctrl+Z` → Desfazer
- `Ctrl+Y` / `Ctrl+Shift+Z` → Refazer
- `Ctrl+S` → Salvar (força imediato)
- `Ctrl+D` → Duplicar selecionados
- `Delete` / `Backspace` → Deletar selecionados
- `Escape` → Desselecionar/Fechar preview
- `Ctrl+P` → Preview
- `Setas` → Mover 1px (Shift+Setas = 10px)

### TopBar com Botões Undo/Redo

```typescript
const TopBar = () => {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const { saveStatus } = useAutoSave();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
      {/* Logo e título */}
      <div className="flex items-center gap-4">
        <Logo />
        <h1>LexOnline Builder</h1>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-2">
        <Button
          onClick={undo}
          disabled={!canUndo}
          title="Desfazer (Ctrl+Z)"
          size="sm"
          variant="ghost"
        >
          <RotateCcw size={18} />
        </Button>

        <Button
          onClick={redo}
          disabled={!canRedo}
          title="Refazer (Ctrl+Y)"
          size="sm"
          variant="ghost"
        >
          <RotateCw size={18} />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Save status */}
        <SaveIndicator status={saveStatus} />
      </div>

      {/* Botões direita */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Preview
        </Button>
        <Button variant="default" size="sm">
          Publicar
        </Button>
      </div>
    </div>
  );
};
```

### PreviewModal.tsx - Preview Full-screen

```typescript
const PreviewModal = ({ isOpen, onClose, pageId }: Props) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Gerar URL preview estática
    setUrl(`/preview/${pageId}`);
  }, [pageId]);

  const deviceDimensions = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: 'calc(768px * 4/3)', maxHeight: '100%' },
    mobile: { width: '375px', height: 'calc(375px * 16/9)', maxHeight: '100%' },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Container preview */}
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            style={deviceDimensions[device]}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header controles */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gray-900 text-white flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={device === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setDevice('desktop')}
                  className="text-white"
                >
                  <Monitor size={16} /> Desktop
                </Button>
                <Button
                  size="sm"
                  variant={device === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setDevice('tablet')}
                  className="text-white"
                >
                  <Tablet size={16} /> Tablet
                </Button>
                <Button
                  size="sm"
                  variant={device === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setDevice('mobile')}
                  className="text-white"
                >
                  <Smartphone size={16} /> Mobile
                </Button>
              </div>

              {/* Close button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-white"
              >
                <X size={20} />
              </Button>
            </div>

            {/* iFrame sem controles */}
            <iframe
              src={url}
              className="w-full h-full border-none"
              style={{
                marginTop: '48px',
                height: 'calc(100% - 48px)',
              }}
            />
          </motion.div>

          {/* Dica: Esc para fechar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            Pressione <kbd className="bg-gray-800 px-2 py-1 rounded">Esc</kbd> para fechar
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

**Características:**
- Full-screen modal
- Toggle Device: Desktop | Tablet | Mobile
- iFrame renderiza página sem controles editor
- Dimensões responsivas por device
- Fecha com Esc ou X
- URL preview estática `/preview/:pageId`

## Critérios de Aceite

- [ ] Ctrl+Z funciona com 50 estados de histórico
- [ ] Ctrl+Y/Ctrl+Shift+Z refaz ações
- [ ] Auto-save respeita toggle (2000ms debounce)
- [ ] Ctrl+S força save manual imediato
- [ ] SaveIndicator mostra "Salvo ✓" / "Salvando..." / "Erro"
- [ ] Botões ↶↷ habilitados/desabilitados corretamente
- [ ] Ctrl+D duplica elementos
- [ ] Delete/Backspace exclui selecionados
- [ ] Escape desseleciona e fecha preview
- [ ] Setas movem 1px, Shift+Setas movem 10px
- [ ] Ctrl+P abre preview full-screen
- [ ] Preview mostra toggle D/T/M
- [ ] Nenhum conflito de atalhos
- [ ] iFrame não mostra controles do editor

## Stack Técnico

- React 18+ com Hooks
- TypeScript
- Framer Motion (animações)
- zustand (state management)
- fetch API para HTTP
