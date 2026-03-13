-- Fase 10: Teste A/B Nativo
-- Rodar manualmente no banco PostgreSQL

-- Expandir tabela ab_tests existente com novos campos
ALTER TABLE ab_tests
  ADD COLUMN IF NOT EXISTS element_id     VARCHAR(100),
  ADD COLUMN IF NOT EXISTS split_a        INT DEFAULT 50,
  ADD COLUMN IF NOT EXISTS split_b        INT DEFAULT 50,
  ADD COLUMN IF NOT EXISTS winner         VARCHAR(1),
  ADD COLUMN IF NOT EXISTS ends_at        TIMESTAMP,
  ADD COLUMN IF NOT EXISTS concluded_at   TIMESTAMP;

-- Atualizar default do status para 'active' (era 'draft')
ALTER TABLE ab_tests ALTER COLUMN status SET DEFAULT 'active';

-- Tabela de eventos (impressões e conversões)
CREATE TABLE IF NOT EXISTS ab_events (
  id          BIGSERIAL PRIMARY KEY,
  test_id     UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  event_type  VARCHAR(20) NOT NULL,   -- 'impression' | 'conversion'
  variant     VARCHAR(1) NOT NULL,    -- 'A' | 'B'
  session_id  VARCHAR(255),
  device      VARCHAR(50),
  source      VARCHAR(500),
  value       DECIMAL(10,2),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_events_test_date ON ab_events(test_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ab_events_test_type ON ab_events(test_id, event_type, variant);
