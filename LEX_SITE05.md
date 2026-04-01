# LEX_SITE05 — Fase 3b: Blocos Inteligentes (30 Blocos)

## Título
LEX_SITE05 — Fase 3b: Blocos Inteligentes (30 Blocos)

## Objetivo
Implementar biblioteca completa de 30 blocos pré-montados especializados para marketing jurídico. Blocos acessíveis APENAS pelo botão "+" no canvas (não na Sidebar). Incluir BlockWrapper com controles flutuantes, BlockSettings, e 30 blocos organizados por categoria (Hero, Prova Social, Benefícios, Conversão, Jurídicos exclusivos, Estrutura).

## Dependência
- Requer: **Fase 3a** (Layout Full-Screen do Editor)
- Bloqueia: Fase 3c (Painel Direito de Edição)

---

## Arquivos a Criar

### Components
- [ ] `frontend/src/page/editor/Canvas/BlockWrapper.tsx` (novo)
- [ ] `frontend/src/page/editor/Canvas/BlockFloatingControls.tsx` (novo)
- [ ] `frontend/src/page/editor/Canvas/BlockSettings.tsx` (novo)

### Bloco Hero (5 blocos)
- [ ] `frontend/src/page/editor/blocks/HeroBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/HeroLeadBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/HeroVslBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/HeroUrgencyBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/HeroVideoBlock.tsx` (novo)

### Prova Social (2 blocos)
- [ ] `frontend/src/page/editor/blocks/TestimonialsBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/SocialProofBlock.tsx` (novo)

### Benefícios (4 blocos)
- [ ] `frontend/src/page/editor/blocks/Benefits3Block.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/Benefits4Block.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/FeaturesBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/StepsBlock.tsx` (novo)

### Conversão (5 blocos)
- [ ] `frontend/src/page/editor/blocks/CtaBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/ContactBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/PricingBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/FaqBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/NewsletterBlock.tsx` (novo)

### Jurídico Especializado (6 blocos)
- [ ] `frontend/src/page/editor/blocks/legal/AreasBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/legal/LawyerProfileBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/legal/ProcessStepsBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/legal/OabBadgeBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/legal/SchedulingBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/legal/JuridicalFaqBlock.tsx` (novo)

### Estrutura (8 blocos)
- [ ] `frontend/src/page/editor/blocks/structure/AboutBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/structure/MissionBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/structure/TimelineBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/structure/PartnersBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/structure/TestimonialVideoBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/structure/GalleryBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/structure/PricingTableBlock.tsx` (novo)
- [ ] `frontend/src/page/editor/blocks/structure/FooterBlock.tsx` (novo)

### Hooks
- [ ] `frontend/src/hooks/useBlocks.ts` (novo)

### Constants & Types
- [ ] `frontend/src/constants/blocks.constants.ts` (novo)
- [ ] `frontend/src/types/block.types.ts` (novo)

---

## Detalhamento

### 1. Types — `frontend/src/types/block.types.ts`

```typescript
// frontend/src/types/block.types.ts

export type BlockType =
  | 'hero'
  | 'hero-lead'
  | 'hero-vsl'
  | 'hero-urgency'
  | 'hero-video'
  | 'testimonials'
  | 'social-proof'
  | 'benefits-3'
  | 'benefits-4'
  | 'features'
  | 'steps'
  | 'cta'
  | 'contact'
  | 'pricing'
  | 'faq'
  | 'newsletter'
  | 'areas'
  | 'lawyer-profile'
  | 'process-steps'
  | 'oab-badge'
  | 'scheduling'
  | 'juridical-faq'
  | 'about'
  | 'mission'
  | 'timeline'
  | 'partners'
  | 'testimonial-video'
  | 'gallery'
  | 'pricing-table'
  | 'footer';

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  category: BlockCategory;
  description: string;
  thumbnail?: string;
  schema: BlockSchema;
  defaultContent: any;
  is_premium: boolean;
}

export type BlockCategory =
  | 'hero'
  | 'social_proof'
  | 'benefits'
  | 'conversion'
  | 'legal'
  | 'structure';

export interface BlockSchema {
  styles: Record<string, string>;
  content: any;
  columns?: number[];
  elements?: BlockElement[];
}

export interface BlockElement {
  id: string;
  type: string;
  tag?: string;
  content?: string;
  styles?: Record<string, string>;
  children?: BlockElement[];
}
```

---

### 2. Constants — `frontend/src/constants/blocks.constants.ts`

```typescript
// frontend/src/constants/blocks.constants.ts

import type { Block, BlockType } from '@/types/block.types';

export const BLOCK_REGISTRY: Record<BlockType, Block> = {
  // HERO (5)
  hero: {
    id: '01',
    type: 'hero',
    title: 'Hero Simples',
    category: 'hero',
    description: 'Título, subtítulo e CTA principal',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Seu Título Aqui',
      subtitle: 'Subtítulo que descreve sua proposta',
      cta_text: 'Começar Agora',
      cta_url: '#',
      bg_color: '#f8fafc',
    },
  },

  'hero-lead': {
    id: '02',
    type: 'hero-lead',
    title: 'Hero com Lead Capture',
    category: 'hero',
    description: 'Hero com formulário de captura lateral',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Aproveite sua Consultoria Jurídica Gratuita',
      subtitle: 'Análise completa do seu caso em 15 minutos',
      form_title: 'Informe Seus Dados',
      form_fields: ['name', 'email', 'phone'],
      cta_text: 'Agendar Agora',
      bg_color: '#ffffff',
    },
  },

  'hero-vsl': {
    id: '03',
    type: 'hero-vsl',
    title: 'Hero VSL (Video Sales Letter)',
    category: 'hero',
    description: 'Vídeo de vendas destaque com play button',
    is_premium: true,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Descubra Como Resolvemos 500+ Casos',
      subtitle: 'Assista este vídeo de 3 minutos',
      video_url: 'https://vimeo.com/exemplo',
      video_thumbnail: '',
      cta_text: 'Fale Conosco',
    },
  },

  'hero-urgency': {
    id: '04',
    type: 'hero-urgency',
    title: 'Hero com Urgência',
    category: 'hero',
    description: 'Countdown timer + oferta limitada',
    is_premium: true,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Oferta Especial - Vagas Limitadas',
      subtitle: '3 primeiros clientes recebem 30% de desconto',
      countdown_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      cta_text: 'Garantir Vaga',
      remaining_spots: 3,
    },
  },

  'hero-video': {
    id: '05',
    type: 'hero-video',
    title: 'Hero com Vídeo Background',
    category: 'hero',
    description: 'Vídeo de fundo fullscreen com overlay',
    is_premium: true,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Transformando Vidas Através da Justiça',
      subtitle: 'Advocacia especializada em direitos do consumidor',
      video_url: 'https://videos.com/example.mp4',
      overlay_opacity: 0.4,
      overlay_color: '#000000',
      cta_text: 'Consulte Agora',
    },
  },

  // PROVA SOCIAL (2)
  testimonials: {
    id: '06',
    type: 'testimonials',
    title: 'Depoimentos (Slider)',
    category: 'social_proof',
    description: 'Depoimentos de clientes em carousel',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'O Que Nossos Clientes Dizem',
      testimonials: [
        {
          text: 'Excelente atendimento e resultado surpreendente!',
          author: 'João Silva',
          role: 'Empresário',
          image: '',
          rating: 5,
        },
      ],
      layout: 'carousel', // carousel | grid
    },
  },

  'social-proof': {
    id: '07',
    type: 'social-proof',
    title: 'Estatísticas de Sucesso',
    category: 'social_proof',
    description: 'Cards com números de cases resolvidos',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Números que Falam por Si Só',
      stats: [
        { label: 'Cases Resolvidos', value: '500+', icon: 'check' },
        { label: 'Clientes Satisfeitos', value: '98%', icon: 'star' },
        { label: 'Anos de Experiência', value: '15+', icon: 'award' },
        { label: 'Vitórias em Tribunal', value: '200+', icon: 'trophy' },
      ],
    },
  },

  // BENEFÍCIOS (4)
  'benefits-3': {
    id: '08',
    type: 'benefits-3',
    title: 'Benefícios 3 Colunas',
    category: 'benefits',
    description: '3 cards de benefícios lado a lado',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Por Que Nos Escolher',
      items: [
        {
          title: 'Especialização',
          description: 'Equipe experiente em direito do consumidor',
          icon: 'briefcase',
        },
        {
          title: 'Transparência',
          description: 'Comunicação clara desde o primeiro contato',
          icon: 'eye',
        },
        {
          title: 'Resultados',
          description: '95% de taxa de sucesso em nossas ações',
          icon: 'check',
        },
      ],
    },
  },

  'benefits-4': {
    id: '09',
    type: 'benefits-4',
    title: 'Benefícios 4 Colunas',
    category: 'benefits',
    description: '4 cards de benefícios lado a lado',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Vantagens Exclusivas',
      items: [
        { title: 'Atendimento 24/7', icon: 'phone' },
        { title: 'Sem Taxa Inicial', icon: 'credit-card' },
        { title: 'Garantia de Resultado', icon: 'shield' },
        { title: 'Equipe Dedicada', icon: 'users' },
      ],
    },
  },

  features: {
    id: '10',
    type: 'features',
    title: 'Recursos Alternados (Imagem + Texto)',
    category: 'benefits',
    description: 'Texto à esquerda/direita com imagem alternada',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      items: [
        {
          title: 'Consultoria Estratégica',
          description: 'Análise profunda do seu caso...',
          image: '',
          cta: 'Saiba Mais',
        },
      ],
    },
  },

  steps: {
    id: '11',
    type: 'steps',
    title: 'Processo em Etapas',
    category: 'benefits',
    description: 'Timeline vertical ou horizontal',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Como Funciona Nosso Atendimento',
      steps: [
        { number: 1, title: 'Consulta Inicial', description: 'Entendemos seu caso' },
        { number: 2, title: 'Análise Jurídica', description: 'Avaliamos as opções' },
        { number: 3, title: 'Estratégia', description: 'Definimos o plano' },
        { number: 4, title: 'Ação', description: 'Executamos a solução' },
      ],
    },
  },

  // CONVERSÃO (5)
  cta: {
    id: '12',
    type: 'cta',
    title: 'CTA Seção (Call-to-Action)',
    category: 'conversion',
    description: 'Seção de chamada com destaque visual',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Pronto Para Resolver Seu Caso?',
      subtitle: 'Agende uma consultoria gratuita com nossos especialistas',
      cta_text: 'Agendar Consultoria',
      cta_url: '#',
      bg_color: '#2563eb',
      text_color: '#ffffff',
    },
  },

  contact: {
    id: '13',
    type: 'contact',
    title: 'Formulário de Contato',
    category: 'conversion',
    description: 'Formulário completo com validação',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Entre em Contato',
      subtitle: 'Preencha o formulário e entraremos em contato',
      fields: ['name', 'email', 'phone', 'subject', 'message'],
      submit_text: 'Enviar',
      success_message: 'Sua mensagem foi enviada com sucesso!',
    },
  },

  pricing: {
    id: '14',
    type: 'pricing',
    title: 'Tabela de Preços',
    category: 'conversion',
    description: '2-3 cards de pricing com destaque',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Nossos Pacotes',
      plans: [
        {
          name: 'Essencial',
          price: 'R$ 1.990',
          period: '/consulta',
          features: ['Consultoria inicial', 'Análise de caso', 'Recomendações'],
          cta: 'Contratar',
          featured: false,
        },
      ],
    },
  },

  faq: {
    id: '15',
    type: 'faq',
    title: 'FAQ (Perguntas Frequentes)',
    category: 'conversion',
    description: 'Accordion com perguntas e respostas',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Perguntas Frequentes',
      faqs: [
        {
          question: 'Qual é o valor da consultoria inicial?',
          answer: 'A consultoria inicial é gratuita. Realizamos uma análise completa do seu caso.',
        },
      ],
    },
  },

  newsletter: {
    id: '16',
    type: 'newsletter',
    title: 'Newsletter Signup',
    category: 'conversion',
    description: 'Seção de inscrição em newsletter',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Receba Dicas Jurídicas Exclusivas',
      subtitle: 'Inscreva-se em nossa newsletter semanal',
      placeholder: 'Seu melhor email',
      cta_text: 'Inscrever',
    },
  },

  // JURÍDICO ESPECIALIZADO (6)
  areas: {
    id: '17',
    type: 'areas',
    title: 'Áreas de Atuação',
    category: 'legal',
    description: 'Grid de áreas jurídicas com ícones',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Nossas Áreas de Especialização',
      areas: [
        { name: 'Direito do Consumidor', icon: 'shield', color: '#2563eb' },
        { name: 'Direito Imobiliário', icon: 'home', color: '#7c3aed' },
        { name: 'Direito Trabalhista', icon: 'briefcase', color: '#dc2626' },
        { name: 'Direito Previdenciário', icon: 'calendar', color: '#059669' },
        { name: 'Direito Família', icon: 'heart', color: '#f59e0b' },
        { name: 'Direito Tributário', icon: 'calculator', color: '#6366f1' },
      ],
    },
  },

  'lawyer-profile': {
    id: '18',
    type: 'lawyer-profile',
    title: 'Perfil do Advogado',
    category: 'legal',
    description: 'Card com foto, bio, OAB e depoimentos',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      name: 'Dr. João Silva',
      title: 'Especialista em Direito do Consumidor',
      bio: 'Mais de 15 anos de experiência em...',
      image: '',
      oab: 'SP 123456',
      specialties: ['Direito do Consumidor', 'Indenizações'],
      phone: '(11) 99999-9999',
      cta_text: 'Agendar Consultoria',
    },
  },

  'process-steps': {
    id: '19',
    type: 'process-steps',
    title: 'Processo Jurídico em Etapas',
    category: 'legal',
    description: 'Timeline do processo legal desde início até julgamento',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Entenda o Processo Legal',
      steps: [
        { phase: 'Protocolo', description: 'Registro da ação', duration: '1 dia' },
        { phase: 'Contestação', description: 'Resposta da outra parte', duration: '15 dias' },
        { phase: 'Instrução', description: 'Coleta de provas', duration: '6 meses' },
        { phase: 'Julgamento', description: 'Decisão do juiz', duration: 'variável' },
      ],
    },
  },

  'oab-badge': {
    id: '20',
    type: 'oab-badge',
    title: 'Badge de Credibilidade (OAB/Certificações)',
    category: 'legal',
    description: 'Badges de OAB, certificações e prêmios',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Credenciais e Certificações',
      credentials: [
        { label: 'OAB SP 123456', image: '', type: 'oab' },
        { label: 'Especialista - AADC', image: '', type: 'cert' },
        { label: 'Prêmio Melhor Advogado 2023', image: '', type: 'award' },
      ],
    },
  },

  scheduling: {
    id: '21',
    type: 'scheduling',
    title: 'Agendamento de Consultoria',
    category: 'legal',
    description: 'Calendário integrado com agendamento',
    is_premium: true,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Agende Sua Consultoria',
      subtitle: 'Escolha um horário disponível',
      calendar_url: '',
      timezone: 'America/Sao_Paulo',
      slot_duration: 30,
      availability_days: 5,
    },
  },

  'juridical-faq': {
    id: '22',
    type: 'juridical-faq',
    title: 'FAQ Jurídico Especializado',
    category: 'legal',
    description: 'Perguntas frequentes sobre questões legais',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Dúvidas Sobre Seu Direito?',
      faqs: [
        {
          question: 'Qual é o prazo para entrar com uma ação?',
          answer: 'Depende do tipo de direito. Geralmente varia de 3 a 5 anos...',
        },
        {
          question: 'Quanto custa uma consultoria?',
          answer: 'A consultoria inicial é sempre gratuita. Após análise, definimos os honorários.',
        },
      ],
    },
  },

  // ESTRUTURA (8)
  about: {
    id: '23',
    type: 'about',
    title: 'Sobre Nós',
    category: 'structure',
    description: 'Seção sobre a empresa/escritório',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Sobre Nosso Escritório',
      content: 'Fundado em 2008, somos especialistas em...',
      image: '',
      cta_text: 'Conheça Melhor',
    },
  },

  mission: {
    id: '24',
    type: 'mission',
    title: 'Missão, Visão, Valores',
    category: 'structure',
    description: 'Cards com missão, visão e valores',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      mission: 'Garantir acesso à justiça de forma eficiente...',
      vision: 'Ser referência em advocacia specializada...',
      values: [
        'Ética profissional',
        'Transparência',
        'Excelência',
        'Dedicação',
      ],
    },
  },

  timeline: {
    id: '25',
    type: 'timeline',
    title: 'Timeline - Histórico da Empresa',
    category: 'structure',
    description: 'Timeline vertical ou horizontal',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Nossa Trajetória',
      events: [
        { year: 2008, title: 'Fundação', description: 'Início das atividades' },
        { year: 2012, title: 'Expansão', description: 'Abertura de filiais' },
        { year: 2023, title: 'Transformação Digital', description: 'Plataforma online' },
      ],
    },
  },

  partners: {
    id: '26',
    type: 'partners',
    title: 'Parcerias e Colaboradores',
    category: 'structure',
    description: 'Logos de parceiros e colaboradores',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Nossos Parceiros',
      partners: [
        { name: 'OAB', logo: '' },
        { name: 'Associação de Direito', logo: '' },
      ],
    },
  },

  'testimonial-video': {
    id: '27',
    type: 'testimonial-video',
    title: 'Vídeo Depoimento',
    category: 'structure',
    description: 'Vídeo de depoimento de cliente',
    is_premium: true,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Histórias de Sucesso',
      subtitle: 'Veja como ajudamos nossos clientes',
      video_url: '',
      client_name: 'Cliente Exemplo',
      case_result: 'Recuperou R$ 50.000',
    },
  },

  gallery: {
    id: '28',
    type: 'gallery',
    title: 'Galeria de Imagens',
    category: 'structure',
    description: 'Grid de fotos com lightbox',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Nossa Galeria',
      images: [],
      columns: 3,
    },
  },

  'pricing-table': {
    id: '29',
    type: 'pricing-table',
    title: 'Tabela de Preços Detalhada',
    category: 'structure',
    description: 'Tabela com múltiplos planos e recursos',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      title: 'Nossos Pacotes',
      plans: [
        {
          name: 'Essencial',
          price: 'R$ 1.990',
          features: ['Consultoria', 'Análise', 'Recomendações'],
        },
      ],
    },
  },

  footer: {
    id: '30',
    type: 'footer',
    title: 'Rodapé',
    category: 'structure',
    description: 'Seção rodapé com contatos e links',
    is_premium: false,
    schema: { styles: {}, content: {} },
    defaultContent: {
      company_name: 'Escritório de Advocacia',
      company_description: 'Especialistas em direito...',
      contact_email: 'contato@exemplo.com',
      contact_phone: '(11) 9999-9999',
      address: 'Rua Exemplo, 123 - São Paulo, SP',
      social_links: [
        { platform: 'facebook', url: '' },
        { platform: 'instagram', url: '' },
        { platform: 'linkedin', url: '' },
      ],
      copyright: '© 2024 Escritório de Advocacia. Todos os direitos reservados.',
    },
  },
};

export const BLOCKS_BY_CATEGORY = {
  hero: ['hero', 'hero-lead', 'hero-vsl', 'hero-urgency', 'hero-video'],
  social_proof: ['testimonials', 'social-proof'],
  benefits: ['benefits-3', 'benefits-4', 'features', 'steps'],
  conversion: ['cta', 'contact', 'pricing', 'faq', 'newsletter'],
  legal: ['areas', 'lawyer-profile', 'process-steps', 'oab-badge', 'scheduling', 'juridical-faq'],
  structure: [
    'about',
    'mission',
    'timeline',
    'partners',
    'testimonial-video',
    'gallery',
    'pricing-table',
    'footer',
  ],
};
```

---

### 3. Hook — `frontend/src/hooks/useBlocks.ts`

```typescript
// frontend/src/hooks/useBlocks.ts

import { useCallback } from 'react';
import type { Page } from '@/types/page.types';

export function useBlocks(page: Page | null, onPageUpdate: (page: Page) => void) {
  const addBlock = useCallback(
    (blockType: string, afterIndex?: number) => {
      if (!page) return;

      const newBlock = {
        id: `block-${Date.now()}`,
        type: blockType,
        styles: {},
        columns: [12],
        elements: [],
      };

      const newSchema = [...page.schema];
      if (afterIndex !== undefined) {
        newSchema.splice(afterIndex + 1, 0, newBlock);
      } else {
        newSchema.push(newBlock);
      }

      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const addEmptyBlock = useCallback(
    (columns: number[], afterIndex?: number) => {
      if (!page) return;

      const newBlock = {
        id: `block-${Date.now()}`,
        type: 'section',
        styles: {},
        columns,
        elements: columns.map(() => []),
      };

      const newSchema = [...page.schema];
      if (afterIndex !== undefined) {
        newSchema.splice(afterIndex + 1, 0, newBlock);
      } else {
        newSchema.push(newBlock);
      }

      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      if (!page) return;

      const newSchema = page.schema.filter((block) => block.id !== blockId);
      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const reorderBlock = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (!page) return;

      const newSchema = [...page.schema];
      const [block] = newSchema.splice(fromIndex, 1);
      newSchema.splice(toIndex, 0, block);

      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const duplicateBlock = useCallback(
    (blockId: string) => {
      if (!page) return;

      const blockIndex = page.schema.findIndex((b) => b.id === blockId);
      if (blockIndex === -1) return;

      const blockToDuplicate = page.schema[blockIndex];
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now()}`,
      };

      const newSchema = [...page.schema];
      newSchema.splice(blockIndex + 1, 0, duplicatedBlock);

      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const updateBlockStyle = useCallback(
    (blockId: string, styles: Record<string, string>) => {
      if (!page) return;

      const newSchema = page.schema.map((block) =>
        block.id === blockId ? { ...block, styles: { ...block.styles, ...styles } } : block
      );

      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  return {
    addBlock,
    addEmptyBlock,
    removeBlock,
    reorderBlock,
    duplicateBlock,
    updateBlockStyle,
  };
}
```

---

### 4. Component — `frontend/src/page/editor/Canvas/BlockFloatingControls.tsx`

```typescript
// frontend/src/page/editor/Canvas/BlockFloatingControls.tsx

import React from 'react';
import { ArrowUp, ArrowDown, Copy, Trash2, Settings } from 'lucide-react';

interface BlockFloatingControlsProps {
  blockId: string;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  onSettings: (blockId: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockFloatingControls({
  blockId,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onSettings,
  canMoveUp,
  canMoveDown,
}: BlockFloatingControlsProps) {
  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-slate-300 rounded-lg shadow-lg flex items-center gap-1 p-2 z-20 whitespace-nowrap">
      <button
        onClick={() => onMoveUp(blockId)}
        disabled={!canMoveUp}
        className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
        title="Mover para cima"
      >
        <ArrowUp size={16} />
      </button>

      <button
        onClick={() => onMoveDown(blockId)}
        disabled={!canMoveDown}
        className="p-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition"
        title="Mover para baixo"
      >
        <ArrowDown size={16} />
      </button>

      <div className="w-px h-6 bg-slate-200" />

      <button
        onClick={() => onDuplicate(blockId)}
        className="p-2 hover:bg-slate-100 rounded transition"
        title="Duplicar bloco"
      >
        <Copy size={16} />
      </button>

      <button
        onClick={() => onDelete(blockId)}
        className="p-2 hover:bg-red-50 text-red-600 rounded transition"
        title="Excluir bloco"
      >
        <Trash2 size={16} />
      </button>

      <button
        onClick={() => onSettings(blockId)}
        className="p-2 hover:bg-slate-100 rounded transition"
        title="Configurações"
      >
        <Settings size={16} />
      </button>
    </div>
  );
}
```

---

### 5. Component — `frontend/src/page/editor/Canvas/BlockSettings.tsx`

```typescript
// frontend/src/page/editor/Canvas/BlockSettings.tsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Block } from '@/types/block.types';

interface BlockSettingsProps {
  block: Block | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
}

export function BlockSettings({ block, isOpen, onClose, onSave }: BlockSettingsProps) {
  const [settings, setSettings] = useState(block?.schema || {});

  if (!isOpen || !block) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed right-0 top-16 w-80 h-[calc(100vh-64px)] bg-white border-l border-slate-200 shadow-lg z-40 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">⚙ Configurações</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Bloco</label>
            <p className="text-xs text-slate-500">{block.type}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
            <input
              type="color"
              defaultValue="#ffffff"
              className="w-full h-10 rounded border border-slate-300 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Padding</label>
            <input
              type="number"
              placeholder="16"
              defaultValue="16"
              className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition font-medium"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### 6. Component — `frontend/src/page/editor/Canvas/BlockWrapper.tsx`

```typescript
// frontend/src/page/editor/Canvas/BlockWrapper.tsx

import React, { useState } from 'react';
import { BlockFloatingControls } from './BlockFloatingControls';
import { BlockSettings } from './BlockSettings';

interface BlockWrapperProps {
  blockId: string;
  blockType: string;
  children: React.ReactNode;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function BlockWrapper({
  blockId,
  blockType,
  children,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp,
  canMoveDown,
}: BlockWrapperProps) {
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div
      className="relative my-4 border-2 border-transparent hover:border-blue-400 rounded-lg transition"
      onMouseEnter={() => setShowFloatingControls(true)}
      onMouseLeave={() => setShowFloatingControls(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Floating Controls */}
      {showFloatingControls && (
        <BlockFloatingControls
          blockId={blockId}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onSettings={() => setShowSettings(true)}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      )}

      {/* Block Content */}
      <div className="p-4">{children}</div>

      {/* Settings Panel */}
      {showSettings && (
        <BlockSettings
          block={null}
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={() => {}}
        />
      )}
    </div>
  );
}
```

---

### 7. Exemplos de Blocos (30 arquivos, mostro 3 exemplos)

**Hero Simples:**

```typescript
// frontend/src/page/editor/blocks/HeroBlock.tsx

import React, { useState } from 'react';

export function HeroBlock() {
  const [content, setContent] = useState({
    title: 'Seu Título Aqui',
    subtitle: 'Subtítulo que descreve sua proposta',
    cta_text: 'Começar Agora',
    bg_color: '#f8fafc',
  });

  return (
    <div
      className="w-full py-24 px-8 text-center"
      style={{ backgroundColor: content.bg_color }}
    >
      <h1 className="text-5xl font-bold mb-4 text-slate-900">{content.title}</h1>
      <p className="text-xl text-slate-600 mb-8">{content.subtitle}</p>
      <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        {content.cta_text}
      </button>
    </div>
  );
}
```

**Áreas de Atuação (Jurídico):**

```typescript
// frontend/src/page/editor/blocks/legal/AreasBlock.tsx

import React from 'react';
import { Shield, Home, Briefcase, Calendar, Heart } from 'lucide-react';

const ICONS = {
  shield: Shield,
  home: Home,
  briefcase: Briefcase,
  calendar: Calendar,
  heart: Heart,
};

export function AreasBlock() {
  const areas = [
    { name: 'Direito do Consumidor', icon: 'shield', color: '#2563eb' },
    { name: 'Direito Imobiliário', icon: 'home', color: '#7c3aed' },
    { name: 'Direito Trabalhista', icon: 'briefcase', color: '#dc2626' },
    { name: 'Direito Previdenciário', icon: 'calendar', color: '#059669' },
    { name: 'Direito Família', icon: 'heart', color: '#f59e0b' },
  ];

  return (
    <div className="w-full py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-12">Nossas Áreas de Especialização</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {areas.map((area) => {
          const Icon = ICONS[area.icon as keyof typeof ICONS];
          return (
            <div
              key={area.name}
              className="p-6 rounded-lg border-2 text-center hover:shadow-lg transition"
              style={{ borderColor: area.color }}
            >
              <Icon size={32} style={{ color: area.color }} className="mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900">{area.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Agendamento (Jurídico Premium):**

```typescript
// frontend/src/page/editor/blocks/legal/SchedulingBlock.tsx

import React from 'react';
import { Calendar } from 'lucide-react';

export function SchedulingBlock() {
  return (
    <div className="w-full py-16 px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto text-center">
        <Calendar size={48} className="mx-auto mb-4 text-blue-600" />
        <h2 className="text-3xl font-bold mb-4">Agende Sua Consultoria</h2>
        <p className="text-slate-600 mb-8">
          Escolha um horário disponível e fale com um de nossos especialistas
        </p>
        <div className="bg-white rounded-lg p-8 border-2 border-blue-200">
          <p className="text-slate-500">Calendário Calendly ou similar será integrado aqui</p>
          <button className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Agendar Agora
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Regra IMPORTANTE: Blocos Não Aparecem na Sidebar

- ❌ Sidebar NÃO exibe lista de blocos individuais
- ✅ Blocos acessados APENAS via "+" no canvas
- ✅ AddBlockPanel mostra tabs por categoria
- ✅ Cada bloco segue o esquema `BlockSchema`

---

## Critérios de Aceite

### ✅ Fase 3b Completa Quando:

1. **30 Blocos implementados**:
   - [ ] 5 Hero blocos
   - [ ] 2 Prova Social
   - [ ] 4 Benefícios
   - [ ] 5 Conversão
   - [ ] 6 Jurídicos (Áreas, Perfil, Processo, OAB, Agendamento, FAQ)
   - [ ] 8 Estrutura (About, Mission, Timeline, Partners, Video, Gallery, Pricing, Footer)

2. **BlockWrapper + FloatingControls**:
   - [ ] Clique no bloco = exibe controles flutuantes (↑ ↓ Duplicar Excluir ⚙)
   - [ ] Clique em elemento interno = abre RightPanel (NOT floating controls)
   - [ ] Controles desaparecem ao clicar fora

3. **useBlocks Hook**:
   - [ ] `addBlock(type, afterIndex?)` funciona
   - [ ] `removeBlock(id)` funciona
   - [ ] `reorderBlock(fromIndex, toIndex)` funciona
   - [ ] `duplicateBlock(id)` funciona
   - [ ] `updateBlockStyle(id, styles)` funciona

4. **Blocos jurídicos pré-preenchidos**:
   - [ ] AreasBlock com 6 áreas
   - [ ] LawyerProfileBlock com dados modelo
   - [ ] ProcessStepsBlock com 4 etapas
   - [ ] OabBadgeBlock com badges
   - [ ] SchedulingBlock integrado
   - [ ] JuridicalFaqBlock com FAQs

5. **AddBlockPanel**:
   - [ ] Tabs funcionam (Hero, Social, Benefícios, etc)
   - [ ] "✦ Criar do Zero" abre ColumnLayoutSelector
   - [ ] Clique no bloco adiciona ao canvas

### ✅ Output Esperado:
- 30 blocos renderizam corretamente
- BlockFloatingControls exibem no hover
- Blocos jurídicos com conteúdo modelo
- AddBlockPanel com tabs por categoria
- Blocos NÃO na sidebar, SOMENTE via "+"
- Canvas renderiza blocos adicionados

---

## Próxima Fase

**Fase 3c**: Painel Direito de Edição
- Edição de texto duplo-clique + painel
- Style Editor (cor, fonte, tamanho)
- Content Editor (WYSIWYG)
- Sincronização bidirecional

