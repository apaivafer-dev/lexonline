-- ============================================================================
-- SEED: 15 TEMPLATES PADRÃO PARA LEXONLINE BUILDER v9.0
-- ============================================================================

INSERT INTO page_templates (title, slug, description, category, schema, is_premium) VALUES

-- LANDING PAGES (5)
('Landing Page Simples', 'landing-simple',
  'Hero + CTA + Rodapé minimalista', 'landing_page',
  '[]'::jsonb, FALSE),

('Landing Page Conversão Alta', 'landing-hcv',
  'Hero + Problemas + Solução + Depoimentos + CTA', 'landing_page',
  '[]'::jsonb, FALSE),

('Landing Page com Vídeo', 'landing-video',
  'Hero com vídeo de fundo + Formulário de captura', 'landing_page',
  '[]'::jsonb, TRUE),

('Landing Page Urgência', 'landing-urgency',
  'Countdown timer + Oferta limitada + FOMO', 'landing_page',
  '[]'::jsonb, TRUE),

('Landing Page VSL', 'landing-vsl',
  'Video Sales Letter + Formulário + Garantia', 'landing_page',
  '[]'::jsonb, TRUE),

-- SITE INSTITUCIONAL (3)
('Site Institucional Advocacia', 'site-legal-institutional',
  'Header + Sobre + Áreas + Equipe + Contato', 'institutional',
  '[]'::jsonb, FALSE),

('Site Estúdio Jurídico Premium', 'site-legal-premium',
  'Design luxury + Portfolio + Prêmios + Equipe expandida', 'institutional',
  '[]'::jsonb, TRUE),

('Site Escritório Pequeno', 'site-legal-small',
  'Simples e direto: quem somos + serviços + contato', 'institutional',
  '[]'::jsonb, FALSE),

-- PÁGINAS DE CAPTURA (3)
('Captura E-book', 'capture-ebook',
  'Foto e-book + Descrição + Formulário', 'capture',
  '[]'::jsonb, FALSE),

('Captura Webinar', 'capture-webinar',
  'Data/hora + Descrição + Palestrantes + Formulário', 'capture',
  '[]'::jsonb, FALSE),

('Captura Consultoria Grátis', 'capture-consultation',
  'Proposta de valor + Depoimentos + Calendário de agendamento', 'capture',
  '[]'::jsonb, TRUE),

-- VENDAS (2)
('Sales Page Produto Digital', 'sales-digital-product',
  'Problema + Solução + Benefícios + Preço + Garantia', 'sales',
  '[]'::jsonb, FALSE),

('Sales Page Curso', 'sales-course',
  'Hero + Currículo + Resultados de alunos + Preço + FAQ', 'sales',
  '[]'::jsonb, FALSE),

-- JURÍDICO ESPECIALIZADO (2)
('Página Serviço Jurídico', 'legal-service-page',
  'Explicação do serviço + Processo + Depoimentos + CTA agendamento', 'legal',
  '[]'::jsonb, FALSE),

('Página Perfil Advogado', 'legal-lawyer-profile',
  'Foto + Bio + Áreas de especialidade + Depoimentos + Agendamento', 'legal',
  '[]'::jsonb, FALSE);

-- Verificar inserção
SELECT COUNT(*) AS total_templates FROM page_templates;
