/**
 * bindingRenderer — resolve variáveis {{campo}} e condicionais {{#if}}...{{/if}}
 * em strings e em árvores JSON de página, substituindo valores de collection items.
 */

// ─── Tipos internos ────────────────────────────────────────────────────────────

type PageJSON = unknown[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Substitui {{variável}} pelo valor correspondente em `data`. */
function resolveBindings(template: string, data: Record<string, unknown>): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_match, key: string) => {
    const val = data[key];
    return val !== undefined && val !== null ? String(val) : `{{${key}}}`;
  });
}

/** Resolve {{#if campo}}...{{/if}} — mostra o conteúdo se `data[campo]` for truthy. */
function resolveConditionals(template: string, data: Record<string, unknown>): string {
  const re = /{{\s*#if\s+(\w+)\s*}}([\s\S]*?){{\s*\/if\s*}}/g;
  return template.replace(re, (_match, condition: string, content: string) => {
    return data[condition] ? content : '';
  });
}

/**
 * Percorre recursivamente um objeto/array JSON substituindo strings
 * que contenham {{variável}} pelos valores de `data`.
 */
function resolveDeep(node: unknown, data: Record<string, unknown>): unknown {
  if (typeof node === 'string') {
    let result = resolveConditionals(node, data);
    result = resolveBindings(result, data);
    return result;
  }
  if (Array.isArray(node)) {
    return node.map((item) => resolveDeep(item, data));
  }
  if (node !== null && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      out[k] = resolveDeep(v, data);
    }
    return out;
  }
  return node;
}

// ─── API pública ──────────────────────────────────────────────────────────────

const bindingRenderer = {
  resolveBindings,
  resolveConditionals,

  /**
   * Substitui todas as ocorrências de {{campo}} na estrutura JSON da página
   * com os dados de um item de collection.
   */
  resolvePageJSON(pageJSON: PageJSON, data: Record<string, unknown>): PageJSON {
    return resolveDeep(pageJSON, data) as PageJSON;
  },

  /**
   * Gera URL a partir de um padrão como "/areas/{{slug}}"
   * e os dados de um item de collection.
   */
  resolveUrlPattern(pattern: string, data: Record<string, unknown>): string {
    return resolveBindings(pattern, data);
  },
};

export default bindingRenderer;
