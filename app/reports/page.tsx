"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import SubscriptionSidebar from "../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/api-error";
import { toast } from "../../lib/toast";
import { ReportCentreService, type ReportCentreData, type ReportCentreItem, type ReportCentreStatus, type ReportFormat, type ReportModule } from "../../services/report-centre.service";

const PAGE_SIZE = 12;
const modules: Array<"All" | ReportModule> = ["All", "Web Scanner", "OS Scanner", "API Scanner", "AI Pentest"];
const statuses: Array<"All" | ReportCentreStatus> = ["All", "Ready", "Generating", "Scheduled", "Failed"];

function Icon({ children }: { children: ReactNode }) { return <svg aria-hidden="true" viewBox="0 0 24 24">{children}</svg>; }
const icons = {
  report: <Icon><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Icon>,
  refresh: <Icon><path d="M20 7v5h-5M4 17v-5h5" /><path d="M18.5 9A7 7 0 0 0 6 6.5M5.5 15A7 7 0 0 0 18 17.5" /></Icon>,
  download: <Icon><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></Icon>,
  eye: <Icon><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></Icon>,
  search: <Icon><circle cx="11" cy="11" r="7" /><path d="m16 16 5 5" /></Icon>,
  shield: <Icon><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" /></Icon>
};

function date(value: string | null) { if (!value) return "Not generated"; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString(); }
function safeName(value: string) { return value.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "forgesec-report"; }
function save(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = safeName(filename.replace(/\.[^.]+$/, "")) + (filename.match(/\.[^.]+$/)?.[0] || ""); document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); }
function csvCell(value: unknown) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function exportCsv(rows: ReportCentreItem[]) {
  const header = ["Report", "Module", "Type", "Target", "Status", "Progress", "Findings", "Critical", "High", "Medium", "Low", "Generated"];
  const body = rows.map((row) => [row.name, row.module, row.type, row.target, row.status, row.progress, row.findings, row.critical, row.high, row.medium, row.low, row.generatedAt]);
  save(new Blob([[header, ...body].map((row) => row.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" }), "forgesec-report-centre.csv");
}

export default function ReportCentrePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<ReportCentreData | null>(null);
  const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false); const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(""); const [module, setModule] = useState<"All" | ReportModule>("All"); const [status, setStatus] = useState<"All" | ReportCentreStatus>("All"); const [period, setPeriod] = useState("all"); const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReportCentreItem | null>(null); const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async (background = false, notify = false) => {
    background ? setRefreshing(true) : setLoading(true); setError(null);
    try {
      const result = await ReportCentreService.load(background); setData(result);
      if (result.errors.length) toast.info(`${result.errors.length} report source${result.errors.length === 1 ? " is" : "s are"} temporarily unavailable. Available reports were loaded.`, "Report Centre");
      else if (notify) toast.success("All report sources are up to date.", "Report Centre");
    } catch (loadError) { const detail = getApiErrorMessage(loadError, "Unable to load reports."); setError(detail); toast.error(detail, "Report Centre"); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { if (isAuthenticated) void load(); }, [isAuthenticated, load]);
  useEffect(() => setPage(1), [module, period, search, status]);

  const reports = useMemo(() => data?.reports || [], [data]);
  const filtered = useMemo(() => reports.filter((report) => {
    const query = search.trim().toLowerCase(); const timestamp = Date.parse(report.generatedAt || report.updatedAt || "");
    const matchesDate = period === "all" || Boolean(timestamp && Date.now() - timestamp <= Number(period) * 86400000);
    return (module === "All" || report.module === module) && (status === "All" || report.status === status) && matchesDate && (!query || [report.name, report.module, report.type, report.target, report.id, report.scanId].join(" ").toLowerCase().includes(query));
  }), [module, period, reports, search, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const ready = reports.filter((item) => item.status === "Ready").length; const generating = reports.filter((item) => item.status === "Generating").length; const scheduled = reports.filter((item) => item.status === "Scheduled").length; const failed = reports.filter((item) => item.status === "Failed").length;
  const totalFindings = reports.reduce((total, item) => total + item.findings, 0);
  const sourceCounts = modules.slice(1).map((name) => ({ name, count: reports.filter((item) => item.module === name).length }));

  async function download(report: ReportCentreItem, format: ReportFormat) {
    const key = `${report.id}-${format}`; if (downloading) return; setDownloading(key);
    try { const file = await ReportCentreService.download(report, format); save(file.blob, file.filename); toast.success(`${format.toUpperCase()} report downloaded.`, "Report ready"); }
    catch (downloadError) { toast.error(getApiErrorMessage(downloadError, `Unable to download the ${format.toUpperCase()} report.`), "Download failed"); }
    finally { setDownloading(null); }
  }

  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening Report Centre...</span></main>;
  return <main className="dashboard-shell subscription-dashboard-shell report-centre-shell">
    <SubscriptionSidebar active="report-centre" user={user} />
    <section className="dashboard-workspace report-centre-workspace">
      <header className="report-centre-topbar"><div><span>{icons.shield} Security evidence</span><h1>Report Centre</h1><p>Tenant scoped reports from every scanner and AI Pentest workflow.</p></div><nav><button disabled={!filtered.length} onClick={() => exportCsv(filtered)}>{icons.download} Export CSV</button><button className="primary" disabled={refreshing} onClick={() => void load(true, true)}>{icons.refresh} {refreshing ? "Refreshing..." : "Refresh"}</button></nav></header>
      <div className="report-centre-content">
        {error && <section className="report-centre-alert"><strong>Reports unavailable</strong><span>{error}</span><button onClick={() => void load()}>Try again</button></section>}
        {data?.errors.length ? <section className="report-centre-source-warning"><b>Partial data:</b> {data.errors.map((item) => item.module).join(", ")} could not be loaded. Other database sources remain available.</section> : null}
        <section className="report-centre-metrics">{[
          { label: "All Reports", value: reports.length, detail: "Across all modules" }, { label: "Ready", value: ready, detail: "Available to view or download" },
          { label: "Generating", value: generating, detail: "Currently processing" }, { label: "Scheduled", value: scheduled, detail: "Queued for generation" },
          { label: "Failed", value: failed, detail: "Needs attention" }
        ].map((item) => <article key={item.label}><i>{icons.report}</i><span>{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></article>)}</section>
        <section className="report-centre-overview"><article><header><div><h2>Report Coverage</h2><p>Available evidence by scanner module.</p></div><strong>{reports.length}</strong></header><div className="report-source-bars">{sourceCounts.map((source) => <div key={source.name}><span><b>{source.name}</b><em>{source.count} report{source.count === 1 ? "" : "s"}</em></span><i><b style={{ width: `${reports.length ? Math.max(3, source.count / reports.length * 100) : 0}%` }} /></i></div>)}</div></article><article><header><div><h2>Security Findings</h2><p>Findings recorded in report metadata.</p></div><strong>{totalFindings}</strong></header><dl><div><dt>Critical</dt><dd>{reports.reduce((sum, row) => sum + row.critical, 0)}</dd></div><div><dt>High</dt><dd>{reports.reduce((sum, row) => sum + row.high, 0)}</dd></div><div><dt>Medium</dt><dd>{reports.reduce((sum, row) => sum + row.medium, 0)}</dd></div><div><dt>Low</dt><dd>{reports.reduce((sum, row) => sum + row.low, 0)}</dd></div></dl></article></section>
        <section className="report-centre-library"><header><div><h2>All Security Reports</h2><p>{filtered.length} matching database record{filtered.length === 1 ? "" : "s"} · Updated {date(data?.loadedAt || null)}</p></div><aside><label>{icons.search}<input aria-label="Search reports" onChange={(event) => setSearch(event.target.value)} placeholder="Search report, target, or scan ID" value={search} /></label><select aria-label="Filter module" onChange={(event) => setModule(event.target.value as "All" | ReportModule)} value={module}>{modules.map((item) => <option key={item}>{item === "All" ? "All modules" : item}</option>)}</select><select aria-label="Filter status" onChange={(event) => setStatus(event.target.value as "All" | ReportCentreStatus)} value={status}>{statuses.map((item) => <option key={item}>{item === "All" ? "All statuses" : item}</option>)}</select><select aria-label="Filter date" onChange={(event) => setPeriod(event.target.value)} value={period}><option value="all">All time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></aside></header>
          <div className="report-centre-table-wrap"><table><thead><tr><th>Report</th><th>Module</th><th>Target</th><th>Status</th><th>Findings</th><th>Generated</th><th>Formats</th><th>Actions</th></tr></thead><tbody>{loading ? <tr><td className="report-centre-empty" colSpan={8}><span className="scanner-spinner" /> Loading reports from all modules...</td></tr> : shown.length ? shown.map((report) => <tr key={report.id}><td><strong>{report.name}</strong><small>{report.type}</small><em>{report.scanId}</em></td><td><b className={`module ${report.module.toLowerCase().replaceAll(" ", "-")}`}>{report.module}</b></td><td><span title={report.target}>{report.target || "Not reported"}</span></td><td><i className={`status ${report.status.toLowerCase()}`}>{report.status}</i>{report.status === "Generating" && <small>{report.progress}% complete</small>}</td><td><strong>{report.findings}</strong><small>{report.critical} critical · {report.high} high</small></td><td>{date(report.generatedAt || report.updatedAt)}</td><td><div className="format-list">{report.formats.length ? report.formats.map((format) => <span key={format}>{format.toUpperCase()}</span>) : <em>Pending</em>}</div></td><td><div className="report-row-actions"><button onClick={() => setSelected(report)}>{icons.eye} View</button>{report.formats.map((format) => <button disabled={downloading !== null} key={format} onClick={() => void download(report, format)}>{downloading === `${report.id}-${format}` ? "..." : format.toUpperCase()}</button>)}</div></td></tr>) : <tr><td className="report-centre-empty" colSpan={8}>No reports match the current filters.</td></tr>}</tbody></table></div>
          <footer><span>Showing <b>{filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filtered.length)}</b> of <b>{filtered.length}</b></span><div><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</button><b>{page} / {pages}</b><button disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</button></div></footer>
        </section>
      </div>
      {selected && <div className="report-detail-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section aria-modal="true" role="dialog"><header><div><span>{selected.module}</span><h2>{selected.name}</h2><p>{selected.target || "Target not reported"}</p></div><button aria-label="Close report details" onClick={() => setSelected(null)}>×</button></header><div className="report-detail-body"><div className="report-detail-grid"><article><span>Status</span><strong>{selected.status}</strong></article><article><span>Progress</span><strong>{selected.progress}%</strong></article><article><span>Findings</span><strong>{selected.findings}</strong></article><article><span>Generated</span><strong>{date(selected.generatedAt)}</strong></article></div><section><h3>Report identity</h3><dl><div><dt>Scanner module</dt><dd>{selected.module}</dd></div><div><dt>Assessment type</dt><dd>{selected.type}</dd></div><div><dt>Scan ID</dt><dd>{selected.scanId}</dd></div><div><dt>Target</dt><dd>{selected.target || "Not reported"}</dd></div></dl></section><section><h3>Severity summary</h3><div className="report-detail-severity"><span><b>{selected.critical}</b>Critical</span><span><b>{selected.high}</b>High</span><span><b>{selected.medium}</b>Medium</span><span><b>{selected.low}</b>Low</span></div></section><footer>{selected.viewHref && <Link href={selected.viewHref}>Open module details</Link>}{selected.formats.map((format) => <button disabled={downloading !== null} key={format} onClick={() => void download(selected, format)}>Download {format.toUpperCase()}</button>)}</footer></div></section></div>}
    </section>
  </main>;
}
