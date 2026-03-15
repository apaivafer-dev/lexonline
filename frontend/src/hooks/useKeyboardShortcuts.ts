import { useEffect } from 'react';

interface ShortcutHandlers {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onPreview: () => void;
  onEscape: () => void;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onSave,
  onPreview,
  onEscape,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const tag = (e.target as HTMLElement).tagName;

      // Skip shortcuts when typing in inputs (except Escape)
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) ||
        (e.target as HTMLElement).isContentEditable;

      if (e.key === 'Escape') {
        onEscape();
        return;
      }

      if (isTyping) return;

      // Ctrl+Z — Desfazer
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        return;
      }

      // Ctrl+Y ou Ctrl+Shift+Z — Refazer
      if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        onRedo();
        return;
      }

      // Ctrl+S — Salvar manualmente
      if (ctrl && e.key === 's') {
        e.preventDefault();
        onSave();
        return;
      }

      // Ctrl+P — Preview
      if (ctrl && e.key === 'p') {
        e.preventDefault();
        onPreview();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onSave, onPreview, onEscape]);
}
