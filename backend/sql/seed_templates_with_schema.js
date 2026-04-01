/**
 * Seed: 15 templates com schemas reais compostos de elementos editáveis.
 * Cada template é uma composição de seções com colunas e elementos.
 * Roda com: node seed_templates_with_schema.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let counter = 0;
function uid(prefix = 'el') {
  return `${prefix}-tpl-${++counter}`;
}

function el(type, content = '', styles = {}, metadata) {
  return { id: uid(), type, content, styles, ...(metadata ? { metadata } : {}) };
}

function col(width, elements) {
  return { id: uid('col'), width, elements };
}

function section(styles, columns) {
  return { id: uid('block'), type: 'section', styles, columns };
}

// ── Blocos reutilizáveis ──

function heroBlock(title, subtitle, ctaText, bg = '#f8fafc') {
  return section(
    { backgroundColor: bg, padding: '96px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', title, { fontSize: '48px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }),
      el('text', subtitle, { fontSize: '20px', color: '#475569', marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px' }),
      el('button', ctaText, { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 32px', borderRadius: '8px', fontSize: '18px', fontWeight: '500' }),
    ])]
  );
}

function heroLeadBlock(title, subtitle, formTitle) {
  return section(
    { backgroundColor: '#ffffff', padding: '64px 32px' },
    [
      col(7, [
        el('heading', title, { fontSize: '40px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }),
        el('text', subtitle, { fontSize: '18px', color: '#475569', marginBottom: '24px' }),
      ]),
      col(5, [
        el('heading', formTitle, { fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }),
        el('form', '', { backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px' }),
      ]),
    ]
  );
}

function heroVslBlock(title, subtitle, ctaText) {
  return section(
    { backgroundColor: '#0f172a', padding: '80px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', title, { fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }),
      el('text', subtitle, { fontSize: '18px', color: '#94a3b8', marginBottom: '32px' }),
      el('video', '', { maxWidth: '720px', margin: '0 auto', borderRadius: '12px' }),
      el('button', ctaText, { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 36px', borderRadius: '8px', fontSize: '18px', fontWeight: '600', marginTop: '32px' }),
    ])]
  );
}

function heroUrgencyBlock(title, subtitle, ctaText) {
  return section(
    { backgroundColor: '#dc2626', padding: '80px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', title, { fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }),
      el('text', subtitle, { fontSize: '18px', color: '#fecaca', marginBottom: '32px' }),
      el('countdown', '', { marginBottom: '32px' }),
      el('button', ctaText, { backgroundColor: '#ffffff', color: '#dc2626', padding: '14px 36px', borderRadius: '8px', fontSize: '18px', fontWeight: '700' }),
    ])]
  );
}

function heroVideoBlock(title, subtitle, ctaText) {
  return section(
    { backgroundColor: '#0f172a', padding: '96px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', title, { fontSize: '48px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }),
      el('text', subtitle, { fontSize: '20px', color: '#cbd5e1', marginBottom: '32px' }),
      el('button', ctaText, { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 36px', borderRadius: '8px', fontSize: '18px', fontWeight: '600' }),
    ])]
  );
}

function benefits3Block(title) {
  return section(
    { padding: '64px 32px' },
    [
      col(12, [el('heading', title, { fontSize: '36px', fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: '48px' })]),
      col(4, [
        el('icon', 'briefcase', { fontSize: '32px', color: '#2563eb', marginBottom: '12px' }),
        el('heading', 'Especialização', { fontSize: '20px', fontWeight: '600', marginBottom: '8px' }),
        el('text', 'Equipe experiente e dedicada ao seu caso', { fontSize: '14px', color: '#64748b' }),
      ]),
      col(4, [
        el('icon', 'eye', { fontSize: '32px', color: '#2563eb', marginBottom: '12px' }),
        el('heading', 'Transparência', { fontSize: '20px', fontWeight: '600', marginBottom: '8px' }),
        el('text', 'Comunicação clara desde o primeiro contato', { fontSize: '14px', color: '#64748b' }),
      ]),
      col(4, [
        el('icon', 'check', { fontSize: '32px', color: '#2563eb', marginBottom: '12px' }),
        el('heading', 'Resultados', { fontSize: '20px', fontWeight: '600', marginBottom: '8px' }),
        el('text', '95% de taxa de sucesso em nossas ações', { fontSize: '14px', color: '#64748b' }),
      ]),
    ]
  );
}

function socialProofBlock() {
  return section(
    { padding: '64px 32px', textAlign: 'center' },
    [
      col(3, [el('stats_counter', '500+', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Cases Resolvidos' })]),
      col(3, [el('stats_counter', '98%', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Clientes Satisfeitos' })]),
      col(3, [el('stats_counter', '15+', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Anos de Experiência' })]),
      col(3, [el('stats_counter', '200+', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Vitórias em Tribunal' })]),
    ]
  );
}

function testimonialsBlock() {
  return section(
    { backgroundColor: '#f8fafc', padding: '80px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', 'O Que Nossos Clientes Dizem', { fontSize: '36px', fontWeight: '700', color: '#0f172a', marginBottom: '48px' }),
      el('testimonial', 'Excelente atendimento e resultado surpreendente!', { marginBottom: '16px' }, { author: 'João Silva', role: 'Empresário', rating: 5 }),
      el('testimonial', 'Profissionais dedicados e competentes.', { marginBottom: '16px' }, { author: 'Maria Souza', role: 'Professora', rating: 5 }),
    ])]
  );
}

function ctaBlock(title, subtitle, ctaText) {
  return section(
    { backgroundColor: '#2563eb', padding: '80px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', title, { fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }),
      el('text', subtitle, { fontSize: '20px', color: '#bfdbfe', marginBottom: '32px' }),
      el('button', ctaText, { backgroundColor: '#ffffff', color: '#2563eb', padding: '16px 40px', borderRadius: '12px', fontSize: '18px', fontWeight: '700' }),
    ])]
  );
}

function contactBlock(title, subtitle) {
  return section(
    { padding: '64px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', title, { fontSize: '36px', fontWeight: '700', marginBottom: '8px' }),
      el('text', subtitle, { fontSize: '16px', color: '#64748b', marginBottom: '32px' }),
      el('form', '', { maxWidth: '560px', margin: '0 auto' }),
    ])]
  );
}

function aboutBlock(title, content) {
  return section(
    { padding: '64px 32px' },
    [
      col(6, [
        el('heading', title, { fontSize: '32px', fontWeight: '700', marginBottom: '16px' }),
        el('text', content, { fontSize: '16px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }),
        el('button', 'Conheça Melhor', { backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 24px', borderRadius: '8px' }),
      ]),
      col(6, [el('image', '', { borderRadius: '12px', minHeight: '280px' })]),
    ]
  );
}

function areasBlock() {
  return section(
    { padding: '64px 32px', textAlign: 'center' },
    [
      col(12, [el('heading', 'Nossas Áreas de Especialização', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
      col(4, [el('icon', 'shield', { fontSize: '32px', color: '#2563eb', marginBottom: '8px' }), el('heading', 'Direito do Consumidor', { fontSize: '16px', fontWeight: '600' })]),
      col(4, [el('icon', 'building-2', { fontSize: '32px', color: '#2563eb', marginBottom: '8px' }), el('heading', 'Direito Empresarial', { fontSize: '16px', fontWeight: '600' })]),
      col(4, [el('icon', 'scale', { fontSize: '32px', color: '#2563eb', marginBottom: '8px' }), el('heading', 'Direito Civil', { fontSize: '16px', fontWeight: '600' })]),
    ]
  );
}

function stepsBlock() {
  return section(
    { padding: '64px 32px', textAlign: 'center' },
    [
      col(12, [el('heading', 'Como Funciona Nosso Atendimento', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
      col(3, [el('heading', '1', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Consulta Inicial', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Entendemos seu caso', { fontSize: '14px', color: '#64748b' })]),
      col(3, [el('heading', '2', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Análise Jurídica', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Avaliamos as opções', { fontSize: '14px', color: '#64748b' })]),
      col(3, [el('heading', '3', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Estratégia', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Definimos o plano', { fontSize: '14px', color: '#64748b' })]),
      col(3, [el('heading', '4', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Ação', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Executamos a solução', { fontSize: '14px', color: '#64748b' })]),
    ]
  );
}

function featuresBlock(title, text) {
  return section(
    { padding: '64px 32px' },
    [
      col(6, [
        el('heading', title, { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }),
        el('text', text, { fontSize: '16px', color: '#475569', marginBottom: '24px' }),
        el('button', 'Saiba Mais', { backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 24px', borderRadius: '8px' }),
      ]),
      col(6, [el('image', '', { borderRadius: '12px', minHeight: '280px' })]),
    ]
  );
}

function lawyerProfileBlock() {
  return section(
    { padding: '64px 32px' },
    [
      col(4, [el('image', '', { borderRadius: '12px', minHeight: '300px' })]),
      col(8, [
        el('heading', 'Dr. João Silva', { fontSize: '28px', fontWeight: '700', marginBottom: '4px' }),
        el('text', 'Especialista em Direito do Consumidor', { fontSize: '16px', color: '#2563eb', fontWeight: '500', marginBottom: '12px' }),
        el('text', 'Mais de 15 anos de experiência em direito do consumidor, com atuação em ações coletivas e individuais.', { fontSize: '15px', color: '#475569', marginBottom: '16px' }),
        el('text', 'OAB: SP 123456', { fontSize: '14px', color: '#64748b', marginBottom: '24px' }),
        el('button', 'Agendar Consultoria', { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontWeight: '600' }),
      ]),
    ]
  );
}

function faqBlock(title) {
  return section(
    { padding: '64px 32px' },
    [col(12, [
      el('heading', title, { fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }),
      el('faq', '', {}, { items: [
        { question: 'Qual é o valor da consultoria?', answer: 'A consultoria inicial é gratuita.' },
        { question: 'Quanto tempo demora o processo?', answer: 'O tempo varia conforme a complexidade do caso.' },
        { question: 'Vocês trabalham com qual modalidade de pagamento?', answer: 'Aceitamos pagamento à vista, parcelado e êxito.' },
      ]}),
    ])]
  );
}

function pricingBlock() {
  return section(
    { padding: '64px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', 'Nossos Pacotes', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' }),
      el('pricing', '', {}),
    ])]
  );
}

function processStepsBlock() {
  return section(
    { padding: '64px 32px', textAlign: 'center' },
    [
      col(12, [el('heading', 'Entenda o Processo Legal', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
      col(3, [el('heading', 'Consulta', { fontSize: '18px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Analisamos seu caso', { fontSize: '14px', color: '#64748b' }), el('text', '~1 semana', { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' })]),
      col(3, [el('heading', 'Petição', { fontSize: '18px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Preparamos os documentos', { fontSize: '14px', color: '#64748b' }), el('text', '~2 semanas', { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' })]),
      col(3, [el('heading', 'Acompanhamento', { fontSize: '18px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Monitoramos o processo', { fontSize: '14px', color: '#64748b' }), el('text', 'Contínuo', { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' })]),
      col(3, [el('heading', 'Resolução', { fontSize: '18px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Resultado favorável', { fontSize: '14px', color: '#64748b' }), el('text', 'Variável', { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' })]),
    ]
  );
}

function schedulingBlock() {
  return section(
    { padding: '64px 32px', textAlign: 'center' },
    [col(12, [
      el('heading', 'Agende Sua Consultoria', { fontSize: '36px', fontWeight: '700', marginBottom: '8px' }),
      el('text', 'Escolha um horário disponível', { fontSize: '16px', color: '#64748b', marginBottom: '32px' }),
      el('form', '', { maxWidth: '480px', margin: '0 auto' }),
    ])]
  );
}

function footerBlock() {
  return section(
    { backgroundColor: '#0f172a', padding: '48px 32px', color: '#ffffff' },
    [
      col(4, [
        el('heading', 'Escritório de Advocacia', { fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }),
        el('text', 'Especialistas em direito do consumidor e empresarial', { fontSize: '14px', color: '#94a3b8' }),
      ]),
      col(4, [
        el('heading', 'Contato', { fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }),
        el('text', 'contato@exemplo.com', { fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }),
        el('text', '(11) 9999-9999', { fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }),
        el('text', 'Rua Exemplo, 123 - São Paulo, SP', { fontSize: '14px', color: '#94a3b8' }),
      ]),
      col(4, [
        el('heading', 'Redes Sociais', { fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }),
        el('social_icons', '', {}),
      ]),
    ]
  );
}

// ── Templates ──

const templates = [
  // LANDING PAGES (5)
  {
    title: 'Landing Page Simples',
    slug: 'landing-simple',
    description: 'Hero + CTA + Rodapé minimalista',
    category: 'landing_page',
    is_premium: false,
    schema: [
      heroBlock('Sua Solução Jurídica Começa Aqui', 'Consultoria especializada para proteger seus direitos', 'Agende Sua Consulta'),
      ctaBlock('Pronto Para Resolver Seu Caso?', 'Agende uma consultoria gratuita', 'Agendar Agora'),
      footerBlock(),
    ],
  },
  {
    title: 'Landing Page Conversão Alta',
    slug: 'landing-hcv',
    description: 'Hero + Problemas + Solução + Depoimentos + CTA',
    category: 'landing_page',
    is_premium: false,
    schema: [
      heroBlock('Proteja Seus Direitos com Especialistas', 'Mais de 500 casos resolvidos com sucesso', 'Fale com um Advogado'),
      benefits3Block('Por Que Somos Diferentes'),
      testimonialsBlock(),
      ctaBlock('Não Perca Mais Tempo', 'Consultoria gratuita e sem compromisso', 'Agendar Consultoria'),
      footerBlock(),
    ],
  },
  {
    title: 'Landing Page com Vídeo',
    slug: 'landing-video',
    description: 'Hero com vídeo de fundo + Formulário de captura',
    category: 'landing_page',
    is_premium: true,
    schema: [
      heroVideoBlock('Transformando Vidas Através da Justiça', 'Advocacia especializada em direitos do consumidor', 'Consulte Agora'),
      featuresBlock('Consultoria Estratégica', 'Análise profunda do seu caso com estratégia personalizada para alcançar o melhor resultado possível.'),
      testimonialsBlock(),
      ctaBlock('Pronto Para o Próximo Passo?', 'Agende sua consulta e descubra seus direitos', 'Falar com Especialista'),
      footerBlock(),
    ],
  },
  {
    title: 'Landing Page Urgência',
    slug: 'landing-urgency',
    description: 'Countdown timer + Oferta limitada + FOMO',
    category: 'landing_page',
    is_premium: true,
    schema: [
      heroUrgencyBlock('Oferta Especial - Vagas Limitadas', '3 primeiros clientes recebem 30% de desconto', 'Garantir Vaga'),
      benefits3Block('O Que Você Recebe'),
      testimonialsBlock(),
      ctaBlock('Últimas Vagas Disponíveis', 'Não perca esta oportunidade única', 'Garantir Minha Vaga'),
      footerBlock(),
    ],
  },
  {
    title: 'Landing Page VSL',
    slug: 'landing-vsl',
    description: 'Video Sales Letter + Formulário + Garantia',
    category: 'landing_page',
    is_premium: true,
    schema: [
      heroVslBlock('Descubra Como Resolvemos 500+ Casos', 'Assista este vídeo de 3 minutos', 'Fale Conosco'),
      socialProofBlock(),
      testimonialsBlock(),
      faqBlock('Perguntas Frequentes'),
      ctaBlock('Pronto Para Começar?', 'Garantia de satisfação ou seu dinheiro de volta', 'Começar Agora'),
      footerBlock(),
    ],
  },

  // SITE INSTITUCIONAL (3)
  {
    title: 'Site Institucional Advocacia',
    slug: 'site-legal-institutional',
    description: 'Header + Sobre + Áreas + Equipe + Contato',
    category: 'institutional',
    is_premium: false,
    schema: [
      heroBlock('Escritório de Advocacia', 'Tradição, competência e resultados', 'Conheça Nosso Escritório'),
      aboutBlock('Sobre Nós', 'Fundado em 2008, somos um escritório de advocacia especializado em diversas áreas do direito, comprometidos com a excelência e a defesa dos direitos de nossos clientes.'),
      areasBlock(),
      stepsBlock(),
      contactBlock('Entre em Contato', 'Preencha o formulário e entraremos em contato em até 24h'),
      footerBlock(),
    ],
  },
  {
    title: 'Site Estúdio Jurídico Premium',
    slug: 'site-legal-premium',
    description: 'Design luxury + Portfolio + Prêmios + Equipe expandida',
    category: 'institutional',
    is_premium: true,
    schema: [
      heroBlock('Excelência em Advocacia', 'Há mais de 20 anos defendendo seus direitos com dedicação e competência', 'Agende uma Consulta', '#0f172a'),
      aboutBlock('Nossa História', 'Com mais de duas décadas de atuação, nosso escritório se consolidou como referência em advocacia de alto padrão, atendendo clientes corporativos e pessoas físicas.'),
      areasBlock(),
      lawyerProfileBlock(),
      testimonialsBlock(),
      footerBlock(),
    ],
  },
  {
    title: 'Site Escritório Pequeno',
    slug: 'site-legal-small',
    description: 'Simples e direto: quem somos + serviços + contato',
    category: 'institutional',
    is_premium: false,
    schema: [
      heroBlock('Seu Advogado de Confiança', 'Atendimento personalizado e humano', 'Fale Conosco'),
      aboutBlock('Quem Somos', 'Somos um escritório de advocacia focado em atendimento personalizado. Acreditamos que cada caso é único e merece atenção dedicada.'),
      contactBlock('Fale Conosco', 'Estamos prontos para ajudar'),
      footerBlock(),
    ],
  },

  // PÁGINAS DE CAPTURA (3)
  {
    title: 'Captura E-book',
    slug: 'capture-ebook',
    description: 'Foto e-book + Descrição + Formulário',
    category: 'capture',
    is_premium: false,
    schema: [
      heroLeadBlock('Baixe Nosso E-book Gratuito', 'Guia completo sobre seus direitos como consumidor', 'Preencha Para Receber'),
      benefits3Block('O Que Você Vai Aprender'),
      footerBlock(),
    ],
  },
  {
    title: 'Captura Webinar',
    slug: 'capture-webinar',
    description: 'Data/hora + Descrição + Palestrantes + Formulário',
    category: 'capture',
    is_premium: false,
    schema: [
      heroLeadBlock('Webinar: Seus Direitos na Era Digital', 'Terça, 20h - Ao vivo e gratuito', 'Inscreva-se Agora'),
      socialProofBlock(),
      footerBlock(),
    ],
  },
  {
    title: 'Captura Consultoria Grátis',
    slug: 'capture-consultation',
    description: 'Proposta de valor + Depoimentos + Calendário de agendamento',
    category: 'capture',
    is_premium: true,
    schema: [
      heroLeadBlock('Consultoria Jurídica Gratuita', 'Análise completa do seu caso em 15 minutos', 'Agende Sua Consultoria'),
      testimonialsBlock(),
      benefits3Block('Por Que Escolher Nossa Consultoria'),
      footerBlock(),
    ],
  },

  // VENDAS (2)
  {
    title: 'Sales Page Produto Digital',
    slug: 'sales-digital-product',
    description: 'Problema + Solução + Benefícios + Preço + Garantia',
    category: 'sales',
    is_premium: false,
    schema: [
      heroBlock('Proteja Seus Direitos Agora', 'O pacote completo para resolver seu problema jurídico', 'Ver Pacotes'),
      benefits3Block('O Que Está Incluído'),
      socialProofBlock(),
      testimonialsBlock(),
      pricingBlock(),
      faqBlock('Dúvidas Frequentes'),
      ctaBlock('Garanta Seu Pacote Hoje', 'Satisfação garantida ou seu dinheiro de volta', 'Comprar Agora'),
      footerBlock(),
    ],
  },
  {
    title: 'Sales Page Curso',
    slug: 'sales-course',
    description: 'Hero + Currículo + Resultados de alunos + Preço + FAQ',
    category: 'sales',
    is_premium: false,
    schema: [
      heroBlock('Curso: Direito do Consumidor na Prática', 'Aprenda a defender seus direitos de forma eficaz', 'Inscreva-se Agora'),
      featuresBlock('O Que Você Vai Aprender', 'Conteúdo completo e atualizado sobre direito do consumidor, com casos práticos e exercícios.'),
      stepsBlock(),
      testimonialsBlock(),
      pricingBlock(),
      faqBlock('Perguntas Frequentes Sobre o Curso'),
      ctaBlock('Não Perca Essa Oportunidade', 'Vagas limitadas para a próxima turma', 'Inscrever-se'),
      footerBlock(),
    ],
  },

  // JURÍDICO ESPECIALIZADO (2)
  {
    title: 'Página Serviço Jurídico',
    slug: 'legal-service-page',
    description: 'Explicação do serviço + Processo + Depoimentos + CTA agendamento',
    category: 'legal',
    is_premium: false,
    schema: [
      heroBlock('Direito do Consumidor', 'Defenda seus direitos com quem entende do assunto', 'Consultar Especialista'),
      featuresBlock('Como Podemos Ajudar', 'Oferecemos consultoria completa em direito do consumidor, desde a análise inicial até a resolução do caso.'),
      processStepsBlock(),
      testimonialsBlock(),
      schedulingBlock(),
      footerBlock(),
    ],
  },
  {
    title: 'Página Perfil Advogado',
    slug: 'legal-lawyer-profile',
    description: 'Foto + Bio + Áreas de especialidade + Depoimentos + Agendamento',
    category: 'legal',
    is_premium: false,
    schema: [
      lawyerProfileBlock(),
      areasBlock(),
      testimonialsBlock(),
      schedulingBlock(),
      footerBlock(),
    ],
  },
];

async function main() {
  // Check if templates already exist
  const existing = await prisma.page_templates.count();
  if (existing > 0) {
    console.log(`Already have ${existing} templates. Deleting and re-inserting...`);
    await prisma.page_templates.deleteMany();
  }

  for (const tpl of templates) {
    await prisma.page_templates.create({
      data: {
        title: tpl.title,
        slug: tpl.slug,
        description: tpl.description,
        category: tpl.category,
        is_premium: tpl.is_premium,
        schema: tpl.schema,
      },
    });
    console.log(`✓ ${tpl.title}`);
  }

  const total = await prisma.page_templates.count();
  console.log(`\nTotal templates: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
