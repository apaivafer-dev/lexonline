-- Fase 9: Collections — Páginas Dinâmicas
-- Rodar manualmente no banco PostgreSQL

-- Tabela principal de collections
CREATE TABLE IF NOT EXISTS collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL,
  description TEXT,
  fields      JSONB NOT NULL DEFAULT '[]',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);

-- Itens de cada collection
CREATE TABLE IF NOT EXISTS collection_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  data          JSONB NOT NULL DEFAULT '{}',
  order_index   INT DEFAULT 0,
  published     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collection_items_coll ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_order ON collection_items(order_index);

-- Vínculos entre página-template e collection (template bindings)
CREATE TABLE IF NOT EXISTS template_bindings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id             UUID NOT NULL,
  collection_id       UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  template_element_id VARCHAR(100) NOT NULL,
  url_pattern         VARCHAR(500) NOT NULL,
  output_folder       VARCHAR(500),
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_template_bindings_page ON template_bindings(page_id);
CREATE INDEX IF NOT EXISTS idx_template_bindings_coll ON template_bindings(collection_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER collection_items_updated_at
  BEFORE UPDATE ON collection_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
