import { HYBRID_SCANNER_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";
import { UnifiedAPIService } from "./unified-api.service";

export type HybridScanMode = "basic" | "network" | "single_host" | "custom_asset";
export type HybridTargetType = "local_system" | "remote_host" | "subnet" | "host_list";

export type HybridScannerStartRequest = {
  scan_mode: HybridScanMode;
  target_type: HybridTargetType;
  target_host_ip?: string;
  subnet_cidr?: string;
  exclude_hosts?: string;
  ports?: string;
  timeout_seconds: number;
  max_threads: number;
  scan_profile: string;
  selected_modules: string[];
  enable_subnet_scan: boolean;
  save_results: boolean;
  email_report: boolean;
  authorization_confirmed: boolean;
  advanced_options?: Record<string, unknown>;
};

export type HybridScannerFinding = {
  id: string; finding_id?: string | null; title: string; severity: string; cvss_score?: number | null;
  component?: string | null; description?: string | null; remediation?: string | null;
  references: string[]; raw_data: Record<string, unknown>; created_at: string;
};

export type HybridScannerReport = {
  id: string; report_type: "json" | "html" | "pdf"; report_name: string; file_path: string;
  file_size: number; mime_type: string; summary_json: Record<string, unknown>; created_at: string;
};

export type HybridScannerScan = {
  id: string; scan_mode: HybridScanMode; target_type: HybridTargetType; target_host_ip?: string | null;
  subnet_cidr?: string | null; exclude_hosts?: string | null; ports?: string | null; timeout_seconds: number;
  max_threads: number; scan_profile: string; selected_modules: string[]; enable_subnet_scan: boolean;
  save_results: boolean; email_report: boolean; advanced_options: Record<string, unknown>;
  status: "queued" | "running" | "completed" | "failed" | "retrying" | "canceled";
  progress: number; started_at?: string | null; completed_at?: string | null; error_message?: string | null;
  retry_count: number; findings: HybridScannerFinding[]; reports: HybridScannerReport[];
  created_at: string; updated_at: string;
};

export type HybridScannerHistoryResponse = { results: HybridScannerScan[]; total: number; page: number; page_size: number };
type Envelope<T> = { success: boolean; data: T; error?: string; message?: string };

async function csrf() { await UnifiedAPIService.auth.getCsrf(); }

export const HybridScannerService = {
  async startScan(payload: HybridScannerStartRequest) {
    await csrf();
    return (await api.post<Envelope<HybridScannerScan>>(HYBRID_SCANNER_ROUTES.start, payload, { loaderMessage: "Starting Hybrid Scanner..." })).data.data;
  },
  async getHistory(query?: { page?: number; page_size?: number; status?: string; q?: string }) {
    return (await api.get<Envelope<HybridScannerHistoryResponse>>(HYBRID_SCANNER_ROUTES.history, { params: query, skipGlobalLoader: true })).data.data;
  },
  async getScan(scanId: string) {
    return (await api.get<Envelope<HybridScannerScan>>(HYBRID_SCANNER_ROUTES.detail(scanId), { skipGlobalLoader: true })).data.data;
  },
  async getStatus(scanId: string) {
    return (await api.get<Envelope<{ id: string; status: string; progress: number; error_message?: string | null }>>(HYBRID_SCANNER_ROUTES.status(scanId), { skipGlobalLoader: true })).data.data;
  },
  async getReport(reportId: string) {
    return (await api.get<Envelope<Record<string, unknown>>>(HYBRID_SCANNER_ROUTES.report(reportId), { loaderMessage: "Loading hybrid scan report..." })).data.data;
  },
  async downloadReport(reportId: string) {
    return (await api.get<Blob>(HYBRID_SCANNER_ROUTES.download(reportId), { responseType: "blob", loaderMessage: "Preparing hybrid scan report..." })).data;
  },
  async deleteScan(scanId: string) {
    await csrf();
    await api.delete(HYBRID_SCANNER_ROUTES.delete(scanId), { loaderMessage: "Removing hybrid scan..." });
  },
  async retryScan(scanId: string) {
    await csrf();
    return (await api.post<Envelope<HybridScannerScan>>(HYBRID_SCANNER_ROUTES.retry(scanId), undefined, { loaderMessage: "Retrying hybrid scan..." })).data.data;
  }
} as const;
