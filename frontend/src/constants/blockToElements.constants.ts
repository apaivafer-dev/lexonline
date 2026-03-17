import type { PageSchema, PageElement, PageColumn } from '@/types/page.types';
import { BLOCK_REGISTRY } from './blocks.constants';

// Helper to create unique IDs
let counter = 0;
function uid(prefix = 'el') {
  return `${prefix}-${Date.now()}-${++counter}-${Math.random().toString(36).slice(2, 5)}`;
}

function el(type: string, content = '', styles: Record<string, string> = {}, metadata?: Record<string, unknown>): PageElement {
  return { id: uid(), type, content, styles, ...(metadata ? { metadata } : {}) };
}

function col(width: number, elements: PageElement[]): PageColumn {
  return { id: uid('col'), width, elements };
}

/**
 * Converte um bloco pré-construído em uma seção com elementos editáveis.
 * Cada bloco é decomposto em elementos (heading, text, button, image, etc.)
 */
export function blockToSection(blockType: string): PageSchema {
  const block = BLOCK_REGISTRY[blockType as keyof typeof BLOCK_REGISTRY];
  const dc = block?.defaultContent || {};

  const sectionId = uid('block');

  switch (blockType) {
    // ─── HERO ─────────────────────────────────────────────
    case 'hero':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: dc.bg_color || '#f8fafc', padding: '96px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Seu Título Aqui', { fontSize: '48px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }),
          el('text', dc.subtitle || 'Subtítulo que descreve sua proposta', { fontSize: '20px', color: '#475569', marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px' }),
          el('button', dc.cta_text || 'Começar Agora', { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 32px', borderRadius: '8px', fontSize: '18px', fontWeight: '500' }),
        ])],
      };

    case 'hero-lead':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: dc.bg_color || '#ffffff', padding: '64px 32px' },
        columns: [
          col(7, [
            el('heading', dc.title || 'Aproveite sua Consultoria Jurídica Gratuita', { fontSize: '40px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }),
            el('text', dc.subtitle || 'Análise completa do seu caso em 15 minutos', { fontSize: '18px', color: '#475569', marginBottom: '24px' }),
          ]),
          col(5, [
            el('heading', dc.form_title || 'Informe Seus Dados', { fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }),
            el('form', '', { backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px' }),
          ]),
        ],
      };

    case 'hero-vsl':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: '#0f172a', padding: '80px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Descubra Como Resolvemos 500+ Casos', { fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }),
          el('text', dc.subtitle || 'Assista este vídeo de 3 minutos', { fontSize: '18px', color: '#94a3b8', marginBottom: '32px' }),
          el('video', '', { maxWidth: '720px', margin: '0 auto', borderRadius: '12px' }),
          el('button', dc.cta_text || 'Fale Conosco', { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 36px', borderRadius: '8px', fontSize: '18px', fontWeight: '600', marginTop: '32px' }),
        ])],
      };

    case 'hero-urgency':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: '#dc2626', padding: '80px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Oferta Especial - Vagas Limitadas', { fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }),
          el('text', dc.subtitle || '3 primeiros clientes recebem 30% de desconto', { fontSize: '18px', color: '#fecaca', marginBottom: '32px' }),
          el('countdown', '', { marginBottom: '32px' }),
          el('button', dc.cta_text || 'Garantir Vaga', { backgroundColor: '#ffffff', color: '#dc2626', padding: '14px 36px', borderRadius: '8px', fontSize: '18px', fontWeight: '700' }),
        ])],
      };

    case 'hero-video':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: '#0f172a', padding: '96px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Transformando Vidas Através da Justiça', { fontSize: '48px', fontWeight: '700', color: '#ffffff', marginBottom: '16px' }),
          el('text', dc.subtitle || 'Advocacia especializada em direitos do consumidor', { fontSize: '20px', color: '#cbd5e1', marginBottom: '32px' }),
          el('button', dc.cta_text || 'Consulte Agora', { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 36px', borderRadius: '8px', fontSize: '18px', fontWeight: '600' }),
        ])],
      };

    // ─── PROVA SOCIAL ─────────────────────────────────────
    case 'testimonials':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: '#f8fafc', padding: '80px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'O Que Nossos Clientes Dizem', { fontSize: '36px', fontWeight: '700', color: '#0f172a', marginBottom: '48px' }),
          el('testimonial', 'Excelente atendimento e resultado surpreendente!', { marginBottom: '16px' }, { author: 'João Silva', role: 'Empresário', rating: 5 }),
          el('testimonial', 'Profissionais dedicados e competentes.', { marginBottom: '16px' }, { author: 'Maria Souza', role: 'Professora', rating: 5 }),
        ])],
      };

    case 'social-proof':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(3, [el('stats_counter', '500+', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Cases Resolvidos' })]),
          col(3, [el('stats_counter', '98%', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Clientes Satisfeitos' })]),
          col(3, [el('stats_counter', '15+', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Anos de Experiência' })]),
          col(3, [el('stats_counter', '200+', { fontSize: '36px', fontWeight: '700', color: '#2563eb' }, { label: 'Vitórias em Tribunal' })]),
        ],
      };

    // ─── BENEFÍCIOS ───────────────────────────────────────
    case 'benefits-3':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [
          col(12, [el('heading', dc.title || 'Por Que Nos Escolher', { fontSize: '36px', fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: '48px' })]),
        ].concat([
          col(4, [
            el('icon', 'briefcase', { fontSize: '32px', color: '#2563eb', marginBottom: '12px' }),
            el('heading', 'Especialização', { fontSize: '20px', fontWeight: '600', marginBottom: '8px' }),
            el('text', 'Equipe experiente em direito do consumidor', { fontSize: '14px', color: '#64748b' }),
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
        ] as PageColumn[]),
      };

    case 'benefits-4':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [
          col(3, [el('icon', 'phone', { fontSize: '28px', color: '#2563eb', marginBottom: '12px' }), el('heading', 'Atendimento 24/7', { fontSize: '16px', fontWeight: '600' })]),
          col(3, [el('icon', 'credit-card', { fontSize: '28px', color: '#2563eb', marginBottom: '12px' }), el('heading', 'Sem Taxa Inicial', { fontSize: '16px', fontWeight: '600' })]),
          col(3, [el('icon', 'shield', { fontSize: '28px', color: '#2563eb', marginBottom: '12px' }), el('heading', 'Garantia de Resultado', { fontSize: '16px', fontWeight: '600' })]),
          col(3, [el('icon', 'users', { fontSize: '28px', color: '#2563eb', marginBottom: '12px' }), el('heading', 'Equipe Dedicada', { fontSize: '16px', fontWeight: '600' })]),
        ],
      };

    case 'features':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [
          col(6, [
            el('heading', 'Consultoria Estratégica', { fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }),
            el('text', 'Análise profunda do seu caso com estratégia personalizada para alcançar o melhor resultado possível.', { fontSize: '16px', color: '#475569', marginBottom: '24px' }),
            el('button', 'Saiba Mais', { backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 24px', borderRadius: '8px' }),
          ]),
          col(6, [
            el('image', '', { borderRadius: '12px', minHeight: '280px' }),
          ]),
        ],
      };

    case 'steps':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(12, [el('heading', dc.title || 'Como Funciona Nosso Atendimento', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
        ].concat([
          col(3, [el('heading', '1', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Consulta Inicial', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Entendemos seu caso', { fontSize: '14px', color: '#64748b' })]),
          col(3, [el('heading', '2', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Análise Jurídica', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Avaliamos as opções', { fontSize: '14px', color: '#64748b' })]),
          col(3, [el('heading', '3', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Estratégia', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Definimos o plano', { fontSize: '14px', color: '#64748b' })]),
          col(3, [el('heading', '4', { fontSize: '32px', fontWeight: '700', color: '#2563eb' }), el('heading', 'Ação', { fontSize: '16px', fontWeight: '600', marginBottom: '4px' }), el('text', 'Executamos a solução', { fontSize: '14px', color: '#64748b' })]),
        ] as PageColumn[]),
      };

    // ─── CONVERSÃO ────────────────────────────────────────
    case 'cta':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: '#2563eb', padding: '80px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Pronto Para Resolver Seu Caso?', { fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }),
          el('text', dc.subtitle || 'Agende uma consultoria gratuita com nossos especialistas', { fontSize: '20px', color: '#bfdbfe', marginBottom: '32px' }),
          el('button', dc.cta_text || 'Agendar Consultoria', { backgroundColor: '#ffffff', color: '#2563eb', padding: '16px 40px', borderRadius: '12px', fontSize: '18px', fontWeight: '700' }),
        ])],
      };

    case 'contact':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Entre em Contato', { fontSize: '36px', fontWeight: '700', marginBottom: '8px' }),
          el('text', dc.subtitle || 'Preencha o formulário e entraremos em contato', { fontSize: '16px', color: '#64748b', marginBottom: '32px' }),
          el('form', '', { maxWidth: '560px', margin: '0 auto' }),
        ])],
      };

    case 'pricing':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Nossos Pacotes', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' }),
          el('pricing', '', {}),
        ])],
      };

    case 'faq':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [col(12, [
          el('heading', dc.title || 'Perguntas Frequentes', { fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }),
          el('faq', '', {}, { items: dc.faqs || [{ question: 'Qual é o valor da consultoria?', answer: 'A consultoria inicial é gratuita.' }] }),
        ])],
      };

    case 'newsletter':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: '#f8fafc', padding: '64px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Receba Dicas Jurídicas Exclusivas', { fontSize: '32px', fontWeight: '700', marginBottom: '8px' }),
          el('text', dc.subtitle || 'Inscreva-se em nossa newsletter semanal', { fontSize: '16px', color: '#64748b', marginBottom: '24px' }),
          el('input', dc.placeholder || 'Seu melhor email', { maxWidth: '400px', margin: '0 auto', marginBottom: '12px' }),
          el('button', dc.cta_text || 'Inscrever', { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 32px', borderRadius: '8px', fontWeight: '600' }),
        ])],
      };

    // ─── JURÍDICO ─────────────────────────────────────────
    case 'areas':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(12, [el('heading', dc.title || 'Nossas Áreas de Especialização', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
        ].concat((dc.areas || []).slice(0, 6).map((a: { name: string; icon: string; color: string }) =>
          col(4, [
            el('icon', a.icon || 'shield', { fontSize: '32px', color: a.color || '#2563eb', marginBottom: '8px' }),
            el('heading', a.name || 'Área', { fontSize: '16px', fontWeight: '600' }),
          ])
        ) as PageColumn[]),
      };

    case 'lawyer-profile':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [
          col(4, [el('image', '', { borderRadius: '12px', minHeight: '300px' })]),
          col(8, [
            el('heading', dc.name || 'Dr. João Silva', { fontSize: '28px', fontWeight: '700', marginBottom: '4px' }),
            el('text', dc.title || 'Especialista em Direito do Consumidor', { fontSize: '16px', color: '#2563eb', fontWeight: '500', marginBottom: '12px' }),
            el('text', dc.bio || 'Mais de 15 anos de experiência em...', { fontSize: '15px', color: '#475569', marginBottom: '16px' }),
            el('text', `OAB: ${dc.oab || 'SP 123456'}`, { fontSize: '14px', color: '#64748b', marginBottom: '24px' }),
            el('button', dc.cta_text || 'Agendar Consultoria', { backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontWeight: '600' }),
          ]),
        ],
      };

    case 'process-steps':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(12, [el('heading', dc.title || 'Entenda o Processo Legal', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
        ].concat((dc.steps || []).map((s: { phase: string; description: string; duration: string }) =>
          col(3, [
            el('heading', s.phase, { fontSize: '18px', fontWeight: '600', marginBottom: '4px' }),
            el('text', s.description, { fontSize: '14px', color: '#64748b', marginBottom: '4px' }),
            el('text', s.duration, { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }),
          ])
        ) as PageColumn[]),
      };

    case 'oab-badge':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(12, [el('heading', dc.title || 'Credenciais e Certificações', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
        ].concat((dc.credentials || []).map((c: { label: string }) =>
          col(4, [
            el('image', '', { borderRadius: '8px', minHeight: '80px', maxWidth: '120px', margin: '0 auto', marginBottom: '8px' }),
            el('text', c.label, { fontSize: '14px', fontWeight: '500', color: '#475569' }),
          ])
        ) as PageColumn[]),
      };

    case 'scheduling':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Agende Sua Consultoria', { fontSize: '36px', fontWeight: '700', marginBottom: '8px' }),
          el('text', dc.subtitle || 'Escolha um horário disponível', { fontSize: '16px', color: '#64748b', marginBottom: '32px' }),
          el('form', '', { maxWidth: '480px', margin: '0 auto' }),
        ])],
      };

    case 'juridical-faq':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [col(12, [
          el('heading', dc.title || 'Dúvidas Sobre Seu Direito?', { fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }),
          el('faq', '', {}, { items: dc.faqs || [] }),
        ])],
      };

    // ─── ESTRUTURA ────────────────────────────────────────
    case 'about':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [
          col(6, [
            el('heading', dc.title || 'Sobre Nosso Escritório', { fontSize: '32px', fontWeight: '700', marginBottom: '16px' }),
            el('text', dc.content || 'Fundado em 2008, somos especialistas em...', { fontSize: '16px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }),
            el('button', dc.cta_text || 'Conheça Melhor', { backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 24px', borderRadius: '8px' }),
          ]),
          col(6, [el('image', '', { borderRadius: '12px', minHeight: '280px' })]),
        ],
      };

    case 'mission':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px' },
        columns: [
          col(4, [
            el('heading', 'Missão', { fontSize: '20px', fontWeight: '700', color: '#2563eb', marginBottom: '12px' }),
            el('text', dc.mission || 'Garantir acesso à justiça de forma eficiente...', { fontSize: '15px', color: '#475569' }),
          ]),
          col(4, [
            el('heading', 'Visão', { fontSize: '20px', fontWeight: '700', color: '#2563eb', marginBottom: '12px' }),
            el('text', dc.vision || 'Ser referência em advocacia especializada...', { fontSize: '15px', color: '#475569' }),
          ]),
          col(4, [
            el('heading', 'Valores', { fontSize: '20px', fontWeight: '700', color: '#2563eb', marginBottom: '12px' }),
            el('list', (dc.values || ['Ética', 'Transparência', 'Excelência']).join('\n'), { fontSize: '15px', color: '#475569' }),
          ]),
        ],
      };

    case 'timeline':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(12, [el('heading', dc.title || 'Nossa Trajetória', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
        ].concat((dc.events || []).map((ev: { year: number; title: string; description: string }) =>
          col(4, [
            el('heading', String(ev.year), { fontSize: '28px', fontWeight: '700', color: '#2563eb', marginBottom: '4px' }),
            el('heading', ev.title, { fontSize: '18px', fontWeight: '600', marginBottom: '4px' }),
            el('text', ev.description, { fontSize: '14px', color: '#64748b' }),
          ])
        ) as PageColumn[]),
      };

    case 'partners':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(12, [el('heading', dc.title || 'Nossos Parceiros', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
        ].concat([
          col(6, [el('image', '', { maxWidth: '160px', margin: '0 auto', minHeight: '80px' })]),
          col(6, [el('image', '', { maxWidth: '160px', margin: '0 auto', minHeight: '80px' })]),
        ] as PageColumn[]),
      };

    case 'testimonial-video':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Histórias de Sucesso', { fontSize: '36px', fontWeight: '700', marginBottom: '8px' }),
          el('text', dc.subtitle || 'Veja como ajudamos nossos clientes', { fontSize: '16px', color: '#64748b', marginBottom: '32px' }),
          el('video', '', { maxWidth: '720px', margin: '0 auto', borderRadius: '12px' }),
        ])],
      };

    case 'gallery':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [
          col(12, [el('heading', dc.title || 'Nossa Galeria', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' })]),
        ].concat([
          col(4, [el('image', '', { borderRadius: '8px', minHeight: '200px' })]),
          col(4, [el('image', '', { borderRadius: '8px', minHeight: '200px' })]),
          col(4, [el('image', '', { borderRadius: '8px', minHeight: '200px' })]),
        ] as PageColumn[]),
      };

    case 'pricing-table':
      return {
        id: sectionId, type: 'section', styles: { padding: '64px 32px', textAlign: 'center' },
        columns: [col(12, [
          el('heading', dc.title || 'Nossos Pacotes', { fontSize: '36px', fontWeight: '700', marginBottom: '48px' }),
          el('pricing', '', {}),
        ])],
      };

    case 'footer':
      return {
        id: sectionId, type: 'section', styles: { backgroundColor: '#0f172a', padding: '48px 32px', color: '#ffffff' },
        columns: [
          col(4, [
            el('heading', dc.company_name || 'Escritório de Advocacia', { fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }),
            el('text', dc.company_description || 'Especialistas em direito...', { fontSize: '14px', color: '#94a3b8' }),
          ]),
          col(4, [
            el('heading', 'Contato', { fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }),
            el('text', dc.contact_email || 'contato@exemplo.com', { fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }),
            el('text', dc.contact_phone || '(11) 9999-9999', { fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }),
            el('text', dc.address || 'Rua Exemplo, 123 - São Paulo, SP', { fontSize: '14px', color: '#94a3b8' }),
          ]),
          col(4, [
            el('heading', 'Redes Sociais', { fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }),
            el('social_icons', '', {}),
          ]),
        ],
      };

    // ─── FALLBACK: bloco em branco ────────────────────────
    default:
      return {
        id: sectionId, type: 'section', styles: {},
        columns: [col(12, [])],
      };
  }
}
