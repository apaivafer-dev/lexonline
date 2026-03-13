-- ============================================================================
-- MIGRAÇÃO: Extensão da tabela page_domains para suporte a domínios por página
-- Fase 7 — Domínio Customizado + SSL
-- ============================================================================

-- Adiciona colunas ausentes na tabela existente page_domains
ALTER TABLE page_domains
  ADD COLUMN IF NOT EXISTS page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'error')),
  ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Migra is_verified existente para o novo campo status
UPDATE page_domains SET status = 'active' WHERE is_verified = TRUE;
UPDATE page_domains SET status = 'pending' WHERE is_verified = FALSE;

-- Índices adicionais
CREATE INDEX IF NOT EXISTS idx_domains_page_id ON page_domains(page_id);
CREATE INDEX IF NOT EXISTS idx_domains_status  ON page_domains(status);
