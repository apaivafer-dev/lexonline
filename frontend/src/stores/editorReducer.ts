import type { EditorState, EditorAction } from '@/types/editor.types';

export const initialState: EditorState = {
  device: 'desktop',
  sidebarVisible: false,
  rightPanelOpen: false,
  zoom: 100,
  autoSave: true,
  isDirty: false,
  showGrid: false,
  selectedElement: null,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,
};

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_DEVICE':
      return { ...state, device: action.device };

    case 'SET_SIDEBAR_VISIBLE':
      return { ...state, sidebarVisible: action.visible };

    case 'SET_RIGHT_PANEL_OPEN':
      return {
        ...state,
        rightPanelOpen: action.open,
        sidebarVisible: action.open ? false : state.sidebarVisible,
      };

    case 'SET_ZOOM':
      return { ...state, zoom: action.zoom };

    case 'SET_AUTO_SAVE':
      return { ...state, autoSave: action.enabled };

    case 'SET_DIRTY':
      return { ...state, isDirty: action.isDirty };

    case 'SET_SHOW_GRID':
      return { ...state, showGrid: action.showGrid };

    case 'SET_SELECTED_ELEMENT':
      return {
        ...state,
        selectedElement: action.element,
        rightPanelOpen: action.element !== null,
        sidebarVisible: action.element !== null ? false : state.sidebarVisible,
      };

    case 'UNDO':
      if (state.historyIndex <= 0) return state;
      return {
        ...state,
        historyIndex: state.historyIndex - 1,
        canRedo: true,
        canUndo: state.historyIndex - 1 > 0,
      };

    case 'REDO':
      if (state.historyIndex >= state.history.length - 1) return state;
      return {
        ...state,
        historyIndex: state.historyIndex + 1,
        canRedo: state.historyIndex + 1 < state.history.length - 1,
        canUndo: true,
      };

    case 'SET_HISTORY':
      return {
        ...state,
        history: action.history,
        historyIndex: action.history.length - 1,
        canUndo: action.history.length > 1,
        canRedo: false,
      };

    default:
      return state;
  }
}
