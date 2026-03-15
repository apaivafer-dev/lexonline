import axios from 'axios';
import type { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: true,
});

export interface DashboardMetrics {
  visits: number;
  visitsTrend: number;
  leads: number;
  leadsTrend: number;
  conversionRate: number;
  conversionRateTrend: number;
  avgDuration: number;
  avgDurationTrend: number;
  bounceRate: number;
  bounceRateTrend: number;
  topSource: string;
  topSourcePct: number;
}

export interface VisitPoint { date: string; visits: number; }
export interface DeviceData { desktop: number; mobile: number; tablet: number; }
export interface SourcePoint { source: string; visits: number; }

export interface Lead {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  area: string | null;
  source: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  area?: string;
  source?: string;
  period?: string;
  start?: string;
  end?: string;
}

export const analyticsApi = {
  getDashboard: (pageId: string, period: string, start?: string, end?: string) =>
    api.get<DashboardMetrics>(`/api/analytics/dashboard/${pageId}`, { params: { period, start, end } }),

  getVisitsChart: (pageId: string, period: string, start?: string, end?: string) =>
    api.get<VisitPoint[]>(`/api/analytics/chart/visits/${pageId}`, { params: { period, start, end } }),

  getDeviceChart: (pageId: string, period: string, start?: string, end?: string) =>
    api.get<DeviceData>(`/api/analytics/chart/device/${pageId}`, { params: { period, start, end } }),

  getSourcesChart: (pageId: string, period: string, start?: string, end?: string) =>
    api.get<SourcePoint[]>(`/api/analytics/chart/sources/${pageId}`, { params: { period, start, end } }),

  getLeads: (pageId: string, filters: LeadFilters) =>
    api.get<LeadsResponse>(`/api/analytics/leads/${pageId}`, { params: filters }),

  updateLeadStatus: (leadId: string, status: string) =>
    api.put<{ id: string; status: string; updated_at: string }>(`/api/analytics/leads/${leadId}`, { status }),

  exportLeads: (pageId: string, period: string, start?: string, end?: string) =>
    api.get('/api/analytics/leads/export', {
      params: { pageId, period, start, end },
      responseType: 'blob',
    }),

  sendLeadsToCrm: (leadIds: string[], crmType: string, credentials: unknown) =>
    api.post<{ sent_count: number; failed_count: number; errors: string[] }>(
      '/api/analytics/leads/send-crm',
      { leadIds, crmType, credentials },
    ),
};

export default analyticsApi;
