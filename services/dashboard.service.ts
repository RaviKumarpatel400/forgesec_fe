import { DASHBOARD_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";

export type DashboardRange = "weekly" | "monthly" | "yearly";

export type DashboardTotals = {
  applications: number;
  vulnerabilities: number;
  validated_vulnerable: number;
  validated_not_vulnerable: number;
  jobs?: number;
  web_scans?: number;
  ai_runs?: number;
};

export type DashboardTrend = {
  period_label: string;
  total_vulnerabilities: number;
  total_jobs: number;
  total_web: number;
  total_ai: number;
  total_scans?: number;
};

export type DashboardActivity = {
  investigation_id?: string;
  vulnerability_name?: string | null;
  application_name?: string | null;
  summary?: string | null;
  client_id?: string | number | null;
  timestamp?: string | null;
  updated_at?: string | null;
  source_type?: string | null;
};

export type DashboardOverview = {
  totals: DashboardTotals;
  recent_activity: DashboardActivity[];
  chart: DashboardTrend[];
  meta?: { range?: string };
};

export type ScanQueueItem = {
  id: string;
  scanId: string;
  target: string;
  type: string;
  initiatedBy: string;
  action: string;
  status: string;
  clientId?: string | null;
  clientName?: string | null;
  agentId?: string | null;
  agentName?: string | null;
};

export type DashboardAlertCve = {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
};

export type DashboardAlert = {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  cves: DashboardAlertCve[];
};

export const DashboardService = {
  alerts: () => api.get<{ title: string; alerts: DashboardAlert[] }>(DASHBOARD_ROUTES.alerts, { skipGlobalLoader: true }),
  overview: (range: DashboardRange) => api.get<DashboardOverview>(DASHBOARD_ROUTES.overview, {
    params: { limit: 50, range },
    skipGlobalLoader: true
  }),
  scanQueue: () => api.get<{ results: ScanQueueItem[]; total: number }>(DASHBOARD_ROUTES.scanQueue, {
    params: { limit: 100 },
    skipGlobalLoader: true
  })
} as const;
