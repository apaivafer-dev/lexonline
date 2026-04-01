# LEX_SITE07 — Fase 3d: Canvas Livre + Redimensionamento

## Objetivo
Interação pixel-a-pixel no canvas com drag livre, resize com 8 handles, alinhamento inteligente e seleção múltipla.

## Dependência
- Fase 3c (Elementos + Painel Direito)

## Estrutura de Arquivos

### Hooks de Interação
- `hooks/usePixelDrag.ts` - Drag livre com mouse eventos
- `hooks/useResize.ts` - Resize com 8 handles
- `hooks/useMultiSelect.ts` - Seleção múltipla com Ctrl+click
- `hooks/useSnapToGrid.ts` - Snap a grid de 8px

### Componentes Canvas
- `Canvas/SelectionBox.tsx` - Caixa de seleção + 8 handles
- `Canvas/AlignmentGuides.tsx` - Guias vermelhas pontilhadas
- `Canvas/DropIndicator.tsx` - Indicador de drop para elementos
- `Canvas/GridOverlay.tsx` - Grid opcional visualização

## Implementação Detalhada

### usePixelDrag.ts - Drag Livre

```typescript
export const usePixelDrag = (elementId: string, initialPosition: { x: number; y: number }) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Não iniciar drag se clicar em handle de resize
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);

    // Calcular offset inicial
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    // Visual feedback
    if (elementRef.current) {
      elementRef.current.style.opacity = '0.8';
      elementRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !elementRef.current) return;

    const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    // Posição relativa ao container
    let newX = e.clientX - parentRect.left - dragOffset.x;
    let newY = e.clientY - parentRect.top - dragOffset.y;

    // Snap a grid de 8px se shift não pressionado
    if (!e.shiftKey) {
      newX = Math.round(newX / 8) * 8;
      newY = Math.round(newY / 8) * 8;
    }

    // Limitação de boundaries
    newX = Math.max(0, Math.min(newX, parentRect.width - 100));
    newY = Math.max(0, Math.min(newY, parentRect.height - 100));

    // Atualizar elemento em tempo real
    dispatch(MOVE_ELEMENT, {
      id: elementId,
      x: newX,
      y: newY
    });

    // Atualizar posição visual
    if (elementRef.current) {
      elementRef.current.style.left = `${newX}px`;
      elementRef.current.style.top = `${newY}px`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Restaurar visual feedback
    if (elementRef.current) {
      elementRef.current.style.opacity = '1';
      elementRef.current.style.cursor = 'grab';
    }

    // Confirmar posição final
    dispatch(CONFIRM_MOVE, { id: elementId });
  };

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, elementId]);

  return { handleMouseDown, elementRef, isDragging };
};
```

**Características:**
- `mousedown` inicia drag apenas no elemento (não em handles)
- `mousemove` calcula delta x,y relativo ao container
- `cursor: grabbing` feedback visual
- Snap opcional a 8px (Shift desativa)
- Boundaries: não sai do container
- `opacity: 0.8` durante drag
- Dispatch `MOVE_ELEMENT` com {id, x, y}

### useResize.ts - Resize com 8 Handles

```typescript
export const useResize = (
  elementId: string,
  initialSize: { width: number; height: number }
) => {
  const dispatch = useDispatch();
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleHandleMouseDown = (handle: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeHandle(handle);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = elementRef.current?.offsetWidth || initialSize.width;
    const startHeight = elementRef.current?.offsetHeight || initialSize.height;
    const aspectRatio = startWidth / startHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      // Calcular novo tamanho baseado no handle
      switch (handle) {
        case 'nw': // Noroeste
          newWidth = startWidth - deltaX;
          newHeight = startHeight - deltaY;
          break;

        case 'n': // Norte
          newHeight = startHeight - deltaY;
          break;

        case 'ne': // Nordeste
          newWidth = startWidth + deltaX;
          newHeight = startHeight - deltaY;
          break;

        case 'e': // Leste
          newWidth = startWidth + deltaX;
          break;

        case 'se': // Sudeste
          newWidth = startWidth + deltaX;
          newHeight = startHeight + deltaY;
          break;

        case 's': // Sul
          newHeight = startHeight + deltaY;
          break;

        case 'sw': // Sudoeste
          newWidth = startWidth - deltaX;
          newHeight = startHeight + deltaY;
          break;

        case 'w': // Oeste
          newWidth = startWidth - deltaX;
          break;
      }

      // Manter proporção se Shift pressionado
      if (moveEvent.shiftKey) {
        newHeight = newWidth / aspectRatio;
      }

      // Tamanho mínimo 20x20px
      newWidth = Math.max(20, newWidth);
      newHeight = Math.max(20, newHeight);

      // Atualizar imediatamente
      dispatch(RESIZE_ELEMENT, {
        id: elementId,
        width: newWidth,
        height: newHeight
      });

      if (elementRef.current) {
        elementRef.current.style.width = `${newWidth}px`;
        elementRef.current.style.height = `${newHeight}px`;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Confirmar resize
      dispatch(CONFIRM_RESIZE, { id: elementId });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { elementRef, handleHandleMouseDown, isResizing };
};
```

**Características:**
- 8 handles: nw, n, ne, e, se, s, sw, w
- Shift mantém proporção aspect ratio
- Mínimo 20x20px
- Dispatch `RESIZE_ELEMENT` com {id, width, height}
- Atualiza em tempo real durante drag

### SelectionBox.tsx - Caixa de Seleção + Handles

```typescript
const SelectionBox = ({ element, onDragStart, onResizeStart }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const handlePositions = [
    { name: 'nw', position: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2' },
    { name: 'n', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
    { name: 'ne', position: 'top-0 right-0 translate-x-1/2 -translate-y-1/2' },
    { name: 'e', position: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2' },
    { name: 'se', position: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2' },
    { name: 's', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
    { name: 'sw', position: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2' },
    { name: 'w', position: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2' },
  ];

  const cursorMap = {
    nw: 'nwse-resize',
    n: 'ns-resize',
    ne: 'nesw-resize',
    e: 'ew-resize',
    se: 'nwse-resize',
    s: 'ns-resize',
    sw: 'nesw-resize',
    w: 'ew-resize',
  };

  return (
    <div
      ref={elementRef}
      className="absolute border-2 border-blue-500 bg-blue-50 bg-opacity-10"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        pointerEvents: 'none',
      }}
      onMouseDown={onDragStart}
    >
      {/* Handles de resize */}
      {handlePositions.map((handle) => (
        <div
          key={handle.name}
          className={`resize-handle absolute w-3 h-3 bg-white border-2 border-blue-500
                       rounded-full cursor-${cursorMap[handle.name]}
                       hover:bg-blue-500 transition-colors ${handle.position}`}
          onMouseDown={onResizeStart(handle.name)}
          style={{ pointerEvents: 'auto' }}
        />
      ))}

      {/* Overlay para drag */}
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing" />
    </div>
  );
};
```

**Características:**
- Borda azul 2px ao redor do elemento selecionado
- 8 handles brancos com borda azul
- Handles mudam de cor ao hover
- Cursor muda por handle (nwse-resize, ns-resize, etc)
- Clique no overlay inicia drag

### AlignmentGuides.tsx - Guias Inteligentes

```typescript
const AlignmentGuides = ({ elements, selectedElementId }: Props) => {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const selectedElement = elements.find(el => el.id === selectedElementId);
    if (!selectedElement) {
      setGuides([]);
      return;
    }

    const selectedRect = {
      left: selectedElement.x,
      top: selectedElement.y,
      right: selectedElement.x + selectedElement.width,
      bottom: selectedElement.y + selectedElement.height,
      centerX: selectedElement.x + selectedElement.width / 2,
      centerY: selectedElement.y + selectedElement.height / 2,
    };

    const newGuides: Guide[] = [];

    // Verificar alinhamento com outros elementos (±5px de tolerância)
    elements.forEach((element) => {
      if (element.id === selectedElementId) return;

      const otherRect = {
        left: element.x,
        top: element.y,
        right: element.x + element.width,
        bottom: element.y + element.height,
        centerX: element.x + element.width / 2,
        centerY: element.y + element.height / 2,
      };

      const SNAP_THRESHOLD = 5;

      // Alinhamento vertical (esquerda)
      if (Math.abs(selectedRect.left - otherRect.left) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'vertical',
          position: selectedRect.left,
          color: 'red',
        });
      }

      // Alinhamento vertical (direita)
      if (Math.abs(selectedRect.right - otherRect.right) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'vertical',
          position: selectedRect.right,
          color: 'red',
        });
      }

      // Alinhamento vertical (centro)
      if (Math.abs(selectedRect.centerX - otherRect.centerX) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'vertical',
          position: selectedRect.centerX,
          color: 'red',
        });
      }

      // Alinhamento horizontal (topo)
      if (Math.abs(selectedRect.top - otherRect.top) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'horizontal',
          position: selectedRect.top,
          color: 'red',
        });
      }

      // Alinhamento horizontal (fundo)
      if (Math.abs(selectedRect.bottom - otherRect.bottom) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'horizontal',
          position: selectedRect.bottom,
          color: 'red',
        });
      }

      // Alinhamento horizontal (centro)
      if (Math.abs(selectedRect.centerY - otherRect.centerY) < SNAP_THRESHOLD) {
        newGuides.push({
          type: 'horizontal',
          position: selectedRect.centerY,
          color: 'red',
        });
      }
    });

    setGuides(newGuides);
  }, [elements, selectedElementId]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {guides.map((guide, idx) => (
        guide.type === 'vertical' ? (
          <div
            key={idx}
            className="absolute border-l-2 border-dashed border-red-500"
            style={{
              left: `${guide.position}px`,
              top: 0,
              height: '100%',
              opacity: 0.7,
            }}
          />
        ) : (
          <div
            key={idx}
            className="absolute border-t-2 border-dashed border-red-500"
            style={{
              top: `${guide.position}px`,
              left: 0,
              width: '100%',
              opacity: 0.7,
            }}
          />
        )
      ))}
    </div>
  );
};
```

**Características:**
- Guia vermelha pontilhada ao alinhar
- Detecta: esquerda, direita, centro vertical
- Detecta: topo, fundo, centro horizontal
- Snap automático ±5px
- Desaparece quando elemento move além do threshold

### Seleção Múltipla

```typescript
const useMultiSelect = () => {
  const dispatch = useDispatch();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dragSelectStart, setDragSelectStart] = useState<{ x: number; y: number } | null>(null);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Drag select no canvas vazio
    if (e.target === e.currentTarget) {
      setDragSelectStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragSelectStart) return;

    // Desenhar seleção retangular
    const selectBox = {
      startX: dragSelectStart.x,
      startY: dragSelectStart.y,
      endX: e.clientX,
      endY: e.clientY,
    };

    // Encontrar elementos dentro da seleção
    const newSelected = elements
      .filter((el) => {
        const elLeft = el.x;
        const elTop = el.y;
        const elRight = el.x + el.width;
        const elBottom = el.y + el.height;

        const selectLeft = Math.min(selectBox.startX, selectBox.endX);
        const selectTop = Math.min(selectBox.startY, selectBox.endY);
        const selectRight = Math.max(selectBox.startX, selectBox.endX);
        const selectBottom = Math.max(selectBox.startY, selectBox.endY);

        return !(elRight < selectLeft ||
                 elLeft > selectRight ||
                 elBottom < selectTop ||
                 elTop > selectBottom);
      })
      .map((el) => el.id);

    setSelectedIds(newSelected);
    dispatch(SELECT_MULTIPLE, { ids: newSelected });
  };

  const handleCanvasMouseUp = () => {
    setDragSelectStart(null);
  };

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      // Ctrl+click: adicionar/remover da seleção
      const newSelected = selectedIds.includes(elementId)
        ? selectedIds.filter((id) => id !== elementId)
        : [...selectedIds, elementId];

      setSelectedIds(newSelected);
      dispatch(SELECT_MULTIPLE, { ids: newSelected });
    } else {
      // Click normal: apenas este elemento
      setSelectedIds([elementId]);
      dispatch(SELECT_ELEMENT, { id: elementId });
    }
  };

  const handleDelete = () => {
    // Delete/Backspace exclui todos selecionados
    dispatch(DELETE_ELEMENTS, { ids: selectedIds });
    setSelectedIds([]);
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right', shift: boolean) => {
    const delta = shift ? 10 : 1;
    const deltaMap = {
      up: { x: 0, y: -delta },
      down: { x: 0, y: delta },
      left: { x: -delta, y: 0 },
      right: { x: delta, y: 0 },
    };

    dispatch(MOVE_ELEMENTS, {
      ids: selectedIds,
      delta: deltaMap[direction],
    });
  };

  return {
    selectedIds,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    handleElementClick,
    handleDelete,
    handleMove,
  };
};
```

**Características:**
- Ctrl+click adiciona/remove elemento da seleção
- Drag no canvas vazio seleciona múltiplos
- Delete exclui todos selecionados
- Setas movem 1px, Shift+Setas movem 10px
- Move todos juntos mantendo posições relativas

### GridOverlay.tsx

```typescript
const GridOverlay = ({ visible, gridSize = 8 }: Props) => {
  if (!visible) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(0deg, transparent ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize}px),
          linear-gradient(90deg, transparent ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize - 1}px, rgba(0,0,0,0.05) ${gridSize}px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  );
};
```

## Critérios de Aceite

- [ ] Drag atualiza left/top pixel-a-pixel
- [ ] Resize funciona em 8 handles
- [ ] Grid snap opcional toggle a 8px
- [ ] Guias de alinhamento vermelhas pontilhadas aparecem
- [ ] Snap automático ±5px ao alinhar
- [ ] Seleção múltipla com Ctrl+click
- [ ] Seleção retangular ao arrastar canvas vazio
- [ ] Delete/Backspace exclui todos selecionados
- [ ] Setas movem 1px, Shift+Setas movem 10px
- [ ] Cursor muda por handle (ns-resize, ew-resize, nwse-resize)
- [ ] Opacity 0.8 durante drag
- [ ] Handles brancos com borda azul

## Stack Técnico

- React 18+ com Hooks
- TypeScript
- Mouse eventos (mousedown, mousemove, mouseup)
- Geometric calculations para alinhamento
