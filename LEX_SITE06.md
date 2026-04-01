# LEX_SITE06 — Fase 3c: Elementos + Painel Direito

## Objetivo
Sistema completo de 40 elementos organizados por categorias e painel de propriedades com 150 propriedades de estilo.

## Dependência
- Fase 3b (Canvas e seleção básica)

## Estrutura de Arquivos

### Sidebar - Aba Elementos
- `Sidebar/ElementsTab.tsx` - Componente principal com accordion por categorias
- `Sidebar/ElementCard.tsx` - Card individual de elemento com ícone e nome

### Painel Direito
- `RightPanel/RightPanel.tsx` - Container principal com 3 abas
- `RightPanel/tabs/ContentTab.tsx` - Aba de conteúdo (inputs específicos por elemento)
- `RightPanel/tabs/StyleTab.tsx` - Aba de estilo (150 propriedades agrupadas)
- `RightPanel/tabs/AdvancedTab.tsx` - Aba avançada (visibilidade, animações, ID CSS)

### Controles Customizados
- `RightPanel/controls/ColorPicker.tsx` - Seletor de cores com alpha
- `RightPanel/controls/SliderInput.tsx` - Input slider com valor numérico
- `RightPanel/controls/FontSelector.tsx` - Seletor de fontes Google Fonts
- `RightPanel/controls/AnimSelector.tsx` - Seletor de animações predefinidas

### Elementos (40 total)
- `components/elements/TitleElement.tsx` - Heading (H1-H6)
- `components/elements/TextElement.tsx` - Parágrafo simples
- `components/elements/RichTextElement.tsx` - Texto rico (bold, italic, link)
- `components/elements/ListElement.tsx` - Listas ordenadas/desordenadas
- `components/elements/QuoteElement.tsx` - Citação/bloco de citação
- `components/elements/HighlightElement.tsx` - Texto com destaque colorido
- `components/elements/ImageElement.tsx` - Imagem com alt text
- `components/elements/VideoElement.tsx` - Embed de vídeo (YouTube/Vimeo)
- `components/elements/IconElement.tsx` - Ícone SVG (Feather, Font Awesome)
- `components/elements/GalleryElement.tsx` - Galeria de imagens (grid/carrossel)
- `components/elements/LottieElement.tsx` - Animação Lottie JSON
- `components/elements/ButtonElement.tsx` - Botão com múltiplas variações
- `components/elements/IconButtonElement.tsx` - Botão apenas ícone
- `components/elements/FormElement.tsx` - Formulário container
- `components/elements/InputElement.tsx` - Campo de texto
- `components/elements/TextAreaElement.tsx` - Campo textarea
- `components/elements/SelectElement.tsx` - Dropdown select
- `components/elements/CheckboxElement.tsx` - Checkbox grupo
- `components/elements/RadioElement.tsx` - Radio button grupo
- `components/elements/SectionElement.tsx` - Seção/container principal
- `components/elements/ContainerElement.tsx` - Container flexível
- `components/elements/ColumnElement.tsx` - Coluna em grid
- `components/elements/SpacerElement.tsx` - Espaçador vazio
- `components/elements/DividerElement.tsx` - Linha divisória
- `components/elements/CountdownElement.tsx` - Cronômetro regressivo
- `components/elements/TestimonialElement.tsx` - Card de depoimento
- `components/elements/PricingElement.tsx` - Tabela de preços
- `components/elements/FaqElement.tsx` - FAQ acordeão
- `components/elements/FeaturesElement.tsx` - Grid de features
- `components/elements/StatsCounterElement.tsx` - Contador com animação
- `components/elements/SocialIconsElement.tsx` - Ícones de redes sociais
- `components/elements/WhatsAppElement.tsx` - Botão flutuante WhatsApp
- `components/elements/MapElement.tsx` - Mapa Google/Leaflet
- `components/elements/TabsElement.tsx` - Abas tabuladas
- `components/elements/CarouselElement.tsx` - Carrossel/slider
- `components/elements/PopupElement.tsx` - Popup/modal
- `components/elements/HtmlCustomElement.tsx` - Código HTML customizado

### Hooks
- `hooks/useSelectedElement.ts` - Acesso ao elemento selecionado
- `hooks/useDragDrop.ts` - Gerenciamento de drag e drop
- `hooks/useInlineEdit.ts` - Edição inline com contenteditable
- `hooks/useElementProperties.ts` - Acesso às propriedades do elemento

### Types e Constants
- `types/element.types.ts` - Tipos TypeScript para elementos
- `constants/elements.constants.ts` - Catálogo de 40 elementos com metadados

## Implementação Detalhada

### ElementsTab.tsx

```typescript
// Layout accordion com categorias
const categories = [
  {
    name: 'Texto',
    icon: 'Type',
    elements: [
      { id: 'heading', name: 'Título', icon: 'Heading1' },
      { id: 'text', name: 'Parágrafo', icon: 'AlignLeft' },
      { id: 'rich_text', name: 'Texto Rico', icon: 'Type' },
      { id: 'list', name: 'Lista', icon: 'List' },
      { id: 'quote', name: 'Citação', icon: 'Quote2' },
      { id: 'highlight', name: 'Destaque', icon: 'Highlighter' },
    ]
  },
  {
    name: 'Mídia',
    icon: 'Image',
    elements: [
      { id: 'image', name: 'Imagem', icon: 'Image' },
      { id: 'video', name: 'Vídeo', icon: 'Play' },
      { id: 'icon', name: 'Ícone', icon: 'Star' },
      { id: 'gallery', name: 'Galeria', icon: 'Grid' },
      { id: 'lottie', name: 'Animação', icon: 'Zap' },
    ]
  },
  {
    name: 'Interação',
    icon: 'PointerClick',
    elements: [
      { id: 'button', name: 'Botão', icon: 'ClickIcon' },
      { id: 'icon_button', name: 'Botão Ícone', icon: 'Circle' },
      { id: 'html_custom', name: 'HTML Custom', icon: 'Code' },
    ]
  },
  {
    name: 'Formulário',
    icon: 'Form',
    elements: [
      { id: 'form', name: 'Formulário', icon: 'Form' },
      { id: 'input', name: 'Input', icon: 'Type' },
      { id: 'textarea', name: 'Textarea', icon: 'TextCursorInput' },
      { id: 'select', name: 'Select', icon: 'ChevronDown' },
      { id: 'checkbox', name: 'Checkbox', icon: 'Check' },
      { id: 'radio', name: 'Radio', icon: 'CircleDot' },
    ]
  },
  {
    name: 'Layout',
    icon: 'Layout',
    elements: [
      { id: 'section', name: 'Seção', icon: 'Layout' },
      { id: 'container', name: 'Container', icon: 'Box' },
      { id: 'column', name: 'Coluna', icon: 'Columns' },
      { id: 'spacer', name: 'Espaçador', icon: 'Maximize2' },
      { id: 'divider', name: 'Divisor', icon: 'Minus' },
    ]
  },
  {
    name: 'Marketing',
    icon: 'Trending2',
    elements: [
      { id: 'countdown', name: 'Countdown', icon: 'Clock' },
      { id: 'testimonial', name: 'Depoimento', icon: 'MessageCircle' },
      { id: 'pricing', name: 'Preços', icon: 'CreditCard' },
      { id: 'faq', name: 'FAQ', icon: 'HelpCircle' },
      { id: 'features', name: 'Features', icon: 'Zap' },
      { id: 'stats_counter', name: 'Estatísticas', icon: 'BarChart3' },
    ]
  },
  {
    name: 'Social',
    icon: 'Share2',
    elements: [
      { id: 'social_icons', name: 'Redes Sociais', icon: 'Share2' },
      { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle' },
      { id: 'map', name: 'Mapa', icon: 'MapPin' },
    ]
  },
  {
    name: 'Avançado',
    icon: 'Settings',
    elements: [
      { id: 'tabs', name: 'Abas', icon: 'Tabs' },
      { id: 'carousel', name: 'Carrossel', icon: 'Shuffle' },
      { id: 'popup', name: 'Popup', icon: 'Square' },
    ]
  }
];

// Primeiro accordion aberto (Texto)
const [openCategory, setOpenCategory] = useState('Texto');
const [searchTerm, setSearchTerm] = useState('');

// Filtrar elementos por busca
const filteredCategories = categories.map(cat => ({
  ...cat,
  elements: cat.elements.filter(el =>
    el.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
})).filter(cat => cat.elements.length > 0);
```

**Características:**
- Campo de busca no topo filtra por nome
- Accordion com primeira categoria (Texto) aberta por padrão
- Grid 2 colunas para elementos (ícone 40x40 + nome)
- Elementos são draggable com HTML5 Drag API
- Drop em canvas cria novo elemento

### ElementCard.tsx

```typescript
// Drag handler
const handleDragStart = (e: React.DragEvent) => {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('element-type', elementId);
  // Imagem preview do elemento durante drag
  e.dataTransfer.setDragImage(dragImage, 0, 0);
};

// Visual feedback
return (
  <div
    draggable
    onDragStart={handleDragStart}
    className="p-3 border rounded cursor-grab active:cursor-grabbing
               hover:bg-blue-50 transition-colors"
  >
    <Icon size={40} className="mx-auto mb-2 text-blue-600" />
    <p className="text-sm font-medium text-center">{name}</p>
  </div>
);
```

### RightPanel.tsx

**Estrutura:**
```typescript
// Abre SOMENTE ao clicar em elemento interno
const selectedElement = useSelectedElement();

return (
  <AnimatePresence>
    {selectedElement && (
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        className="fixed right-0 top-16 h-screen w-96 bg-white
                   border-l shadow-lg z-40 overflow-y-auto"
      >
        {/* 3 Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="style">Estilo</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentTab element={selectedElement} />
          </TabsContent>

          <TabsContent value="style">
            <StyleTab element={selectedElement} />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedTab element={selectedElement} />
          </TabsContent>
        </Tabs>
      </motion.div>
    )}
  </AnimatePresence>
);

// Sidebar desaparece quando painel abre
const sidebarWidth = selectedElement ? 'w-0' : 'w-80';
```

### ContentTab.tsx

**Renderiza inputs específicos por tipo:**

```typescript
// Map de renderizadores por tipo de elemento
const renderContent = () => {
  switch (element.type) {
    case 'heading':
      return (
        <>
          <Label>Nível de Heading</Label>
          <Select value={element.props.level} onChange={...}>
            {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map(h => (...))}
          </Select>

          <Label>Texto</Label>
          <input
            type="text"
            value={element.props.text}
            onChange={(e) => updateElement({ props: { text: e.target.value } })}
            onBlur={() => canvas updates}
          />
        </>
      );

    case 'image':
      return (
        <>
          <Label>URL da Imagem</Label>
          <input type="text" value={element.props.src} />

          <Label>Texto Alternativo</Label>
          <input type="text" value={element.props.alt} />

          <Button onClick={() => openImageGallery()}>
            Escolher da Galeria
          </Button>
        </>
      );

    case 'button':
      return (
        <>
          <Label>Texto do Botão</Label>
          <input type="text" value={element.props.text} />

          <Label>Link/Action</Label>
          <input type="text" placeholder="https://..." />

          <Label>Variação</Label>
          <Select value={element.props.variant}>
            <option>Preenchido</option>
            <option>Contorno</option>
            <option>Ghost</option>
          </Select>
        </>
      );

    // ... mais 37 tipos de elementos
  }
};
```

### StyleTab.tsx - 150 Propriedades Agrupadas

**Estrutura em colapsáveis:**

```typescript
const styleGroups = [
  {
    name: 'Posição',
    props: [
      { key: 'position', label: 'Posição', type: 'select', options: ['static', 'relative', 'absolute', 'fixed'] },
      { key: 'left', label: 'Esquerda', type: 'slider', min: -500, max: 2000 },
      { key: 'top', label: 'Topo', type: 'slider', min: -500, max: 2000 },
      { key: 'zIndex', label: 'Z-index', type: 'number', min: -1000, max: 9999 },
    ]
  },
  {
    name: 'Dimensões',
    props: [
      { key: 'width', label: 'Largura', type: 'slider', min: 20, max: 1920, unit: 'px' },
      { key: 'height', label: 'Altura', type: 'slider', min: 20, max: 1080, unit: 'px' },
      { key: 'minWidth', label: 'Largura Mín', type: 'slider', min: 0, max: 1920 },
      { key: 'maxWidth', label: 'Largura Máx', type: 'slider', min: 0, max: 1920 },
      { key: 'aspectRatio', label: 'Proporção', type: 'select', options: ['auto', '1/1', '16/9', '4/3', '3/2'] },
    ]
  },
  {
    name: 'Flexbox/Grid',
    props: [
      { key: 'display', label: 'Display', type: 'select', options: ['block', 'flex', 'grid', 'inline', 'inline-block', 'none'] },
      { key: 'flexDirection', label: 'Direção', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
      { key: 'justifyContent', label: 'Align Horizontal', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] },
      { key: 'alignItems', label: 'Align Vertical', type: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] },
      { key: 'gap', label: 'Gap', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'flexWrap', label: 'Quebra de Linha', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
      { key: 'flex', label: 'Flex', type: 'input', placeholder: '1 1 auto' },
      { key: 'gridColumns', label: 'Colunas Grid', type: 'input', placeholder: 'repeat(3, 1fr)' },
      { key: 'gridRows', label: 'Linhas Grid', type: 'input', placeholder: 'repeat(2, 1fr)' },
    ]
  },
  {
    name: 'Espaçamento',
    props: [
      { key: 'marginTop', label: 'Margem Topo', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'marginRight', label: 'Margem Direita', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'marginBottom', label: 'Margem Baixo', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'marginLeft', label: 'Margem Esquerda', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'paddingTop', label: 'Preenchimento Topo', type: 'slider', min: 0, max: 200, unit: 'px' },
      { key: 'paddingRight', label: 'Preenchimento Direita', type: 'slider', min: 0, max: 200, unit: 'px' },
      { key: 'paddingBottom', label: 'Preenchimento Baixo', type: 'slider', min: 0, max: 200, unit: 'px' },
      { key: 'paddingLeft', label: 'Preenchimento Esquerda', type: 'slider', min: 0, max: 200, unit: 'px' },
    ]
  },
  {
    name: 'Tipografia',
    props: [
      { key: 'fontFamily', label: 'Fonte', type: 'font-selector' },
      { key: 'fontSize', label: 'Tamanho', type: 'slider', min: 8, max: 120, unit: 'px' },
      { key: 'fontWeight', label: 'Peso', type: 'select', options: ['100', '300', '400', '500', '600', '700', '800', '900'] },
      { key: 'fontStyle', label: 'Estilo', type: 'select', options: ['normal', 'italic'] },
      { key: 'textDecoration', label: 'Decoração', type: 'select', options: ['none', 'underline', 'overline', 'line-through'] },
      { key: 'lineHeight', label: 'Altura Linha', type: 'slider', min: 0.5, max: 3, step: 0.1 },
      { key: 'letterSpacing', label: 'Espaço Letras', type: 'slider', min: -2, max: 10, unit: 'px' },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', options: ['left', 'center', 'right', 'justify'] },
      { key: 'textTransform', label: 'Transformação', type: 'select', options: ['none', 'uppercase', 'lowercase', 'capitalize'] },
      { key: 'textShadow', label: 'Sombra Texto', type: 'input', placeholder: '0 2px 4px rgba(0,0,0,0.2)' },
    ]
  },
  {
    name: 'Cores',
    props: [
      { key: 'color', label: 'Cor Texto', type: 'color-picker' },
      { key: 'backgroundColor', label: 'Cor Fundo', type: 'color-picker' },
      { key: 'backgroundImage', label: 'Imagem Fundo', type: 'input', placeholder: 'url(...)' },
      { key: 'backgroundSize', label: 'Tamanho Fundo', type: 'select', options: ['auto', 'cover', 'contain', '100% 100%'] },
      { key: 'backgroundPosition', label: 'Posição Fundo', type: 'select', options: ['top left', 'top center', 'top right', 'center', 'bottom center', 'bottom right'] },
      { key: 'opacity', label: 'Opacidade', type: 'slider', min: 0, max: 1, step: 0.1 },
    ]
  },
  {
    name: 'Bordas',
    props: [
      { key: 'borderWidth', label: 'Espessura', type: 'slider', min: 0, max: 20, unit: 'px' },
      { key: 'borderColor', label: 'Cor', type: 'color-picker' },
      { key: 'borderStyle', label: 'Estilo', type: 'select', options: ['solid', 'dashed', 'dotted', 'double', 'none'] },
      { key: 'borderRadius', label: 'Arredondamento', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderTopLeftRadius', label: 'Raio Topo Esq', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderTopRightRadius', label: 'Raio Topo Dir', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderBottomLeftRadius', label: 'Raio Baixo Esq', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderBottomRightRadius', label: 'Raio Baixo Dir', type: 'slider', min: 0, max: 100, unit: 'px' },
    ]
  },
  {
    name: 'Sombra',
    props: [
      { key: 'boxShadow', label: 'Sombra Caixa', type: 'input', placeholder: '0 4px 12px rgba(0,0,0,0.15)' },
      { key: 'filter', label: 'Filtro', type: 'input', placeholder: 'blur(4px) brightness(1.1)' },
    ]
  },
  {
    name: 'Animação',
    props: [
      { key: 'animation', label: 'Tipo Animação', type: 'anim-selector' },
      { key: 'animationDuration', label: 'Duração', type: 'slider', min: 0.2, max: 5, step: 0.1, unit: 's' },
      { key: 'animationDelay', label: 'Atraso', type: 'slider', min: 0, max: 5, step: 0.1, unit: 's' },
      { key: 'animationIterationCount', label: 'Repetições', type: 'select', options: ['1', '2', '3', 'infinite'] },
      { key: 'animationTimingFunction', label: 'Timing', type: 'select', options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'] },
      { key: 'transform', label: 'Transform', type: 'input', placeholder: 'rotate(0deg) scale(1)' },
      { key: 'transition', label: 'Transição', type: 'input', placeholder: 'all 0.3s ease' },
    ]
  },
];

// Renderizar grupos colapsáveis
return (
  <div className="space-y-2 p-4">
    {styleGroups.map((group) => (
      <Collapsible key={group.name} open={expandedGroups[group.name]}>
        <CollapsibleTrigger className="font-semibold p-2 hover:bg-gray-100">
          {group.name}
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 space-y-3 pt-2">
          {group.props.map((prop) => (
            <div key={prop.key}>
              <Label>{prop.label}</Label>
              {renderControl(prop, element)}
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    ))}
  </div>
);

// Debounce 300ms para atualizar elemento
const updateStyle = debounce((key, value) => {
  dispatch(UPDATE_ELEMENT, {
    id: element.id,
    props: { [key]: value }
  });
}, 300);
```

### AdvancedTab.tsx

```typescript
// Visibilidade por dispositivo
return (
  <div className="space-y-4 p-4">
    <div>
      <Label>Visibilidade</Label>
      <div className="flex gap-2 mt-2">
        <Button
          variant={element.props.visibleOn.desktop ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleVisibility('desktop')}
        >
          <Monitor size={16} /> Desktop
        </Button>
        <Button
          variant={element.props.visibleOn.tablet ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleVisibility('tablet')}
        >
          <Tablet size={16} /> Tablet
        </Button>
        <Button
          variant={element.props.visibleOn.mobile ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleVisibility('mobile')}
        >
          <Smartphone size={16} /> Mobile
        </Button>
      </div>
    </div>

    <div>
      <Label>Animação de Entrada</Label>
      <Select value={element.props.animationIn || 'none'}>
        <option value="none">Nenhuma</option>
        <option value="fadeIn">Fade In</option>
        <option value="slideInLeft">Slide In Left</option>
        <option value="slideInUp">Slide In Up</option>
        <option value="zoomIn">Zoom In</option>
        <option value="rotateIn">Rotate In</option>
      </Select>
      <Label className="mt-2">Velocidade</Label>
      <Select value={element.props.animationSpeed || '0.6s'}>
        <option value="0.3s">Rápido</option>
        <option value="0.6s">Normal</option>
        <option value="1s">Lento</option>
      </Select>
      <Label className="mt-2">Atraso (s)</Label>
      <SliderInput min={0} max={5} step={0.1} value={element.props.animationDelay || 0} />
    </div>

    <div>
      <Label>ID CSS</Label>
      <input
        type="text"
        value={element.props.customId || ''}
        onChange={(e) => updateElement({ props: { customId: e.target.value } })}
        placeholder="elemento-unico"
      />
    </div>

    <div>
      <Label>Classes CSS Adicionais</Label>
      <textarea
        value={element.props.customClasses || ''}
        onChange={(e) => updateElement({ props: { customClasses: e.target.value } })}
        placeholder="classe-1 classe-2"
        rows={3}
      />
    </div>
  </div>
);
```

### Edição Inline com useInlineEdit

```typescript
// Hook para edição síncrona
export const useInlineEdit = () => {
  const dispatch = useDispatch();
  const selectedElement = useSelectedElement();

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (selectedElement?.type === 'text' || selectedElement?.type === 'heading') {
      const element = e.currentTarget as HTMLElement;
      element.contentEditable = 'true';
      element.focus();
      // Selecionar todo o texto
      document.execCommand('selectAll');
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    const element = e.currentTarget as HTMLElement;
    const newText = element.textContent || '';

    // Atualizar no painel direito e canvas simultaneamente
    dispatch(UPDATE_ELEMENT, {
      id: selectedElement.id,
      props: { text: newText }
    });

    element.contentEditable = 'false';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  };

  return { handleDoubleClick, handleBlur, handleKeyDown };
};
```

## Critérios de Aceite

- [ ] 40 elementos em accordion por categorias
- [ ] Busca filtra elementos em tempo real
- [ ] Drag de elemento cria novo no canvas
- [ ] Clique em elemento interno abre painel direito
- [ ] Sidebar fecha ao abrir painel (width=0)
- [ ] Duplo clique sincroniza entre canvas e painel
- [ ] 150 propriedades na aba Estilo (agrupadas em 9 colapsáveis)
- [ ] Mudanças em tempo real com debounce 300ms
- [ ] Todos os 40 elementos renderizam corretamente
- [ ] ColorPicker com alpha channel
- [ ] FontSelector integrado com Google Fonts
- [ ] AnimSelector com previsualization

## Stack Técnico

- React 18+ com Hooks
- TypeScript
- TailwindCSS
- Framer Motion (animações)
- zustand (state management)
- HTML5 Drag and Drop API
