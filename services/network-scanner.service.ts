import { AxiosError } from "axios";

import { NETWORK_SCANNER_ROUTES } from "../config/api-routes";
import {
  normalizeNetworkAgents,
  normalizeNetworkAgent,
  normalizeNetworkClients,
  normalizeNetworkEnrollment,
  normalizeNetworkInventoryPage,
  normalizeNetworkOverview,
  normalizeNetworkSites,
  serializeNetworkSite,
  serializeNetworkEnrollment,
} from "../features/network-scanner/contract";
import { sha256BlobHex } from "../features/network-scanner/sha256";
import type {
  DownloadedNetworkAgent,
  NetworkAgentEnrollment,
  NetworkAgentEnrollmentInput,
  NetworkAgentControlAction,
  NetworkInventoryAsset,
  NetworkInventoryPage,
  NetworkScannerAgent,
  NetworkScannerClient,
  NetworkScannerSite,
  NetworkScannerSiteInput,
  NetworkScannerOverview,
} from "../features/network-scanner/types";
import { sanitizeNetworkScannerServerMessage } from "../features/network-scanner/errors";
import { api } from "../lib/axios";
import { UnifiedAPIService } from "./unified-api.service";

type ErrorPayload = {
  detail?: unknown;
  error?: unknown;
  message?: unknown;
  code?: unknown;
  errors?: unknown;
};

export class NetworkScannerApiError extends Error {
  readonly status: number | null;
  readonly code: string | null;

  constructor(message: string, status: number | null = null, code: string | null = null, cause?: unknown) {
    super(message, { cause });
    this.name = "NetworkScannerApiError";
    this.status = status;
    this.code = code;
  }
}

function safeText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function responseHeader(headers: unknown, expectedName: string): string | undefined {
  if (!headers || typeof headers !== "object") return undefined;
  const headerObject = headers as Record<string, unknown> & { get?: (name: string) => unknown };
  if (typeof headerObject.get === "function") {
    try {
      const value = headerObject.get.call(headers, expectedName);
      if (value !== undefined && value !== null) return String(value).trim();
    } catch {
      // Fall through for plain or restricted header objects.
    }
  }
  const normalizedName = expectedName.toLowerCase();
  const entry = Object.entries(headerObject).find(([name]) => name.toLowerCase() === normalizedName);
  if (!entry || entry[1] === undefined || entry[1] === null) return undefined;
  return String(entry[1]).trim();
}

export function toNetworkScannerApiError(error: unknown): NetworkScannerApiError {
  if (error instanceof NetworkScannerApiError) return error;
  const transport = error as {
    code?: string;
    message?: string;
    response?: { status?: number; data?: unknown };
  };
  if (error instanceof AxiosError || transport.response || transport.code) {
    const status = transport.response?.status ?? null;
    const responseData = transport.response?.data;
    const payload = responseData && typeof responseData === "object"
      ? responseData as ErrorPayload
      : {};
    const code = safeText(payload.code) ?? safeText(payload.error);
    const serverMessage = sanitizeNetworkScannerServerMessage(payload.message)
      ?? sanitizeNetworkScannerServerMessage(payload.detail)
      ?? sanitizeNetworkScannerServerMessage(responseData);
    const csrfOriginFailure = status === 403
      && Boolean(serverMessage?.toLowerCase().includes("csrf failed: origin checking failed"));
    const message = csrfOriginFailure
      ? "This dashboard address is not enabled in the running backend. Restart the ForgeSec network-scanner local stack, then try again."
      : code === "scope_invalid" || serverMessage?.includes("RFC1918")
      ? "That is not a private network range. Use a range beginning with 10, 192.168, or 172.16 through 172.31."
      : serverMessage
      ?? (status === 401
        ? "Your session has expired. Sign in again to continue."
        : status === 403
          ? "You do not have permission to manage this client's network agents."
          : status === 404
            ? "The requested network-scanner resource was not found."
            : status === 409
              ? "This enrollment conflicts with an existing or recently issued agent. Refresh and try again."
              : status === 429
                ? "Too many enrollment requests were made. Wait a moment and try again."
                : status && status >= 500
                  ? "The network-scanner service is temporarily unavailable."
            : transport.code === "ECONNABORTED"
                    ? "The network-scanner request timed out. Try again."
                    : "Unable to reach the network-scanner service.");
    return new NetworkScannerApiError(message, status, code, error);
  }
  return new NetworkScannerApiError(
    error instanceof Error ? error.message : "The network-scanner request failed.",
    null,
    null,
    error,
  );
}

async function request<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw toNetworkScannerApiError(error);
  }
}

function artifactApiPath(downloadUrl: string): string {
  const absolute = /^[a-z][a-z\d+.-]*:\/\//i.test(downloadUrl);
  if (absolute) {
    throw new NetworkScannerApiError("The server returned an unsafe cross-origin agent URL.");
  }
  const parsed = new URL(downloadUrl, "https://forgesec.invalid");
  if (parsed.username || parsed.password || parsed.hash || parsed.search) {
    throw new NetworkScannerApiError("The server returned invalid agent package metadata.");
  }
  const expectedPrefix = "/api/v1/network-scanner/artifacts/";
  const alternatePrefix = "/v1/network-scanner/artifacts/";
  if (!parsed.pathname.startsWith(expectedPrefix) && !parsed.pathname.startsWith(alternatePrefix)) {
    throw new NetworkScannerApiError("The server returned an untrusted agent package location.");
  }
  return parsed.pathname.startsWith("/api/") ? parsed.pathname.slice(4) : parsed.pathname;
}

function safeInstallerFileName(value: string, fallback: string): string {
  const leaf = value.split(/[\\/]/).at(-1)?.replace(/[^a-zA-Z0-9._-]/g, "-") ?? "";
  return /\.(?:exe|zip)$/i.test(leaf) ? leaf : fallback;
}

export async function sha256Hex(blob: Blob): Promise<string> {
  return sha256BlobHex(blob);
}

export const NetworkScannerService = {
  async listClients(): Promise<NetworkScannerClient[]> {
    return request(async () => {
      const response = await api.get(NETWORK_SCANNER_ROUTES.clients, { skipGlobalLoader: true });
      return normalizeNetworkClients(response.data);
    });
  },

  async listSites(clientId?: string): Promise<NetworkScannerSite[]> {
    return request(async () => {
      const response = await api.get(NETWORK_SCANNER_ROUTES.sites, {
        params: clientId ? { client_id: clientId } : undefined,
        skipGlobalLoader: true,
      });
      return normalizeNetworkSites(response.data);
    });
  },

  async createSite(input: NetworkScannerSiteInput): Promise<NetworkScannerSite> {
    return request(async () => {
      await UnifiedAPIService.auth.getCsrf();
      const response = await api.post(NETWORK_SCANNER_ROUTES.sites, serializeNetworkSite(input), { loaderMessage: "Creating authorized network site..." });
      const site = normalizeNetworkSites(response.data)[0];
      if (!site) throw new NetworkScannerApiError("The server returned incomplete site metadata.");
      return site;
    });
  },

  async listAgents(query?: { clientId?: string; siteId?: string }): Promise<NetworkScannerAgent[]> {
    return request(async () => {
      const response = await api.get(NETWORK_SCANNER_ROUTES.agents, {
        params: {
          ...(query?.clientId ? { client_id: query.clientId } : {}),
          ...(query?.siteId ? { site_id: query.siteId } : {}),
        },
        skipGlobalLoader: true,
      });
      return normalizeNetworkAgents(response.data);
    });
  },

  async controlAgent(agentId: string, action: NetworkAgentControlAction): Promise<NetworkScannerAgent> {
    return request(async () => {
      await UnifiedAPIService.auth.getCsrf();
      const response = await api.post(NETWORK_SCANNER_ROUTES.agentControl(agentId), { action }, { loaderMessage: action === "collect" ? "Requesting network collection..." : `${action === "start" ? "Starting" : "Stopping"} network monitoring...` });
      const envelope = response.data && typeof response.data === "object"
        ? response.data as { data?: { agent?: unknown } }
        : {};
      const agent = normalizeNetworkAgent(envelope.data?.agent);
      if (!agent) throw new NetworkScannerApiError("The server returned incomplete agent control metadata.");
      return agent;
    });
  },

  async getOverview(): Promise<NetworkScannerOverview> {
    return request(async () => {
      const response = await api.get(NETWORK_SCANNER_ROUTES.overview, { skipGlobalLoader: true });
      return normalizeNetworkOverview(response.data);
    });
  },

  async getInventoryPage(query?: { clientId?: string; siteId?: string; search?: string; page?: number; pageSize?: number }): Promise<NetworkInventoryPage> {
    return request(async () => {
      const response = await api.get(NETWORK_SCANNER_ROUTES.inventory, {
        params: {
          ...(query?.clientId ? { client_id: query.clientId } : {}),
          ...(query?.siteId ? { site_id: query.siteId } : {}),
          ...(query?.search?.trim() ? { search: query.search.trim() } : {}),
          ...(query?.page ? { page: query.page } : {}),
          ...(query?.pageSize ? { page_size: query.pageSize } : {}),
        },
        skipGlobalLoader: true,
      });
      return normalizeNetworkInventoryPage(response.data);
    });
  },

  async listInventory(query?: { clientId?: string; siteId?: string; search?: string }): Promise<NetworkInventoryAsset[]> {
    return (await this.getInventoryAll(query)).assets;
  },

  async getInventoryAll(query?: { clientId?: string; siteId?: string; search?: string }): Promise<NetworkInventoryPage> {
    const pageSize = 500;
    const maximumLoadedAssets = 10_000;
    const assets: NetworkInventoryAsset[] = [];
    const seenAssetIds = new Set<string>();
    let page = 1;
    let total = 0;
    let summary: NetworkInventoryPage["summary"] = {
      totalAssets: 0,
      activeAssets: 0,
      staleAssets: 0,
      newAssets24h: 0,
      macIdentified: 0,
      hostnameIdentified: 0,
      vendorIdentified: 0,
      servicesIdentified: 0,
      ipv4Assets: 0,
      ipv6Assets: 0,
    };

    while (assets.length < maximumLoadedAssets) {
      const result = await this.getInventoryPage({ ...query, page, pageSize });
      total = result.total;
      summary = result.summary;
      const before = assets.length;
      for (const asset of result.assets) {
        if (!seenAssetIds.has(asset.id) && assets.length < maximumLoadedAssets) {
          seenAssetIds.add(asset.id);
          assets.push(asset);
        }
      }
      if (
        result.assets.length < pageSize
        || assets.length >= total
        || assets.length === before
      ) {
        break;
      }
      page += 1;
    }

    return { assets, total, page: 1, pageSize: assets.length || pageSize, summary };
  },

  async createEnrollment(input: NetworkAgentEnrollmentInput): Promise<NetworkAgentEnrollment> {
    return request(async () => {
      await UnifiedAPIService.auth.getCsrf();
      const response = await api.post(
        NETWORK_SCANNER_ROUTES.enrollments,
        serializeNetworkEnrollment(input),
        { loaderMessage: "Creating secure network-agent enrollment..." },
      );
      return normalizeNetworkEnrollment(response.data);
    });
  },

  async downloadArtifact(enrollment: NetworkAgentEnrollment): Promise<DownloadedNetworkAgent> {
    return request(async () => {
      const path = artifactApiPath(enrollment.artifact.downloadUrl);
      const response = await api.get<Blob>(path, { responseType: "blob", timeout: 120_000, loaderMessage: "Downloading and verifying network agent..." });
      const contentType = String(response.headers["content-type"] ?? "").toLowerCase();
      if (contentType.includes("application/json") || contentType.includes("text/html")) {
        throw new NetworkScannerApiError("The server did not return an agent package.");
      }
      if (enrollment.artifact.sizeBytes !== null && response.data.size !== enrollment.artifact.sizeBytes) {
        throw new NetworkScannerApiError("Agent package size verification failed. The file was not saved.");
      }
      const responseSha256 = responseHeader(response.headers, "x-artifact-sha256")?.toLowerCase();
      if (
        responseSha256 !== undefined
        && (!/^[a-f0-9]{64}$/.test(responseSha256) || responseSha256 !== enrollment.artifact.sha256)
      ) {
        throw new NetworkScannerApiError("Agent package checksum metadata mismatch. The file was not saved.");
      }
      const actualSha256 = await sha256Hex(response.data);
      if (actualSha256 !== enrollment.artifact.sha256) {
        throw new NetworkScannerApiError("Agent package checksum verification failed. The file was not saved.");
      }
      const isPythonPackage = enrollment.artifact.fileName.toLowerCase().endsWith(".zip");
      const fallback = isPythonPackage
        ? `ForgeSecNetworkAgent-Python-${enrollment.artifact.version}.zip`
        : `ForgeSecNetworkAgent-${enrollment.artifact.version}-windows-amd64.exe`;
      return {
        blob: response.data,
        fileName: safeInstallerFileName(enrollment.artifact.fileName, fallback),
        sha256: actualSha256,
      };
    });
  },
};
