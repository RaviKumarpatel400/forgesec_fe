"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import SubscriptionSidebar from "../../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/api-error";
import { toast } from "../../../lib/toast";
import { AiPentestService, type AiReport, type AiReportDetail, type AiScan, type AiSeverity } from "../../../services/ai-pentest.service";

function Icon({ children }: { children: ReactNode }) { return <svg aria-hidden="true" viewBox="0 0 24 24">{children}</svg>; }
const icons = {
  spark: <Icon><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></Icon>,
  play: <Icon><path d="m8 5 11 7-11 7V5Z" /></Icon>,
  refresh: <Icon><path d="M20 6v5h-5M4 18v-5h5" /><path d="M18.5 10A7 7 0 0 0 6 7.5L4 11m2 3a7 7 0 0 0 12 2.5l2-3.5" /></Icon>,
  shield: <Icon><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></Icon>,
  bolt: <Icon><path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z" /></Icon>,
  brain: <Icon><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 5 2V6a2 2 0 0 0-2-2Zm6 0a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-5 2V6a2 2 0 0 1 2-2Z" /></Icon>,
  gauge: <Icon><path d="M4 17a8 8 0 1 1 16 0" /><path d="m12 17 4-5" /></Icon>,
  report: <Icon><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Icon>,
  activity: <Icon><path d="M3 12h4l2-6 4 12 2-6h6" /></Icon>
};

const severities: AiSeverity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const severityColors: Record<AiSeverity, string> = { CRITICAL: "#b4233a", HIGH: "#625cf6", MEDIUM: "#c4772d", LOW: "#087476" };
function number(value: unknown) { const parsed = Number(value ?? 0); return Number.isFinite(parsed) ? parsed : 0; }
function pct(value: number, total: number) { return total ? Math.round((value / total) * 100) : 0; }
function label(value: string | null | undefined) { return String(value || "unknown").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function date(value: string | null | undefined) { if (!value) return "Not available"; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString([], { day: "2-digit", month: "short", hour: "numeric", minute: "2-digit" }); }
function safeName(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 72) || "ai-pentest"; }
function saveBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url); }

export default function AiOverviewPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [reportDetail, setReportDetail] = useState<AiReportDetail | null>(null);
  const [openingReportId, setOpeningReportId] = useState<string | number | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const overviewQuery = useQuery({ queryKey: ["ai-pentest", "overview"], queryFn: () => AiPentestService.getOverview(), enabled: isAuthenticated, staleTime: 15_000, refetchOnWindowFocus: true });
  useEffect(() => { if (overviewQuery.isError) toast.error(getApiErrorMessage(overviewQuery.error, "Unable to load AI Pentest overview."), "AI Overview unavailable"); }, [overviewQuery.error, overviewQuery.isError]);

  const data = overviewQuery.data;
  const reports = data?.reports.reports ?? [];
  const vulnerabilities = data?.reports.latest_vulnerabilities ?? [];
  const scans = data?.scans.data ?? [];
  const reportCards = data?.reports.cards ?? { ready: 0, generating: 0, scheduled: 0, failed: 0, total: 0 };
  const scanSummary = data?.scans.summary ?? { total: 0, active: 0, completed: 0, failed: 0, cancelled: 0, reports_ready: 0, total_cves: 0 };
  const vulnCards = data?.reports.vulnerability_cards ?? { total_cves_tracked: vulnerabilities.length, active_exploits: vulnerabilities.filter((item) => item.exploitable).length, intel_sources: 0, avg_risk_score: 0 };
  const severity = data?.reports.severity_distribution ?? { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, total: 0 };
  const totalFindings = number(vulnCards.total_cves_tracked);
  const exploitable = number(vulnCards.active_exploits);
  const highRisk = number(severity.CRITICAL) + number(severity.HIGH);
  const targetCount = number(vulnCards.target_count ?? new Set(vulnerabilities.map((item) => item.target || item.affected).filter(Boolean)).size);
  const pipeline = data?.pipeline;
  const pipelineProgress = number(pipeline?.job?.summary?.progress);
  const trend = data?.reports.vulnerability_monthly ?? [];
  const trendMax = Math.max(1, ...trend.flatMap((point) => severities.map((item) => number(point[item]))));
  const filteredScans = useMemo(() => scans.filter((scan) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [scan.scan_name, scan.target_url, scan.id, scan.status, scan.stage].some((item) => String(item ?? "").toLowerCase().includes(query));
    const matchesStatus = status === "all" || (status === "active" ? scan.is_active : status === "terminal" ? !scan.is_active : scan.status === status);
    return matchesSearch && matchesStatus;
  }), [scans, search, status]);
  const recentReports = [...reports].sort((a, b) => Date.parse(b.generated ?? "") - Date.parse(a.generated ?? "")).slice(0, 3);

  async function openReport(reportId: string | number) {
    if (openingReportId !== null) return;
    setOpeningReportId(reportId);
    try { setReportDetail(await AiPentestService.getReport(reportId)); }
    catch (error) { toast.error(getApiErrorMessage(error, "Unable to open this report."), "Report unavailable"); }
    finally { setOpeningReportId(null); }
  }
  async function downloadReport(report: Pick<AiReport, "report_id" | "id">, format: "json" | "pdf") {
    const key = `${report.report_id}-${format}`;
    if (downloading) return;
    setDownloading(key);
    try { saveBlob(await AiPentestService.downloadReport(report.report_id, format), `${safeName(report.id)}.${format}`); toast.success(`${format.toUpperCase()} report downloaded.`, "Download complete"); }
    catch (error) { toast.error(getApiErrorMessage(error, `Unable to download the ${format.toUpperCase()} report.`), "Download failed"); }
    finally { setDownloading(null); }
  }
  async function downloadEvidence(scan: AiScan) {
    const key = `${scan.id}-evidence`;
    if (downloading) return;
    setDownloading(key);
    try { saveBlob(await AiPentestService.downloadEvidence(scan.id), `${safeName(scan.scan_name)}-${scan.id.slice(0, 8)}-evidence.zip`); toast.success("Evidence bundle downloaded.", "Download complete"); }
    catch (error) { toast.error(getApiErrorMessage(error, "Unable to download the evidence bundle."), "Download failed"); }
    finally { setDownloading(null); }
  }

  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening AI Pentest workspace...</span></main>;
  return <main className="dashboard-shell subscription-dashboard-shell ai-overview-shell">
    <SubscriptionSidebar active="ai-overview" scannerCount={scanSummary.active} user={user} />
    <section className="dashboard-workspace ai-overview-workspace">
      <header className="ai-page-topbar"><div><span>{icons.spark} AI Pentester</span><h1>AI Pentest Overview</h1></div><div><button onClick={() => window.location.assign("/ai-scanner/new-scan")} type="button">{icons.play} Launch Scan</button><button onClick={() => window.location.assign("/ai-scanner/reports")} type="button">{icons.report} AI Reports</button><button aria-label="Refresh AI Overview" disabled={overviewQuery.isFetching} onClick={async () => { const result = await overviewQuery.refetch(); if (!result.error) toast.success("AI Pentest data is up to date.", "Overview refreshed"); }} type="button">{icons.refresh}</button><div className="ai-profile"><b>{(user?.username || user?.email || "F")[0]?.toUpperCase()}</b><span><strong>{user?.username || user?.email || "ForgeSec User"}</strong><small>Profile</small></span></div></div></header>

      <div className="ai-overview-content">
        {overviewQuery.isLoading ? <section className="ai-overview-message"><span className="scanner-spinner" /><h2>Loading AI security intelligence</h2><p>Reading tenant scoped findings, scans, reports, and pipeline state.</p></section>
        : overviewQuery.isError || !data ? <section className="ai-overview-message error"><h2>Unable to load AI Pentest Overview</h2><p>{getApiErrorMessage(overviewQuery.error, "The AI Pentest APIs could not be reached.")}</p><button onClick={() => overviewQuery.refetch()} type="button">Try again</button></section>
        : <>
          <section className="ai-primary-metrics">
            {[{ title: "Findings tracked", value: totalFindings, detail: `${number(vulnCards.unique_cves ?? totalFindings)} unique CVEs`, icon: icons.shield }, { title: "Confirmed exploitable", value: exploitable, detail: `${pct(exploitable, totalFindings)}% exploitable`, icon: icons.bolt }, { title: "AI jobs", value: scanSummary.total, detail: `${scanSummary.active} active`, icon: icons.brain }, { title: "Avg risk score", value: number(vulnCards.avg_risk_score).toFixed(1), detail: "Average CVSS", icon: icons.gauge }, { title: "AI reports", value: reportCards.total || reports.length, detail: `${reportCards.ready} ready`, icon: icons.report }].map((item) => <article key={item.title}><div><span>{item.title}</span><strong>{item.value}</strong><small>{item.detail}</small></div><i>{item.icon}</i></article>)}
          </section>

          <section className="ai-pipeline-panel"><header><div><i>{icons.activity}</i><span><h2>Pipeline Stages</h2><p>Full AI Pentester workflow from queue to final validation.</p></span></div><dl><div><dt>State</dt><dd>{pipeline?.job ? label(pipeline.job.status) : "Idle"}</dd></div><div><dt>Progress</dt><dd>{pipeline?.job ? `${pipelineProgress}%` : "0%"}</dd></div><div><dt>Stages</dt><dd>{pipeline?.pipeline.length ?? 0}</dd></div><div><dt>Reports</dt><dd>{reportCards.ready}</dd></div></dl></header><div className="ai-pipeline-progress"><span style={{ width: `${Math.max(0, Math.min(100, pipelineProgress))}%` }} /></div>
            {pipeline?.pipeline.length ? <div className="ai-stage-scroll">{pipeline.pipeline.map((stage, index) => <article key={stage.key}><em>{String(index + 1).padStart(2, "0")}</em><i>{icons.activity}</i><h3>{stage.stage}</h3><p>{stage.detail}</p><span className={stage.state.toLowerCase()}>{stage.state}</span></article>)}</div> : <div className="ai-empty-row">No AI Pentest pipeline has been started for this tenant.</div>}
          </section>

          <section className="ai-secondary-metrics">{[{ title: "Exploitability ratio", value: `${pct(exploitable, totalFindings)}%`, detail: `${exploitable} exploitable of ${totalFindings}` }, { title: "High risk focus", value: highRisk, detail: "Critical and high severity findings" }, { title: "Targets touched", value: targetCount, detail: "Unique affected assets" }, { title: "Validation ready", value: `${pct(reportCards.ready, reportCards.total)}%`, detail: `${reportCards.ready} generated reports` }].map((item) => <article key={item.title}><i>{icons.activity}</i><div><span>{item.title}</span><strong>{item.value}</strong><small>{item.detail}</small></div></article>)}</section>

          <section className="ai-analytics-grid"><article className="ai-chart-panel"><header><h2>Severity Discovery Trend</h2><p>Monthly findings grouped by source severity.</p></header>{trend.length ? <div className="ai-bar-chart">{trend.map((point, index) => <div className="ai-bar-group" key={`${point.year}-${point.month}-${index}`}><div>{severities.map((item) => <span key={item} style={{ background: severityColors[item], height: `${Math.max(3, number(point[item]) / trendMax * 100)}%` }} title={`${item}: ${number(point[item])}`} />)}</div><small>{point.label || `${point.month}/${point.year}`}</small></div>)}</div> : <div className="ai-chart-empty">No trend data yet. Monthly trends appear after AI reports are generated.</div>}</article>
            <article className="ai-chart-panel"><header><h2>Severity Mix</h2><p>Current distribution of tracked findings.</p></header><div className="ai-severity-layout"><div className="ai-donut" style={{ background: severity.total ? `conic-gradient(${severityColors.CRITICAL} 0 ${pct(severity.CRITICAL, severity.total)}%,${severityColors.HIGH} 0 ${pct(severity.CRITICAL + severity.HIGH, severity.total)}%,${severityColors.MEDIUM} 0 ${pct(severity.CRITICAL + severity.HIGH + severity.MEDIUM, severity.total)}%,${severityColors.LOW} 0 100%)` : "#e9ecf1" }}><span><b>{severity.total}</b>Findings</span></div><div>{severities.map((item) => <p key={item}><i style={{ background: severityColors[item] }} /><span>{label(item)}</span><b>{number(severity[item])}</b><em>{pct(number(severity[item]), number(severity.total))}%</em></p>)}</div></div></article></section>

          <section className="ai-data-panel"><header><div><h2>Recent AI Pentest Scans</h2><p>Live tenant scoped jobs and pipeline progress.</p></div><div><input aria-label="Search AI scans" onChange={(event) => setSearch(event.target.value)} placeholder="Search scans or targets" value={search} /><select aria-label="Filter AI scans" onChange={(event) => setStatus(event.target.value)} value={status}><option value="all">All scans</option><option value="active">Active</option><option value="terminal">Terminal</option><option value="completed">Completed</option><option value="failed">Failed</option><option value="cancelled">Cancelled</option></select></div></header><div className="ai-table-wrap"><table><thead><tr><th>Scan</th><th>Target</th><th>Status</th><th>Progress</th><th>CVE flow</th><th>Sandbox</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{filteredScans.length ? filteredScans.map((scan) => <tr key={scan.id}><td><strong>{scan.scan_name}</strong><small>{scan.id}</small></td><td><span>{scan.target_url || "Not reported"}</span><small>{scan.input_format || "unknown"}</small></td><td><b className={`ai-status ${scan.status}`}>{label(scan.status)}</b><small>{scan.stage ? label(scan.stage) : ""}</small></td><td><div className="ai-progress"><span style={{ width: `${Math.max(0, Math.min(100, number(scan.progress)))}%` }} /></div><small>{number(scan.progress)}%</small></td><td><span>{scan.cve_count} detected · {scan.normalized_count} normalized · {scan.matched_count} matched</span></td><td><span>{scan.executed_count} runs</span><small>{scan.confirmed_count} confirmed</small></td><td>{date(scan.updated_at || scan.created_at)}</td><td><div className="ai-row-actions"><button disabled={!scan.report_id || openingReportId !== null} onClick={() => scan.report_id && openReport(scan.report_id)} title={scan.report_id ? "View AI report" : "Report is not ready"} type="button">View</button><button disabled={!scan.report_id || downloading !== null} onClick={() => scan.report_id && downloadReport({ report_id: scan.report_id, id: scan.scan_name }, "json")} title="Download JSON report" type="button">JSON</button><button disabled={!scan.report_id || downloading !== null} onClick={() => scan.report_id && downloadReport({ report_id: scan.report_id, id: scan.scan_name }, "pdf")} title="Download PDF report" type="button">PDF</button><button className="evidence" disabled={downloading !== null} onClick={() => downloadEvidence(scan)} title="Download evidence bundle" type="button">↓ Evidence</button></div></td></tr>) : <tr><td className="ai-table-empty" colSpan={8}>No AI Pentest scans match the current filters.</td></tr>}</tbody></table></div><footer>Showing {filteredScans.length} of {data.scans.pagination.total || scans.length} recent scans</footer></section>

          <section className="ai-data-panel ai-reports"><header><div><h2>Latest AI Reports</h2><p>{reportCards.ready} generated reports available.</p></div></header><div className="ai-report-grid">{recentReports.length ? recentReports.map((report) => <article key={report.report_id}><header><span>{report.id}</span><b className={`report-${report.status.toLowerCase()}`}>{report.status}</b></header><h3>{report.title}</h3><dl><div><dt>Findings</dt><dd>{report.vulnerabilities_count}</dd></div><div><dt>Confirmed</dt><dd>{report.exploitable_count}</dd></div><div><dt>Review</dt><dd>{number(report.inconclusive_count) + number(report.not_executed_count)}</dd></div></dl><p><b>Target:</b> {report.scope || "Not reported"}</p><p><b>Generated:</b> {date(report.generated)}</p><footer className="ai-report-actions"><button disabled={openingReportId !== null} onClick={() => openReport(report.report_id)} type="button">View report</button><button disabled={report.status !== "Ready" || downloading !== null} onClick={() => downloadReport(report, "json")} type="button">JSON</button><button disabled={report.status !== "Ready" || downloading !== null} onClick={() => downloadReport(report, "pdf")} type="button">PDF</button></footer></article>) : <div className="ai-empty-row">AI reports appear after Log Analysis and Report generation complete.</div>}</div></section>
        </>}
      </div>
      {reportDetail && <div className="ai-report-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setReportDetail(null)}><section aria-labelledby="ai-report-modal-title" aria-modal="true" className="ai-report-modal" role="dialog"><header><div><span>AI Pentest report</span><h2 id="ai-report-modal-title">{reportDetail.data.title}</h2><p>{reportDetail.data.scope || "Target scope not reported"}</p></div><button aria-label="Close report" onClick={() => setReportDetail(null)} type="button">×</button></header><div className="ai-report-modal-body"><section className="ai-report-modal-metrics"><article><span>Status</span><strong>{reportDetail.data.status}</strong></article><article><span>Findings</span><strong>{reportDetail.data.vulnerabilities_count}</strong></article><article><span>Confirmed</span><strong>{reportDetail.data.exploitable_count}</strong></article><article><span>Generated</span><strong>{date(reportDetail.data.generated)}</strong></article></section>{reportDetail.report && <><section className="ai-report-modal-section"><h3>Report summary</h3><dl>{Object.entries(reportDetail.report.summary || {}).slice(0, 12).map(([key, value]) => <div key={key}><dt>{label(key)}</dt><dd>{typeof value === "object" ? JSON.stringify(value) : String(value ?? "Not reported")}</dd></div>)}</dl></section>{reportDetail.report.report_markdown && <section className="ai-report-modal-section"><h3>Executive report</h3><pre>{reportDetail.report.report_markdown}</pre></section>}</>}<footer><button onClick={() => downloadReport(reportDetail.data, "json")} type="button">Download JSON</button><button className="primary" onClick={() => downloadReport(reportDetail.data, "pdf")} type="button">Download PDF</button></footer></div></section></div>}
    </section>
  </main>;
}

