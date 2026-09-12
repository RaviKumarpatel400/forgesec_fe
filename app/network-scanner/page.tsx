"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NetIcon, NetworkBanner, NetworkShell, StatusBadge, networkDate, title } from "../../components/network-scanner/NetworkScannerUi";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../lib/toast";
import { NetworkScannerService, toNetworkScannerApiError } from "../../services/network-scanner.service";
import type { NetworkAgentStatus, NetworkInventoryService } from "../../features/network-scanner/types";

function services(items: NetworkInventoryService[]) { const shown = items.slice(0, 3).map((item) => `${item.name || item.product || "Service"}${item.port ? ` :${item.port}` : ""}`); return shown.length ? `${shown.join(" · ")}${items.length > 3 ? ` +${items.length - 3}` : ""}` : "No services reported"; }
function latest(values: Array<string | null>) { return values.filter((value): value is string => Boolean(value)).sort((a, b) => Date.parse(b) - Date.parse(a))[0] || null; }

export default function NetworkScannerPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const agentsQuery = useQuery({ enabled: isAuthenticated, queryKey: ["network-scanner", "agents"], queryFn: () => NetworkScannerService.listAgents(), refetchInterval: 15_000, retry: false });
  const overviewQuery = useQuery({ enabled: isAuthenticated, queryKey: ["network-scanner", "overview"], queryFn: () => NetworkScannerService.getOverview(), refetchInterval: 15_000, retry: false });
  const error = overviewQuery.error || agentsQuery.error; const errorMessage = error ? toNetworkScannerApiError(error).message : null;
  useEffect(() => { if (errorMessage) toast.error(errorMessage, "Network Scanner"); }, [errorMessage]);
  if (authLoading || (!isAuthenticated && !user)) return <main className="scanner-auth-wait"><span>Opening Network Scanner...</span></main>;
  const agents = agentsQuery.data || overviewQuery.data?.recentAgents || []; const assets = overviewQuery.data?.recentAssets || []; const summary = overviewQuery.data?.summary;
  const counts = agents.reduce<Record<NetworkAgentStatus, number>>((all, agent) => { all[agent.status]++; return all; }, { online: 0, degraded: 0, offline: 0, pending: 0 });
  const total = summary?.totalAgents ?? agents.length; const online = summary?.onlineAgents ?? counts.online; const collecting = agents.filter((agent) => agent.collectionState === "collecting").length; const issues = agents.filter((agent) => ["failed", "partial"].includes(agent.collectionState)).length;
  const queued = agents.reduce((sum, agent) => sum + agent.spoolDepth, 0); const failed = agents.reduce((sum, agent) => sum + agent.deadLetterCount, 0); const telemetryErrors = agents.filter((agent) => agent.telemetryStatus === "error").length; const healthy = agents.filter((agent) => agent.telemetryStatus === "healthy").length;
  const lastCollection = latest(agents.map((agent) => agent.lastCollectionAt)); const lastSeen = summary?.lastSnapshotAt || latest(assets.map((asset) => asset.lastSeenAt)); const loading = agentsQuery.isLoading || overviewQuery.isLoading;
  const delivery = failed ? `${failed} failed` : telemetryErrors ? `${telemetryErrors} agent error${telemetryErrors === 1 ? "" : "s"}` : queued ? `${queued} queued` : healthy ? "Healthy" : total ? "No backlog reported" : "Waiting";
  return <NetworkShell active="network-overview" user={user}>
    <header className="network-page-header"><div><span><NetIcon name="network"/> Network operations</span><h1>Network Scanner</h1><p>See whether agents are running, when they collected, what devices they found, and whether data reached the server.</p></div><nav><Link href="/network-scanner/inventory"><NetIcon name="boxes"/> View inventory</Link><Link className="primary" href="/network-scanner/agents"><NetIcon name="radio"/> Manage agents</Link></nav></header>
    <div className="network-content"><NetworkBanner error={errorMessage} loading={loading} empty={!loading && !errorMessage && total === 0 && (summary?.totalAssets || 0) === 0}/>
      <section className="network-kpis">{[
        ["Agent health", loading ? "—" : `${online} / ${total} online`, total ? `${counts.degraded} degraded · ${counts.offline} offline · ${counts.pending} pending` : "No agents enrolled", "radio"],
        ["Collections", loading ? "—" : collecting ? `${collecting} running` : lastCollection ? networkDate(lastCollection) : "Not started", issues ? `${issues} agents reported failed or partial collection` : collecting ? "Inventory is being collected now" : "Most recent completed collection", "activity"],
        ["Known devices", loading ? "—" : summary?.totalAssets || 0, `${summary?.activeAssets || 0} recently seen · ${summary?.staleAssets || 0} stale`, "boxes"],
        ["Data delivery", loading ? "—" : delivery, failed ? `${queued} records still queued` : queued ? "Stored safely until accepted" : "No queued or failed records reported", "database"]
      ].map(([label,value,detail,icon]) => <article key={String(label)}><i><NetIcon name={String(icon)}/></i><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</section>
      <section className="network-overview-grid"><article className="network-panel"><header><div><h2>Agent operations</h2><p>Live service, collection, and delivery state.</p></div><Link href="/network-scanner/agents">Open agents &rarr;</Link></header><div className="network-card-list">{agents.length ? agents.slice(0,8).map((agent) => <section key={agent.id}><div><i><NetIcon name={agent.status === "online" ? "check" : "warning"}/></i><span><b>{agent.name}</b><small>{agent.detectedNetworks.find((item) => item.authorized)?.cidr || agent.site}</small></span><StatusBadge value={agent.status}/></div><dl><div><dt>Service</dt><dd>{title(agent.serviceState)}</dd></div><div><dt>Collection</dt><dd>{agent.collectionState === "never" ? "Waiting" : title(agent.collectionState)}</dd></div><div><dt>Delivery</dt><dd>{agent.spoolDepth} queued</dd></div></dl><p>Last heartbeat: {networkDate(agent.lastHeartbeatAt)} / Last collection: {networkDate(agent.lastCollectionAt)}</p></section>) : <div className="network-empty"><NetIcon name="server"/><b>No agents are enrolled</b><Link href="/network-scanner/agents">Install the first agent &rarr;</Link></div>}</div></article>
        <article className="network-panel"><header><div><h2>Recently seen devices</h2><p>Latest device records accepted by the server.</p></div><Link href="/network-scanner/inventory">Full inventory &rarr;</Link></header><div className="network-card-list assets">{assets.length ? assets.slice(0,8).map((asset) => <section key={asset.id}><div><span><b>{asset.hostname}</b><small>{asset.ipAddress}</small></span><em>{asset.deviceType}</em></div><dl><div><dt>MAC / vendor</dt><dd>{asset.macAddress} / {asset.vendor}</dd></div><div><dt>Services</dt><dd>{services(asset.services)}</dd></div></dl><p>Last seen {networkDate(asset.lastSeenAt)}</p></section>) : <div className="network-empty"><NetIcon name="boxes"/><b>No device inventory received</b><span>Start an authorized agent and wait for its first collection.</span></div>}</div></article>
      </section><p className="network-evidence-note">The dashboard shows only observations reported by authenticated agents. A detected service or device classification is inventory evidence, not a vulnerability finding. Last observation: {networkDate(lastSeen)}.</p>
    </div>
  </NetworkShell>;
}
