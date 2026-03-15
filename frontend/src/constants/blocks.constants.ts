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
      video_url: '',
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
          rating: 5,
        },
      ],
      layout: 'carousel',
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
        { title: 'Especialização', description: 'Equipe experiente em direito do consumidor', icon: 'briefcase' },
        { title: 'Transparência', description: 'Comunicação clara desde o primeiro contato', icon: 'eye' },
        { title: 'Resultados', description: '95% de taxa de sucesso em nossas ações', icon: 'check' },
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
        { title: 'Consultoria Estratégica', description: 'Análise profunda do seu caso...', image: '', cta: 'Saiba Mais' },
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
          answer: 'A consultoria inicial é gratuita.',
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
          answer: 'A consultoria inicial é sempre gratuita.',
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
      vision: 'Ser referência em advocacia especializada...',
      values: ['Ética profissional', 'Transparência', 'Excelência', 'Dedicação'],
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
  structure: ['about', 'mission', 'timeline', 'partners', 'testimonial-video', 'gallery', 'pricing-table', 'footer'],
} as const;
