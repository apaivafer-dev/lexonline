import { useState, useCallback } from 'react';
import collectionsApi from '@/services/collectionsApi';
import type { Collection, CollectionDetail, CollectionItem, Field, PublishResult } from '@/services/collectionsApi';

export interface PublishingProgress {
  total: number;
  completed: number;
  status: 'idle' | 'publishing' | 'done' | 'error';
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [currentCollection, setCurrentCollection] = useState<CollectionDetail | null>(null);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishingProgress, setPublishingProgress] = useState<PublishingProgress>({
    total: 0,
    completed: 0,
    status: 'idle',
  });

  // ── Collections ────────────────────────────────────────────────────────────

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await collectionsApi.getCollections();
      setCollections(res.data);
    } catch {
      setError('Falha ao carregar collections');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCollection = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await collectionsApi.getCollectionById(id);
      setCurrentCollection(res.data);
      setItems(res.data.items);
    } catch {
      setError('Falha ao carregar collection');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCollection = useCallback(
    async (name: string, slug: string, fields: Field[], description?: string): Promise<Collection> => {
      const res = await collectionsApi.createCollection({ name, slug, fields, description });
      setCollections((prev) => [{ ...res.data, fieldCount: fields.length, itemCount: 0 }, ...prev]);
      return res.data;
    },
    []
  );

  const updateCollection = useCallback(
    async (id: string, data: { name?: string; description?: string; fields?: Field[] }) => {
      const res = await collectionsApi.updateCollection(id, data);
      setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...res.data } : c)));
      if (currentCollection?.id === id) {
        setCurrentCollection((prev) => prev ? { ...prev, ...res.data } : prev);
      }
    },
    [currentCollection]
  );

  const deleteCollection = useCallback(async (id: string) => {
    await collectionsApi.deleteCollection(id);
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (currentCollection?.id === id) setCurrentCollection(null);
  }, [currentCollection]);

  // ── Items ──────────────────────────────────────────────────────────────────

  const addItem = useCallback(
    async (collectionId: string, data: Record<string, unknown>): Promise<CollectionItem> => {
      const res = await collectionsApi.createItem(collectionId, data);
      setItems((prev) => [...prev, res.data]);
      setCollections((prev) =>
        prev.map((c) => (c.id === collectionId ? { ...c, itemCount: c.itemCount + 1 } : c))
      );
      return res.data;
    },
    []
  );

  const updateItem = useCallback(
    async (collectionId: string, itemId: string, data: Record<string, unknown>) => {
      const res = await collectionsApi.updateItem(collectionId, itemId, data);
      setItems((prev) => prev.map((i) => (i.id === itemId ? res.data : i)));
    },
    []
  );

  const deleteItem = useCallback(async (collectionId: string, itemId: string) => {
    await collectionsApi.deleteItem(collectionId, itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setCollections((prev) =>
      prev.map((c) => (c.id === collectionId ? { ...c, itemCount: Math.max(0, c.itemCount - 1) } : c))
    );
  }, []);

  const reorderItems = useCallback(
    async (collectionId: string, newOrder: { id: string; order_index: number }[]) => {
      await collectionsApi.reorderItems(collectionId, newOrder);
      setItems((prev) => {
        const orderMap = new Map(newOrder.map((o) => [o.id, o.order_index]));
        return [...prev]
          .map((i) => ({ ...i, order_index: orderMap.get(i.id) ?? i.order_index }))
          .sort((a, b) => a.order_index - b.order_index);
      });
    },
    []
  );

  // ── Publicação em massa ────────────────────────────────────────────────────

  const publishAllPages = useCallback(
    async (collectionId: string, pageId: string, bindingId: string): Promise<PublishResult> => {
      const total = items.filter((i) => i.published).length;
      setPublishingProgress({ total, completed: 0, status: 'publishing' });

      try {
        const res = await collectionsApi.publishAll(collectionId, pageId, bindingId);
        setPublishingProgress({ total: res.data.pages_generated, completed: res.data.pages_generated, status: 'done' });
        return res.data;
      } catch {
        setPublishingProgress((prev) => ({ ...prev, status: 'error' }));
        throw new Error('Falha ao publicar páginas');
      }
    },
    [items]
  );

  return {
    collections,
    currentCollection,
    items,
    loading,
    error,
    publishingProgress,
    fetchCollections,
    fetchCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    publishAllPages,
  };
}
