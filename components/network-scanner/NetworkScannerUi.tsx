"use client";

import type { ReactNode } from "react";
import SubscriptionSidebar from "../dashboard/SubscriptionSidebar";
import type { CurrentUserResponse } from "../../services/unified-api.service";

export function NetIcon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    network: <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7.8 7 3 8.5M16.2 7l-3 8.5M8 6h8"/></>,
    radio: <><circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4m8.4-8.4a6 6 0 0 1 0 8.4M4.6 4.6a10.5 10.5 0 0 0 0 14.8m14.8-14.8a10.5 10.5 0 0 1 0 14.8"/></>,
    boxes: <><path d="m12 3 4 2.2v4.6L12 12 8 9.8V5.2L12 3Z"/><path d="m6 12 4 2.2v4.6L6 21l-4-2.2v-4.6L6 12Zm12 0 4 2.2v4.6L18 21l-4-2.2v-4.6l4-2.2Z"/></>,
    activity: <path d="M3 12h4l2-7 4 14 2-7h6"/>, server: <><rect x="4" y="3" width="16" height="7" rx="2"/><rect x="4" y="14" width="16" height="7" rx="2"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h5M12 17.5h5"/></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/></>, search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></>, download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14"/></>, refresh: <><path d="M20 7v5h-5M4 17v-5h5"/><path d="M18.5 9A7 7 0 0 0 6 6.5M5.5 15A7 7 0 0 0 18 17.5"/></>,
    play: <path d="m8 5 11 7-11 7V5Z"/>, pause: <><path d="M8 5v14M16 5v14"/></>, plus: <><path d="M12 5v14M5 12h14"/></>, copy: <><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2"/></>, close: <path d="m6 6 12 12M18 6 6 18"/>, shield: <><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></>, warning: <><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/></>, check: <path d="m5 12 4 4L19 6"/>
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name] || paths.network}</svg>;
}

export function NetworkShell({ active, children, user }: { active: "network-overview" | "network-inventory" | "network-agents"; children: ReactNode; user?: CurrentUserResponse }) {
  return <main className="dashboard-shell subscription-dashboard-shell network-shell"><SubscriptionSidebar active={active} user={user}/><section className="dashboard-workspace network-workspace">{children}</section></main>;
}

export function NetworkBanner({ error, loading, empty }: { error?: string | null; loading: boolean; empty?: boolean }) {
  if (loading) return <div className="network-banner loading"><span className="scanner-spinner"/> Loading live network-agent data...</div>;
  if (error) return <div className="network-banner error"><NetIcon name="warning"/><span><b>Network data unavailable</b>{error}</span></div>;
  if (empty) return <div className="network-banner empty"><NetIcon name="radio"/><span><b>No network-agent data yet</b>Enroll an agent to begin collecting authorized inventory.</span></div>;
  return <div className="network-banner success"><NetIcon name="radio"/><span><b>Live network-agent data</b>These records come from authenticated network agents and refresh automatically.</span></div>;
}

export function StatusBadge({ value }: { value: string }) { return <span className={`network-status ${value.toLowerCase().replaceAll("_","-")}`}>{title(value)}</span>; }
export function title(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
export function networkDate(value?: string | null) { if (!value) return "Never"; const date = new Date(value); return Number.isNaN(date.getTime()) ? "Unknown" : date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata", timeZoneName: "short" }); }
