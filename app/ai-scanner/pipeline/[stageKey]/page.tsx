"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import SubscriptionSidebar from "../../../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../../lib/api-error";
import { toast } from "../../../../lib/toast";
import { AiPentestService, type AiGeneratedScriptRequest, type AiPipelineStageKey, type AiStageArtifact } from "../../../../services/ai-pentest.service";

const STAGES: AiPipelineStageKey[] = ["ingestion", "cve_gate", "standardization", "normalization", "knowledge_match", "sandbox", "log_analysis", "output_validation", "report"];
const COPY: Record<AiPipelineStageKey, { label: string; title: string; description: string }> = {
  ingestion: { label: "Upload", title: "Upload Detail", description: "Scanner file, target, authorization, and original artifact snapshot." },
  cve_gate: { label: "CVE Gate", title: "CVE Gate Detail", description: "Detected CVE IDs and the early-stop decision before deeper processing." },
  standardization: { label: "Standardization", title: "Standardization Detail", description: "Uploaded findings converted into the internal AI Pentester schema." },
  normalization: { label: "Normalization", title: "Normalization Detail", description: "Quality-gated findings after duplicate, noise, and severity filtering." },
  knowledge_match: { label: "KB Match", title: "Knowledge Match Detail", description: "Normalized CVEs matched against the validation script knowledge base." },
  sandbox: { label: "Sandbox", title: "Sandbox Detail", description: "Queued and executed CVE scripts with verdict, stdout, and stderr evidence." },
  log_analysis: { label: "Log Analysis", title: "Log Analysis Detail", description: "Analyzer decisions prepared from sandbox execution evidence." },
  output_validation: { label: "Output Validation", title: "Output Validation Detail", description: "Final decisions combining scanner, KB, sandbox, and analyzer evidence." },
  report: { label: "Report", title: "Report Detail", description: "Final report status and generated validation evidence." }
};

function Icon({ children }: { children: ReactNode }) { return <svg aria-hidden="true" viewBox="0 0 24 24">{children}</svg>; }
const icons = { back: <Icon><path d="m15 18-6-6 6-6" /></Icon>, next: <Icon><path d="m9 18 6-6-6-6" /></Icon>, refresh: <Icon><path d="M20 7v5h-5M4 17v-5h5" /><path d="M18.5 9A7 7 0 0 0 6 6.5M5.5 15A7 7 0 0 0 18 17.5" /></Icon>, bolt: <Icon><path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" /></Icon>, shield: <Icon><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" /></Icon>, file: <Icon><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Icon>, download: <Icon><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></Icon>, copy: <Icon><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></Icon> };
function stageKey(value: string | string[] | undefined): AiPipelineStageKey { const key = Array.isArray(value) ? value[0] : value; return STAGES.includes(key as AiPipelineStageKey) ? key as AiPipelineStageKey : "ingestion"; }
function text(value: unknown): string { if (value === null || value === undefined || value === "") return "Not reported"; if (typeof value === "boolean") return value ? "Yes" : "No"; if (Array.isArray(value)) return value.length ? value.map(text).join(", ") : "None"; if (typeof value === "object") return JSON.stringify(value); return String(value); }
function date(value: unknown) { if (!value) return "Not reported"; const parsed = new Date(String(value)); return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString(); }
function bytes(value: unknown) { const size = Number(value || 0); if (!size) return "0 B"; const units = ["B", "KB", "MB", "GB"]; const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), 3); return `${(size / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`; }
function json(value: unknown) { return JSON.stringify(value && typeof value === "object" ? value : {}, null, 2); }
function save(content: Blob, name: string) { const url = URL.createObjectURL(content); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url); }
function href(key: AiPipelineStageKey, jobId: string) { return `/ai-scanner/pipeline/${key}?job_id=${encodeURIComponent(jobId)}`; }
function columns(key: AiPipelineStageKey) {
  if (key === "knowledge_match") return [["CVE", "cve_id"], ["Status", "match_status"], ["Script", "script_filename"], ["Score", "match_score"], ["Notes", "notes"]];
  if (key === "sandbox") return [["CVE", "cve_id"], ["Status", "status"], ["Verdict", "verdict"], ["Exit", "exit_code"], ["Duration", "duration_ms"]];
  if (key === "log_analysis") return [["CVE", "cve_id"], ["Decision", "validation_status"], ["Confidence", "confidence_label"], ["Evidence", "evidence_summary"], ["Action", "recommended_action"]];
  if (key === "output_validation") return [["CVE", "cve_id"], ["Final decision", "final_decision"], ["Confidence", "confidence_label"], ["Evidence", "evidence_summary"], ["Action", "recommended_action"]];
  if (key === "report") return [["Title", "title"], ["Status", "status"], ["Generated", "generated_at"], ["SHA-256", "sha256"], ["Report ID", "id"]];
  return [["CVE", "cve_id"], ["Status", "status"], ["Severity", "normalized_severity"], ["CVSS", "normalized_cvss_score"], ["Gate", "gate_reason"]];
}

function StageDetail() {
  const params = useParams<{ stageKey?: string | string[] }>();
  const search = useSearchParams();
  const current = stageKey(params.stageKey);
  const jobId = (search.get("job_id") || "").trim();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<Awaited<ReturnType<typeof AiPentestService.getStageDetail>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async (background = false) => { if (!jobId) { setError("Open a pipeline job before viewing stage details."); setLoading(false); return; } background && setRefreshing(true); try { setData(await AiPentestService.getStageDetail(jobId, current, background)); setError(null); } catch (loadError) { const message = getApiErrorMessage(loadError, "Unable to load pipeline stage details."); setError(message); if (!background) toast.error(message, COPY[current].title); } finally { setLoading(false); setRefreshing(false); } }, [current, jobId]);
  useEffect(() => { setLoading(true); void load(); }, [load]);
  useEffect(() => { if (!data?.is_active) return; const timer = window.setInterval(() => void load(true), 2500); return () => window.clearInterval(timer); }, [data?.is_active, load]);
  const run = useCallback(async (action: "next" | "auto" | "retry" | "cancel") => { if (!jobId || busy) return; if (action === "cancel" && !window.confirm("Cancel this AI Pentest pipeline?")) return; setBusy(action); try { const result = action === "next" ? await AiPentestService.advancePipeline(jobId) : action === "auto" ? await AiPentestService.advancePipeline(jobId, { untilIdle: true, maxCycles: 3 }) : await AiPentestService.controlPipeline(jobId, action === "retry" ? "retry_failed" : "cancel"); if (result.success === false) throw new Error(result.error); setData(await AiPentestService.getStageDetail(jobId, current, true)); toast.success(action === "cancel" ? "Pipeline cancelled." : action === "retry" ? "Failed validations queued again." : action === "auto" ? "Bounded pipeline run completed." : "Pipeline advanced.", "AI Pipeline"); } catch (actionError) { toast.error(getApiErrorMessage(actionError, "Pipeline action failed."), "AI Pipeline"); } finally { setBusy(null); } }, [busy, current, jobId]);
  const details = data?.details || {};
  const records = details.records || [];
  const artifacts = details.artifacts || [];
  const requests = details.script_generation_requests || [];
  const summary = Object.entries(details.summary || {}).filter(([, value]) => value !== null && value !== undefined);
  const payloadText = useMemo(() => json(details.json), [details.json]);
  const completed = data?.pipeline.filter((item) => item.state === "Completed").length || 0;
  const progress = data?.pipeline.length ? Math.round(completed / data.pipeline.length * 100) : 0;
  const state = data?.selected_stage?.state || "Waiting";
  const retryable = Number(data?.job?.summary?.sandbox_failed_runs || 0) + Number(data?.job?.summary?.sandbox_timeout_runs || 0) + Number(data?.job?.summary?.sandbox_cancelled_runs || 0);
  const reportId = current === "report" ? String(records[0]?.id || "") : "";
  const tableColumns = columns(current);
  async function resume(request: AiGeneratedScriptRequest) { setBusy(request.id); try { await AiPentestService.resumeGeneratedScript(request.id); toast.success(`${request.cve_id} validation resumed.`, "KB Match"); await load(true); } catch (resumeError) { toast.error(getApiErrorMessage(resumeError, "Unable to resume validation."), "KB Match"); } finally { setBusy(null); } }
  async function downloadReport(format: "json" | "pdf") { if (!reportId) return; setBusy(format); try { save(await AiPentestService.downloadReport(reportId, format), `ai-pentest-${jobId}.${format}`); toast.success(`${format.toUpperCase()} report downloaded.`, "Report"); } catch (downloadError) { toast.error(getApiErrorMessage(downloadError, "Unable to download report."), "Report"); } finally { setBusy(null); } }
  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening pipeline stage details...</span></main>;
  return <main className="dashboard-shell subscription-dashboard-shell ai-stage-shell"><SubscriptionSidebar active="ai-pipeline" user={user} /><section className="dashboard-workspace ai-stage-workspace">
    <header className="ai-stage-topbar"><div><Link href={jobId ? `/ai-scanner/pipeline?job_id=${encodeURIComponent(jobId)}` : "/ai-scanner/pipeline"}>{icons.back} Pipeline</Link><span><i>{icons.shield}</i><b><h1>{COPY[current].title}</h1><small>{COPY[current].description}</small></b></span></div><nav>{data?.navigation.previous && <Link href={href(data.navigation.previous, jobId)}>{icons.back} Previous</Link>}{data?.navigation.next && <Link className="primary" href={href(data.navigation.next, jobId)}>Next {icons.next}</Link>}<button disabled={!jobId || Boolean(busy)} onClick={() => void run("next")}>{icons.bolt} Run Next</button><button disabled={!jobId || Boolean(busy)} onClick={() => void run("auto")}>Auto Run</button><button disabled={!jobId || Boolean(busy) || retryable < 1} onClick={() => void run("retry")}>Retry Failed</button><button className="danger" disabled={!data?.is_active || Boolean(busy)} onClick={() => void run("cancel")}>Cancel</button><button aria-label="Refresh details" disabled={refreshing} onClick={() => void load(true)}>{icons.refresh}</button></nav></header>
    <div className="ai-stage-content">{error && <section className="ai-stage-alert"><strong>Stage detail issue</strong><span>{error}</span><button onClick={() => void load()}>Try again</button></section>}{loading && !data ? <section className="ai-stage-empty">Loading live stage data...</section> : data && <>
      <section className="ai-stage-job"><header><div><small>Job</small><strong title={data.job?.id || jobId}>{data.job?.id || jobId}</strong></div><aside><b className={state.toLowerCase()}>{state}</b><em>{progress}%</em><span>{data.job?.stage || COPY[current].label}</span></aside></header><dl><div><dt>Target</dt><dd>{data.job?.target_url || "Not reported"}</dd></div><div><dt>Status</dt><dd>{data.job?.status || "Not reported"}</dd></div><div><dt>Updated</dt><dd>{date(data.job?.updated_at)}</dd></div></dl><div className="ai-stage-nav">{data.pipeline.map((item) => <Link className={`${item.key === current ? "active " : ""}${item.state.toLowerCase()}`} href={href(item.key as AiPipelineStageKey, jobId)} key={item.key}><small>{item.order}</small><strong>{item.stage}</strong><span>{item.state}</span></Link>)}</div></section>
      <section className="ai-stage-summary">{summary.length ? summary.map(([key, value]) => <article key={key}><small>{key.replaceAll("_", " ")}</small><strong title={text(value)}>{text(value)}</strong></article>) : <div className="ai-stage-empty">This stage has not returned summary values yet.</div>}</section>
      <div className="ai-stage-grid"><section className="ai-stage-panel"><header><i>{icons.file}</i><div><h2>Artifacts</h2><p>Generated files and parser snapshots for this step.</p></div></header>{artifacts.length ? <div className="ai-stage-table artifacts"><div><b>File</b><b>Kind</b><b>Size</b><b>Storage</b></div>{artifacts.map((item: AiStageArtifact) => <div key={item.id}><span title={item.original_filename}>{item.original_filename || item.id}</span><span>{item.artifact_kind}</span><span>{bytes(item.file_size_bytes)}</span><span title={item.storage_path}>{item.storage_path || "Not reported"}</span></div>)}</div> : <div className="ai-stage-empty">No artifact has been produced for this stage yet.</div>}{current === "ingestion" && artifacts[0]?.raw_text_preview && <pre>{artifacts[0].raw_text_preview}</pre>}</section>
      <section className="ai-stage-panel"><header><i>{icons.file}</i><div><h2>JSON Output</h2><p>Current payload returned by the backend.</p></div><aside><button aria-label="Copy JSON" onClick={() => void navigator.clipboard.writeText(payloadText).then(() => toast.success("JSON copied.", COPY[current].label))}>{icons.copy}</button><button aria-label="Download JSON" onClick={() => save(new Blob([payloadText], { type: "application/json" }), `${current}-${jobId}.json`)}>{icons.download}</button></aside></header><pre>{payloadText}</pre></section></div>
      {records.length > 0 && <section className="ai-stage-panel"><header><i>{icons.shield}</i><div><h2>{current === "sandbox" ? "Sandbox Execution Output" : current === "output_validation" ? "Trusted Output Decisions" : "Stage Records"}</h2><p>{records.length} live backend record{records.length === 1 ? "" : "s"} returned.</p></div></header><div className="ai-stage-table records"><div>{tableColumns.map(([label]) => <b key={label}>{label}</b>)}</div>{records.map((record, index) => <div key={String(record.id || record.cve_id || index)}>{tableColumns.map(([label, key]) => <span title={text(record[key])} key={label}>{key === "duration_ms" && record[key] !== undefined ? `${text(record[key])} ms` : text(record[key])}</span>)}</div>)}</div>{current === "sandbox" && records.map((record, index) => <article className="ai-stage-console" key={`console-${index}`}><header><strong>{text(record.cve_id || `Run ${index + 1}`)}</strong><span>{text(record.verdict)}</span></header><div><section><b>STDOUT</b><pre>{text(record.stdout)}</pre></section><section><b>STDERR</b><pre>{text(record.stderr)}</pre></section></div></article>)}</section>}
      {requests.length > 0 && <section className="ai-stage-panel"><header><i>{icons.bolt}</i><div><h2>Script Generation Queue</h2><p>Missing CVEs tracked for Knowledge Hub review.</p></div></header><div className="ai-stage-requests">{requests.map((request) => <article key={request.id}><div><strong>{request.cve_id}</strong><span>{request.status.replaceAll("_", " ")}</span><small>{request.target_url}</small></div><button disabled={busy === request.id || request.status.toLowerCase() !== "approved" || !request.knowledge_base_id} onClick={() => void resume(request)}>Resume Validation</button></article>)}</div></section>}
      {current === "report" && <section className="ai-stage-panel ai-stage-report"><header><i>{icons.download}</i><div><h2>Final Report Downloads</h2><p>Evidence package generated from output validation.</p></div><aside><button disabled={!reportId || Boolean(busy)} onClick={() => void downloadReport("json")}>JSON</button><button className="primary" disabled={!reportId || Boolean(busy)} onClick={() => void downloadReport("pdf")}>PDF</button></aside></header></section>}
      <section className="ai-stage-panel"><header><i>{icons.refresh}</i><div><h2>Stage Events</h2><p>Latest backend activity for this pipeline step.</p></div></header><div className="ai-stage-events">{data.events?.length ? data.events.map((event) => <article key={event.id}><time>{date(event.created_at)}</time><b>{event.level || "Info"}</b><span>{event.stage || "General"}</span><p>{event.message}</p></article>) : <div className="ai-stage-empty">No stage events have been recorded yet.</div>}</div></section>
    </>}</div>
  </section></main>;
}

export default function PipelineStageDetailPage() { return <Suspense fallback={<main className="scanner-auth-wait"><span>Opening pipeline stage details...</span></main>}><StageDetail /></Suspense>; }
