# Lexonline — Design System

Referência central de design para o **builder de landing pages** (frontend) e o **portal administrativo** (PortalLexonline). Sempre que criar, ajustar ou revisar componentes, use este documento como fonte de verdade.

---

## 1. Fundação

### Stack de estilização
| Camada | Frontend Builder | PortalLexonline |
|---|---|---|
| Framework | Tailwind CSS 3.4 | Tailwind CSS 4.2 |
| Estilo dinâmico | `React.CSSProperties` (inline) | Tailwind utilities |
| Dark mode | Não aplicado | `darkMode: 'class'` |
| Fonte principal | Inter (Google Fonts) | Inter via `fontFamily.sans` |

### Utilitário de classes
```ts
// frontend/src/utils/cn.ts
cn(...classes: (string | false | null | undefined)[]): string
```
Usar sempre que combinar classes condicionais. Nunca concatenar strings manualmente.

---

## 2. Cores

### Paleta Principal (Tailwind Slate)

| Token | Hex | Uso |
|---|---|---|
| `slate-50` | `#f8fafc` | Fundo de página, backgrounds levíssimos |
| `slate-100` | `#f1f5f9` | Cards, inputs, hover background |
| `slate-200` | `#e2e8f0` | Bordas, divisores |
| `slate-300` | `#cbd5e1` | Bordas secundárias, placeholders |
| `slate-400` | `#94a3b8` | Texto desativado, ícones inativos |
| `slate-500` | `#64748b` | Texto secundário |
| `slate-600` | `#475569` | Texto de corpo padrão |
| `slate-700` | `#334155` | Labels, rótulos |
| `slate-800` | `#1e293b` | Textos de destaque, sidebars |
| `slate-900` | `#0f172a` | Títulos, textos principais |
| `slate-850`* | `#151e2e` | Fundo de painel escuro (Portal) |
| `slate-950`* | `#020617` | Fundo máximo escuro (Portal) |

> `*` Tokens customizados definidos em `PortalLexonline/tailwind.config.js`

### Paleta de Ação (Tailwind Blue)

| Token | Hex | Uso |
|---|---|---|
| `blue-50` | `#eff6ff` | Background de alertas info, hover suave |
| `blue-100` | `#dbeafe` | Badges, tags de informação |
| `blue-500` | `#3b82f6` | Links, ícones de ação |
| `blue-600` | `#2563eb` | **Cor primária** — botões, CTAs, selecionado |
| `blue-700` | `#1d4ed8` | Hover state de botões primários |
| `blue-800` | `#1e40af` | Estados pressionados, active |

### Paleta Semântica

| Intenção | Token Tailwind | Hex | Uso |
|---|---|---|---|
| Sucesso | `green-500` | `#22c55e` | Confirmação, publicado |
| Sucesso fundo | `green-50` / `dcfce7` | — | Background de badge de sucesso |
| Aviso | `yellow-500` | `#eab308` | Alertas, rascunho |
| Erro | `red-500` | `#ef4444` | Erros, destruição |
| Info | `blue-500` | `#3b82f6` | Informações neutras |
| WhatsApp | — | `#25d366` | Botão WhatsApp exclusivamente |

### Branco e Transparência

```
#ffffff — Superfícies primárias, textos sobre fundo escuro
rgba(0,0,0,0.15) — Sombra padrão de card
rgba(0,0,0,0.2)  — Sombra de texto
rgba(255,255,255,0.1) — Overlay em fundos escuros
```

---

## 3. Tipografia

### Família de Fontes

```
Font primária:  Inter, system-ui, -apple-system, sans-serif
Font de código: monospace (não customizada)
```

### Escala de Tamanhos

| Nome | px | Tailwind | Uso |
|---|---|---|---|
| `xs` | 12px | `text-xs` | Labels, meta, captions |
| `sm` | 14px | `text-sm` | Labels, descrições secundárias |
| `base` | 16px | `text-base` | Corpo de texto padrão |
| `lg` | 18px | `text-lg` | Subtítulos, destaque de parágrafo |
| `xl` | 20px | `text-xl` | Títulos de seção pequenos |
| `2xl` | 24px | `text-2xl` | Títulos de card, seção |
| `3xl` | 30px | `text-3xl` | Títulos de página |
| H6 | 16px | inline | Heading nível 6 |
| H5 | 18px | inline | Heading nível 5 |
| H4 | 22px | inline | Heading nível 4 |
| H3 | 28px | inline | Heading nível 3 |
| H2 | 36px | inline | Heading nível 2 |
| H1 | 48px | inline | Heading nível 1 (hero) |

### Pesos

| Valor | Nome | Uso |
|---|---|---|
| `400` | Regular | Corpo de texto, parágrafos |
| `500` | Medium | Labels, rótulos de campo |
| `600` | Semibold | Botões, subtítulos, destaque |
| `700` | Bold | Títulos principais |
| `800` | Extrabold | Headings de hero, números de stats |

### Line Height & Letter Spacing

```
Corpo:        line-height 1.7  (padrão legível)
Listas:       line-height 1.8
Títulos:      line-height 1.1 – 1.3
Letter-spacing: -2px a +10px (configurável pelo editor)
```

---

## 4. Espaçamento

Escala baseada em múltiplos de 4px (padrão Tailwind).

| Token | px | Tailwind | Uso típico |
|---|---|---|---|
| `1` | 4px | `p-1`, `m-1` | Espaço mínimo interno |
| `2` | 8px | `p-2`, `gap-2` | Separação de ícone/texto |
| `3` | 12px | `p-3` | Padding de badge, tag |
| `4` | 16px | `p-4` | Padding padrão de card/painel |
| `5` | 20px | `p-5` | Padding de seção compacta |
| `6` | 24px | `p-6` | Padding de card maior |
| `8` | 32px | `p-8` | Padding de seção |
| `12` | 48px | `p-12` | Espaçador vertical padrão |
| `16` | 64px | `p-16` | Seções hero |
| `24` | 96px | — | Seções com muito espaço |

### Espaçamento de componentes do editor
- **Spacer padrão:** `height: 48px`
- **Gap padrão entre colunas:** `0px` (configurável)
- **Padding de seção:** `paddingTop: 80px, paddingBottom: 80px` (template padrão)

---

## 5. Bordas e Arredondamento

| Token | px | Tailwind | Uso |
|---|---|---|---|
| `rounded-sm` | 2px | `rounded-sm` | Badges pequenos |
| `rounded` | 4px | `rounded` | Inputs, botões compactos |
| `rounded-md` | 6px | `rounded-md` | Cards, panels |
| `rounded-lg` | 8px | `rounded-lg` | Cards principais |
| `rounded-xl` | 12px | `rounded-xl` | Modais, drawers |
| `rounded-2xl` | 16px | `rounded-2xl` | Cards de destaque |
| `rounded-full` | 9999px | `rounded-full` | Avatars, pills, botões circulares |

### Bordas padrão
```
Borda leve:    border border-slate-200
Borda padrão:  border-2 border-slate-200
Borda de foco: ring-2 ring-blue-500 ring-offset-1
```

---

## 6. Sombras

```
shadow-sm   → 0 1px 2px rgba(0,0,0,0.05)          — Elementos quase sem sombra
shadow      → 0 1px 3px rgba(0,0,0,0.1)            — Cards padrão
shadow-md   → 0 4px 6px rgba(0,0,0,0.07)           — Dropdowns, popovers
shadow-lg   → 0 10px 15px rgba(0,0,0,0.1)          — Modais, sidebars flutuantes
shadow-xl   → 0 20px 25px rgba(0,0,0,0.1)          — Elementos em destaque máximo

Sombra customizada de card: 0 4px 12px rgba(0,0,0,0.15)
Sombra de texto:            0 2px 4px rgba(0,0,0,0.2)
```

---

## 7. Breakpoints (Editor)

O editor usa um sistema de dispositivo explícito — **não** media queries CSS.

| Dispositivo | Largura de canvas | Constante |
|---|---|---|
| Desktop | 1440px | `DEVICE_WIDTHS.desktop` |
| Tablet | 768px | `DEVICE_WIDTHS.tablet` |
| Mobile | 375px | `DEVICE_WIDTHS.mobile` |

A visibilidade de elementos é controlada por:
```ts
ElementInstance.visibleOn = {
  desktop: boolean,
  tablet: boolean,
  mobile: boolean
}
```

---

## 8. Componentes de Interface (Builder)

### Botões

| Variante | Aparência | Tailwind base |
|---|---|---|
| `filled` | Fundo azul, texto branco | `bg-blue-600 text-white hover:bg-blue-700` |
| `outline` | Borda azul, texto azul, fundo transparente | `border-2 border-blue-600 text-blue-600 hover:bg-blue-50` |
| `ghost` | Sem borda, texto azul | `text-blue-600 hover:bg-blue-50` |

| Tamanho | Padding | Font size |
|---|---|---|
| `sm` | `px-3 py-1.5` | `text-sm` |
| `md` | `px-4 py-2` | `text-base` |
| `lg` | `px-6 py-3` | `text-lg` |

Peso sempre `font-semibold`. Transição padrão `transition-colors`.

### Cards / Painéis
```
bg-white rounded-lg border border-slate-200 shadow-sm p-4
bg-white rounded-xl border border-slate-200 shadow-md p-6  (card destacado)
```

### Inputs / Formulários
```
border border-slate-200 rounded-md px-3 py-2 text-sm
focus:outline-none focus:ring-2 focus:ring-blue-500
bg-white text-slate-900 placeholder:text-slate-400
```

### Badges / Tags
```
Neutro:   bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full
Sucesso:  bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full
Aviso:    bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full
Erro:     bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full
Info:     bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full
```

### Sidebar do Editor
```
Largura: w-64 (256px)
Fundo:   bg-white
Borda:   border-r border-slate-200
```

### TopBar do Editor
```
Altura:  h-14 (56px)
Fundo:   bg-white
Borda:   border-b border-slate-200
Sombra:  shadow-sm
```

---

## 9. Categorias de Elementos

O editor organiza elementos em 8 categorias:

| ID | Label | Elementos |
|---|---|---|
| `text` | Texto | Título, Parágrafo, Texto Rico, Lista, Citação, Destaque |
| `media` | Mídia | Imagem, Vídeo, Ícone, Galeria, Animação (Lottie) |
| `interaction` | Interação | Botão, Botão Ícone, HTML Custom |
| `form` | Formulário | Form, Input, Textarea, Select, Checkbox, Radio |
| `layout` | Layout | Seção, Container, Coluna, Espaçador, Divisor |
| `marketing` | Marketing | Countdown, Depoimento, Preços, FAQ, Features, Estatísticas |
| `social` | Social | Redes Sociais, WhatsApp, Mapa |
| `advanced` | Avançado | Abas, Carrossel, Popup |

---

## 10. Grupos de Estilo (STYLE_GROUPS)

Propriedades CSS controladas pelo painel direito do editor, agrupadas em 9 categorias:

| Grupo | Propriedades-chave |
|---|---|
| **Posição** | `position`, `left`, `top`, `zIndex` |
| **Dimensões** | `width`, `height`, `minWidth`, `maxWidth`, `aspectRatio` |
| **Flexbox/Grid** | `display`, `flexDirection`, `justifyContent`, `alignItems`, `gap`, `flexWrap`, `flex` |
| **Espaçamento** | `marginTop/Right/Bottom/Left`, `paddingTop/Right/Bottom/Left` |
| **Tipografia** | `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `textDecoration`, `lineHeight`, `letterSpacing`, `textAlign`, `textTransform`, `textShadow` |
| **Cores** | `color`, `backgroundColor`, `backgroundImage`, `backgroundSize`, `backgroundPosition`, `opacity` |
| **Bordas** | `borderWidth`, `borderColor`, `borderStyle`, `borderRadius` (todos os cantos) |
| **Sombra e Filtro** | `boxShadow`, `filter` |
| **Animação** | `animation`, `animationDuration`, `animationDelay`, `animationIterationCount`, `animationTimingFunction`, `transform`, `transition` |

---

## 11. Animações

Opções disponíveis via `anim-selector`:

```
Duração:    0.2s – 5s (passo 0.1s), padrão recomendado: 0.5s
Atraso:     0s – 5s   (passo 0.1s)
Repetições: 1 | 2 | 3 | infinite
Timing:     ease | ease-in | ease-out | ease-in-out | linear
```

Transição padrão de UI (hover/focus):
```css
transition: all 0.2s ease;
transition: colors 0.15s ease; /* apenas cor */
```

---

## 12. Ícones

Biblioteca: **Lucide React** (`lucide-react` ^0.563.0)

- Usar sempre ícones do Lucide — não misturar com outras bibliotecas.
- Tamanho padrão: `size={16}` (UI) | `size={20}` (ações) | `size={24}` (elementos de destaque)
- Cor: herdar do contexto via `currentColor` (padrão Lucide)

---

## 13. Estrutura de Página (Schema)

```
PageSchema[]              → array de seções
  └─ PageColumn[]         → colunas por seção
       └─ ElementInstance[]  → elementos por coluna
```

Cada `ElementInstance`:
```ts
{
  id: string
  type: ElementType
  props: Record<string, any>   // propriedades específicas do elemento
  styles: Record<string, string> // CSS properties (camelCase)
  visibleOn?: { desktop, tablet, mobile }
  animationIn?: string
  animationSpeed?: string
  animationDelay?: number
  customId?: string
  customClasses?: string
}
```

---

## 14. Padrões de Convenção

### Nomeação de classes Tailwind
- Ordenação: layout → dimensões → espaçamento → tipografia → cores → bordas → efeitos → estado
- Preferir utilitários Tailwind a estilos inline para UI de painel/editor
- Usar estilos inline (`React.CSSProperties`) apenas para propriedades dinâmicas dos elementos da página

### Responsividade
- **UI do editor:** Não responsiva (desktop-only)
- **Preview da página:** Controlado por `device` state, não por media queries
- **PortalLexonline:** Mobile-first com `sm:`, `md:`, `lg:` prefixes

### Dark Mode (Portal)
- Ativado via classe `.dark` no `<html>`
- Padrão: usar `dark:` prefix nas classes Tailwind
- Fundos escuros: `slate-850` (#151e2e) e `slate-950` (#020617)

### Status de Páginas
```
draft      → badge amarelo  (rascunho)
published  → badge verde    (publicado)
archived   → badge cinza    (arquivado)
```

---

## 15. Anti-padrões (Evitar)

- Não usar cores hardcoded (`#2563eb`) em componentes de UI — usar tokens Tailwind
- Não criar componentes sem considerar os grupos de estilo existentes
- Não adicionar bibliotecas de ícones além do Lucide
- Não usar `position: fixed` em elementos de página (conflita com preview do editor)
- Não concatenar classes Tailwind via string — usar sempre `cn()`
- Não criar media queries CSS para breakpoints de página — usar o sistema `device` do editor
- Não usar `gray-*` no Portal — usar sempre `slate-*`
- Não usar `indigo-*` ou `violet-*` — usar `blue-*` (paleta de ação unificada)

---

## 16. Exceções Intencionais

### `FontSelector.tsx` — Seletor de Fontes do Editor

**Localização:** `frontend/src/page/editor/RightPanel/controls/FontSelector.tsx`

Este componente expõe 16 famílias de fonte para o **usuário final** configurar a página editada. Comportamento esperado e intencional — o editor precisa oferecer variedade tipográfica para o conteúdo da landing page.

**Regra:** Fontes não-Inter são permitidas **exclusivamente** neste componente.

Fontes disponíveis ao usuário final:
```
Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Source Sans Pro,
Raleway, Nunito, Ubuntu, Playfair Display, Merriweather, Lora,
Georgia, Times New Roman, Courier New, JetBrains Mono
```

A regra "Inter only" aplica-se apenas à **UI do editor e do portal**, não ao conteúdo editável.

### `HeroUrgencyBlock.tsx` — Bloco de Urgência

Usa `red-*` como cor principal do bloco. Válido semanticamente (urgência/escassez). O botão de CTA segue a variante `outline` adaptada ao contexto: fundo branco, texto vermelho, borda branca, hover `bg-red-50`.

---

*Gerado em 2026-03-15 | Baseado na análise de `frontend/src/`, `PortalLexonline/`, e `backend/`*
