import { WEB_SCANNER_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";
import { UnifiedAPIService } from "./unified-api.service";

export type WebScannerClient = { id: string; name: string; status: boolean };
export type TargetAuthorizationStatus = "required" | "pending" | "valid" | "expired" | "revoked";
export type TargetVerificationStatus = "required" | "pending" | "verified" | "revoked";

export type WebScannerTarget = {
  id: string;
  name: string;
  url: string;
  hostname: string;
  environment: string;
  isActive: boolean;
  client: { id: string; name: string } | null;
  scope: {
    canonicalOrigin: string;
    includePaths: string[];
    excludePaths: string[];
    effectiveExcludePaths: string[];
    allowedHttpMethods: string[];
    redirectMode: string;
  };
  authorizationPermissions: string[];
  authorizationStatus: TargetAuthorizationStatus;
  verificationStatus: TargetVerificationStatus;
  canScan: boolean;
  profiles: Record<"safe" | "active", WebScannerProfile>;
  latestScan: { id: string; status: string; progressPercent: number; createdAt: string | null } | null;
  createdAt: string | null;
};

export type WebScannerProfile = {
  id: "safe" | "active";
  name: string;
  description: string;
  tools: string[];
  capabilities: string[];
  limitations: string[];
  limits: Record<string, number>;
};

export type WebScanToolResult = {
  tool: string; status: string; phase: string; findingsCount: number;
  summary: Record<string, unknown>; coverage: Record<string, unknown>;
  errors: Array<{ code: string; message: string }>; error: string | null;
  startedAt: string | null; finishedAt: string | null; durationMs: number | null;
};

export type WebScanReport = {
  id: string | null; status: string; available: boolean; generatedAt: string | null; sha256: string | null;
  severityCounts: Record<string, number>; summary: Record<string, unknown>; coverageMetrics: Record<string, unknown>;
  limitations: string[]; tools: string[]; syncWarning: string | null;
};

export type WebScanRun = {
  id: string; target: { id: string; name: string; url: string }; mode: "safe" | "active"; status: string; phase: string;
  progressPercent: number; enabledTools: string[]; completedTools: string[]; pendingTools: string[]; toolResults: WebScanToolResult[];
  errors: Array<{ tool: string | null; code: string | null; message: string; phase: string | null }>; error: string | null;
  report: WebScanReport | null; submittedAt: string | null; queuedAt: string | null; startedAt: string | null;
  completedAt: string | null; lastSyncedAt: string | null; runtimeUpdatedAt: string | null; createdAt: string | null;
  updatedAt: string | null; dispatchAttempts: number | null; syncWarning: string | null;
};

export type WebScanFinding = {
  id: string; title: string; description: string; severity: string; confidence: string | null; kind: string | null;
  validationStatus: string | null; affectedUrl: string | null; tools: string[]; occurrenceCount: number;
  remediation: string | null; ruleId: string | null; firstSeenAt: string | null;
};

export type WebScanFindingPage = { findings: WebScanFinding[]; total: number; offset: number; limit: number; syncWarning: string | null };

export type WebScannerTargetInput = {
  name: string;
  url: string;
  clientId?: string;
  environment: string;
  includePaths: string[];
  excludePaths: string[];
  allowActive: boolean;
};

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).map((item) => item.trim()).filter(Boolean) : [];
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function finiteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeReport(value: unknown): WebScanReport | null {
  const row = record(value);
  if (!Object.keys(row).length) return null;
  return {
    id: nullableText(row.report_id ?? row.id), status: String(row.status ?? "pending"),
    available: row.download_available === true || row.available === true || row.status === "ready",
    generatedAt: nullableText(row.generated_at), sha256: nullableText(row.sha256),
    severityCounts: Object.fromEntries(Object.entries(record(row.severity_counts)).map(([key, count]) => [key, finiteNumber(count)])),
    summary: record(row.summary), coverageMetrics: record(row.coverage_metrics), limitations: strings(row.limitations),
    tools: strings(row.tools), syncWarning: nullableText(row.sync_warning)
  };
}

function normalizeScan(value: unknown): WebScanRun {
  const row = record(value);
  const target = record(row.target);
  const dispatch = record(row.dispatch);
  const toolResults = (Array.isArray(row.tool_results) ? row.tool_results : []).map((value) => {
    const item = record(value);
    const summary = record(item.summary);
    return {
      tool: String(item.tool ?? "scanner"), status: String(item.status ?? "pending"), phase: String(item.phase ?? "awaiting_terminal_result"),
      findingsCount: finiteNumber(summary.findings_count ?? summary.total_findings ?? item.findings_count), summary,
      coverage: record(item.tool_coverage),
      errors: (Array.isArray(item.errors) ? item.errors : []).map((value) => { const detail = record(value); return { code: String(detail.code ?? "scanner_error"), message: String(detail.message ?? detail.detail ?? "Scanner error") }; }),
      error: nullableText(item.error), startedAt: nullableText(item.started_at), finishedAt: nullableText(item.finished_at),
      durationMs: item.duration_ms == null ? null : finiteNumber(item.duration_ms)
    };
  });
  return {
    id: String(row.id ?? row.scan_id ?? ""), target: { id: String(target.id ?? ""), name: String(target.name ?? "Web scan"), url: String(target.url ?? "") },
    mode: row.mode === "active" ? "active" : "safe", status: String(row.status ?? "queued"), phase: String(row.phase ?? row.status ?? "queued"),
    progressPercent: finiteNumber(row.progress_percent), enabledTools: strings(row.enabled_tools), completedTools: strings(row.completed_tools), pendingTools: strings(row.pending_tools), toolResults,
    errors: (Array.isArray(row.errors) ? row.errors : []).map((value) => { const detail = record(value); return { tool: nullableText(detail.tool), code: nullableText(detail.code), message: String(detail.message ?? detail.detail ?? "Scanner error"), phase: nullableText(detail.phase) }; }),
    error: nullableText(row.error), report: normalizeReport(row.report),
    submittedAt: nullableText(row.submitted_at), queuedAt: nullableText(row.queued_at), startedAt: nullableText(row.started_at), completedAt: nullableText(row.completed_at),
    lastSyncedAt: nullableText(row.last_synced_at), runtimeUpdatedAt: nullableText(row.runtime_updated_at), createdAt: nullableText(row.created_at), updatedAt: nullableText(row.updated_at),
    dispatchAttempts: dispatch.attempt == null ? null : finiteNumber(dispatch.attempt), syncWarning: nullableText(row.sync_warning)
  };
}

function normalizeFinding(value: unknown): WebScanFinding {
  const row = record(value);
  const affected = record(row.affected);
  const directTool = nullableText(row.tool);
  const listedTools = strings(row.tools);
  return {
    id: String(row.id ?? row.fingerprint ?? ""), title: String(row.title ?? "Untitled finding"), description: String(row.description ?? ""), severity: String(row.severity ?? "unknown").toLowerCase(),
    confidence: nullableText(row.confidence), kind: nullableText(row.finding_kind), validationStatus: nullableText(row.validation_status), affectedUrl: nullableText(row.affected_url ?? affected.url),
    tools: listedTools.length ? listedTools : directTool ? [directTool] : [], occurrenceCount: finiteNumber(row.occurrence_count, 1), remediation: nullableText(row.remediation), ruleId: nullableText(row.rule_id), firstSeenAt: nullableText(row.first_seen_at)
  };
}

function profile(value: unknown, mode: "safe" | "active", url: string): WebScannerProfile {
  const row = record(value);
  const coverage = record(row.coverage);
  const labels = (value: unknown) => Array.isArray(value)
    ? value.map((item) => typeof item === "string" ? item : String(record(item).label ?? "")).filter(Boolean)
    : [];
  const safe = mode === "safe";
  return {
    id: mode,
    name: String(row.name ?? `forgesec-web-${mode}`),
    description: safe
      ? "Connectivity, TLS, crawling, and passive analysis within the verified scope."
      : "Adds bounded service reconnaissance and constrained active checks within the verified scope.",
    tools: strings(row.tools ?? row.enabled_tools),
    capabilities: labels(coverage.capabilities),
    limitations: labels(coverage.limitations),
    limits: Object.fromEntries(Object.entries(record(row.limits)).flatMap(([key, raw]) => {
      const number = Number(raw);
      return Number.isFinite(number) ? [[key, number]] : [];
    }))
  };
}

function normalizeTarget(value: unknown): WebScannerTarget {
  const row = record(value);
  const scope = record(row.scope);
  const client = record(row.client);
  const verification = record(row.verification);
  const authorization = record(row.authorization);
  const profiles = record(row.profiles);
  const latestScan = record(row.latest_scan);
  return {
    id: String(row.id ?? ""),
    name: String(row.name ?? "Unnamed website"),
    url: String(row.url ?? row.start_url ?? ""),
    hostname: String(row.hostname ?? ""),
    environment: String(row.environment ?? "other"),
    isActive: row.is_active !== false,
    client: client.id ? { id: String(client.id), name: String(client.name ?? "Client") } : null,
    scope: {
      canonicalOrigin: String(row.canonical_origin ?? row.url ?? ""),
      includePaths: strings(scope.include_paths),
      excludePaths: strings(scope.exclude_paths),
      effectiveExcludePaths: strings(scope.effective_exclude_paths),
      allowedHttpMethods: strings(scope.allowed_http_methods),
      redirectMode: String(record(scope.redirect_policy).mode ?? "same_origin")
    },
    authorizationPermissions: strings(authorization.permissions),
    authorizationStatus: String(row.authorization_status ?? "required") as TargetAuthorizationStatus,
    verificationStatus: String(verification.status ?? "required") as TargetVerificationStatus,
    canScan: row.can_scan === true,
    profiles: {
      safe: profile(profiles.safe, "safe", String(row.url ?? "")),
      active: profile(profiles.active, "active", String(row.url ?? ""))
    },
    latestScan: latestScan.id ? {
      id: String(latestScan.id),
      status: String(latestScan.status ?? "queued"),
      progressPercent: Number(latestScan.progress_percent ?? 0),
      createdAt: latestScan.created_at ? String(latestScan.created_at) : null
    } : null,
    createdAt: row.created_at ? String(row.created_at) : null
  };
}

function normalizeUrl(value: string): string {
  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
  const parsed = new URL(candidate);
  if (!/^https?:$/.test(parsed.protocol) || parsed.username || parsed.password || parsed.hash) {
    throw new Error("Enter a valid HTTP or HTTPS website URL without credentials or a fragment.");
  }
  return parsed.toString();
}

function payload(input: WebScannerTargetInput) {
  return {
    name: input.name.trim(),
    url: normalizeUrl(input.url),
    environment: input.environment,
    ...(input.clientId ? { client_id: input.clientId } : {}),
    scope: {
      include_paths: input.includePaths.length ? input.includePaths : ["/*"],
      exclude_paths: input.excludePaths,
      allowed_http_methods: ["GET", "HEAD"],
      allow_subdomains: false,
      redirect_policy: { mode: "same_origin", max_hops: 3, allowed_origins: [] }
    },
    authorization: { attested: true, allow_active: input.allowActive }
  };
}

async function csrf() {
  await UnifiedAPIService.auth.getCsrf();
}

export const WebScannerService = {
  async listScans(offset = 0, limit = 200): Promise<{ count: number; scans: WebScanRun[] }> {
    const response = await api.get<unknown>(WEB_SCANNER_ROUTES.scans, { params: { offset, limit }, skipGlobalLoader: true });
    const data = record(response.data);
    const rows = Array.isArray(data.scans) ? data.scans : [];
    return { count: finiteNumber(data.count, rows.length), scans: rows.map(normalizeScan).filter((scan) => scan.id) };
  },
  async listClients(): Promise<WebScannerClient[]> {
    const response = await api.get<unknown>(WEB_SCANNER_ROUTES.clients, { skipGlobalLoader: true });
    const rows = Array.isArray(response.data) ? response.data : [];
    return rows.flatMap((value) => {
      const row = record(value);
      const id = String(row.id ?? "").trim();
      const name = String(row.clientName ?? row.client_name ?? row.name ?? "").trim();
      return id && name ? [{ id, name, status: row.status !== false }] : [];
    });
  },
  async listTargets(): Promise<{ count: number; targets: WebScannerTarget[] }> {
    const response = await api.get<unknown>(WEB_SCANNER_ROUTES.targets, { skipGlobalLoader: true });
    const data = record(response.data);
    const rows = Array.isArray(data.targets) ? data.targets : Array.isArray(response.data) ? response.data : [];
    const targets = rows.map(normalizeTarget).filter((target) => target.id);
    return { count: Number(data.count ?? targets.length), targets };
  },
  async createTarget(input: WebScannerTargetInput): Promise<WebScannerTarget> {
    await csrf();
    const response = await api.post<unknown>(WEB_SCANNER_ROUTES.targets, payload(input), { loaderMessage: "Adding website securely..." });
    return normalizeTarget(record(response.data).target ?? response.data);
  },
  async updateTarget(targetId: string, input: WebScannerTargetInput): Promise<WebScannerTarget> {
    await csrf();
    const response = await api.patch<unknown>(WEB_SCANNER_ROUTES.target(targetId), payload(input), { loaderMessage: "Updating website settings..." });
    return normalizeTarget(record(response.data).target ?? response.data);
  },
  async deleteTarget(targetId: string): Promise<void> {
    await csrf();
    await api.delete(WEB_SCANNER_ROUTES.target(targetId), { loaderMessage: "Removing website..." });
  },
  async verifyTarget(targetId: string): Promise<WebScannerTarget> {
    await csrf();
    const response = await api.post<unknown>(WEB_SCANNER_ROUTES.verifyTarget(targetId), { method: "manual_review" }, { loaderMessage: "Verifying website permission..." });
    return normalizeTarget(record(response.data).target ?? response.data);
  },
  async launchScan(targetId: string, mode: "safe" | "active"): Promise<{ id: string; status: string }> {
    await csrf();
    const response = await api.post<unknown>(WEB_SCANNER_ROUTES.scans, {
      target_id: targetId,
      mode,
      ...(mode === "active" ? { active_acknowledgement: true } : {})
    }, { loaderMessage: `Launching ${mode} web scan...` });
    const scan = record(record(response.data).scan ?? response.data);
    return { id: String(scan.id ?? ""), status: String(scan.status ?? "queued") };
  },
  async getScan(scanId: string): Promise<WebScanRun> {
    const response = await api.get<unknown>(WEB_SCANNER_ROUTES.scan(scanId), { skipGlobalLoader: true });
    return normalizeScan(record(response.data).scan ?? response.data);
  },
  async getFindings(scanId: string, offset = 0, limit = 100): Promise<WebScanFindingPage> {
    const response = await api.get<unknown>(WEB_SCANNER_ROUTES.findings(scanId), { params: { offset, limit }, skipGlobalLoader: true });
    const data = record(response.data);
    return { findings: (Array.isArray(data.findings) ? data.findings : []).map(normalizeFinding), total: finiteNumber(data.total), offset: finiteNumber(data.offset, offset), limit: finiteNumber(data.limit, limit), syncWarning: nullableText(data.sync_warning) };
  },
  async getReport(scanId: string): Promise<WebScanReport> {
    const response = await api.get<unknown>(WEB_SCANNER_ROUTES.report(scanId), { skipGlobalLoader: true });
    return normalizeReport(record(response.data).report ?? response.data) ?? { id: null, status: "pending", available: false, generatedAt: null, sha256: null, severityCounts: {}, summary: {}, coverageMetrics: {}, limitations: [], tools: [], syncWarning: null };
  },
  async downloadReport(scanId: string): Promise<{ blob: Blob; filename: string }> {
    const response = await api.get<Blob>(WEB_SCANNER_ROUTES.reportDownload(scanId), { responseType: "blob", loaderMessage: "Preparing verified web scan report..." });
    const disposition = String(response.headers["content-disposition"] ?? "");
    return { blob: response.data, filename: disposition.match(/filename="?([^";]+)"?/i)?.[1] ?? `forgesec-webscan-${scanId}.json` };
  }
} as const;
