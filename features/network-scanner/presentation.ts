import type {
  NetworkAgentLicenseStatus,
  NetworkAgentStatus,
} from "./types";

export function formatNetworkTimestamp(value: string | null): string {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  });
}

export function titleCaseNetworkValue(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function agentStatusTone(status: NetworkAgentStatus): string {
  const tones: Record<NetworkAgentStatus, string> = {
    online: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    degraded: "bg-amber-50 text-amber-700 ring-amber-200",
    offline: "bg-red-50 text-red-700 ring-red-200",
    pending: "bg-blue-50 text-blue-700 ring-blue-200",
  };
  return tones[status];
}

export function licenseStatusTone(status: NetworkAgentLicenseStatus): string {
  const tones: Record<NetworkAgentLicenseStatus, string> = {
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    expiring: "bg-amber-50 text-amber-700 ring-amber-200",
    pending: "bg-blue-50 text-blue-700 ring-blue-200",
    disabled: "bg-slate-100 text-slate-700 ring-slate-300",
    expired: "bg-red-50 text-red-700 ring-red-200",
    revoked: "bg-red-50 text-red-700 ring-red-200",
  };
  return tones[status];
}
