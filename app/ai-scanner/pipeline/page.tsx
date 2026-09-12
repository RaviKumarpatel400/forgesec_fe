"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SubscriptionSidebar from "../../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/api-error";
import { toast } from "../../../lib/toast";
import { AiPentestService, type AiPipeline, type AiPipelineEvent } from "../../../services/ai-pentest.service";

type Level = "all" | "info" | "warning" | "error";
const POLL_MS = 2000;
function Icon({ children }: { children: ReactNode }) { return <svg aria-hidden="true" viewBox="0 0 24 24">{children}</svg>; }
const icons = {
  activity: <Icon><path d="M3 12h4l2-7 4 14 2-7h6" /></Icon>, play: <Icon><path d="m8 5 11 7-11 7V5Z" /></Icon>, refresh: <Icon><path d="M20 7v5h-5M4 17v-5h5" /><path d="M18.5 9A7 7 0 0 0 6 6.5M5.5 15A7 7 0 0 0 18 17.5" /></Icon>,
  download: <Icon><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></Icon>, bolt: <Icon><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" /></Icon>, retry: <Icon><path d="M4 7v5h5" /><path d="M5.5 10A7 7 0 1 1 6 16" /></Icon>, stop: <Icon><rect x="5" y="5" width="14" height="14" rx="2" /></Icon>, terminal: <Icon><path d="m5 7 4 4-4 4M11 17h7" /></Icon>, shield: <Icon><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" /></Icon>
};
function bounded(value: string | null, fallback: number, min: number, max: number) { const parsed = Number.parseInt(value || "", 10); return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback; }
function time(value?: string | null, clockOnly = false) { if (!value) return clockOnly ? "--:--:--" : "Not reported"; const date = new Date(value); if (Number.isNaN(date.getTime())) return value; return clockOnly ? date.toLocaleTimeString([], { hour12: false }) : date.toLocaleString(); }
function mergeEvents(current: AiPipelineEvent[], incoming: AiPipelineEvent[]) { const byId = new Map(current.map((event) => [event.id, event])); incoming.forEach((event) => byId.set(event.id, event)); return [...byId.values()].sort((a, b) => a.id - b.id).slice(-300); }
function statusLabel(value?: string | null) { if (!value) return "Idle"; return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function download(blob: Blob, name: string) { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url); }

function PipelineMonitor() {
  const params = useSearchParams();
  const requestedJobId = (params.get("job_id") || "").trim();
  const autoRequested = ["1", "true", "yes"].includes((params.get("auto_run") || "").toLowerCase());
  const runLimit = bounded(params.get("run_limit"), 1, 1, 5);
  const maxCycles = bounded(params.get("max_cycles"), 3, 1, 10);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<AiPipeline | null>(null);
  const [events, setEvents] = useState<AiPipelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<Level>("all");
  const [stage, setStage] = useState("all");
  const [updated, setUpdated] = useState<string | null>(null);
  const lastEventId = useRef(0);
  const autoStarted = useRef("");
  const logEnd = useRef<HTMLDivElement>(null);

  const apply = useCallback((payload: AiPipeline) => {
    setData(payload); setUpdated(new Date().toISOString()); setError(null);
    if (payload.events?.length) { setEvents((current) => mergeEvents(current, payload.events || [])); lastEventId.current = Math.max(lastEventId.current, ...payload.events.map((event) => event.id)); }
  }, []);
  const load = useCallback(async (manual = false) => {
    manual && setRefreshing(true);
    try { apply(await AiPentestService.getPipeline(requestedJobId || undefined, lastEventId.current || undefined, !loading)); }
    catch (loadError) { setError(getApiErrorMessage(loadError, "Unable to load the live AI pipeline.")); }
    finally { setLoading(false); setRefreshing(false); }
  }, [apply, loading, requestedJobId]);

  useEffect(() => { lastEventId.current = 0; setEvents([]); setData(null); setLoading(true); setError(null); }, [requestedJobId]);
  useEffect(() => { if (paused) return; void load(); const timer = window.setInterval(() => void load(), POLL_MS); return () => window.clearInterval(timer); }, [load, paused]);

  const jobId = data?.job?.id || requestedJobId;
  const doAction = useCallback(async (kind: "next" | "auto" | "retry" | "cancel") => {
    if (!jobId || busy) return;
    if (kind === "cancel" && !window.confirm("Cancel this AI Pentest pipeline?")) return;
    setBusy(kind);
    try {
      const payload = kind === "next" ? await AiPentestService.advancePipeline(jobId) : kind === "auto" ? await AiPentestService.advancePipeline(jobId, { runLimit, maxCycles, untilIdle: true }) : await AiPentestService.controlPipeline(jobId, kind === "retry" ? "retry_failed" : "cancel");
      apply(payload);
      toast.success(kind === "next" ? "Pipeline advanced successfully." : kind === "auto" ? "Bounded pipeline run completed." : kind === "retry" ? "Failed validations were queued again." : "Pipeline cancelled.", "AI Pipeline");
    } catch (actionError) { const message = getApiErrorMessage(actionError, "The pipeline action failed."); setError(message); toast.error(message, "AI Pipeline"); }
    finally { setBusy(null); }
  }, [apply, busy, jobId, maxCycles, runLimit]);
  useEffect(() => { if (!autoRequested || !jobId || autoStarted.current === jobId) return; autoStarted.current = jobId; void doAction("auto"); }, [autoRequested, doAction, jobId]);

  const rows = data?.pipeline || [];
  const completed = rows.filter((row) => row.state === "Completed").length;
  const progress = data?.job?.summary && typeof data.job.summary.progress === "number" ? data.job.summary.progress : rows.length ? Math.round(completed / rows.length * 100) : 0;
  const summary = data?.job?.summary || {};
  const retryable = Number(summary.sandbox_failed_runs || 0) + Number(summary.sandbox_timeout_runs || 0) + Number(summary.sandbox_cancelled_runs || 0);
  const stageOptions = useMemo(() => [...new Set(events.map((event) => event.stage || "general"))], [events]);
  const filtered = useMemo(() => events.filter((event) => { const text = `${event.level} ${event.stage} ${event.message}`.toLowerCase(); return (!search || text.includes(search.toLowerCase())) && (level === "all" || (event.level || "info").toLowerCase() === level) && (stage === "all" || (event.stage || "general") === stage); }), [events, level, search, stage]);
  useEffect(() => { if (autoScroll) logEnd.current?.scrollIntoView({ block: "end" }); }, [autoScroll, filtered]);
  function downloadEvidence() { if (!jobId) return; setBusy("evidence"); void AiPentestService.downloadEvidence(jobId).then((blob) => { download(blob, `ai-pentest-evidence-${jobId.slice(0, 8)}.zip`); toast.success("Evidence bundle downloaded.", "AI Pipeline"); }).catch((downloadError) => toast.error(getApiErrorMessage(downloadError, "Unable to download evidence."), "AI Pipeline")).finally(() => setBusy(null)); }
  function exportLogs() { const content = filtered.map((event) => `[${time(event.created_at, true)}] ${(event.level || "info").toUpperCase()} [${event.stage || "general"}] ${event.message}`).join("\n"); download(new Blob([content], { type: "text/plain" }), `ai-pipeline-${jobId || "activity"}.log`); }

  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening AI pipeline monitor...</span></main>;
  return <main className="dashboard-shell subscription-dashboard-shell ai-monitor-shell"><SubscriptionSidebar active="ai-pipeline" user={user} /><section className="dashboard-workspace ai-monitor-workspace">
    <header className="ai-monitor-topbar"><div><span>{icons.bolt} Live AI Pentester Flow</span><h1>AI Pipeline Monitor</h1></div><nav><a href="/ai-scanner/new-scan">{icons.play} Launch Scan</a><a className="secondary" href="/ai-scanner/reports">{icons.terminal} AI Reports</a><button disabled={!jobId || Boolean(busy)} onClick={downloadEvidence}>{icons.download} Evidence</button><button disabled={!jobId || Boolean(busy)} onClick={() => void doAction("next")}>{icons.bolt} Run Next</button><button disabled={!jobId || Boolean(busy)} onClick={() => void doAction("auto")}>{icons.activity} Auto Run</button><button disabled={!jobId || Boolean(busy) || retryable < 1} onClick={() => void doAction("retry")}>{icons.retry} Retry Failed</button><button className="danger" disabled={!jobId || Boolean(busy) || !data?.is_active} onClick={() => void doAction("cancel")}>{icons.stop} Cancel</button><button aria-label="Refresh pipeline" disabled={refreshing} onClick={() => void load(true)}>{icons.refresh}</button></nav></header>
    <div className="ai-monitor-content">{error && <section className="ai-monitor-alert"><strong>Pipeline feed issue</strong><span>{error}</span><button onClick={() => void load(true)}>Try again</button></section>}
      <section className="ai-monitor-metrics"><article><span>Job status</span><strong>{loading ? "Loading..." : statusLabel(data?.job?.status)}</strong><small>{data?.is_active ? "Live backend feed" : jobId ? "Pipeline is idle" : "No active job"}</small></article><article><span>Current stage</span><strong>{statusLabel(data?.job?.stage)}</strong><small>{completed}/{rows.length} stages complete</small></article><article><span>Progress</span><strong>{Math.round(Number(progress) || 0)}%</strong><small>Backend pipeline progress</small></article><article><span>Events</span><strong>{events.length}</strong><small>Live events received</small></article><article><span>Last update</span><strong>{updated ? time(updated, true) : "--:--:--"}</strong><small>{paused ? "Polling paused" : "Polling every 2s"}</small></article></section>
      <section className="ai-timeline-panel"><header><div><i>{icons.activity}</i><span><h2>Pipeline Timeline</h2><p>Full AI Pentester workflow from ingestion to final validation.</p></span></div><aside><b className={data?.is_active ? "running" : ""}>{data?.is_active ? "Running" : statusLabel(data?.job?.status)}</b><span>Job <strong title={jobId}>{jobId || "No active job"}</strong></span><em>{Math.round(Number(progress) || 0)}%</em></aside></header><div className="ai-monitor-progress"><span style={{ width: `${Math.max(0, Math.min(100, Number(progress) || 0))}%` }} /></div><dl><div><dt>Job ID</dt><dd>{jobId || "No active job"}</dd></div><div><dt>Target</dt><dd>{data?.job?.target_url || "Waiting for scan target"}</dd></div><div><dt>Updated</dt><dd>{time(data?.job?.updated_at || updated)}</dd></div></dl><div className="ai-timeline-scroll">{rows.length ? rows.map((row) => jobId ? <Link aria-label={`Open ${row.stage} details`} className={row.state.toLowerCase()} href={`/ai-scanner/pipeline/${encodeURIComponent(row.key)}?job_id=${encodeURIComponent(jobId)}`} key={row.key}><em>{row.order}</em><i>{icons.shield}</i><h3>{row.stage}</h3><p>{row.detail}</p><b>{row.state}</b></Link> : <article className={row.state.toLowerCase()} key={row.key}><em>{row.order}</em><i>{icons.shield}</i><h3>{row.stage}</h3><p>{row.detail}</p><b>{row.state}</b></article>) : <div className="ai-monitor-empty">{loading ? "Loading pipeline stages..." : "No AI Pentest pipeline has been started for this tenant."}</div>}</div></section>
      <section className="ai-log-panel"><header><div><i>{icons.terminal}</i><span><h2>Live Log Feed</h2><p>{paused ? "Live feed paused" : data?.is_active ? "Polling every 2s" : "Job is not active"}</p></span></div><div><input aria-label="Search live logs" onChange={(event) => setSearch(event.target.value)} placeholder="Search live logs..." value={search} /><select aria-label="Filter log level" onChange={(event) => setLevel(event.target.value as Level)} value={level}><option value="all">All levels</option><option value="info">Info</option><option value="warning">Warning</option><option value="error">Error</option></select><select aria-label="Filter pipeline stage" onChange={(event) => setStage(event.target.value)} value={stage}><option value="all">All stages</option>{stageOptions.map((item) => <option key={item}>{item}</option>)}</select><button onClick={() => setPaused((value) => !value)}>{paused ? "Resume" : "Pause"}</button><button className={autoScroll ? "active" : ""} onClick={() => setAutoScroll((value) => !value)}>Auto</button><button aria-label="Download filtered logs" onClick={exportLogs}>{icons.download}</button></div></header><div className="ai-log-console">{filtered.length ? filtered.map((event) => <div key={event.id}><time>{time(event.created_at, true)}</time><b className={(event.level || "info").toLowerCase()}>{event.level || "Info"}</b><span>[{event.stage || "general"}]</span><p>{event.message}</p></div>) : <div className="ai-monitor-empty">No log entries match the selected filters.</div>}<div ref={logEnd} /></div></section>
    </div></section></main>;
}

export default function PipelinePage() { return <Suspense fallback={<main className="scanner-auth-wait"><span>Opening AI pipeline monitor...</span></main>}><PipelineMonitor /></Suspense>; }


