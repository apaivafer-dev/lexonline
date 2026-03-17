import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

export const pageApi = {
  // PÁGINAS
  getPages: () => api.get('/page'),
  createPage: (data: { title: string; slug: string; template_id?: string }) =>
    api.post('/page', data),
  getPageById: (id: string) => api.get(`/page/${id}`),
  updatePage: (id: string, data: { title?: string; schema?: unknown; metadata?: unknown }) =>
    api.put(`/page/${id}`, data),
  deletePage: (id: string) => api.delete(`/page/${id}`),

  // PUBLICAÇÃO
  publishPage: (id: string) => api.post(`/page/${id}/publish`),
  unpublishPage: (id: string) => api.post(`/page/${id}/unpublish`),

  // DUPLICAÇÃO
  duplicatePage: (id: string) => api.post(`/page/${id}/duplicate`),

  // TEMPLATES
  getTemplates: () => api.get('/page/templates/list'),
  getTemplateById: (id: string) => api.get(`/page/templates/${id}`),
  createFromTemplate: (templateId: string, data: { title: string; slug: string }) =>
    api.post(`/page/from-template/${templateId}`, data),

  // LEADS
  getPageLeads: (id: string) => api.get(`/page/${id}/leads`),

  // ANALYTICS
  getPageAnalytics: (id: string) => api.get(`/page/${id}/analytics`),
  getPageViews: (id: string) => api.get(`/page/${id}/views`),

  // DOMÍNIOS (legado)
  getUserDomains: () => api.get('/page/domains/list'),
  addDomain: (data: { domain: string }) => api.post('/page/domains', data),
  removeDomain: (id: string) => api.delete(`/page/domains/${id}`),

  // DOMÍNIOS POR PÁGINA (Fase 7)
  getPageDomains: (pageId: string) => api.get(`/page/${pageId}/domains`),
  addPageDomain: (pageId: string, data: { domain: string }) =>
    api.post(`/page/${pageId}/domain`, data),
  verifyPageDomain: (pageId: string, domainId: string) =>
    api.get(`/page/${pageId}/domain/${domainId}/verify`),
  removePageDomain: (pageId: string, domainId: string) =>
    api.delete(`/page/${pageId}/domain/${domainId}`),
};

export default pageApi;
