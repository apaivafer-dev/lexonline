import type { PageSchema } from '@/types/page.types';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export type EditorAction =
  | { type: 'SET_DEVICE'; device: DeviceType }
  | { type: 'SET_SIDEBAR_VISIBLE'; visible: boolean }
  | { type: 'SET_RIGHT_PANEL_OPEN'; open: boolean }
  | { type: 'SET_ZOOM'; zoom: number }
  | { type: 'SET_AUTO_SAVE'; enabled: boolean }
  | { type: 'SET_DIRTY'; isDirty: boolean }
  | { type: 'SET_SHOW_GRID'; showGrid: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_HISTORY'; history: PageSchema[][] }
  | { type: 'SET_SELECTED_ELEMENT'; element: SelectedElement | null }
  | { type: 'ADD_BLOCK'; block: PageSchema; afterIndex?: number }
  | { type: 'REMOVE_BLOCK'; blockIndex: number }
  | { type: 'UPDATE_ELEMENT'; elementId: string; data: Partial<{ content: string; styles: Record<string, string> }> }
  | { type: 'REORDER_BLOCKS'; fromIndex: number; toIndex: number };

export interface SelectedElement {
  id: string;
  type: string;
  content?: string;
  styles: Record<string, string>;
  sectionId: string;
  columnId: string;
}

export interface EditorState {
  device: DeviceType;
  sidebarVisible: boolean;
  rightPanelOpen: boolean;
  zoom: number;
  autoSave: boolean;
  isDirty: boolean;
  showGrid: boolean;
  selectedElement: SelectedElement | null;
  history: PageSchema[][];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export const DEVICE_WIDTHS: Record<DeviceType, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
};
