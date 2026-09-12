"use client";

import Image from "next/image";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type MouseEvent, type ReactNode } from "react";
import type { CurrentUserResponse } from "../../services/unified-api.service";
import { UnifiedAPIService } from "../../services/unified-api.service";

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

type MenuItem = string | { href: string; label: string };

function MenuGroup({ badge, icon, label, items, activeItem }: { badge?: string; icon: string; label: string; items: MenuItem[]; activeItem?: string }) {
  return <details className="dashboard-menu-group" open={Boolean(activeItem)}>
    <summary title={label}><span><i className="dashboard-menu-icon"><MenuIcon name={icon} /></i><span className="dashboard-menu-text">{label}</span></span><span className="dashboard-summary-meta">{badge && <em>{badge}</em>}<b aria-hidden="true">⌄</b></span></summary>
    <div className="dashboard-submenu">{items.map((item) => {
      const itemLabel = typeof item === "string" ? item : item.label;
      return typeof item === "string"
        ? <button className={activeItem === itemLabel ? "active" : ""} key={itemLabel} type="button"><i />{itemLabel}</button>
        : <Link className={activeItem === itemLabel ? "active" : ""} href={item.href} key={itemLabel}><i />{itemLabel}</Link>;
    })}</div>
  </details>;
}

export default function SubscriptionSidebar({ active = "billing", scannerCount, user }: { active?: "billing" | "web-scanner" | "os-scanner" | "api-scanner" | "network-overview" | "network-inventory" | "network-agents" | "ai-overview" | "ai-launch" | "ai-pipeline" | "ai-knowledge" | "ai-reports" | "report-centre"; scannerCount?: number; user?: CurrentUserResponse }) {
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.username || "ForgeSec User";
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "FS";

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

  return <aside className={`dashboard-sidebar subscription-sidebar${active.startsWith("ai-") ? " ai-module-sidebar" : ""}${collapsed ? " subscription-sidebar-collapsed" : ""}`}>
    <header className="dashboard-brand">
      <Link href="/" aria-label="Forge-Sec home">
        <Image alt="Forge-Sec" className="dashboard-logo-full" height={166} priority src="/images/logo1.png" width={166} />
        <span aria-hidden="true" className="dashboard-logo-icon">FS</span>
      </Link>
      <div><span>Security Workspace</span></div>
      <button aria-label={collapsed ? "Open sidebar" : "Close sidebar"} className="dashboard-collapse" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Open sidebar" : "Close sidebar"} type="button">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d={collapsed ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} /></svg>
      </button>
    </header>

    <nav className="dashboard-navigation" aria-label="Workspace navigation">
      <span className="dashboard-nav-label">Workspace</span>
      <Link className="dashboard-main-link" href="/dashboard" title="Overview"><i className="dashboard-menu-icon"><MenuIcon name="overview" /></i><span className="dashboard-menu-text">Overview</span></Link>
      <MenuGroup activeItem={active === "web-scanner" ? "Web Scanner" : active === "os-scanner" ? "OS Scanner" : active === "api-scanner" ? "API Scanner" : undefined} badge={["web-scanner", "os-scanner", "api-scanner"].includes(active) ? String(scannerCount ?? 0) : "4"} icon="scanner" items={[{ href: "/configuration", label: "Web Scanner" }, { href: "/os-scanner", label: "OS Scanner" }, { href: "/api-scanner", label: "API Scanner" }, "Hybrid Scanner"]} label="Scanners" />
      <MenuGroup activeItem={active === "network-overview" ? "Network Overview" : active === "network-inventory" ? "Network Inventory" : active === "network-agents" ? "Network Agents" : undefined} icon="network" items={[{ href: "/network-scanner", label: "Network Overview" }, { href: "/network-scanner/inventory", label: "Network Inventory" }, { href: "/network-scanner/agents", label: "Network Agents" }]} label="Network Scanner" />
      <span className="dashboard-nav-label dashboard-nav-divider">Intelligence</span>
      <MenuGroup activeItem={active === "ai-overview" ? "AI Overview" : active === "ai-launch" ? "Launch Scan" : active === "ai-pipeline" ? "Pipeline" : active === "ai-knowledge" ? "Knowledge Hub" : active === "ai-reports" ? "AI Reports" : undefined} badge="AI" icon="ai" items={[{ href: "/ai-scanner/dashboard", label: "AI Overview" }, { href: "/ai-scanner/new-scan", label: "Launch Scan" }, { href: "/ai-scanner/pipeline", label: "Pipeline" }, { href: "/ai-scanner/knowledge-base", label: "Knowledge Hub" }, { href: "/ai-scanner/reports", label: "AI Reports" }]} label="AI Pentest" />
      <Link className={`dashboard-main-link${active === "report-centre" ? " active" : ""}`} href="/reports" title="Report Centre"><i className="dashboard-menu-icon"><MenuIcon name="report" /></i><span className="dashboard-menu-text">Report Centre</span></Link>
      <span className="dashboard-nav-label dashboard-nav-divider">Management</span>
      <Link className={`dashboard-main-link${active === "billing" ? " active" : ""}`} href="/subscription" title="Billing & Cost Management"><i className="dashboard-menu-icon"><MenuIcon name="billing" /></i><span className="dashboard-menu-text">Billing &amp; Cost Management</span></Link>
      <MenuGroup icon="account" items={["Plan & Usage", { href: "/change-password", label: "Change Password" }, "Profile & Settings"]} label="Account" />
    </nav>

    <footer className="dashboard-sidebar-footer">
      <div className="dashboard-user"><span>{initials}</span><div><strong>{displayName}</strong><small>{user?.email ?? "Secure workspace"}</small></div><i /></div>
      <div className="dashboard-footer-actions">
        <button type="button"><MenuIcon name="help" /><span>Support</span></button>
        <Link aria-disabled={isLoggingOut} href="/login" onClick={handleLogout}><MenuIcon name="logout" /><span>{isLoggingOut ? "Signing out..." : "Log out"}</span></Link>
      </div>
    </footer>
  </aside>;
}
// z
