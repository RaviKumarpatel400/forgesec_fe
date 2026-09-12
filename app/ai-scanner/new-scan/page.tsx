"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import SubscriptionSidebar from "../../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../../hooks/useAuth";
import { getApiErrorMessage } from "../../../lib/api-error";
import { toast } from "../../../lib/toast";
import { AiPentestService } from "../../../services/ai-pentest.service";

type UploadFormat = "json" | "csv" | "sql";
type FileSummary = { cves: string[]; format: UploadFormat };
const CVE_PATTERN = /\bCVE-\d{4}-\d{4,}\b/gi;
const ACCEPT = ".json,.csv,.sql,application/json,text/csv,text/plain,application/sql,application/x-sql";
const WORKFLOW = [{ label: "Ingestion", detail: "Load scanner export" }, { label: "CVE extraction", detail: "Find CVE identifiers" }, { label: "Standardization", detail: "Convert to internal JSON" }, { label: "KB lookup", detail: "Match known CVEs" }, { label: "Report", detail: "Publish evidence" }];

function Icon({ children }: { children: ReactNode }) { return <svg aria-hidden="true" viewBox="0 0 24 24">{children}</svg>; }
const icons = {
  spark: <Icon><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /></Icon>,
  shield: <Icon><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></Icon>,
  file: <Icon><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Icon>,
  upload: <Icon><path d="M12 16V4m0 0L8 8m4-4 4 4" /><path d="M5 14v5h14v-5" /></Icon>,
  play: <Icon><path d="m8 5 11 7-11 7V5Z" /></Icon>,
  reset: <Icon><path d="M4 6v5h5" /><path d="M5.5 10A7 7 0 1 1 6 16" /></Icon>
};
function initialName() { const now = new Date(); return `AI validation - ${now.toLocaleDateString([], { day: "2-digit", month: "short" })} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`; }
function formatBytes(size: number) { return size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(2)} MB`; }
function validUrl(value: string) { try { const parsed = new URL(value.trim()); return parsed.protocol === "http:" || parsed.protocol === "https:"; } catch { return false; } }
function formatOf(file: File): UploadFormat | null { const name = file.name.toLowerCase(); if (name.endsWith(".json") || file.type === "application/json") return "json"; if (name.endsWith(".csv") || file.type === "text/csv") return "csv"; if (name.endsWith(".sql") || ["application/sql", "application/x-sql"].includes(file.type)) return "sql"; return null; }

export default function AiNewScanPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [scanName, setScanName] = useState(initialName);
  const [targetUrl, setTargetUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileSummary, setFileSummary] = useState<FileSummary | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => { setScanName(initialName()); setTargetUrl(""); setFile(null); setFileSummary(null); setAuthorized(false); setAutoRun(true); setDragging(false); setError(null); if (inputRef.current) inputRef.current.value = ""; }, []);
  const acceptFile = useCallback(async (nextFile: File | null) => {
    if (!nextFile) return;
    const format = formatOf(nextFile);
    if (!format) { setFile(null); setFileSummary(null); setError("Unsupported file type. Upload one JSON, CSV, or SQL scanner export."); toast.warning("Upload a JSON, CSV, or SQL scanner export.", "Unsupported file"); return; }
    try {
      const content = await nextFile.text();
      if (format === "json") JSON.parse(content);
      const cves = [...new Set((content.match(CVE_PATTERN) ?? []).map((value) => value.toUpperCase()))];
      setFile(nextFile); setFileSummary({ format, cves }); setError(cves.length ? null : "No CVE ID was found in the uploaded report. The scan cannot proceed.");
      if (!cves.length) toast.warning("The selected report does not contain a CVE identifier.", "CVE required");
    } catch { setFile(null); setFileSummary(null); setError(format === "json" ? "The selected file is not valid JSON." : "Unable to read the selected scanner export."); toast.error("The selected scanner report could not be read.", "Invalid report"); }
  }, []);
  const onFile = (event: ChangeEvent<HTMLInputElement>) => void acceptFile(event.target.files?.[0] ?? null);
  const onDrop = (event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files.length !== 1) { setError("Upload exactly one scanner export file."); return; } void acceptFile(event.dataTransfer.files[0]); };
  const targetReady = validUrl(targetUrl);
  const checks = useMemo(() => [{ label: "Scan name", ready: Boolean(scanName.trim()) }, { label: "Scanner evidence", ready: Boolean(file) }, { label: "CVE requirement", ready: Boolean(fileSummary?.cves.length) }, { label: "Target URL", ready: targetReady }, { label: "Authorization", ready: authorized }], [authorized, file, fileSummary, scanName, targetReady]);
  const readyCount = checks.filter((item) => item.ready).length;
  const ready = readyCount === checks.length;
  const readiness = Math.round(readyCount / checks.length * 100);

  async function launch() {
    if (!ready || !file) { const message = !scanName.trim() ? "Provide a scan name." : !file ? "Upload one supported scanner report." : !fileSummary?.cves.length ? "The report must contain at least one CVE ID." : !targetReady ? "Enter a valid HTTP or HTTPS target URL." : "Confirm authorization before launch."; setError(message); toast.warning(message, "Launch requirements incomplete"); return; }
    setLaunching(true); setError(null);
    try {
      const response = await AiPentestService.launch(file, { scanName, targetUrl, authorizationConfirmed: authorized, autoRunAfterLaunch: autoRun, autoRunLimit: 1, autoRunMaxCycles: 3 });
      const jobId = response.data?.job_id;
      toast.success(jobId ? `AI validation ${jobId.slice(0, 8)} was accepted.` : "AI validation was accepted.", "Validation launched");
      router.push(response.data?.pipeline_url || (jobId ? `/ai-scanner/pipeline?job_id=${encodeURIComponent(jobId)}` : "/ai-scanner/pipeline"));
    } catch (launchError) { const message = getApiErrorMessage(launchError, "Unable to launch AI validation."); setError(message); toast.error(message, "Launch failed"); }
    finally { setLaunching(false); }
  }

  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening AI Pentest launch workspace...</span></main>;
  return <main className="dashboard-shell subscription-dashboard-shell ai-launch-shell">
    <SubscriptionSidebar active="ai-launch" user={user} />
    <section className="dashboard-workspace ai-launch-workspace">
      <header className="ai-launch-topbar"><div><span>{icons.spark} AI Pentester Launch</span><h1>Launch AI Validation</h1></div><div><button onClick={() => router.push("/ai-scanner/pipeline")} type="button">Open Pipeline</button><button onClick={() => router.push("/ai-scanner/reports")} type="button">AI Reports</button><button aria-label="Reset scan form" onClick={reset} type="button">{icons.reset}</button><div className="ai-launch-profile"><b>{(user?.username || user?.email || "F")[0]?.toUpperCase()}</b><span><strong>{user?.username || user?.email || "ForgeSec User"}</strong><small>Profile</small></span></div></div></header>
      <div className="ai-launch-content">
        {error && <div className="ai-launch-alert" role="alert"><strong>Launch blocked</strong><span>{error}</span></div>}
        <section className="ai-launch-hero"><div><span>{icons.shield} CVE Report + Target Validation</span><h2>Validate external findings against an approved application.</h2><p>Extract CVEs, match the knowledgebase, run controlled validation checks, and generate evidence.</p><div>{["JSON / CSV / SQL", "CVE required", "Target URL", "Authorized scope"].map((item) => <b key={item}>✓ {item}</b>)}</div></div><aside><header><div><span>Launch readiness</span><strong>{readiness}% <small>{readyCount} of {checks.length} checks ready</small></strong></div><b>{ready ? "Ready to launch" : "Setup needed"}</b></header><div className="ai-readiness-bar"><span style={{ width: `${readiness}%` }} /></div><div className="ai-readiness-checks">{checks.map((item) => <article className={item.ready ? "ready" : "needed"} key={item.label}><i>{icons.shield}</i><span><strong>{item.label}</strong><small>{item.ready ? "Ready" : "Needed"}</small></span><b /></article>)}</div></aside></section>
        <div className="ai-launch-grid"><section className="ai-launch-card"><header><i>{icons.file}</i><div><h2>Validation Setup</h2><p>Enter scan details, target URL, and scanner report before launch.</p></div></header><div className="ai-launch-form"><div className="ai-launch-fields"><label><span>Scan name</span><input onChange={(event) => { setScanName(event.target.value); setError(null); }} placeholder="External scanner report analysis" value={scanName} /></label><label><span>Authorized target URL</span><input onChange={(event) => { setTargetUrl(event.target.value); setError(null); }} placeholder="https://staging.example.com" type="url" value={targetUrl} /><small>{targetUrl && !targetReady ? "Use http:// or https://." : "Enter the authorized application URL to validate."}</small></label></div><section className="ai-upload-section"><header><i>{icons.file}</i><div><h3>Scanner Report Source</h3><p>Upload one scanner export containing CVE IDs.</p></div><b>JSON / CSV / SQL</b></header><label className={`ai-dropzone${dragging ? " dragging" : ""}${file ? " selected" : ""}`} htmlFor="ai-scanner-file" onDragLeave={() => setDragging(false)} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDrop={onDrop}><input accept={ACCEPT} id="ai-scanner-file" onChange={onFile} ref={inputRef} type="file" /><i>{file ? icons.shield : icons.upload}</i><strong>{file ? file.name : "Drop or browse scanner file"}</strong><span>{file ? `${fileSummary?.format.toUpperCase()} · ${formatBytes(file.size)} · ${fileSummary?.cves.length ?? 0} CVE ID(s) detected` : "One .json, .csv, or .sql export containing at least one CVE ID."}</span>{file && <button onClick={(event) => { event.preventDefault(); setFile(null); setFileSummary(null); if (inputRef.current) inputRef.current.value = ""; }} type="button">Remove file</button>}</label></section></div></section>
          <aside className="ai-launch-confirm"><header><span>{icons.shield} Launch Validation</span><h2>Confirm scope before launch.</h2><p>The backend extracts CVEs, matches the knowledgebase, and validates the approved target.</p><label><input checked={authorized} onChange={(event) => { setAuthorized(event.target.checked); setError(null); }} type="checkbox" />I confirm this target is authorized for validation.</label><label><input checked={autoRun} onChange={(event) => setAutoRun(event.target.checked)} type="checkbox" />Start bounded Auto Run after launch.</label><button disabled={!ready || launching} onClick={launch} type="button">{icons.play}{launching ? "Launching..." : "Launch Validation"}</button></header><dl><div><dt>Source</dt><dd>{fileSummary ? `${fileSummary.format.toUpperCase()} file upload` : "JSON / CSV / SQL upload"}</dd></div><div><dt>File</dt><dd>{file ? `${file.name} (${formatBytes(file.size)})` : "Not selected"}</dd></div><div><dt>CVEs</dt><dd>{fileSummary?.cves.length ? `${fileSummary.cves.length} unique: ${fileSummary.cves.slice(0, 3).join(", ")}${fileSummary.cves.length > 3 ? "..." : ""}` : "None detected"}</dd></div><div><dt>Target</dt><dd>{targetUrl || "Not provided"}</dd></div><div><dt>Authorization</dt><dd>{authorized ? "Confirmed" : "Required"}</dd></div><div><dt>Auto run</dt><dd>{autoRun ? "Enabled · 3 bounded cycles" : "Off · monitor only"}</dd></div></dl></aside></div>
        <section className="ai-after-launch"><header><i>{icons.spark}</i><div><h2>After launch</h2><p>The pipeline opens with the returned job ID and monitors backend processing.</p></div></header><div>{WORKFLOW.map((step, index) => <article key={step.label}><b>{String(index + 1).padStart(2, "0")}</b><strong>{step.label}</strong><span>{step.detail}</span></article>)}</div></section>
      </div>
    </section>
  </main>;
}

