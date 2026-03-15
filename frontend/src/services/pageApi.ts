import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
});

export const pageApi = {
  // PÁGINAS
  getPages: () => api.get('/api/page'),
  createPage: (data: { title: string; slug: string; template_id?: string }) =>
    api.post('/api/page', data),
  getPageById: (id: string) => api.get(`/api/page/${id}`),
  updatePage: (id: string, data: { title?: string; schema?: unknown; metadata?: unknown }) =>
    api.put(`/api/page/${id}`, data),
  deletePage: (id: string) => api.delete(`/api/page/${id}`),

  // PUBLICAÇÃO
  publishPage: (id: string) => api.post(`/api/page/${id}/publish`),
  unpublishPage: (id: string) => api.post(`/api/page/${id}/unpublish`),

  // DUPLICAÇÃO
  duplicatePage: (id: string) => api.post(`/api/page/${id}/duplicate`),

  // TEMPLATES
  getTemplates: () => api.get('/api/page/templates/list'),
  getTemplateById: (id: string) => api.get(`/api/page/templates/${id}`),
  createFromTemplate: (templateId: string, data: { title: string; slug: string }) =>
    api.post(`/api/page/from-template/${templateId}`, data),

  // LEADS
  getPageLeads: (id: string) => api.get(`/api/page/${id}/leads`),

  // ANALYTICS
  getPageAnalytics: (id: string) => api.get(`/api/page/${id}/analytics`),
  getPageViews: (id: string) => api.get(`/api/page/${id}/views`),

  // DOMÍNIOS (legado)
  getUserDomains: () => api.get('/api/page/domains/list'),
  addDomain: (data: { domain: string }) => api.post('/api/page/domains', data),
  removeDomain: (id: string) => api.delete(`/api/page/domains/${id}`),

  // DOMÍNIOS POR PÁGINA (Fase 7)
  getPageDomains: (pageId: string) => api.get(`/api/page/${pageId}/domains`),
  addPageDomain: (pageId: string, data: { domain: string }) =>
    api.post(`/api/page/${pageId}/domain`, data),
  verifyPageDomain: (pageId: string, domainId: string) =>
    api.get(`/api/page/${pageId}/domain/${domainId}/verify`),
  removePageDomain: (pageId: string, domainId: string) =>
    api.delete(`/api/page/${pageId}/domain/${domainId}`),
};

export default pageApi;
