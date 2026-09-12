"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/api-error";
import { toast } from "../../lib/toast";
import { DashboardService, type DashboardRange, type DashboardTrend } from "../../services/dashboard.service";
import { UnifiedAPIService } from "../../services/unified-api.service";

type SourceFilter = "all" | "core" | "web" | "ai";
const runningStatuses = new Set(["active", "in_progress", "processing", "retrying", "running", "started"]);
const pendingStatuses = new Set(["created", "pending", "queued", "scheduled", "waiting"]);
const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
const sourceColors = ["#826fff", "#43bcd0", "#4fc398"];

function MenuIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    overview: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    scanner: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2M5 12h2m10 0h2" /></>,
    network: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" /><path d="m7.8 7 3 8.5M16.2 7l-3 8.5M8 6h8" /></>,
    ai: <><path d="M8 4a4 4 0 0 0-4 4v2a3 3 0 0 0 1 5.2V17a3 3 0 0 0 5 2.2V4.6A4 4 0 0 0 8 4Zm8 0a4 4 0 0 1 4 4v2a3 3 0 0 1-1 5.2V17a3 3 0 0 1-5 2.2V4.6A4 4 0 0 1 16 4Z" /></>,
    report: <><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    account: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    billing: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.5 2.5 0 1 1 3.1 2.4c-.6.3-.8.8-.8 1.6M12 17h.01" /></>,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4m4-4H9" /></>
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function ActionArrow() {
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" /></svg>;
}

function MenuGroup({ badge, icon, label, items }: { badge?: string; icon: string; label: string; items: string[] }) {
  return <details className="dashboard-menu-group" open><summary title={label}><span><i className="dashboard-menu-icon"><MenuIcon name={icon} /></i><span className="dashboard-menu-text">{label}</span></span><span className="dashboard-summary-meta">{badge && <em>{badge}</em>}<b aria-hidden="true">⌄</b></span></summary><div className="dashboard-submenu">{items.map((item) => item === "Web Scanner" ? <Link href="/configuration" key={item}>{item}</Link> : item === "OS Scanner" ? <Link href="/os-scanner" key={item}>{item}</Link> : item === "API Scanner" ? <Link href="/api-scanner" key={item}>{item}</Link> : item === "Hybrid Scanner" ? <Link href="/hybrid-scanner" key={item}>{item}</Link> : <button key={item} type="button">{item}</button>)}</div></details>;
}

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function normalizeStatus(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function sourceValue(row: DashboardTrend, source: SourceFilter): number {
  if (source === "core") return number(row.total_jobs);
  if (source === "web") return number(row.total_web);
  if (source === "ai") return number(row.total_ai);
  return number(row.total_scans ?? number(row.total_jobs) + number(row.total_web) + number(row.total_ai));
}

function sourceMatches(type: string | null | undefined, source: SourceFilter): boolean {
  if (source === "all") return true;
  const normalized = String(type ?? "").toLowerCase();
  if (source === "web") return normalized.includes("web");
  if (source === "ai") return normalized.includes("ai");
  return !normalized.includes("web") && !normalized.includes("ai");
}

function formatPeriod(value: string): string {
  const week = value.match(/^(\d{4})-W(\d{2})$/);
  if (week) return `W${week[2]} '${week[1].slice(2)}`;
  const month = value.match(/^(\d{4})-(\d{2})$/);
  if (month) return new Date(Number(month[1]), Number(month[2]) - 1, 1).toLocaleDateString(undefined, { month: "short", year: "2-digit" });
  return value;
}

function formatTimeAgo(value: string | null | undefined): string {
  if (!value) return "No timestamp";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return value;
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} d ago`;
}

function linePoints(values: number[]) {
  const width = 700;
  const top = 18;
  const bottom = 160;
  const max = Math.max(1, ...values);
  const points = (values.length ? values : [0]).map((value, index, rows) => {
    const x = rows.length === 1 ? width : (index / (rows.length - 1)) * width;
    const y = bottom - (value / max) * (bottom - top);
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const [lastX, lastY] = points[points.length - 1];
  return { area: `0,${bottom} ${line} ${width},${bottom}`, line, lastX, lastY, max };
}

function EmptyState({ children }: { children: ReactNode }) {
  return <div className="dashboard-empty-state">{children}</div>;
}

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [range, setRange] = useState<DashboardRange>("monthly");
  const [source, setSource] = useState<SourceFilter>("all");

  const overviewQuery = useQuery({
    queryKey: ["dashboard", "overview", range],
    queryFn: async () => (await DashboardService.overview(range)).data,
    staleTime: 60_000,
    refetchOnWindowFocus: false
  });
  const queueQuery = useQuery({
    queryKey: ["dashboard", "scan-queue"],
    queryFn: async () => (await DashboardService.scanQueue()).data,
    refetchInterval: 20_000,
    retry: false,
    staleTime: 15_000
  });
  const alertsQuery = useQuery({
    queryKey: ["dashboard", "alerts"],
    queryFn: async () => (await DashboardService.alerts()).data,
    retry: false,
    staleTime: 60_000
  });

  useEffect(() => {
    if (overviewQuery.error) toast.error(getApiErrorMessage(overviewQuery.error, "Unable to load dashboard data."), "Overview unavailable");
  }, [overviewQuery.error]);

  const totals = overviewQuery.data?.totals;
  const allQueue = queueQuery.data?.results ?? [];
  const queue = useMemo(() => allQueue.filter((item) => sourceMatches(item.type, source)), [allQueue, source]);
  const running = allQueue.filter((item) => runningStatuses.has(normalizeStatus(item.status))).length;
  const pending = allQueue.filter((item) => pendingStatuses.has(normalizeStatus(item.status))).length;
  const activities = useMemo(() => (overviewQuery.data?.recent_activity ?? []).filter((item) => sourceMatches(item.source_type, source)), [overviewQuery.data?.recent_activity, source]);
  const trends = overviewQuery.data?.chart ?? [];
  const scanValues = trends.map((row) => sourceValue(row, source));
  const vulnerabilityValues = trends.map((row) => number(row.total_vulnerabilities));
  const chart = linePoints(vulnerabilityValues);
  const currentExposure = vulnerabilityValues.at(-1) ?? 0;
  const previousExposure = vulnerabilityValues.at(-2) ?? 0;
  const exposureChange = previousExposure ? ((currentExposure - previousExposure) / previousExposure) * 100 : null;
  const cves = (alertsQuery.data?.alerts ?? []).flatMap((alert) => alert.cves ?? []);
  const severityCounts = Object.fromEntries(severityOrder.map((severity) => [severity, cves.filter((item) => item.severity === severity).length])) as Record<(typeof severityOrder)[number], number>;
  const severityTotal = severityOrder.reduce((sum, severity) => sum + severityCounts[severity], 0);
  const validatedVulnerable = number(totals?.validated_vulnerable);
  const resolved = number(totals?.validated_not_vulnerable);
  const validationTotal = validatedVulnerable + resolved;
  const resolutionRate = validationTotal ? Math.round((resolved / validationTotal) * 100) : 0;
  const awaitingValidation = Math.max(0, number(totals?.vulnerabilities) - validationTotal);
  const scanMix = [
    { label: "Core scanner", value: number(totals?.jobs) },
    { label: "Web scanner", value: number(totals?.web_scans) },
    { label: "AI Pentest", value: number(totals?.ai_runs) }
  ];
  const scanMixTotal = scanMix.reduce((sum, item) => sum + item.value, 0);
  let mixCursor = 0;
  const mixStops = scanMix.map((item, index) => {
    const start = scanMixTotal ? (mixCursor / scanMixTotal) * 100 : 0;
    mixCursor += item.value;
    const end = scanMixTotal ? (mixCursor / scanMixTotal) * 100 : 0;
    return `${sourceColors[index]} ${start}% ${end}%`;
  });
  const donutStyle: CSSProperties = { background: scanMixTotal ? `conic-gradient(${mixStops.join(",")})` : "#e7eaf0" };
  const maxThroughput = Math.max(1, ...scanValues);
  const displayName = user?.first_name || user?.username || user?.email || "User";
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
  const isLoading = overviewQuery.isLoading || queueQuery.isLoading;
  const isRefreshing = overviewQuery.isFetching || queueQuery.isFetching || alertsQuery.isFetching;
  const platformHealthy = !overviewQuery.isError && !queueQuery.isError;
  const metrics = [
    { label: "Protected Applications", value: number(totals?.applications), change: `${scanMixTotal} scans recorded`, tone: "violet" },
    { label: "Active Scans", value: running + pending, change: `${running} running · ${pending} queued`, tone: "cyan" },
    { label: "Verified Risks", value: validatedVulnerable, change: `${number(totals?.vulnerabilities)} findings detected`, tone: "orange" },
    { label: "Not Exploitable", value: resolved, change: `${resolutionRate}% of validation decisions`, tone: "green" }
  ];

  async function refresh() {
    await Promise.all([overviewQuery.refetch(), queueQuery.refetch(), alertsQuery.refetch()]);
  }

  async function handleLogout(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await UnifiedAPIService.auth.logout();
    } finally {
      queryClient.clear();
      window.localStorage.removeItem("forgesec_authenticated");
      window.dispatchEvent(new Event("forgesec-auth-change"));
      window.location.replace("/login");
    }
  }

  return <main className={`dashboard-shell${collapsed ? " sidebar-collapsed" : ""}`}>
    <aside className="dashboard-sidebar">
      <header className="dashboard-brand">
        <Link href="/" aria-label="Forge-Sec home"><Image alt="Forge-Sec" className="dashboard-logo-full" height={166} priority src="/images/logo1.png" width={166} /><span aria-hidden="true" className="dashboard-logo-icon">FS</span></Link>
        <div><span>{user?.tenant?.name || "Security Workspace"}</span></div>
        <button aria-label={collapsed ? "Open sidebar" : "Close sidebar"} className="dashboard-collapse" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Open sidebar" : "Close sidebar"} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d={collapsed ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} /></svg></button>
      </header>
      <nav className="dashboard-navigation" aria-label="Dashboard navigation">
        <span className="dashboard-nav-label">Workspace</span>
        <Link className="dashboard-main-link active" href="/dashboard" title="Overview"><i className="dashboard-menu-icon"><MenuIcon name="overview" /></i><span className="dashboard-menu-text">Overview</span></Link>
        <MenuGroup badge={String(running + pending)} icon="scanner" items={["Web Scanner", "OS Scanner", "Hybrid Scanner", "API Scanner"]} label="Scanners" />
        <details className="dashboard-menu-group">
          <summary title="Network Scanner"><span><i className="dashboard-menu-icon"><MenuIcon name="network" /></i><span className="dashboard-menu-text">Network Scanner</span></span><span className="dashboard-summary-meta"><b aria-hidden="true">v</b></span></summary>
          <div className="dashboard-submenu"><Link href="/network-scanner">Network Overview</Link><Link href="/network-scanner/inventory">Network Inventory</Link><Link href="/network-scanner/agents">Network Agents</Link></div>
        </details>
        <span className="dashboard-nav-label dashboard-nav-divider">Intelligence</span>
        <MenuGroup badge="AI" icon="ai" items={["AI Overview", "Launch Scan", "Pipeline", "Vulnerabilities", "AI Reports", "Knowledge Hub"]} label="AI Pentest" />
        <button className="dashboard-main-link" title="Report Centre" type="button"><i className="dashboard-menu-icon"><MenuIcon name="report" /></i><span className="dashboard-menu-text">Report Centre</span></button>
        <span className="dashboard-nav-label dashboard-nav-divider">Management</span>
        <Link className="dashboard-main-link" href="/subscription" title="Billing & Cost Management"><i className="dashboard-menu-icon"><MenuIcon name="billing" /></i><span className="dashboard-menu-text">Billing &amp; Cost Management</span></Link>
        <details className="dashboard-menu-group" open><summary title="Account"><span><i className="dashboard-menu-icon"><MenuIcon name="account" /></i><span className="dashboard-menu-text">Account</span></span><span className="dashboard-summary-meta"><b aria-hidden="true">v</b></span></summary><div className="dashboard-submenu"><button type="button">Plan &amp; Usage</button><Link href="/change-password">Change Password</Link><button type="button">Profile &amp; Settings</button></div></details>
      </nav>
      <footer className="dashboard-sidebar-footer">
        <div className="dashboard-user"><span>{initials}</span><div><strong>{displayName}</strong><small>{user?.email || "Authenticated user"}</small></div><i /></div>
        <div className="dashboard-footer-actions"><button type="button"><MenuIcon name="help" /><span>Support</span></button><Link aria-disabled={isLoggingOut} href="/login" onClick={handleLogout}><MenuIcon name="logout" /><span>{isLoggingOut ? "Signing out..." : "Log out"}</span></Link></div>
      </footer>
    </aside>

    <section className="dashboard-workspace" aria-label="Dashboard overview">
      <header className="dashboard-topbar">
        <div><span>{user?.tenant?.name || "Security Workspace"}</span><b>/</b><strong>Overview</strong></div>
        <div className="dashboard-top-actions"><button disabled={isRefreshing} onClick={refresh} type="button">{isRefreshing ? "Refreshing…" : "Refresh data"}</button><button className="dashboard-launch" type="button"><span>Launch Scan</span><i className="dashboard-launch-icon"><ActionArrow /></i></button></div>
      </header>

      <div className="dashboard-content">
        <header className="dashboard-overview-head">
          <div><span>Security posture overview</span><h1>Welcome Back, {displayName}</h1><p>Live tenant-scoped security coverage, validation outcomes, and scanning activity.</p></div>
          <div className={`dashboard-health${platformHealthy ? "" : " is-degraded"}`}><i /><span><small>Data status</small><strong>{platformHealthy ? "Backend connected" : "Some data unavailable"}</strong></span></div>
        </header>

        <div className="dashboard-filter-bar">
          <label><span>Time range</span><select aria-label="Dashboard time range" onChange={(event) => setRange(event.target.value as DashboardRange)} value={range}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
          <label><span>Scanner source</span><select aria-label="Dashboard scanner source" onChange={(event) => setSource(event.target.value as SourceFilter)} value={source}><option value="all">All sources</option><option value="core">Core scanner</option><option value="web">Web scanner</option><option value="ai">AI Pentest</option></select></label>
          <small>{overviewQuery.data?.meta?.range ? `Showing ${overviewQuery.data.meta.range} database aggregates` : "Loading database aggregates"}</small>
        </div>

        <div className="dashboard-metrics">{metrics.map((metric) => <article className={`dashboard-metric dashboard-metric-${metric.tone}`} key={metric.label}><header><span>{metric.label}</span><i /></header><strong>{isLoading ? "—" : formatNumber(metric.value)}</strong><footer>{isLoading ? "Loading live data" : metric.change}</footer></article>)}</div>

        <div className="dashboard-primary-grid">
          <article className="dashboard-panel dashboard-exposure-panel">
            <header><div><span>Exposure trend</span><h2>Vulnerability Movement</h2></div><b>{range}</b></header>
            <div className="dashboard-chart-summary"><div><small>Findings in latest period</small><strong>{isLoading ? "—" : formatNumber(currentExposure)}</strong></div><span>{exposureChange === null ? "No previous period" : `${exposureChange > 0 ? "↑" : exposureChange < 0 ? "↓" : "→"} ${Math.abs(exposureChange).toFixed(1)}% from previous period`}</span></div>
            <div className="dashboard-line-chart">
              <div className="dashboard-chart-labels"><span>{formatNumber(chart.max)}</span><span>{formatNumber(Math.round(chart.max * .75))}</span><span>{formatNumber(Math.round(chart.max * .5))}</span><span>0</span></div>
              <svg aria-label="Database vulnerability trend" preserveAspectRatio="none" role="img" viewBox="0 0 700 190"><defs><linearGradient id="riskArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#8976ff" stopOpacity=".34" /><stop offset="1" stopColor="#8976ff" stopOpacity="0" /></linearGradient></defs><polygon className="dashboard-chart-area" points={chart.area} /><polyline className="dashboard-chart-line" points={chart.line} /><circle cx={chart.lastX} cy={chart.lastY} r="5" /></svg>
              <div className="dashboard-chart-dates">{trends.length ? trends.map((row) => <span key={row.period_label}>{formatPeriod(row.period_label)}</span>) : <span>No trend data</span>}</div>
            </div>
          </article>

          <article className="dashboard-panel dashboard-coverage-panel">
            <header><div><span>Scanner coverage</span><h2>Scan Activity Mix</h2></div><b>{formatNumber(scanMixTotal)} total</b></header>
            <div className="dashboard-donut" style={donutStyle}><div><strong>{formatNumber(scanMixTotal)}</strong><span>Scans</span></div></div>
            <ul>{scanMix.map((item, index) => <li key={item.label}><i style={{ background: sourceColors[index] }} /><span>{item.label}</span><strong>{formatNumber(item.value)}</strong></li>)}</ul>
          </article>
        </div>

        <div className="dashboard-insights-grid">
          <article className="dashboard-panel dashboard-severity-panel">
            <header><div><span>Latest scan risk composition</span><h2>Findings by Severity</h2></div><b>{formatNumber(severityTotal)} total</b></header>
            <div className="dashboard-severity-total"><strong>{formatNumber(severityCounts.CRITICAL + severityCounts.HIGH)}</strong><span>critical and high findings</span></div>
            <div className="dashboard-severity-bar">{severityOrder.map((severity) => <i className={severity.toLowerCase()} key={severity} style={{ width: `${severityTotal ? (severityCounts[severity] / severityTotal) * 100 : 0}%` }} />)}</div>
            <ul>{severityOrder.map((severity) => <li key={severity}><i className={severity.toLowerCase()} />{severity[0] + severity.slice(1).toLowerCase()} <b>{formatNumber(severityCounts[severity])}</b></li>)}</ul>
          </article>

          <article className="dashboard-panel dashboard-throughput-panel">
            <header><div><span>Scanner activity</span><h2>Scan Throughput</h2></div><b>{formatNumber(scanValues.reduce((sum, value) => sum + value, 0))} scans</b></header>
            {trends.length ? <div className="dashboard-mini-bars" aria-label="Scan throughput by period">{trends.map((row, index) => <div key={`${row.period_label}-${index}`}><i style={{ height: `${Math.max(4, (scanValues[index] / maxThroughput) * 100)}%` }} /><span>{formatPeriod(row.period_label)}</span></div>)}</div> : <EmptyState>No scan activity for this range.</EmptyState>}
            <footer><span><b>{formatNumber(running)}</b> running</span><span><b>{formatNumber(pending)}</b> queued</span></footer>
          </article>

          <article className="dashboard-panel dashboard-remediation-panel">
            <header><div><span>Validation outcomes</span><h2>Resolution Performance</h2></div><b>{formatNumber(validationTotal)} decisions</b></header>
            <div className="dashboard-resolution-ring" style={{ background: `conic-gradient(#52c39b 0 ${resolutionRate}%,#e8ebef ${resolutionRate}% 100%)` }}><div><strong>{resolutionRate}%</strong><span>Not exploitable</span></div></div>
            <dl><div><dt>Verified exploitable</dt><dd>{formatNumber(validatedVulnerable)}</dd></div><div><dt>Not exploitable</dt><dd>{formatNumber(resolved)}</dd></div><div><dt>Awaiting validation</dt><dd>{formatNumber(awaitingValidation)}</dd></div></dl>
          </article>
        </div>

        <div className="dashboard-secondary-grid">
          <article className="dashboard-panel dashboard-findings-panel">
            <header><div><span>Needs attention</span><h2>Priority Findings</h2></div><b>Latest scan</b></header>
            <div className="dashboard-findings-list">{cves.length ? cves.slice(0, 5).map((finding) => <div key={`${finding.severity}-${finding.id}`}><span className={`severity-${finding.severity.toLowerCase()}`}>{finding.severity}</span><div><strong>{finding.id}</strong><small>{finding.description}</small></div><time>Latest</time></div>) : <EmptyState>No priority findings returned by the latest scan.</EmptyState>}</div>
          </article>
          <article className="dashboard-panel dashboard-scans-panel">
            <header><div><span>Live activity</span><h2>Recent Scan Queue</h2></div><b>{formatNumber(queue.length)} records</b></header>
            <div className="dashboard-scans-list">{queue.length ? queue.slice(0, 5).map((scan) => <div key={scan.id}><i className={`scan-${normalizeStatus(scan.status)}`} /><div><strong>{scan.target}</strong><small>{scan.type}</small></div><span><b>{scan.action || scan.status}</b><small>{scan.initiatedBy}</small></span></div>) : <EmptyState>No scans match the selected source.</EmptyState>}</div>
          </article>
        </div>

        <article className="dashboard-panel dashboard-activity-panel">
          <header><div><span>Database activity</span><h2>Recent Security Activity</h2></div><b>{formatNumber(activities.length)} shown</b></header>
          <div className="dashboard-activity-table">{activities.length ? <table><thead><tr><th>Finding or scan</th><th>Application</th><th>Source</th><th>When</th></tr></thead><tbody>{activities.slice(0, 10).map((activity, index) => <tr key={activity.investigation_id || `${activity.timestamp}-${index}`}><td><strong>{activity.vulnerability_name || activity.summary || "Security activity"}</strong><small>{activity.summary && activity.summary !== activity.vulnerability_name ? activity.summary : ""}</small></td><td>{activity.application_name || "Unassigned"}</td><td>{String(activity.source_type || "activity").replaceAll("_", " ")}</td><td>{formatTimeAgo(activity.timestamp || activity.updated_at)}</td></tr>)}</tbody></table> : <EmptyState>No recent security activity for this filter.</EmptyState>}</div>
        </article>
      </div>
    </section>
  </main>;
}
