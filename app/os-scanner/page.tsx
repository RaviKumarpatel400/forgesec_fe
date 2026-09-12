"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import SubscriptionSidebar from "../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/api-error";
import { toast } from "../../lib/toast";
import { OSScannerService, type OSScannerScan, type OSScannerStartRequest, type SentinelPlatform } from "../../services/os-scanner.service";

const profiles = [
  { value: "quick", label: "Quick", ports: "Common TCP service ports", description: "Usually 5–20 minutes. Best for confirming the complete workflow quickly." },
  { value: "standard", label: "Standard", ports: "TCP 1–1024 + common application ports", description: "Usually 15–60 minutes. Balanced port coverage and vulnerability testing." },
  { value: "deep", label: "Deep + Full", ports: "All IANA assigned TCP", description: "Usually 1–3+ hours. Maximum current TCP port coverage." }
] as const;
const downloads: Array<{ platform: SentinelPlatform; label: string; detail: string }> = [
  { platform: "windows", label: "Windows", detail: ".exe installer" }, { platform: "macos", label: "macOS", detail: ".pkg installer" }, { platform: "linux", label: "Linux", detail: ".deb installer" }
];
const emptyForm: OSScannerStartRequest = { target_ip: "", asset_name: "", scan_name: "", scan_mode: "combined", scan_profile: "quick", endpoint_uuid: "", authentication_type: "unauthenticated", username: "", password: "", private_key: "", private_key_passphrase: "", domain: "", credential_port: 22 };

function Icon({ name }: { name: "download" | "refresh" | "search" | "server" }) {
  const paths: Record<string, ReactNode> = {
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 19h14" /></>, refresh: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 1-2-5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>, server: <><rect x="4" y="4" width="16" height="6" rx="2" /><rect x="4" y="14" width="16" height="6" rx="2" /><path d="M8 7h.01M8 17h.01" /></>
  };
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">{paths[name]}</svg>;
}
function validIp(value: string) { const parts = value.trim().split("."); return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255); }
function date(value?: string | null) { if (!value) return "—"; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString(); }
function downloadBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url); }

export default function OSScannerPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [form, setForm] = useState<OSScannerStartRequest>(emptyForm);
  const [page, setPage] = useState(1); const [search, setSearch] = useState(""); const [status, setStatus] = useState("");
  useEffect(() => { if (!authLoading && !isAuthenticated) window.location.replace(`/login?next=${encodeURIComponent("/os-scanner")}`); }, [authLoading, isAuthenticated]);

  const summaryQuery = useQuery({ enabled: isAuthenticated, queryFn: OSScannerService.summary, queryKey: ["os-scanner", "summary"], refetchInterval: 5_000, retry: false });
  const assetsQuery = useQuery({ enabled: isAuthenticated, queryFn: OSScannerService.assets, queryKey: ["os-scanner", "assets"], retry: false });
  const endpointsQuery = useQuery({ enabled: isAuthenticated, queryFn: OSScannerService.endpoints, queryKey: ["os-scanner", "endpoints"], refetchInterval: 10_000, retry: false });
  const historyQuery = useQuery({ enabled: isAuthenticated, queryFn: () => OSScannerService.history({ page, page_size: 10, ...(search.trim() ? { q: search.trim() } : {}), ...(status ? { status } : {}) }), queryKey: ["os-scanner", "history", page, search, status], refetchInterval: 5_000, retry: false });
  useEffect(() => { if (historyQuery.error) toast.error(getApiErrorMessage(historyQuery.error, "Unable to load OS scan history."), "OS scanner unavailable"); }, [historyQuery.error]);

  async function refresh() { await Promise.all([summaryQuery.refetch(), assetsQuery.refetch(), endpointsQuery.refetch(), historyQuery.refetch()]); }
  async function refreshRuns() { await Promise.all([queryClient.invalidateQueries({ queryKey: ["os-scanner", "summary"] }), queryClient.invalidateQueries({ queryKey: ["os-scanner", "history"] })]); }

  const installerMutation = useMutation({ mutationFn: OSScannerService.installer, onSuccess: ({ blob, filename, platform }) => { downloadBlob(blob, filename); toast.success(`${platform === "windows" ? "Open the installer as Administrator" : "Install the downloaded package"}. Device Ready will appear after its first heartbeat.`, "Sentinel downloaded"); }, onError: (error) => toast.error(getApiErrorMessage(error, "Unable to download Sentinel."), "Download failed") });
  const authorizeMutation = useMutation({ mutationFn: () => OSScannerService.authorize(form.target_ip.trim(), form.asset_name.trim()), onSuccess: async () => { toast.success("The asset is authorized and ready for scanning.", "Asset authorized"); await queryClient.invalidateQueries({ queryKey: ["os-scanner", "assets"] }); }, onError: (error) => toast.error(getApiErrorMessage(error, "Unable to authorize this asset."), "Authorization failed") });
  const startMutation = useMutation({ mutationFn: OSScannerService.start, onSuccess: async (scan) => { toast.success(`${scan.scan_name} is ${scan.status}.`, "OS scan queued"); setForm(emptyForm); await refreshRuns(); }, onError: (error) => toast.error(getApiErrorMessage(error, "Unable to start the OS scan."), "Scan not started") });
  const retryMutation = useMutation({ mutationFn: OSScannerService.retry, onSuccess: async () => { toast.success("The OS scan was queued again.", "Scan retried"); await refreshRuns(); }, onError: (error) => toast.error(getApiErrorMessage(error), "Retry failed") });
  const cancelMutation = useMutation({ mutationFn: OSScannerService.cancel, onSuccess: async () => { toast.success("The scanner is stopping this run.", "Scan cancelled"); await refreshRuns(); }, onError: (error) => toast.error(getApiErrorMessage(error), "Cancel failed") });
  const deleteMutation = useMutation({ mutationFn: OSScannerService.remove, onSuccess: async () => { toast.success("The scan was removed from visible history.", "Scan removed"); await refreshRuns(); }, onError: (error) => toast.error(getApiErrorMessage(error), "Remove failed") });
  const reportMutation = useMutation({ mutationFn: ({ format, reportId }: { format: "json" | "pdf" | "xml"; reportId: string }) => OSScannerService.report(reportId, format), onSuccess: (blob, variables) => downloadBlob(blob, `os-scan-report.${variables.format}`), onError: (error) => toast.error(getApiErrorMessage(error), "Report download failed") });

  const endpoints = endpointsQuery.data ?? []; const readyEndpoints = endpoints.filter((item) => item.ready);
  const effectiveEndpoint = form.endpoint_uuid || (form.scan_mode === "combined" && readyEndpoints.length === 1 ? readyEndpoints[0].agent_uuid : "");
  const selectedEndpoint = endpoints.find((item) => item.agent_uuid === effectiveEndpoint);
  const authorizedAsset = (assetsQuery.data ?? []).find((item) => item.target_ip === form.target_ip.trim() && item.is_authorized);
  const selectedProfile = profiles.find((item) => item.value === form.scan_profile) ?? profiles[0];
  const requiresUser = ["ssh_password", "ssh_private_key", "windows_smb_wmi", "domain"].includes(form.authentication_type);
  const requiresPassword = ["ssh_password", "windows_smb_wmi", "domain"].includes(form.authentication_type);
  const requiresKey = form.authentication_type === "ssh_private_key"; const showsDomain = ["windows_smb_wmi", "domain"].includes(form.authentication_type);
  const userPermissions = new Set((user?.permissions ?? []).map((permission) => String(permission).toLowerCase()));
  const userRoles = new Set((user?.roles ?? []).map((role) => String(role).toLowerCase()));
  const canAuthorize = userPermissions.has("os_asset.authorize") || userRoles.has("superadmin");
  const totals = summaryQuery.data ?? { running: 0, completed: 0, failed: 0, critical: 0, high: 0, medium: 0, low: 0 };
  const rows = historyQuery.data?.results ?? []; const totalPages = Math.max(1, Math.ceil((historyQuery.data?.total ?? 0) / 10));
  const pending = installerMutation.isPending || authorizeMutation.isPending || startMutation.isPending || retryMutation.isPending || cancelMutation.isPending || deleteMutation.isPending;

  function validate() {
    if (!validIp(form.target_ip)) return toast.warning("Enter one valid IPv4 address, for example 192.168.1.25.", "Invalid target"), false;
    if (!form.asset_name.trim() || !form.scan_name.trim()) return toast.warning("Asset name and scan name are required.", "Details required"), false;
    if (form.scan_mode === "combined" && !selectedEndpoint) return toast.warning("Select a registered, ready Sentinel endpoint.", "Endpoint required"), false;
    if (form.scan_mode === "combined" && (!selectedEndpoint?.ready || !selectedEndpoint.privileged || !selectedEndpoint.capabilities.includes("endpoint_inventory_v1"))) return toast.warning("The selected endpoint must be online, ready, and running with Administrator/root privileges.", "Endpoint not ready"), false;
    return true;
  }
  function submit(event: FormEvent) { event.preventDefault(); if (!validate()) return; startMutation.mutate({ ...form, target_ip: form.target_ip.trim(), asset_name: form.asset_name.trim(), scan_name: form.scan_name.trim(), endpoint_uuid: form.scan_mode === "combined" ? effectiveEndpoint : undefined }); }

  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening secure OS scanner workspace…</span></main>;
  return <main className="dashboard-shell subscription-dashboard-shell os-shell"><SubscriptionSidebar active="os-scanner" scannerCount={totals.running} user={user} /><section className="dashboard-workspace os-workspace">
    <header className="dashboard-topbar"><div><span>{user?.tenant?.name || "Security Workspace"}</span><b>/</b><strong>OS Scanner</strong></div><div className="dashboard-top-actions"><button disabled={summaryQuery.isFetching} onClick={refresh} type="button"><Icon name="refresh" />{summaryQuery.isFetching ? "Refreshing…" : "Refresh"}</button></div></header>
    <div className="os-content"><header className="os-heading"><span>Host security</span><h1>OS Scanner</h1><p>OpenVAS-backed host and operating-system vulnerability assessment.</p></header>
      <section className="os-metrics">{(["running", "completed", "failed", "critical", "high", "medium", "low"] as const).map((key) => <article className={key} key={key}><span>{key}</span><strong>{totals[key]}</strong></article>)}</section>
      <section className="os-card os-endpoints"><div><h2>Sentinel Endpoint Setup</h2>{endpointsQuery.isLoading ? <p>Checking for active devices…</p> : endpoints.length ? <div className="os-endpoint-list">{endpoints.map((endpoint) => <span className={endpoint.ready ? "ready" : "waiting"} key={endpoint.agent_uuid}>{endpoint.hostname || endpoint.agent_name}: {endpoint.ready ? "Device Ready" : endpoint.setup_status.replaceAll("_", " ")}</span>)}</div> : <p>No active Sentinel was detected. Install the matching package on the device you want to inventory.</p>}<small>Sentinel is required only for Combined mode. Network-only scans use the central OpenVAS worker.</small></div><div className="os-downloads">{downloads.map((item) => <button disabled={installerMutation.isPending} key={item.platform} onClick={() => installerMutation.mutate(item.platform)} type="button"><Icon name="download" /><span><b>{installerMutation.isPending && installerMutation.variables === item.platform ? "Preparing…" : `Download ${item.label}`}</b><small>{item.detail}</small></span></button>)}</div></section>
      <section className="os-card"><header><h2>New Scan</h2><p>Choose a network-only OpenVAS scan or combine it with deep inventory from a licensed endpoint agent.</p></header><form className="os-form" onSubmit={submit}>
        <label><span>Scan Mode *</span><select onChange={(e) => setForm((v) => ({ ...v, scan_mode: e.target.value as OSScannerStartRequest["scan_mode"], endpoint_uuid: e.target.value === "network" ? "" : v.endpoint_uuid }))} value={form.scan_mode}><option value="combined">Combined (Endpoint + OpenVAS) — Recommended</option><option value="network">Network only (OpenVAS)</option></select></label>
        {form.scan_mode === "combined" && <label className="wide"><span>Licensed Endpoint *</span><select onChange={(e) => { const endpoint = endpoints.find((item) => item.agent_uuid === e.target.value); setForm((v) => ({ ...v, endpoint_uuid: e.target.value, target_ip: endpoint?.local_ip || endpoint?.tunnel_ip || v.target_ip, asset_name: v.asset_name || endpoint?.hostname || endpoint?.agent_name || "" })); }} required value={effectiveEndpoint}><option value="">Select endpoint</option>{readyEndpoints.map((endpoint) => <option key={endpoint.agent_uuid} value={endpoint.agent_uuid}>{endpoint.hostname || endpoint.agent_name} — {endpoint.local_ip || endpoint.tunnel_ip || "IP not reported"} — Device Ready</option>)}</select>{!endpointsQuery.isLoading && !readyEndpoints.length && <small className="warning">Install or start Sentinel and wait until Device Ready appears.</small>}</label>}
        <label><span>Target IP *</span><input onChange={(e) => setForm((v) => ({ ...v, target_ip: e.target.value }))} placeholder="192.168.1.25" required value={form.target_ip} />{authorizedAsset && <small className="success">Authorized asset</small>}</label>
        <label><span>Asset Name *</span><input maxLength={255} onChange={(e) => setForm((v) => ({ ...v, asset_name: e.target.value }))} placeholder="Production Finance Server" required value={form.asset_name} /></label>
        <label><span>Scan Name *</span><input maxLength={255} onChange={(e) => setForm((v) => ({ ...v, scan_name: e.target.value }))} placeholder="Finance Server Security Assessment" required value={form.scan_name} /></label>
        <label><span>Authentication</span><select onChange={(e) => setForm((v) => ({ ...v, authentication_type: e.target.value as OSScannerStartRequest["authentication_type"] }))} value={form.authentication_type}><option value="unauthenticated">No Authentication</option><option value="ssh_password">SSH Username/Password</option><option value="ssh_private_key">SSH Private Key</option><option value="windows_smb_wmi">Windows SMB/WMI</option><option value="domain">Domain Authentication</option></select></label>
        {requiresUser && <label><span>Username *</span><input autoComplete="off" onChange={(e) => setForm((v) => ({ ...v, username: e.target.value }))} required value={form.username} /></label>}{requiresPassword && <label><span>Password *</span><input autoComplete="new-password" onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} required type="password" value={form.password} /></label>}{showsDomain && <label><span>Domain {form.authentication_type === "domain" ? "*" : "(optional)"}</span><input onChange={(e) => setForm((v) => ({ ...v, domain: e.target.value }))} required={form.authentication_type === "domain"} value={form.domain} /></label>}
        {requiresKey && <label className="wide"><span>Private Key *</span><textarea onChange={(e) => setForm((v) => ({ ...v, private_key: e.target.value }))} required rows={4} value={form.private_key} /></label>}{requiresKey && <label><span>Private Key Passphrase</span><input onChange={(e) => setForm((v) => ({ ...v, private_key_passphrase: e.target.value }))} type="password" value={form.private_key_passphrase} /></label>}{["ssh_password", "ssh_private_key"].includes(form.authentication_type) && <label><span>SSH Port</span><input max={65535} min={1} onChange={(e) => setForm((v) => ({ ...v, credential_port: Number(e.target.value) }))} type="number" value={form.credential_port} /></label>}
        <label><span>Scan Profile *</span><select onChange={(e) => setForm((v) => ({ ...v, scan_profile: e.target.value as OSScannerStartRequest["scan_profile"] }))} value={form.scan_profile}>{profiles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><small>{selectedProfile.description}</small></label><label><span>Port Range</span><input readOnly value={selectedProfile.ports} /></label><label><span>Alive / Scan Options</span><input readOnly value="ICMP + ARP + Consider Alive" /></label>
        <footer>{canAuthorize ? <button className="secondary" disabled={authorizeMutation.isPending || Boolean(authorizedAsset)} onClick={() => validate() && authorizeMutation.mutate()} type="button">{authorizedAsset ? "Asset Authorized" : authorizeMutation.isPending ? "Authorizing…" : "Authorize Asset"}</button> : <p>An administrator must authorize a new target before it can be scanned.</p>}<button className="primary" disabled={startMutation.isPending} type="submit">{startMutation.isPending ? "Queuing…" : "Start Scan"}</button></footer>
      </form></section>
      <section className="os-card os-history"><header><div><h2>Scan History</h2><p>Live tenant-scoped OS scan activity and findings.</p></div><div><label><Icon name="search" /><input onChange={(e) => { setPage(1); setSearch(e.target.value); }} placeholder="Search scan, asset or IP" value={search} /></label><select onChange={(e) => { setPage(1); setStatus(e.target.value); }} value={status}><option value="">All statuses</option>{["queued", "preparing", "running", "processing", "completed", "failed", "cancelled"].map((item) => <option key={item}>{item}</option>)}</select></div></header><div className="os-table"><table><thead><tr><th>Scan</th><th>Mode</th><th>Asset</th><th>Target</th><th>Status</th><th>Progress</th><th>Findings</th><th>Started</th><th>Actions</th></tr></thead><tbody>{historyQuery.isLoading ? <tr><td colSpan={9}>Loading scan history…</td></tr> : !rows.length ? <tr><td className="empty" colSpan={9}>No scans match the selected filters.</td></tr> : rows.map((scan) => <ScanRow busy={pending} key={scan.id} onCancel={() => window.confirm(`Stop ${scan.scan_name}?`) && cancelMutation.mutate(scan.id)} onDelete={() => window.confirm(`Remove ${scan.scan_name} from visible history?`) && deleteMutation.mutate(scan.id)} onReport={(format) => scan.reports[0] && reportMutation.mutate({ reportId: scan.reports[0].id, format })} onRetry={() => retryMutation.mutate(scan.id)} scan={scan} />)}</tbody></table></div><footer><span>Total: {historyQuery.data?.total ?? 0}</span><div><button disabled={page <= 1} onClick={() => setPage((v) => v - 1)} type="button">Previous</button><b>Page {page} of {totalPages}</b><button disabled={page >= totalPages} onClick={() => setPage((v) => v + 1)} type="button">Next</button></div></footer></section>
    </div></section></main>;
}

function ScanRow({ busy, onCancel, onDelete, onReport, onRetry, scan }: { busy: boolean; onCancel: () => void; onDelete: () => void; onReport: (format: "pdf" | "json") => void; onRetry: () => void; scan: OSScannerScan }) {
  const active = ["queued", "preparing", "running", "processing"].includes(scan.status); const retry = ["completed", "failed", "cancelled"].includes(scan.status); const report = scan.reports[0];
  return <tr><td><strong>{scan.scan_name}</strong><small>{scan.scan_profile}</small></td><td>{scan.scan_mode}</td><td><strong>{scan.asset_name}</strong><small>{scan.hostname || "Host pending"}</small></td><td>{scan.target_ip}</td><td><span className={`os-status ${scan.status}`}>{scan.status}</span>{scan.error_message && <small title={scan.error_message}>{scan.error_message}</small>}</td><td>{scan.progress}%</td><td><span className="os-findings"><b>{scan.critical_count} critical</b><i>{scan.high_count} high</i><small>{scan.medium_count} medium · {scan.low_count} low</small></span></td><td>{date(scan.started_at)}</td><td><div className="os-actions">{report && <><button onClick={() => onReport("pdf")} type="button">PDF</button><button onClick={() => onReport("json")} type="button">JSON</button></>} {active && <button disabled={busy} onClick={onCancel} type="button">{scan.status === "queued" ? "Cancel" : "Stop"}</button>}<button disabled={!retry || busy} onClick={onRetry} type="button">Retry</button><button className="danger" disabled={busy} onClick={onDelete} type="button">Remove</button></div></td></tr>;
}
