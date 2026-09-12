"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import SubscriptionSidebar from "../../components/dashboard/SubscriptionSidebar";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/api-error";
import { toast } from "../../lib/toast";
import {
  WebScannerService,
  type WebScannerTarget,
  type WebScannerTargetInput
} from "../../services/web-scanner.service";

const terminalStatuses = new Set(["completed", "partial", "failed", "cancelled"]);
const emptyForm = {
  name: "",
  url: "",
  clientId: "",
  environment: "production",
  includePaths: "/*",
  excludePaths: "",
  allowActive: false,
  attested: false
};

type TargetForm = typeof emptyForm;

function Icon({ name }: { name: "add" | "close" | "globe" | "refresh" | "search" | "shield" }) {
  const paths = {
    add: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    refresh: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 1-2-5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4 4" /></>,
    shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-5" /></>
  };
  return <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function pathList(value: string, fallback: string[] = []): string[] {
  const entries = value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  return entries.length ? entries : fallback;
}

function formatDate(value: string | null): string {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusLabel(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function limitValue(key: string, value: number): string {
  if (key === "max_duration_seconds") return `${Math.round(value / 60)} min`;
  if (key === "max_response_bytes") return value >= 1024 * 1024 ? `${Math.round(value / 1024 / 1024)} MiB` : `${Math.round(value / 1024)} KiB`;
  if (key === "max_requests_per_second") return `${value}/sec`;
  return value.toLocaleString();
}

export default function WebScannerPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<WebScannerTarget | null>(null);
  const [form, setForm] = useState<TargetForm>(emptyForm);
  const [reviewTarget, setReviewTarget] = useState<WebScannerTarget | null>(null);
  const [launchTarget, setLaunchTarget] = useState<WebScannerTarget | null>(null);
  const [launchMode, setLaunchMode] = useState<"safe" | "active">("safe");
  const [activeAcknowledged, setActiveAcknowledged] = useState(false);
  const [activeConfirmation, setActiveConfirmation] = useState("");

  const targetsQuery = useQuery({
    enabled: isAuthenticated,
    queryFn: WebScannerService.listTargets,
    queryKey: ["web-scanner", "targets"],
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    retry: false
  });
  const clientsQuery = useQuery({
    enabled: isAuthenticated,
    queryFn: WebScannerService.listClients,
    queryKey: ["web-scanner", "clients"],
    staleTime: 60_000,
    retry: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.replace(`/login?next=${encodeURIComponent("/configuration")}`);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (targetsQuery.error) toast.error(getApiErrorMessage(targetsQuery.error, "Unable to load websites."), "Web scanner unavailable");
  }, [targetsQuery.error]);

  const saveMutation = useMutation({
    mutationFn: async (input: WebScannerTargetInput) => editing
      ? WebScannerService.updateTarget(editing.id, input)
      : WebScannerService.createTarget(input),
    onSuccess: async () => {
      toast.success(editing ? "Website settings were updated." : "Website added. Permission review is required before its first scan.", editing ? "Website updated" : "Website added");
      setIsFormOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await queryClient.invalidateQueries({ queryKey: ["web-scanner", "targets"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to save this website."), "Website not saved")
  });
  const verifyMutation = useMutation({
    mutationFn: WebScannerService.verifyTarget,
    onSuccess: async () => {
      toast.success("Website authorization is verified and ready for scanning.", "Permission verified");
      setReviewTarget(null);
      await queryClient.invalidateQueries({ queryKey: ["web-scanner", "targets"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to verify this website."), "Verification failed")
  });
  const launchMutation = useMutation({
    mutationFn: ({ mode, targetId }: { mode: "safe" | "active"; targetId: string }) => WebScannerService.launchScan(targetId, mode),
    onSuccess: async (scan) => {
      toast.success(`Scan ${scan.id ? scan.id.slice(0, 8) : "request"} was accepted and is ${scan.status}.`, "Scan launched");
      setLaunchTarget(null);
      setLaunchMode("safe");
      setActiveAcknowledged(false);
      setActiveConfirmation("");
      await queryClient.invalidateQueries({ queryKey: ["web-scanner", "targets"] });
      if (scan.id) window.location.assign(`/scan?scanId=${encodeURIComponent(scan.id)}`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to launch this scan."), "Scan not launched")
  });
  const deleteMutation = useMutation({
    mutationFn: WebScannerService.deleteTarget,
    onSuccess: async () => {
      toast.success("The website was removed from the scanner workspace.", "Website removed");
      await queryClient.invalidateQueries({ queryKey: ["web-scanner", "targets"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Unable to remove this website."), "Remove failed")
  });

  const targets = targetsQuery.data?.targets ?? [];
  const visibleTargets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? targets.filter((target) => [target.name, target.url, target.hostname, target.client?.name].some((value) => value?.toLowerCase().includes(term))) : targets;
  }, [search, targets]);
  const ready = targets.filter((target) => target.canScan).length;
  const needsPermission = targets.filter((target) => target.authorizationStatus !== "valid").length;
  const activeRuns = targets.filter((target) => target.latestScan && !terminalStatuses.has(target.latestScan.status.toLowerCase())).length;
  const roles = [user?.tenant?.role, ...(user?.roles ?? [])].filter(Boolean).map((value) => String(value).toLowerCase());
  const canVerify = roles.some((role) => role === "admin" || role === "superadmin");
  const activeAuthorized = Boolean(launchTarget && canVerify && launchTarget.authorizationPermissions.includes("active_safe"));
  const activeConfirmed = Boolean(launchTarget && activeAcknowledged && activeConfirmation.trim().toLowerCase() === launchTarget.name.trim().toLowerCase());
  const busy = saveMutation.isPending || verifyMutation.isPending || launchMutation.isPending || deleteMutation.isPending;

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, clientId: clientsQuery.data?.length === 1 ? clientsQuery.data[0].id : "" });
    setIsFormOpen(true);
  }

  function openEdit(target: WebScannerTarget) {
    setEditing(target);
    setForm({
      name: target.name,
      url: target.url,
      clientId: target.client?.id ?? "",
      environment: target.environment,
      includePaths: target.scope.includePaths.join("\n") || "/*",
      excludePaths: target.scope.excludePaths.join("\n"),
      allowActive: false,
      attested: false
    });
    setIsFormOpen(true);
  }

  function openLaunch(target: WebScannerTarget) {
    setLaunchTarget(target);
    setLaunchMode("safe");
    setActiveAcknowledged(false);
    setActiveConfirmation("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.attested) {
      toast.warning("Confirm that you are authorized to scan this website.", "Authorization required");
      return;
    }
    saveMutation.mutate({
      name: form.name,
      url: form.url,
      clientId: form.clientId || undefined,
      environment: form.environment,
      includePaths: pathList(form.includePaths, ["/*"]),
      excludePaths: pathList(form.excludePaths),
      allowActive: form.allowActive
    });
  }

  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening secure scanner workspace…</span></main>;

  return <main className="dashboard-shell subscription-dashboard-shell web-scanner-shell">
    <SubscriptionSidebar active="web-scanner" scannerCount={targets.length} user={user} />
    <section className="dashboard-workspace web-scanner-workspace">
      <header className="dashboard-topbar">
        <div><span>{user?.tenant?.name || "Security Workspace"}</span><b>/</b><strong>Web Scanner</strong></div>
        <div className="dashboard-top-actions">
          <button disabled={targetsQuery.isFetching} onClick={() => targetsQuery.refetch()} type="button"><Icon name="refresh" />{targetsQuery.isFetching ? "Refreshing…" : "Refresh"}</button>
          <button className="scanner-primary" onClick={openCreate} type="button"><Icon name="add" />Add website</button>
        </div>
      </header>

      <div className="web-scanner-content">
        <header className="scanner-heading"><span>Web scanning</span><h1>Web scanner</h1><p>Add websites you are authorized to test, then launch controlled scans after permission verification.</p></header>
        <section className="scanner-metrics" aria-label="Website scan summary">
          <article className="ready"><Icon name="shield" /><span>Ready to scan</span><strong>{ready}</strong></article>
          <article className="pending"><Icon name="shield" /><span>Needs permission review</span><strong>{needsPermission}</strong></article>
          <article className="running"><Icon name="refresh" /><span>Active runs</span><strong>{activeRuns}</strong></article>
        </section>

        <section className="scanner-panel">
          <header><div><h2>Websites</h2><p>{targetsQuery.data?.count ?? 0} tenant-scoped website{(targetsQuery.data?.count ?? 0) === 1 ? "" : "s"}</p></div><label className="scanner-search"><Icon name="search" /><input aria-label="Search websites" onChange={(event) => setSearch(event.target.value)} placeholder="Search websites" value={search} /></label></header>
          {targetsQuery.isLoading ? <div className="scanner-empty"><span className="scanner-spinner" /><h3>Loading websites</h3><p>Reading the latest scanner configuration from the backend.</p></div>
            : visibleTargets.length === 0 ? <div className="scanner-empty"><Icon name="shield" /><h3>{targets.length ? "No matching websites" : "No websites yet"}</h3><p>{targets.length ? "Try a different search term." : "Add a website you are allowed to test. An administrator verifies it before the first scan."}</p>{!targets.length && <button className="scanner-primary" onClick={openCreate} type="button"><Icon name="add" />Add first website</button>}</div>
              : <div className="scanner-table-wrap"><table><thead><tr><th>Website</th><th>Scope</th><th>Permission</th><th>Verification</th><th>Latest scan</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{visibleTargets.map((target) => <tr key={target.id}>
                <td><div className="scanner-site"><i><Icon name="globe" /></i><span><strong>{target.name}</strong><small>{target.url}</small></span></div></td>
                <td><span className="scanner-scope"><b>Scan: {target.scope.includePaths.join(", ") || "/*"}</b><small>Skip: {target.scope.effectiveExcludePaths.join(", ") || "None"}</small></span></td>
                <td><span className={`scanner-chip ${target.canScan ? "success" : "warning"}`}>{target.canScan ? "Ready" : statusLabel(target.authorizationStatus)}</span></td>
                <td><span className={`scanner-verification ${target.verificationStatus === "verified" ? "verified" : "pending"}`}><span className={`scanner-chip ${target.verificationStatus === "verified" ? "success" : "warning"}`}>{statusLabel(target.verificationStatus)}</span>{target.verificationStatus !== "verified" && canVerify ? <button disabled={busy} onClick={() => setReviewTarget(target)} type="button">Review and verify</button> : target.verificationStatus !== "verified" ? <small>Awaiting administrator review</small> : null}</span></td>
                <td>{target.latestScan ? <span className="scanner-latest"><b>{statusLabel(target.latestScan.status)}</b><small>{formatDate(target.latestScan.createdAt)}</small><Link href={`/scan?scanId=${encodeURIComponent(target.latestScan.id)}`}>View run</Link></span> : "No scans"}</td>
                <td><div className="scanner-row-actions"><button onClick={() => openEdit(target)} type="button">Edit</button><button className="launch" disabled={!target.canScan || busy} onClick={() => openLaunch(target)} type="button">Launch scan</button><button className="danger" disabled={busy} onClick={() => window.confirm(`Remove ${target.name}?`) && deleteMutation.mutate(target.id)} type="button">Remove</button></div></td>
              </tr>)}</tbody></table></div>}
        </section>
      </div>
    </section>

    {reviewTarget && <div className="scanner-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !verifyMutation.isPending && setReviewTarget(null)}>
      <section aria-labelledby="review-title" aria-modal="true" className="scanner-modal scanner-review-modal" role="dialog">
        <header><div><span>Permission review</span><h2 id="review-title">Review and verify</h2><p>Confirm the saved website and authorized scope before enabling scans.</p></div><button aria-label="Close" disabled={verifyMutation.isPending} onClick={() => setReviewTarget(null)} type="button"><Icon name="close" /></button></header>
        <div className="scanner-dialog-body">
          <div className="scanner-notice info"><Icon name="shield" /><span><b>Administrator verification required</b><small>This approval records your identity against the current authorization grant. Editing sensitive target details requires a new review.</small></span></div>
          <section className="scanner-review-target"><h3><Icon name="globe" />Website and authorized scope</h3><dl><div><dt>Website</dt><dd>{reviewTarget.name}</dd></div><div><dt>Origin</dt><dd>{reviewTarget.scope.canonicalOrigin}</dd></div><div><dt>Environment</dt><dd>{statusLabel(reviewTarget.environment)}</dd></div><div><dt>Client</dt><dd>{reviewTarget.client?.name ?? "Tenant wide"}</dd></div><div><dt>Included paths</dt><dd>{reviewTarget.scope.includePaths.join(", ") || "/*"}</dd></div><div><dt>Effective exclusions</dt><dd>{reviewTarget.scope.effectiveExcludePaths.join(", ") || "None"}</dd></div><div><dt>Allowed methods</dt><dd>{reviewTarget.scope.allowedHttpMethods.join(", ") || "Not reported"}</dd></div><div><dt>Redirect boundary</dt><dd>{statusLabel(reviewTarget.scope.redirectMode)}</dd></div></dl></section>
          <div className="scanner-notice warning"><Icon name="shield" /><span><b>Verify only an approved target</b><small>Verification enables automated reconnaissance within this stored scope. Scanner findings still require human validation.</small></span></div>
          <footer className="scanner-dialog-actions"><button disabled={verifyMutation.isPending} onClick={() => setReviewTarget(null)} type="button">Cancel</button><button className="scanner-primary" disabled={verifyMutation.isPending} onClick={() => verifyMutation.mutate(reviewTarget.id)} type="button">{verifyMutation.isPending ? "Verifying…" : "Verify website and scope"}</button></footer>
        </div>
      </section>
    </div>}

    {launchTarget && <div className="scanner-modal-backdrop scanner-launch-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !launchMutation.isPending && setLaunchTarget(null)}>
      <section aria-labelledby="launch-title" aria-modal="true" className="scanner-modal scanner-launch-modal" role="dialog">
        <header><div><span>Authorized assessment</span><h2 id="launch-title">Launch authorized scan</h2><p>Choose a server-managed profile for {launchTarget.name}.</p></div><button aria-label="Close" disabled={launchMutation.isPending} onClick={() => setLaunchTarget(null)} type="button"><Icon name="close" /></button></header>
        <div className="scanner-dialog-body">
          <div className="scanner-notice info"><Icon name="shield" /><span><b>This launches an automated assessment</b><small>Reconnaissance and scanner alerts are review inputs. Results do not become confirmed vulnerabilities without human validation.</small></span></div>
          <section className="scanner-review-target"><h3><Icon name="shield" />Verified target and scope</h3><dl><div><dt>Origin</dt><dd>{launchTarget.scope.canonicalOrigin}</dd></div><div><dt>Environment</dt><dd>{statusLabel(launchTarget.environment)}</dd></div><div><dt>Included paths</dt><dd>{launchTarget.scope.includePaths.join(", ") || "/*"}</dd></div><div><dt>Effective exclusions</dt><dd>{launchTarget.scope.effectiveExcludePaths.join(", ") || "None"}</dd></div><div><dt>Allowed methods</dt><dd>{launchTarget.scope.allowedHttpMethods.join(", ") || "Not reported"}</dd></div><div><dt>Redirect boundary</dt><dd>{statusLabel(launchTarget.scope.redirectMode)}</dd></div></dl></section>
          <fieldset className="scanner-profile-list"><legend>Scan profile</legend>{(["safe", "active"] as const).map((mode) => {
            const item = launchTarget.profiles[mode];
            const disabled = mode === "active" && !activeAuthorized;
            return <label className={`${launchMode === mode ? "selected" : ""}${disabled ? " disabled" : ""}`} key={mode}><input checked={launchMode === mode} disabled={disabled} name="scan-profile" onChange={() => setLaunchMode(mode)} type="radio" value={mode} /><span><strong>{item.name}{mode === "safe" && <em>Recommended</em>}</strong><small>{item.description}</small><i>{item.tools.map((tool) => <b key={tool}>{tool}</b>)}</i></span><u aria-hidden="true" /></label>;
          })}{!activeAuthorized && <p>Active scanning requires admin access and a verified grant containing active-safe permission.</p>}</fieldset>
          <section className="scanner-outcomes"><article><h3>What this profile can collect</h3><ul>{launchTarget.profiles[launchMode].capabilities.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>What remains unverified</h3><ul>{launchTarget.profiles[launchMode].limitations.map((item) => <li key={item}>{item}</li>)}</ul></article></section>
          <section className="scanner-limits"><h3>Configured safety limits</h3><dl>{Object.entries(launchTarget.profiles[launchMode].limits).map(([key, value]) => <div key={key}><dt>{statusLabel(key.replace(/^max_/, ""))}</dt><dd>{limitValue(key, value)}</dd></div>)}</dl><p>Only limits returned by the server are shown. These are enforced ceilings, not promised coverage.</p></section>
          {launchMode === "active" && <section className="scanner-active-confirm"><h3>Active testing confirmation</h3><label><input checked={activeAcknowledged} onChange={(event) => setActiveAcknowledged(event.target.checked)} type="checkbox" /><span>I understand this profile sends bounded active probes within the verified scope.</span></label><label><span>Type <b>{launchTarget.name}</b> to authorize this run</span><input autoComplete="off" onChange={(event) => setActiveConfirmation(event.target.value)} value={activeConfirmation} /></label></section>}
          <footer className="scanner-dialog-actions"><button disabled={launchMutation.isPending} onClick={() => setLaunchTarget(null)} type="button">Cancel</button><button className="scanner-primary" disabled={launchMutation.isPending || (launchMode === "active" && (!activeAuthorized || !activeConfirmed))} onClick={() => launchMutation.mutate({ mode: launchMode, targetId: launchTarget.id })} type="button">{launchMutation.isPending ? "Starting…" : launchMode === "active" ? "Start authorized active scan" : "Start safe scan"}</button></footer>
        </div>
      </section>
    </div>}

    {isFormOpen && <div className="scanner-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saveMutation.isPending && setIsFormOpen(false)}>
      <section aria-labelledby="website-form-title" aria-modal="true" className="scanner-modal" role="dialog">
        <header><div><span>{editing ? "Website settings" : "New scan target"}</span><h2 id="website-form-title">{editing ? "Edit website" : "Add website"}</h2><p>Define the exact website and approved paths the scanner may access.</p></div><button aria-label="Close" disabled={saveMutation.isPending} onClick={() => setIsFormOpen(false)} type="button"><Icon name="close" /></button></header>
        <form onSubmit={submit}>
          <label className="wide"><span>Website URL *</span><input autoFocus onChange={(event) => setForm((value) => ({ ...value, url: event.target.value }))} placeholder="https://example.com" required type="text" value={form.url} /></label>
          <label><span>Display name *</span><input maxLength={255} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} placeholder="Customer portal" required value={form.name} /></label>
          <label><span>Environment</span><select onChange={(event) => setForm((value) => ({ ...value, environment: event.target.value }))} value={form.environment}><option value="production">Production</option><option value="staging">Staging</option><option value="development">Development</option><option value="other">Other</option></select></label>
          {!!clientsQuery.data?.length && <label className="wide"><span>Client</span><select onChange={(event) => setForm((value) => ({ ...value, clientId: event.target.value }))} value={form.clientId}><option value="">Tenant wide</option>{clientsQuery.data.filter((client) => client.status).map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>}
          <label><span>Included paths</span><textarea onChange={(event) => setForm((value) => ({ ...value, includePaths: event.target.value }))} placeholder="/*" rows={4} value={form.includePaths} /><small>One path per line, starting with /.</small></label>
          <label><span>Excluded paths</span><textarea onChange={(event) => setForm((value) => ({ ...value, excludePaths: event.target.value }))} placeholder={"/logout\n/admin"} rows={4} value={form.excludePaths} /><small>Optional paths the scanner must avoid.</small></label>
          <label className="scanner-check wide"><input checked={form.allowActive} onChange={(event) => setForm((value) => ({ ...value, allowActive: event.target.checked }))} type="checkbox" /><span><b>Allow approved active-safe checks</b><small>The backend still requires explicit verification before active scanning.</small></span></label>
          <label className="scanner-check authorization wide"><input checked={form.attested} onChange={(event) => setForm((value) => ({ ...value, attested: event.target.checked }))} required type="checkbox" /><span><b>I confirm that I am authorized to scan this website and the configured scope.</b><small>This attestation is stored with your identity and tenant for permission review.</small></span></label>
          <footer><button disabled={saveMutation.isPending} onClick={() => setIsFormOpen(false)} type="button">Cancel</button><button className="scanner-primary" disabled={saveMutation.isPending} type="submit">{saveMutation.isPending ? "Saving…" : editing ? "Save changes" : "Add website"}</button></footer>
        </form>
      </section>
    </div>}
  </main>;
}
