import { OS_SCANNER_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";
import { UnifiedAPIService } from "./unified-api.service";

export type OSScannerAuthType = "unauthenticated" | "ssh_password" | "ssh_private_key" | "windows_smb_wmi" | "domain";
export type OSScannerMode = "network" | "combined";
export type OSScannerProfile = "quick" | "standard" | "deep";
export type SentinelPlatform = "windows" | "macos" | "linux";

export type OSScannerStartRequest = {
  target_ip: string; asset_name: string; scan_name: string; scan_mode: OSScannerMode; scan_profile: OSScannerProfile;
  endpoint_uuid?: string; authentication_type: OSScannerAuthType; username?: string; password?: string;
  private_key?: string; private_key_passphrase?: string; domain?: string; credential_port?: number;
};
export type OSScannerEndpoint = {
  agent_uuid: string; agent_name: string; hostname?: string | null; os_name?: string | null; os_version?: string | null;
  local_ip?: string | null; tunnel_ip?: string | null; privileged: boolean; online: boolean; capabilities: string[];
  ready: boolean; setup_status: "offline" | "admin_required" | "upgrade_required" | "tunnel_required" | "ready";
};
export type OSScannerAsset = { id: string; target_ip: string; asset_name: string; is_authorized: boolean; authorized_at?: string };
export type OSScannerSummary = { running: number; completed: number; failed: number; critical: number; high: number; medium: number; low: number };
export type OSScannerReport = { id: string; report_type: string; report_name: string; created_at: string };
export type OSScannerScan = {
  id: string; scan_name: string; asset_name: string; target_ip: string; scan_mode: OSScannerMode; scan_profile: string;
  hostname?: string | null; status: "queued" | "preparing" | "running" | "processing" | "completed" | "failed" | "cancelled";
  progress: number; started_at?: string | null; completed_at?: string | null; error_message?: string | null;
  critical_count: number; high_count: number; medium_count: number; low_count: number; reports: OSScannerReport[];
};
export type OSScannerHistory = { results: OSScannerScan[]; total: number; page: number; page_size: number };
type Envelope<T> = { success: boolean; data: T; error?: string; message?: string };

async function csrf() { await UnifiedAPIService.auth.getCsrf(); }

export const OSScannerService = {
  async summary() { return (await api.get<Envelope<OSScannerSummary>>(OS_SCANNER_ROUTES.summary, { skipGlobalLoader: true })).data.data; },
  async assets() { return (await api.get<Envelope<OSScannerAsset[]>>(OS_SCANNER_ROUTES.assets, { skipGlobalLoader: true })).data.data; },
  async endpoints() { return (await api.get<Envelope<OSScannerEndpoint[]>>(OS_SCANNER_ROUTES.endpoints, { skipGlobalLoader: true })).data.data; },
  async history(params: { page: number; page_size: number; q?: string; status?: string }) { return (await api.get<Envelope<OSScannerHistory>>(OS_SCANNER_ROUTES.history, { params, skipGlobalLoader: true })).data.data; },
  async authorize(target_ip: string, asset_name: string) { await csrf(); return (await api.post<Envelope<OSScannerAsset>>(OS_SCANNER_ROUTES.assets, { target_ip, asset_name }, { loaderMessage: "Authorizing OS scan target..." })).data.data; },
  async start(payload: OSScannerStartRequest) { await csrf(); return (await api.post<Envelope<OSScannerScan>>(OS_SCANNER_ROUTES.start, payload, { loaderMessage: "Queuing OS security scan..." })).data.data; },
  async retry(scanId: string) { await csrf(); return (await api.post<Envelope<OSScannerScan>>(OS_SCANNER_ROUTES.retry(scanId), undefined, { loaderMessage: "Retrying OS scan..." })).data.data; },
  async cancel(scanId: string) { await csrf(); return (await api.post<Envelope<OSScannerScan>>(OS_SCANNER_ROUTES.cancel(scanId), undefined, { loaderMessage: "Stopping OS scan..." })).data.data; },
  async remove(scanId: string) { await csrf(); await api.delete(OS_SCANNER_ROUTES.delete(scanId), { loaderMessage: "Removing OS scan history..." }); },
  async installer(platform: SentinelPlatform) {
    await csrf();
    const response = await api.post<Blob>(OS_SCANNER_ROUTES.endpointInstaller, { platform }, { loaderMessage: `Preparing ${platform} Sentinel installer...`, responseType: "blob" });
    const disposition = String(response.headers["content-disposition"] ?? "");
    const fallback = platform === "windows" ? "ForgeSecSentinel-Windows.exe" : platform === "macos" ? "ForgeSecSentinel-macOS.pkg" : "ForgeSecSentinel-Linux.deb";
    return { blob: response.data, filename: disposition.match(/filename="?([^";]+)"?/i)?.[1] ?? fallback, platform };
  },
  async report(reportId: string, format: "json" | "pdf" | "xml") {
    const response = await api.get<Blob>(OS_SCANNER_ROUTES.download(reportId, format), { loaderMessage: `Preparing ${format.toUpperCase()} report...`, responseType: "blob" });
    return response.data;
  }
} as const;
