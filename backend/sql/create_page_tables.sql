-- ============================================================================
-- TABELAS DO MÓDULO LEXONLINE BUILDER v9.0
-- ============================================================================

-- 1. pages — Página principal
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,

  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),

  schema JSONB NOT NULL DEFAULT '[]',
  metadata JSONB DEFAULT '{}',

  published_url VARCHAR(500),
  published_at TIMESTAMP,

  domain_id UUID REFERENCES page_domains(id) ON DELETE SET NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, slug)
);

CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_pages_team_id ON pages(team_id);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_domain_id ON pages(domain_id);
CREATE INDEX idx_pages_slug ON pages(slug);

-- 2. page_templates — Templates reutilizáveis
CREATE TABLE IF NOT EXISTS page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50) NOT NULL
    CHECK (category IN (
      'landing_page', 'institutional', 'capture', 'sales', 'legal',
      'services', 'portfolio', 'event', 'blog', 'contact'
    )),

  thumbnail_url VARCHAR(500),
  schema JSONB NOT NULL,

  is_premium BOOLEAN DEFAULT FALSE,
  preview_url VARCHAR(500),

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON page_templates(category);
CREATE INDEX idx_templates_is_premium ON page_templates(is_premium);

-- 3. page_versions — Histórico de versões
CREATE TABLE IF NOT EXISTS page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  version_number INT NOT NULL,
  schema JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  UNIQUE(page_id, version_number)
);

CREATE INDEX idx_versions_page_id ON page_versions(page_id);
CREATE INDEX idx_versions_created_at ON page_versions(created_at);

-- 4. page_leads — Captura de leads da página
CREATE TABLE IF NOT EXISTS page_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT,

  form_id VARCHAR(100),
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  source_url VARCHAR(500)
);

CREATE INDEX idx_leads_page_id ON page_leads(page_id);
CREATE INDEX idx_leads_email ON page_leads(email);
CREATE INDEX idx_leads_created_at ON page_leads(created_at);

-- 5. page_assets — Arquivos da página (imagens, vídeos)
CREATE TABLE IF NOT EXISTS page_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,

  firebase_url VARCHAR(500) NOT NULL,
  firebase_path VARCHAR(500) NOT NULL,

  width INT,
  height INT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_page_id ON page_assets(page_id);
CREATE INDEX idx_assets_user_id ON page_assets(user_id);

-- 6. page_domains — Domínios customizados
CREATE TABLE IF NOT EXISTS page_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  domain VARCHAR(255) NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,

  dns_records JSONB,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_domains_user_id ON page_domains(user_id);
CREATE INDEX idx_domains_domain ON page_domains(domain);

-- 7. ab_tests — A/B Testing
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed')),

  variant_a_schema JSONB NOT NULL,
  variant_b_schema JSONB NOT NULL,

  traffic_split INT DEFAULT 50,
  metric_type VARCHAR(50),

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE INDEX idx_abtests_page_id ON ab_tests(page_id);
CREATE INDEX idx_abtests_status ON ab_tests(status);

-- 8. page_views — Analytics de visualizações
CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  session_id VARCHAR(100),
  user_agent TEXT,
  ip_address INET,

  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),

  scroll_depth INT,
  time_on_page INT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_views_page_id ON page_views(page_id);
CREATE INDEX idx_views_session_id ON page_views(session_id);
CREATE INDEX idx_views_created_at ON page_views(created_at);

-- ============================================================================
-- TRIGGERS PARA AUTO-UPDATE updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pages_update_timestamp
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER templates_update_timestamp
  BEFORE UPDATE ON page_templates
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER domains_update_timestamp
  BEFORE UPDATE ON page_domains
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE pages IS 'Páginas criadas pelos usuários no Builder v9.0';
COMMENT ON TABLE page_templates IS 'Templates pré-montados reutilizáveis';
COMMENT ON TABLE page_versions IS 'Histórico de versões de cada página';
COMMENT ON TABLE page_leads IS 'Leads capturados via formulários da página';
COMMENT ON TABLE page_assets IS 'Arquivos (imagens, vídeos) usados nas páginas';
COMMENT ON TABLE page_domains IS 'Domínios customizados do usuário';
COMMENT ON TABLE ab_tests IS 'Testes A/B em variantes de páginas';
COMMENT ON TABLE page_views IS 'Analytics: visualizações e comportamento';

COMMENT ON COLUMN pages.schema IS 'JSON array de Sections: [{id, type, styles, columns:[{id, width, elements:[]}]}]';
COMMENT ON COLUMN page_templates.schema IS 'Schema base para nova página criada a partir deste template';
COMMENT ON COLUMN ab_tests.metric_type IS 'Métrica a acompanhar: conversions | click | scroll';
