/**
 * massPublisher — gera e publica páginas estáticas em massa a partir de
 * um template_binding + os itens de uma collection.
 */
import { PrismaClient } from '@prisma/client';
import htmlGenerator from '@/services/htmlGenerator';
import fileDeployer from '@/services/fileDeployer';
import bindingRenderer from '@/services/bindingRenderer';

const prisma = new PrismaClient();

export interface PublishPageResult {
  itemId: string;
  url: string;
  status: 'success' | 'error';
  error?: string;
}

export interface PublishResult {
  pages_generated: number;
  pages: PublishPageResult[];
  duration_ms: number;
}

const massPublisher = {
  async publishCollectionPages(
    pageId: string,
    collectionId: string,
    templateBindingId: string
  ): Promise<PublishResult> {
    const startTime = Date.now();

    // 1. Buscar binding
    const binding = await prisma.template_bindings.findUnique({
      where: { id: templateBindingId },
    });
    if (!binding) throw new Error('Template binding não encontrado');

    // 2. Buscar schema da página template
    const page = await prisma.pages.findUnique({
      where: { id: pageId },
      select: { schema: true, metadata: true },
    });
    if (!page) throw new Error('Página template não encontrada');

    // 3. Buscar itens da collection (apenas publicados, ordenados)
    const items = await prisma.collection_items.findMany({
      where: { collection_id: collectionId, published: true },
      orderBy: { order_index: 'asc' },
    });

    // 4. Para cada item, resolver bindings, gerar HTML e publicar
    const results: PublishPageResult[] = [];

    for (const item of items) {
      try {
        const itemData = item.data as Record<string, unknown>;

        // Resolver variáveis no JSON da página
        const resolvedSchema = bindingRenderer.resolvePageJSON(
          page.schema as unknown[],
          itemData
        );

        // Gerar HTML (título do item, schema resolvido)
        const title = String(itemData['titulo'] ?? itemData['title'] ?? 'Página');
        const htmlContent = htmlGenerator.generate(
          item.id,
          title,
          resolvedSchema as unknown[],
          (page.metadata ?? {}) as never
        );

        // Gerar URL única para este item
        const urlSlug = bindingRenderer.resolveUrlPattern(binding.url_pattern, itemData);
        // Usar urlSlug como "pageId" no fileDeployer (remove barras iniciais)
        const fileKey = urlSlug.replace(/^\//, '').replace(/\//g, '_');

        const url = await fileDeployer.deploy(fileKey, htmlContent);

        results.push({ itemId: item.id, url, status: 'success' });
      } catch (err) {
        results.push({
          itemId: item.id,
          url: '',
          status: 'error',
          error: err instanceof Error ? err.message : 'Erro desconhecido',
        });
      }
    }

    return {
      pages_generated: results.filter((r) => r.status === 'success').length,
      pages: results,
      duration_ms: Date.now() - startTime,
    };
  },
};

export default massPublisher;
