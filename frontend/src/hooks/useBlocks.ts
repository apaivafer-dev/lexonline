import { useCallback } from 'react';
import type { Page, PageSchema } from '@/types/page.types';
import { blockToSection } from '@/constants/blockToElements.constants';

export function useBlocks(page: Page | null, onPageUpdate: (page: Page) => void) {
  const addBlock = useCallback(
    (blockType: string, afterIndex?: number) => {
      if (!page) return;

      const newBlock: PageSchema = blockToSection(blockType);

      const newSchema = [...page.schema];
      if (afterIndex !== undefined) {
        newSchema.splice(afterIndex + 1, 0, newBlock);
      } else {
        newSchema.push(newBlock);
      }

      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const addEmptyBlock = useCallback(
    (columns: number[], afterIndex?: number) => {
      if (!page) return;

      const ts = Date.now();
      const newBlock: PageSchema = {
        id: `block-${ts}`,
        type: 'section',
        styles: {},
        columns: columns.map((width, idx) => ({
          id: `col-${ts}-${idx}`,
          width,
          elements: [],
        })),
      };

      const newSchema = [...page.schema];
      if (afterIndex !== undefined) {
        newSchema.splice(afterIndex + 1, 0, newBlock);
      } else {
        newSchema.push(newBlock);
      }

      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const removeBlock = useCallback(
    (blockId: string) => {
      if (!page) return;
      const newSchema = page.schema.filter((block) => block.id !== blockId);
      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const reorderBlock = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (!page) return;
      const newSchema = [...page.schema];
      const [block] = newSchema.splice(fromIndex, 1);
      newSchema.splice(toIndex, 0, block);
      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const duplicateBlock = useCallback(
    (blockId: string) => {
      if (!page) return;
      const blockIndex = page.schema.findIndex((b) => b.id === blockId);
      if (blockIndex === -1) return;

      const duplicated: PageSchema = {
        ...page.schema[blockIndex],
        id: `block-${Date.now()}`,
      };

      const newSchema = [...page.schema];
      newSchema.splice(blockIndex + 1, 0, duplicated);
      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  const updateBlockStyle = useCallback(
    (blockId: string, styles: Record<string, string>) => {
      if (!page) return;
      const newSchema = page.schema.map((block) =>
        block.id === blockId ? { ...block, styles: { ...block.styles, ...styles } } : block
      );
      onPageUpdate({ ...page, schema: newSchema });
    },
    [page, onPageUpdate]
  );

  return {
    addBlock,
    addEmptyBlock,
    removeBlock,
    reorderBlock,
    duplicateBlock,
    updateBlockStyle,
  };
}
