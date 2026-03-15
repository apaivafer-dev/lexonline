import { useState, useCallback } from 'react';
import { analyticsApi } from '@/services/analyticsApi';
import type {
  DashboardMetrics, VisitPoint, DeviceData, SourcePoint, Lead, LeadFilters,
} from '@/services/analyticsApi';

export type Period = 'today' | '7d' | '30d' | '90d' | 'custom';

interface AnalyticsState {
  metrics: DashboardMetrics | null;
  chartVisits: VisitPoint[];
  chartDevice: DeviceData | null;
  chartSources: SourcePoint[];
  leads: Lead[];
  leadsTotal: number;
  leadsPage: number;
  leadsPageSize: number;
  period: Period;
  customStart: string;
  customEnd: string;
  loading: boolean;
  loadingLeads: boolean;
  error: string | null;
}

const INITIAL: AnalyticsState = {
  metrics: null,
  chartVisits: [],
  chartDevice: null,
  chartSources: [],
  leads: [],
  leadsTotal: 0,
  leadsPage: 1,
  leadsPageSize: 20,
  period: '30d',
  customStart: '',
  customEnd: '',
  loading: false,
  loadingLeads: false,
  error: null,
};

export function useAnalytics() {
  const [state, setState] = useState<AnalyticsState>(INITIAL);

  const setPeriod = useCallback((period: Period) => {
    setState(s => ({ ...s, period }));
  }, []);

  const setCustomRange = useCallback((start: string, end: string) => {
    setState(s => ({ ...s, customStart: start, customEnd: end }));
  }, []);

  const fetchAll = useCallback(async (pageId: string, period: Period, start?: string, end?: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const [metrics, chartVisits, chartDevice, chartSources] = await Promise.all([
        analyticsApi.getDashboard(pageId, period, start, end),
        analyticsApi.getVisitsChart(pageId, period, start, end),
        analyticsApi.getDeviceChart(pageId, period, start, end),
        analyticsApi.getSourcesChart(pageId, period, start, end),
      ]);
      setState(s => ({
        ...s,
        loading: false,
        metrics: metrics.data,
        chartVisits: chartVisits.data,
        chartDevice: chartDevice.data,
        chartSources: chartSources.data,
      }));
    } catch {
      setState(s => ({ ...s, loading: false, error: 'Erro ao carregar analytics' }));
    }
  }, []);

  const fetchLeads = useCallback(async (pageId: string, filters: LeadFilters) => {
    setState(s => ({ ...s, loadingLeads: true }));
    try {
      const res = await analyticsApi.getLeads(pageId, filters);
      setState(s => ({
        ...s,
        loadingLeads: false,
        leads: res.data.leads,
        leadsTotal: res.data.total,
        leadsPage: res.data.page,
        leadsPageSize: res.data.pageSize,
      }));
    } catch {
      setState(s => ({ ...s, loadingLeads: false }));
    }
  }, []);

  const updateLeadStatus = useCallback(async (leadId: string, status: string) => {
    await analyticsApi.updateLeadStatus(leadId, status);
    setState(s => ({
      ...s,
      leads: s.leads.map(l => l.id === leadId ? { ...l, status } : l),
    }));
  }, []);

  const exportLeads = useCallback(async (pageId: string, period: string, start?: string, end?: string) => {
    const res = await analyticsApi.exportLeads(pageId, period, start, end);
    const url = URL.createObjectURL(res.data as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const sendLeadsToCrm = useCallback(async (leadIds: string[], crmType: string, credentials: unknown) => {
    const res = await analyticsApi.sendLeadsToCrm(leadIds, crmType, credentials);
    return res.data;
  }, []);

  return {
    ...state,
    setPeriod,
    setCustomRange,
    fetchAll,
    fetchLeads,
    updateLeadStatus,
    exportLeads,
    sendLeadsToCrm,
  };
}
