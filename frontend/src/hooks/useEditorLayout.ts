import { useReducer, useCallback } from 'react';
import { editorReducer, initialState } from '@/stores/editorReducer';
import type { EditorState, SelectedElement } from '@/types/editor.types';

export function useEditorLayout() {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const setDevice = useCallback((device: EditorState['device']) => {
    dispatch({ type: 'SET_DEVICE', device });
  }, []);

  const setSidebarVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_VISIBLE', visible });
  }, []);

  const setRightPanelOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_RIGHT_PANEL_OPEN', open });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', zoom });
  }, []);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', enabled });
  }, []);

  const setDirty = useCallback((isDirty: boolean) => {
    dispatch({ type: 'SET_DIRTY', isDirty });
  }, []);

  const setShowGrid = useCallback((showGrid: boolean) => {
    dispatch({ type: 'SET_SHOW_GRID', showGrid });
  }, []);

  const setSelectedElement = useCallback((element: SelectedElement | null) => {
    dispatch({ type: 'SET_SELECTED_ELEMENT', element });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  return {
    ...state,
    setDevice,
    setSidebarVisible,
    setRightPanelOpen,
    setZoom,
    setAutoSave,
    setDirty,
    setShowGrid,
    setSelectedElement,
    undo,
    redo,
  };
}
