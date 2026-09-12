import { AiPentestService, type AiReport } from "./ai-pentest.service";
import { APIScannerService, type APIScan } from "./api-scanner.service";
import { OSScannerService, type OSScannerScan } from "./os-scanner.service";
import { WebScannerService, type WebScanRun } from "./web-scanner.service";

export type ReportModule = "Web Scanner" | "OS Scanner" | "API Scanner" | "AI Pentest";
export type ReportCentreStatus = "Ready" | "Generating" | "Scheduled" | "Failed";
export type ReportFormat = "json" | "csv" | "pdf" | "xml";

export type ReportCentreItem = {
  id: string;
  sourceId: string;
  scanId: string;
  module: ReportModule;
  name: string;
  type: string;
  target: string;
  status: ReportCentreStatus;
  progress: number;
  findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  generatedAt: string | null;
  updatedAt: string | null;
  formats: ReportFormat[];
  viewHref?: string;
};

export type ReportCentreData = {
  reports: ReportCentreItem[];
  errors: Array<{ module: ReportModule; message: string }>;
  loadedAt: string;
};

const number = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const percent = (value: unknown) => Math.max(0, Math.min(100, number(value)));
const message = (reason: unknown) => reason instanceof Error ? reason.message : "The report source is unavailable.";
const sum = (values: Record<string, number> = {}) => Object.values(values).reduce((total, value) => total + number(value), 0);

function webStatus(scan: WebScanRun): ReportCentreStatus {
  if (scan.report?.available) return "Ready";
  if (["failed", "cancelled", "canceled"].includes(scan.status.toLowerCase())) return "Failed";
  if (["queued", "pending", "created"].includes(scan.status.toLowerCase())) return "Scheduled";
  return "Generating";
}

function webReport(scan: WebScanRun): ReportCentreItem {
  const counts = scan.report?.severityCounts || {};
  return {
    id: `web-${scan.id}`, sourceId: scan.id, scanId: scan.id, module: "Web Scanner", name: `${scan.target.name} web assessment`,
    type: scan.mode === "active" ? "Active web assessment" : "Safe web assessment", target: scan.target.url,
    status: webStatus(scan), progress: percent(scan.progressPercent), findings: number(scan.report?.summary.unique_finding_count) || sum(counts),
    critical: number(counts.critical), high: number(counts.high), medium: number(counts.medium), low: number(counts.low),
    generatedAt: scan.report?.generatedAt || scan.completedAt, updatedAt: scan.updatedAt || scan.runtimeUpdatedAt || scan.createdAt,
    formats: scan.report?.available ? ["json"] : [], viewHref: `/scan?scanId=${encodeURIComponent(scan.id)}`
  };
}

function osStatus(scan: OSScannerScan): ReportCentreStatus {
  if (scan.reports.length) return "Ready";
  if (["failed", "cancelled"].includes(scan.status)) return "Failed";
  if (["queued", "preparing"].includes(scan.status)) return "Scheduled";
  return "Generating";
}

function osReports(scan: OSScannerScan): ReportCentreItem[] {
  const common = {
    scanId: scan.id, module: "OS Scanner" as const, target: scan.target_ip, status: osStatus(scan), progress: percent(scan.progress),
    findings: number(scan.critical_count) + number(scan.high_count) + number(scan.medium_count) + number(scan.low_count),
    critical: number(scan.critical_count), high: number(scan.high_count), medium: number(scan.medium_count), low: number(scan.low_count),
    updatedAt: scan.completed_at || scan.started_at || null
  };
  if (!scan.reports.length) return [{ ...common, id: `os-${scan.id}`, sourceId: scan.id, name: scan.scan_name, type: `${scan.scan_profile} OS assessment`, generatedAt: scan.completed_at || null, formats: [] }];
  return scan.reports.map((report) => ({ ...common, id: `os-${report.id}`, sourceId: report.id, name: report.report_name || scan.scan_name, type: report.report_type || `${scan.scan_profile} OS assessment`, generatedAt: report.created_at, formats: ["json", "pdf", "xml"] }));
}

function apiStatus(scan: APIScan): ReportCentreStatus {
  if (["completed", "completed_with_warnings", "inconclusive"].includes(scan.status)) return "Ready";
  if (["failed", "canceled"].includes(scan.status)) return "Failed";
  if (scan.status === "queued") return "Scheduled";
  return "Generating";
}

function apiReport(scan: APIScan): ReportCentreItem {
  const ready = apiStatus(scan) === "Ready";
  return {
    id: `api-${scan.id}`, sourceId: scan.id, scanId: scan.id, module: "API Scanner", name: scan.scan_name,
    type: `${scan.scan_profile} API assessment`, target: scan.target, status: apiStatus(scan), progress: percent(scan.progress),
    findings: number(scan.findings_count), critical: 0, high: 0, medium: 0, low: 0,
    generatedAt: ready ? scan.completed_at || null : null, updatedAt: scan.completed_at || scan.started_at || scan.created_at || null,
    formats: ready ? ["json", "csv", "pdf"] : []
  };
}

function aiReport(report: AiReport): ReportCentreItem {
  return {
    id: `ai-${report.report_id}`, sourceId: String(report.report_id), scanId: report.job_id, module: "AI Pentest",
    name: report.title || report.job_name || report.id, type: "AI validation evidence pack", target: report.scope,
    status: report.status, progress: report.status === "Ready" ? 100 : report.status === "Generating" ? 65 : 0,
    findings: number(report.vulnerabilities_count), critical: (report.vulnerabilities || []).filter((item) => item.severity === "CRITICAL").length,
    high: (report.vulnerabilities || []).filter((item) => item.severity === "HIGH").length,
    medium: (report.vulnerabilities || []).filter((item) => item.severity === "MEDIUM").length,
    low: (report.vulnerabilities || []).filter((item) => item.severity === "LOW").length,
    generatedAt: report.generated, updatedAt: report.generated, formats: report.status === "Ready" ? ["json", "pdf"] : [],
    viewHref: `/ai-scanner/reports?reportId=${encodeURIComponent(String(report.report_id))}`
  };
}

export const ReportCentreService = {
  async load(background = false): Promise<ReportCentreData> {
    const sources = await Promise.allSettled([
      WebScannerService.listScans(0, 200),
      OSScannerService.history({ page: 1, page_size: 200 }),
      APIScannerService.scans({ page: 1, page_size: 200 }),
      AiPentestService.getReports(background)
    ]);
    const modules: ReportModule[] = ["Web Scanner", "OS Scanner", "API Scanner", "AI Pentest"];
    const errors = sources.flatMap((result, index) => result.status === "rejected" ? [{ module: modules[index], message: message(result.reason) }] : []);
    if (sources.every((result) => result.status === "rejected")) throw new Error("No report source could be loaded.");
    const reports: ReportCentreItem[] = [];
    if (sources[0].status === "fulfilled") reports.push(...sources[0].value.scans.map(webReport));
    if (sources[1].status === "fulfilled") reports.push(...sources[1].value.results.flatMap(osReports));
    if (sources[2].status === "fulfilled") reports.push(...sources[2].value.results.map(apiReport));
    if (sources[3].status === "fulfilled") reports.push(...sources[3].value.reports.map(aiReport));
    reports.sort((a, b) => Date.parse(b.generatedAt || b.updatedAt || "") - Date.parse(a.generatedAt || a.updatedAt || ""));
    return { reports, errors, loadedAt: new Date().toISOString() };
  },

  async download(report: ReportCentreItem, format: ReportFormat): Promise<{ blob: Blob; filename: string }> {
    if (report.module === "Web Scanner") return WebScannerService.downloadReport(report.scanId);
    if (report.module === "OS Scanner") return { blob: await OSScannerService.report(report.sourceId, format as "json" | "pdf" | "xml"), filename: `${report.name}.${format}` };
    if (report.module === "API Scanner") {
      const data = await APIScannerService.report(report.scanId, format as "json" | "csv" | "pdf");
      return { blob: data instanceof Blob ? data : new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), filename: `${report.name}.${format}` };
    }
    return { blob: await AiPentestService.downloadReport(report.sourceId, format as "json" | "pdf"), filename: `${report.name}.${format}` };
  }
} as const;
