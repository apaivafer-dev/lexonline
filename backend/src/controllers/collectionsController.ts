import type { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import massPublisher from '@/services/massPublisher';

const prisma = new PrismaClient();

// ── Helpers ───────────────────────────────────────────────────────────────────

function getUserId(req: Request, res: Response): string | null {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return userId;
}

// ── Collections CRUD ──────────────────────────────────────────────────────────

export async function getCollections(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const collections = await prisma.collections.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        _count: { select: { items: true } },
      },
    });

    const result = collections.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      fields: c.fields,
      fieldCount: (c.fields as unknown[]).length,
      itemCount: c._count.items,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }));

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
}

export async function createCollection(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { name, slug, description, fields } = req.body as {
      name: string;
      slug: string;
      description?: string;
      fields?: unknown[];
    };

    if (!name || !slug) {
      res.status(400).json({ error: 'Missing required fields: name, slug' });
      return;
    }

    const collection = await prisma.collections.create({
      data: {
        user_id: userId,
        name,
        slug,
        description: description ?? null,
        fields: (fields ?? []) as Prisma.InputJsonValue,
      },
    });

    res.status(201).json(collection);
  } catch (err: unknown) {
    const msg = err instanceof Error && err.message.includes('Unique constraint')
      ? 'Slug já existe nesta conta'
      : 'Failed to create collection';
    res.status(400).json({ error: msg });
  }
}

export async function getCollectionById(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    const collection = await prisma.collections.findFirst({
      where: { id, user_id: userId },
      include: {
        items: { orderBy: { order_index: 'asc' } },
        template_bindings: true,
      },
    });

    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    res.json(collection);
  } catch {
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
}

export async function updateCollection(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    const { name, description, fields } = req.body as {
      name?: string;
      description?: string;
      fields?: unknown[];
    };

    const existing = await prisma.collections.findFirst({ where: { id, user_id: userId } });
    if (!existing) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    const updated = await prisma.collections.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(fields !== undefined && { fields: fields as Prisma.InputJsonValue }),
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update collection' });
  }
}

export async function deleteCollection(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id } = req.params;
    const existing = await prisma.collections.findFirst({ where: { id, user_id: userId } });
    if (!existing) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    await prisma.collections.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete collection' });
  }
}

// ── Items CRUD ────────────────────────────────────────────────────────────────

export async function getItems(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id: collectionId } = req.params;
    const page = parseInt(String(req.query['page'] ?? '1'));
    const limit = Math.min(parseInt(String(req.query['limit'] ?? '50')), 200);
    const skip = (page - 1) * limit;

    const collection = await prisma.collections.findFirst({ where: { id: collectionId, user_id: userId } });
    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    const [items, total] = await Promise.all([
      prisma.collection_items.findMany({
        where: { collection_id: collectionId },
        orderBy: { order_index: 'asc' },
        skip,
        take: limit,
      }),
      prisma.collection_items.count({ where: { collection_id: collectionId } }),
    ]);

    res.json({ items, total, page, pageSize: limit });
  } catch {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}

export async function createItem(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id: collectionId } = req.params;
    const { data } = req.body as { data: Record<string, unknown> };

    const collection = await prisma.collections.findFirst({ where: { id: collectionId, user_id: userId } });
    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: 'Campo "data" é obrigatório' });
      return;
    }

    const maxOrder = await prisma.collection_items.aggregate({
      where: { collection_id: collectionId },
      _max: { order_index: true },
    });
    const nextOrder = (maxOrder._max.order_index ?? -1) + 1;

    const item = await prisma.collection_items.create({
      data: { collection_id: collectionId, data: data as Prisma.InputJsonValue, order_index: nextOrder },
    });

    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Failed to create item' });
  }
}

export async function updateItem(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id: collectionId, itemId } = req.params;
    const { data, published } = req.body as { data?: Record<string, unknown>; published?: boolean };

    const collection = await prisma.collections.findFirst({ where: { id: collectionId, user_id: userId } });
    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    const item = await prisma.collection_items.findFirst({
      where: { id: itemId, collection_id: collectionId },
    });
    if (!item) {
      res.status(404).json({ error: 'Item não encontrado' });
      return;
    }

    const updated = await prisma.collection_items.update({
      where: { id: itemId },
      data: {
        ...(data !== undefined && { data: data as Prisma.InputJsonValue }),
        ...(published !== undefined && { published }),
      },
    });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update item' });
  }
}

export async function deleteItem(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id: collectionId, itemId } = req.params;

    const collection = await prisma.collections.findFirst({ where: { id: collectionId, user_id: userId } });
    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    await prisma.collection_items.deleteMany({ where: { id: itemId, collection_id: collectionId } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete item' });
  }
}

export async function reorderItems(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id: collectionId } = req.params;
    const { items } = req.body as { items: { id: string; order_index: number }[] };

    const collection = await prisma.collections.findFirst({ where: { id: collectionId, user_id: userId } });
    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    await Promise.all(
      items.map((item) =>
        prisma.collection_items.updateMany({
          where: { id: item.id, collection_id: collectionId },
          data: { order_index: item.order_index },
        })
      )
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to reorder items' });
  }
}

// ── Template Bindings ─────────────────────────────────────────────────────────

export async function createBinding(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id: collectionId } = req.params;
    const { page_id, template_element_id, url_pattern, output_folder } = req.body as {
      page_id: string;
      template_element_id: string;
      url_pattern: string;
      output_folder?: string;
    };

    if (!page_id || !template_element_id || !url_pattern) {
      res.status(400).json({ error: 'Missing required fields: page_id, template_element_id, url_pattern' });
      return;
    }

    const collection = await prisma.collections.findFirst({ where: { id: collectionId, user_id: userId } });
    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    const binding = await prisma.template_bindings.create({
      data: { page_id, collection_id: collectionId, template_element_id, url_pattern, output_folder },
    });

    res.status(201).json(binding);
  } catch {
    res.status(500).json({ error: 'Failed to create binding' });
  }
}

// ── Publish All ───────────────────────────────────────────────────────────────

export async function publishAll(req: Request, res: Response): Promise<void> {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const { id: collectionId } = req.params;
    const { page_id, binding_id } = req.body as { page_id: string; binding_id: string };

    if (!page_id || !binding_id) {
      res.status(400).json({ error: 'Missing required fields: page_id, binding_id' });
      return;
    }

    const collection = await prisma.collections.findFirst({ where: { id: collectionId, user_id: userId } });
    if (!collection) {
      res.status(404).json({ error: 'Collection não encontrada' });
      return;
    }

    const result = await massPublisher.publishCollectionPages(page_id, collectionId, binding_id);
    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to publish';
    res.status(500).json({ error: msg });
  }
}
