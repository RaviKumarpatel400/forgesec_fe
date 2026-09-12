"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Suspense, useEffect, useMemo, useState } from "react";
import SubscriptionSidebar from "../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/api-error";
import { toast } from "../../lib/toast";
import { WebScannerService, type WebScanRun } from "../../services/web-scanner.service";

type Tab = "overview" | "review" | "report";
const terminalStatuses = new Set(["completed", "completed_with_errors", "partial", "failed", "cancelled"]);

function title(value: string) { return value.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function dateTime(value: string | null) { if (!value) return "Not reported"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "Not reported" : date.toLocaleString(); }
function duration(scan: WebScanRun) {
  const start = scan.startedAt ?? scan.submittedAt ?? scan.createdAt;
  const end = scan.completedAt ?? scan.runtimeUpdatedAt ?? scan.lastSyncedAt ?? scan.updatedAt;
  if (!start || !end) return "Not reported";
  const milliseconds = new Date(end).getTime() - new Date(start).getTime();
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return "Not reported";
  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}
function phaseDetail(scan: WebScanRun) {
  if (scan.phase === "queued_scope_wait") return "Waiting for the existing scan lease on this target to be released.";
  if (["queued", "accepted", "created"].includes(scan.phase)) return "Accepted by the control plane and waiting for worker dispatch.";
  if (["dispatching", "dispatched"].includes(scan.phase)) return "Handing the authorized scan manifest to scanner workers.";
  if (scan.status === "running") return "Workers are active. This view advances when the scanner returns tool results.";
  if (scan.status === "aggregating") return "Tool results are being normalized into findings and the final report.";
  if (terminalStatuses.has(scan.status)) return "The scanner returned a terminal run state.";
  return "Waiting for the next scanner status update.";
}
function downloadBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url); }

function ScanDetails() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId")?.trim() ?? "";
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [findingOffset, setFindingOffset] = useState(0);
  useEffect(() => { setTab("overview"); setFindingOffset(0); }, [scanId]);

  const scanQuery = useQuery({
    queryKey: ["web-scanner", "scan", scanId], queryFn: () => WebScannerService.getScan(scanId), enabled: Boolean(scanId && isAuthenticated),
    refetchInterval: (query) => query.state.data && terminalStatuses.has(query.state.data.status) ? false : 2500, refetchOnWindowFocus: true
  });
  const scan = scanQuery.data;
  const findingsQuery = useQuery({
    queryKey: ["web-scanner", "scan", scanId, "findings", findingOffset], queryFn: () => WebScannerService.getFindings(scanId, findingOffset, 100), enabled: Boolean(scan && isAuthenticated),
    refetchInterval: scan && terminalStatuses.has(scan.status) ? false : 5000, retry: 1
  });
  const reportReady = Boolean(scan && terminalStatuses.has(scan.status));
  const reportQuery = useQuery({
    queryKey: ["web-scanner", "scan", scanId, "report"], queryFn: () => WebScannerService.getReport(scanId), enabled: reportReady,
    refetchInterval: (query) => query.state.data?.available || query.state.data?.status === "failed" ? false : 5000, retry: false
  });

  const tools = useMemo(() => scan ? [...new Set([...scan.enabledTools, ...scan.toolResults.map((result) => result.tool)])] : [], [scan]);
  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening secure scan details...</span></main>;

  return <main className="dashboard-shell subscription-dashboard-shell scan-details-shell">
    <SubscriptionSidebar active="web-scanner" user={user} />
    <section className="dashboard-workspace scan-details-workspace">
      {!scanId ? <div className="scan-state-message"><h1>Choose a scan run</h1><p>Open a run from the Web Scanner targets page.</p><Link href="/configuration">Back to Web Scanner</Link></div>
      : scanQuery.isLoading ? <div className="scan-state-message"><span className="scanner-spinner" /><h1>Loading scan</h1><p>Reading the latest run state from the backend.</p></div>
      : scanQuery.isError || !scan ? <div className="scan-state-message error"><h1>Unable to load this scan</h1><p>{getApiErrorMessage(scanQuery.error, "The requested scan could not be loaded.")}</p><div><Link href="/configuration">Back to targets</Link><button onClick={() => scanQuery.refetch()} type="button">Retry</button></div></div>
      : <div className="scan-details-content">
        <header className="scan-details-heading"><div><Link href="/configuration">← Web Scanner targets</Link><h1>{scan.target.name}</h1><p>{scan.target.url || "Target URL unavailable"}</p><small>Scan ID: {scan.id}</small></div><button disabled={scanQuery.isFetching} onClick={async () => { await Promise.all([scanQuery.refetch(), findingsQuery.refetch(), ...(reportReady ? [reportQuery.refetch()] : [])]); }} type="button">↻ {scanQuery.isFetching ? "Refreshing..." : "Refresh current run"}</button></header>

        {(scan.error || scan.errors.length > 0 || scan.syncWarning) && <section className="scan-alert"><strong>Scanner diagnostics</strong><p>{scan.error ?? scan.errors[0]?.message ?? scan.syncWarning}</p></section>}

        <nav className="scan-tabs" aria-label="Scan result sections" role="tablist">
          <button aria-selected={tab === "overview"} onClick={() => setTab("overview")} role="tab" type="button">◈ Overview</button>
          <button aria-selected={tab === "review"} onClick={() => setTab("review")} role="tab" type="button">▧ Review queue ({findingsQuery.data?.total ?? 0})</button>
          <button aria-selected={tab === "report"} onClick={() => setTab("report")} role="tab" type="button">◫ Report</button>
        </nav>

        {tab === "overview" && <div className="scan-tab-panel">
          <section className="scan-card live-state"><header><div><h2>Live run state <span className={`scan-status ${scan.status}`}>{title(scan.status)}</span></h2><strong>Phase: {title(scan.phase)}</strong><p>{phaseDetail(scan)}</p></div><div><b>{scan.completedTools.length}/{tools.length}</b><span>terminal tool results received</span>{scan.pendingTools.length > 0 && <em>{scan.pendingTools.length} pending</em>}</div></header>
            <dl className="scan-timeline"><div><dt>Submitted</dt><dd>{dateTime(scan.submittedAt ?? scan.createdAt)}</dd></div><div><dt>Queued</dt><dd>{dateTime(scan.queuedAt)}</dd></div><div><dt>Started by tool</dt><dd>{dateTime(scan.startedAt)}</dd></div><div><dt>Scanner update</dt><dd>{dateTime(scan.runtimeUpdatedAt)}</dd></div><div><dt>Last synchronized</dt><dd>{dateTime(scan.lastSyncedAt)}</dd></div><div><dt>Completed</dt><dd>{dateTime(scan.completedAt)}</dd></div><div><dt>{scan.completedAt ? "Duration" : "Duration at last sync"}</dt><dd>{duration(scan)}</dd></div><div><dt>Dispatch attempts</dt><dd>{scan.dispatchAttempts ?? "Not reported"}</dd></div></dl>
          </section>
          <section className="scan-card"><h2>Tool results</h2><p>Pending cards indicate that no terminal result has arrived yet.</p><div className="tool-result-grid">{tools.length ? tools.map((tool) => { const result = scan.toolResults.find((item) => item.tool === tool); const status = result?.status ?? (scan.completedTools.includes(tool) ? "completed" : "pending"); return <article key={tool}><header><span className={`tool-dot ${status}`} /><div><h3>{tool}</h3><small>{title(status)} · {title(result?.phase ?? "awaiting_terminal_result")}</small></div><b>{result ? `${result.findingsCount} results` : "Awaiting result"}</b></header>{result ? <dl><div><dt>Started</dt><dd>{dateTime(result.startedAt)}</dd></div><div><dt>Finished</dt><dd>{dateTime(result.finishedAt)}</dd></div><div><dt>Duration</dt><dd>{result.durationMs == null ? "Not reported" : `${(result.durationMs / 1000).toFixed(1)}s`}</dd></div></dl> : <p>No terminal result received from this tool yet.</p>}{(result?.error || result?.errors.length) ? <em>{result.error ?? result.errors[0].message}</em> : null}</article>; }) : <p className="scan-empty-inline">Tool dispatch information has not arrived yet.</p>}</div></section>
        </div>}

        {tab === "review" && <section className="scan-card scan-tab-panel"><header className="panel-heading"><div><h2>Review queue</h2><p>Automated scanner observations requiring security review.</p></div><b>{findingsQuery.data?.total ?? 0} findings</b></header>{findingsQuery.isLoading ? <div className="scan-empty-inline"><span className="scanner-spinner" />Loading findings...</div> : findingsQuery.isError ? <div className="scan-empty-inline error">{getApiErrorMessage(findingsQuery.error, "Unable to load findings.")}</div> : !findingsQuery.data?.findings.length ? <div className="scan-empty-inline">No findings have been returned for this scan.</div> : <div className="findings-list">{findingsQuery.data.findings.map((finding) => <article key={finding.id}><header><span className={`severity ${finding.severity}`}>{title(finding.severity)}</span><div><h3>{finding.title}</h3><p>{[finding.ruleId, ...finding.tools].filter(Boolean).join(" · ")}</p></div><b>{finding.occurrenceCount} occurrence{finding.occurrenceCount === 1 ? "" : "s"}</b></header>{finding.affectedUrl && <a href={finding.affectedUrl} rel="noreferrer" target="_blank">{finding.affectedUrl}</a>}<p>{finding.description || "No description was provided by the scanner."}</p>{finding.remediation && <div><strong>Remediation</strong><p>{finding.remediation}</p></div>}</article>)}</div>}{(findingsQuery.data?.total ?? 0) > 100 && <footer className="scan-pagination"><button disabled={findingOffset === 0} onClick={() => setFindingOffset(Math.max(0, findingOffset - 100))}>Previous</button><span>{findingOffset + 1}–{Math.min(findingOffset + 100, findingsQuery.data?.total ?? 0)}</span><button disabled={findingOffset + 100 >= (findingsQuery.data?.total ?? 0)} onClick={() => setFindingOffset(findingOffset + 100)}>Next</button></footer>}</section>}

        {tab === "report" && <section className="scan-card scan-tab-panel"><header className="panel-heading"><div><h2>Scan report</h2><p>Backend generated report and recorded assessment coverage.</p></div>{reportQuery.data?.available && <button className="report-download" onClick={async () => { try { const file = await WebScannerService.downloadReport(scan.id); downloadBlob(file.blob, file.filename); toast.success("The verified scan report was downloaded.", "Report ready"); } catch (error) { toast.error(getApiErrorMessage(error, "Unable to download this report."), "Download failed"); } }} type="button">Download JSON report</button>}</header>{!reportReady ? <div className="scan-empty-inline">The report becomes available after the scan reaches a terminal state.</div> : reportQuery.isLoading ? <div className="scan-empty-inline"><span className="scanner-spinner" />Preparing report metadata...</div> : reportQuery.isError ? <div className="scan-empty-inline">The report is still being prepared by the scanner.</div> : reportQuery.data && <div className="report-content"><div className="report-summary"><article><span>Status</span><strong>{title(reportQuery.data.status)}</strong></article><article><span>Generated</span><strong>{dateTime(reportQuery.data.generatedAt)}</strong></article><article><span>Findings</span><strong>{String(reportQuery.data.summary.unique_finding_count ?? findingsQuery.data?.total ?? "Not reported")}</strong></article><article><span>Artifact SHA-256</span><strong>{reportQuery.data.sha256 ? `${reportQuery.data.sha256.slice(0, 16)}...` : "Not reported"}</strong></article></div><h3>Severity summary</h3><div className="severity-summary">{["critical", "high", "medium", "low", "info", "unknown"].map((severity) => <span key={severity}><b>{Number(reportQuery.data?.severityCounts[severity] ?? 0)}</b>{title(severity)}</span>)}</div>{reportQuery.data.limitations.length > 0 && <><h3>Assessment limitations</h3><ul>{reportQuery.data.limitations.map((item) => <li key={item}>{item}</li>)}</ul></>}</div>}</section>}
      </div>}
    </section>
  </main>;
}

export default function ScanPage() { return <Suspense fallback={<main className="scanner-auth-wait"><span>Opening scan details...</span></main>}><ScanDetails /></Suspense>; }
