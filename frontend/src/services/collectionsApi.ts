import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
});

export interface Field {
  name: string;
  slug: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'url' | 'date' | 'image' | 'select';
  required: boolean;
  default?: string;
  options?: { label: string; value: string }[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: Field[];
  fieldCount: number;
  itemCount: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionDetail extends Omit<Collection, 'fieldCount' | 'itemCount'> {
  items: CollectionItem[];
  template_bindings: TemplateBinding[];
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  data: Record<string, unknown>;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateBinding {
  id: string;
  page_id: string;
  collection_id: string;
  template_element_id: string;
  url_pattern: string;
  output_folder?: string;
  created_at: string;
}

export interface PublishResult {
  pages_generated: number;
  pages: { itemId: string; url: string; status: 'success' | 'error'; error?: string }[];
  duration_ms: number;
}

export const collectionsApi = {
  // Collections
  getCollections: () => api.get<Collection[]>('/api/collections'),
  createCollection: (data: { name: string; slug: string; description?: string; fields?: Field[] }) =>
    api.post<Collection>('/api/collections', data),
  getCollectionById: (id: string) => api.get<CollectionDetail>(`/api/collections/${id}`),
  updateCollection: (id: string, data: { name?: string; description?: string; fields?: Field[] }) =>
    api.put<Collection>(`/api/collections/${id}`, data),
  deleteCollection: (id: string) => api.delete(`/api/collections/${id}`),

  // Items
  getItems: (id: string, params?: { page?: number; limit?: number }) =>
    api.get<{ items: CollectionItem[]; total: number; page: number; pageSize: number }>(
      `/api/collections/${id}/items`,
      { params }
    ),
  createItem: (id: string, data: Record<string, unknown>) =>
    api.post<CollectionItem>(`/api/collections/${id}/items`, { data }),
  updateItem: (id: string, itemId: string, data: Record<string, unknown>) =>
    api.put<CollectionItem>(`/api/collections/${id}/items/${itemId}`, { data }),
  deleteItem: (id: string, itemId: string) =>
    api.delete(`/api/collections/${id}/items/${itemId}`),
  reorderItems: (id: string, items: { id: string; order_index: number }[]) =>
    api.post(`/api/collections/${id}/reorder`, { items }),

  // Bindings
  createBinding: (
    id: string,
    data: { page_id: string; template_element_id: string; url_pattern: string; output_folder?: string }
  ) => api.post<TemplateBinding>(`/api/collections/${id}/bindings`, data),

  // Publicação em massa
  publishAll: (id: string, page_id: string, binding_id: string) =>
    api.post<PublishResult>(`/api/collections/${id}/publish-all`, { page_id, binding_id }),
};

export default collectionsApi;
