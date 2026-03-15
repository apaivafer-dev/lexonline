import { useRef, useCallback, useState } from 'react';
import type { Page } from '@/types/page.types';

const MAX_HISTORY = 50;

export function useHistory(setPage: (page: Page) => void) {
  const statesRef = useRef<Page[]>([]);
  const indexRef = useRef(-1);
  const isRestoringRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateFlags = useCallback(() => {
    setCanUndo(indexRef.current > 0);
    setCanRedo(indexRef.current < statesRef.current.length - 1);
  }, []);

  const push = useCallback((page: Page) => {
    if (isRestoringRef.current) return;

    // Truncate future states when new change comes in
    statesRef.current = statesRef.current.slice(0, indexRef.current + 1);
    statesRef.current.push(page);

    // Enforce max history size
    if (statesRef.current.length > MAX_HISTORY) {
      statesRef.current.shift();
    }

    indexRef.current = statesRef.current.length - 1;
    updateFlags();
  }, [updateFlags]);

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return;
    isRestoringRef.current = true;
    indexRef.current--;
    setPage(statesRef.current[indexRef.current]);
    updateFlags();
    // Reset flag after state update propagates
    setTimeout(() => { isRestoringRef.current = false; }, 0);
  }, [setPage, updateFlags]);

  const redo = useCallback(() => {
    if (indexRef.current >= statesRef.current.length - 1) return;
    isRestoringRef.current = true;
    indexRef.current++;
    setPage(statesRef.current[indexRef.current]);
    updateFlags();
    setTimeout(() => { isRestoringRef.current = false; }, 0);
  }, [setPage, updateFlags]);

  const historyCount = statesRef.current.length;

  return { push, undo, redo, canUndo, canRedo, historyCount };
}
