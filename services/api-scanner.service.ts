import { API_SCANNER_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";
import { UnifiedAPIService } from "./unified-api.service";

export type APIInputMode = "url" | "openapi" | "swagger";
export type APIProfile = "discovery" | "baseline" | "full";
export type APISeverity = "info" | "low" | "medium" | "high" | "critical";
export type APIAuthType = "none" | "bearer" | "basic" | "api_key" | "custom_header";
export type APIStatus = "queued" | "running" | "paused" | "completed" | "completed_with_warnings" | "inconclusive" | "failed" | "canceled";
export type APIScanCreate = { scan_name: string; target: string; input_mode: APIInputMode; scan_profile: APIProfile; severity_filter: APISeverity[]; tags: string[]; auth_type: APIAuthType; auth_payload: Record<string, string>; authorization_confirmed: boolean; allow_private_targets: boolean; safe_mode: boolean; include_state_changing_operations: boolean; verify_tls: boolean; rate_limit: number; concurrency: number; request_timeout_seconds: number; max_scan_seconds: number };
export type APIScan = { id: string; scan_name: string; target: string; input_mode: APIInputMode; scan_profile: APIProfile; auth_type: APIAuthType; status: APIStatus; stage: string; status_reason?: string; progress: number; created_at?: string; started_at?: string | null; completed_at?: string | null; error_message?: string | null; findings_count?: number; target_reachable?: boolean | null; target_http_status?: number | null; coverage?: { operations?: { discovered?: number; attempted?: number; completed?: number; failed?: number } }; engine_metadata?: Record<string, unknown> };
export type APIFinding = { id: number; template_id: string; name: string; severity: APISeverity; verification_status: string; host: string; matched_at: string; description?: string; impact?: string; remediation?: string; evidence?: Record<string, unknown>; metadata?: Record<string, unknown> };
export type APIEvent = { stage: string; level: string; message: string; timestamp: string };
export type APIScanDetail = APIScan & { findings?: APIFinding[]; events?: APIEvent[]; diagnostics?: Record<string, unknown> };
export type APIList = { count: number; next: number | null; previous: number | null; results: APIScan[] };
export type APIHealth = { ready: boolean; agents: Array<{ agent_id: string; status: "online" | "offline"; version: string; capabilities: string[]; last_seen_at: string }> };

async function csrf() { await UnifiedAPIService.auth.getCsrf(); }
export const APIScannerService = {
  async health() { return (await api.get<APIHealth>(API_SCANNER_ROUTES.health, { skipGlobalLoader: true })).data; },
  async scans(params: { page: number; page_size: number; q?: string; status?: string }) { return (await api.get<APIList>(API_SCANNER_ROUTES.scans, { params, skipGlobalLoader: true })).data; },
  async detail(scanId: string) { return (await api.get<{ success: boolean; data: APIScanDetail }>(API_SCANNER_ROUTES.detail(scanId), { skipGlobalLoader: true })).data.data; },
  async start(payload: APIScanCreate, specification?: File | null) {
    await csrf();
    if (specification) { const body = new FormData(); body.append("configuration", JSON.stringify(payload)); body.append("specification", specification); return (await api.post<{ id: string; status: string; message: string }>(API_SCANNER_ROUTES.create, body, { loaderMessage: "Uploading API definition and queuing scan..." })).data; }
    return (await api.post<{ id: string; status: string; message: string }>(API_SCANNER_ROUTES.create, payload, { loaderMessage: "Queuing authorized API scan..." })).data;
  },
  async control(scanId: string, action: "pause" | "resume" | "cancel") { await csrf(); await api.post(API_SCANNER_ROUTES.control(scanId), { action }, { loaderMessage: `${action === "resume" ? "Resuming" : action === "pause" ? "Pausing" : "Cancelling"} API scan...` }); },
  async remove(scanId: string) { await csrf(); await api.delete(API_SCANNER_ROUTES.detail(scanId), { loaderMessage: "Removing API scan..." }); },
  async report(scanId: string, format: "json" | "csv" | "pdf") { return (await api.get<Blob | Record<string, unknown>>(API_SCANNER_ROUTES.report(scanId, format), { loaderMessage: `Preparing ${format.toUpperCase()} API report...`, ...(format === "json" ? {} : { responseType: "blob" as const }) })).data; }
} as const;
