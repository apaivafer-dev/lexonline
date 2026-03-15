import type { ElementMeta, ElementCategory, StyleGroup } from '@/types/element.types';

export const ELEMENT_CATEGORIES: Array<{ id: ElementCategory; label: string; icon: string; elements: ElementMeta[] }> = [
  {
    id: 'text',
    label: 'Texto',
    icon: 'Type',
    elements: [
      { id: 'heading', name: 'Título', icon: 'Heading1', category: 'text', defaultProps: { level: 1, content: 'Seu Título' } },
      { id: 'text', name: 'Parágrafo', icon: 'AlignLeft', category: 'text', defaultProps: { content: 'Clique para editar.' } },
      { id: 'rich_text', name: 'Texto Rico', icon: 'Type', category: 'text', defaultProps: {} },
      { id: 'list', name: 'Lista', icon: 'List', category: 'text', defaultProps: { ordered: false } },
      { id: 'quote', name: 'Citação', icon: 'Quote', category: 'text', defaultProps: {} },
      { id: 'highlight', name: 'Destaque', icon: 'Highlighter', category: 'text', defaultProps: {} },
    ],
  },
  {
    id: 'media',
    label: 'Mídia',
    icon: 'Image',
    elements: [
      { id: 'image', name: 'Imagem', icon: 'Image', category: 'media', defaultProps: {} },
      { id: 'video', name: 'Vídeo', icon: 'Play', category: 'media', defaultProps: {} },
      { id: 'icon', name: 'Ícone', icon: 'Star', category: 'media', defaultProps: { icon: 'star' } },
      { id: 'gallery', name: 'Galeria', icon: 'Grid2x2', category: 'media', defaultProps: { columns: 3 } },
      { id: 'lottie', name: 'Animação', icon: 'Zap', category: 'media', defaultProps: {} },
    ],
  },
  {
    id: 'interaction',
    label: 'Interação',
    icon: 'MousePointer',
    elements: [
      { id: 'button', name: 'Botão', icon: 'MousePointer2', category: 'interaction', defaultProps: { text: 'Clique Aqui', variant: 'filled' } },
      { id: 'icon_button', name: 'Botão Ícone', icon: 'Circle', category: 'interaction', defaultProps: {} },
      { id: 'html_custom', name: 'HTML Custom', icon: 'Code', category: 'interaction', defaultProps: {} },
    ],
  },
  {
    id: 'form',
    label: 'Formulário',
    icon: 'FileText',
    elements: [
      { id: 'form', name: 'Formulário', icon: 'FileText', category: 'form', defaultProps: {} },
      { id: 'input', name: 'Input', icon: 'Type', category: 'form', defaultProps: {} },
      { id: 'textarea', name: 'Textarea', icon: 'AlignLeft', category: 'form', defaultProps: {} },
      { id: 'select', name: 'Select', icon: 'ChevronDown', category: 'form', defaultProps: {} },
      { id: 'checkbox', name: 'Checkbox', icon: 'CheckSquare', category: 'form', defaultProps: {} },
      { id: 'radio', name: 'Radio', icon: 'CircleDot', category: 'form', defaultProps: {} },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: 'Layout',
    elements: [
      { id: 'section', name: 'Seção', icon: 'Layout', category: 'layout', defaultProps: {} },
      { id: 'container', name: 'Container', icon: 'Box', category: 'layout', defaultProps: {} },
      { id: 'column', name: 'Coluna', icon: 'Columns2', category: 'layout', defaultProps: {} },
      { id: 'spacer', name: 'Espaçador', icon: 'Maximize2', category: 'layout', defaultProps: { height: 48 } },
      { id: 'divider', name: 'Divisor', icon: 'Minus', category: 'layout', defaultProps: {} },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: 'TrendingUp',
    elements: [
      { id: 'countdown', name: 'Countdown', icon: 'Clock', category: 'marketing', defaultProps: {} },
      { id: 'testimonial', name: 'Depoimento', icon: 'MessageCircle', category: 'marketing', defaultProps: {} },
      { id: 'pricing', name: 'Preços', icon: 'CreditCard', category: 'marketing', defaultProps: {} },
      { id: 'faq', name: 'FAQ', icon: 'HelpCircle', category: 'marketing', defaultProps: {} },
      { id: 'features', name: 'Features', icon: 'Zap', category: 'marketing', defaultProps: {} },
      { id: 'stats_counter', name: 'Estatísticas', icon: 'BarChart3', category: 'marketing', defaultProps: {} },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    icon: 'Share2',
    elements: [
      { id: 'social_icons', name: 'Redes Sociais', icon: 'Share2', category: 'social', defaultProps: {} },
      { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle', category: 'social', defaultProps: {} },
      { id: 'map', name: 'Mapa', icon: 'MapPin', category: 'social', defaultProps: {} },
    ],
  },
  {
    id: 'advanced',
    label: 'Avançado',
    icon: 'Settings',
    elements: [
      { id: 'tabs', name: 'Abas', icon: 'Layers', category: 'advanced', defaultProps: {} },
      { id: 'carousel', name: 'Carrossel', icon: 'Shuffle', category: 'advanced', defaultProps: {} },
      { id: 'popup', name: 'Popup', icon: 'Square', category: 'advanced', defaultProps: {} },
    ],
  },
];

export const STYLE_GROUPS: StyleGroup[] = [
  {
    name: 'Posição',
    props: [
      { key: 'position', label: 'Posição', type: 'select', options: ['static', 'relative', 'absolute', 'fixed'] },
      { key: 'left', label: 'Esquerda', type: 'slider', min: -500, max: 2000, unit: 'px' },
      { key: 'top', label: 'Topo', type: 'slider', min: -500, max: 2000, unit: 'px' },
      { key: 'zIndex', label: 'Z-index', type: 'number', min: -1000, max: 9999 },
    ],
  },
  {
    name: 'Dimensões',
    props: [
      { key: 'width', label: 'Largura', type: 'slider', min: 20, max: 1920, unit: 'px' },
      { key: 'height', label: 'Altura', type: 'slider', min: 20, max: 1080, unit: 'px' },
      { key: 'minWidth', label: 'Largura Mín', type: 'slider', min: 0, max: 1920, unit: 'px' },
      { key: 'maxWidth', label: 'Largura Máx', type: 'slider', min: 0, max: 1920, unit: 'px' },
      { key: 'aspectRatio', label: 'Proporção', type: 'select', options: ['auto', '1/1', '16/9', '4/3', '3/2'] },
    ],
  },
  {
    name: 'Flexbox / Grid',
    props: [
      { key: 'display', label: 'Display', type: 'select', options: ['block', 'flex', 'grid', 'inline', 'inline-block', 'none'] },
      { key: 'flexDirection', label: 'Direção', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'] },
      { key: 'justifyContent', label: 'Align Horizontal', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] },
      { key: 'alignItems', label: 'Align Vertical', type: 'select', options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] },
      { key: 'gap', label: 'Gap', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'flexWrap', label: 'Quebra de Linha', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'] },
      { key: 'flex', label: 'Flex', type: 'input', placeholder: '1 1 auto' },
    ],
  },
  {
    name: 'Espaçamento',
    props: [
      { key: 'marginTop', label: 'Margem Topo', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'marginRight', label: 'Margem Direita', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'marginBottom', label: 'Margem Baixo', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'marginLeft', label: 'Margem Esquerda', type: 'slider', min: -50, max: 200, unit: 'px' },
      { key: 'paddingTop', label: 'Padding Topo', type: 'slider', min: 0, max: 200, unit: 'px' },
      { key: 'paddingRight', label: 'Padding Direita', type: 'slider', min: 0, max: 200, unit: 'px' },
      { key: 'paddingBottom', label: 'Padding Baixo', type: 'slider', min: 0, max: 200, unit: 'px' },
      { key: 'paddingLeft', label: 'Padding Esquerda', type: 'slider', min: 0, max: 200, unit: 'px' },
    ],
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
    ],
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
    ],
  },
  {
    name: 'Bordas',
    props: [
      { key: 'borderWidth', label: 'Espessura', type: 'slider', min: 0, max: 20, unit: 'px' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color-picker' },
      { key: 'borderStyle', label: 'Estilo', type: 'select', options: ['solid', 'dashed', 'dotted', 'double', 'none'] },
      { key: 'borderRadius', label: 'Arredondamento', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderTopLeftRadius', label: 'Raio Topo Esq', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderTopRightRadius', label: 'Raio Topo Dir', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderBottomLeftRadius', label: 'Raio Baixo Esq', type: 'slider', min: 0, max: 100, unit: 'px' },
      { key: 'borderBottomRightRadius', label: 'Raio Baixo Dir', type: 'slider', min: 0, max: 100, unit: 'px' },
    ],
  },
  {
    name: 'Sombra e Filtro',
    props: [
      { key: 'boxShadow', label: 'Sombra', type: 'input', placeholder: '0 4px 12px rgba(0,0,0,0.15)' },
      { key: 'filter', label: 'Filtro', type: 'input', placeholder: 'blur(4px) brightness(1.1)' },
    ],
  },
  {
    name: 'Animação',
    props: [
      { key: 'animation', label: 'Animação', type: 'anim-selector' },
      { key: 'animationDuration', label: 'Duração', type: 'slider', min: 0.2, max: 5, step: 0.1, unit: 's' },
      { key: 'animationDelay', label: 'Atraso', type: 'slider', min: 0, max: 5, step: 0.1, unit: 's' },
      { key: 'animationIterationCount', label: 'Repetições', type: 'select', options: ['1', '2', '3', 'infinite'] },
      { key: 'animationTimingFunction', label: 'Timing', type: 'select', options: ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'] },
      { key: 'transform', label: 'Transform', type: 'input', placeholder: 'rotate(0deg) scale(1)' },
      { key: 'transition', label: 'Transição', type: 'input', placeholder: 'all 0.3s ease' },
    ],
  },
];
