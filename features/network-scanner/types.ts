export type NetworkAgentStatus = "online" | "degraded" | "offline" | "pending";

export type NetworkAgentLicenseStatus =
  | "active"
  | "expiring"
  | "pending"
  | "disabled"
  | "expired"
  | "revoked";

export type NetworkAgentPlatform = "windows" | "linux";

export type NetworkAgentServiceState =
  | "running"
  | "degraded"
  | "stopped"
  | "starting"
  | "stopping"
  | "unknown";

export type NetworkAgentCollectionState =
  | "collecting"
  | "idle"
  | "stopped"
  | "success"
  | "partial"
  | "failed"
  | "never"
  | "unknown";

export type NetworkAgentTelemetryStatus = "healthy" | "queued" | "error" | "unknown";

export type NetworkAgentScopeState = "pending" | "authorized" | "partial" | "blocked" | "unknown";

export interface NetworkDetectedNetwork {
  cidr: string;
  interfaceName: string | null;
  localAddress: string | null;
  gateway: string | null;
  isDefault: boolean;
  scopeStatus: "authorized" | "partial" | "not_authorized" | "unknown";
  authorized: boolean;
}

export interface NetworkScannerClient {
  id: string;
  name: string;
  status: boolean;
}

export interface NetworkScannerSite {
  id: string;
  clientId: string;
  name: string;
  allowedNetworks: string[];
  excludedNetworks: string[];
  isActive: boolean;
  maxHosts: number;
}

export interface NetworkScannerSiteInput {
  clientId: string;
  name: string;
  allowedNetworks: string[];
  excludedNetworks: string[];
  maxHosts: number;
}

export interface NetworkInventoryAsset {
  id: string;
  hostname: string;
  ipAddress: string;
  macAddress: string;
  sourceAgentId: string;
  site: string;
  firstSeenAt: string;
  lastSeenAt: string;
  observationSource?: "local_interface" | "neighbor_cache" | "unknown";
  observationSources?: Array<"local_interface" | "neighbor_cache" | "unknown">;
  observationMethod?: "os_interface_table" | "os_neighbor_cache" | "unknown";
  confidence?: number | null;
  interfaceName?: string | null;
  state?: string | null;
  freshness: "active" | "stale" | "unknown";
  ageSeconds: number | null;
  vendor: string;
  deviceType: string;
  operatingSystem: string;
  services: NetworkInventoryService[];
}

export interface NetworkInventoryService {
  port: number | null;
  protocol: string;
  name: string;
  product: string;
  version: string;
  state: string;
}

export interface NetworkInventoryPage {
  assets: NetworkInventoryAsset[];
  total: number;
  page: number;
  pageSize: number;
  summary: NetworkInventorySummary;
}

export interface NetworkInventorySummary {
  totalAssets: number;
  activeAssets: number;
  staleAssets: number;
  newAssets24h: number;
  macIdentified: number;
  hostnameIdentified: number;
  vendorIdentified: number;
  servicesIdentified: number;
  ipv4Assets: number;
  ipv6Assets: number;
}

export interface NetworkScannerAgent {
  id: string;
  name: string;
  site: string;
  status: NetworkAgentStatus;
  platform: string;
  version: string;
  localAddress: string;
  lastHeartbeatAt: string | null;
  discoveredAssets: number;
  spoolDepth: number;
  licenseStatus: NetworkAgentLicenseStatus;
  certificateExpiresAt: string | null;
  clientId?: string;
  clientName?: string;
  siteId?: string;
  createdAt: string | null;
  activatedAt?: string | null;
  serviceState: NetworkAgentServiceState;
  collectionState: NetworkAgentCollectionState;
  lastCollectionAt: string | null;
  nextCollectionAt: string | null;
  collectionError: string | null;
  collectionIntervalSeconds: number | null;
  lastCollectionObservations: number | null;
  lastCollectionDurationMs: number | null;
  deadLetterCount: number;
  detectedNetworks: NetworkDetectedNetwork[];
  scopeState: NetworkAgentScopeState;
  telemetryStatus: NetworkAgentTelemetryStatus;
  desiredCollectionState: "running" | "stopped";
  controlRevision: number;
  controlRevisionApplied: number | null;
  collectRequestedRevision: number;
  collectRevisionApplied: number | null;
}

export type NetworkAgentControlAction = "start" | "stop" | "collect";

export interface NetworkActivity {
  id: string;
  type: "agent" | "asset" | "system";
  title: string;
  detail: string;
  occurredAt: string;
  tone: "success" | "warning" | "info";
}

export interface NetworkScannerOverview {
  summary: {
    sites: number;
    totalAgents: number;
    onlineAgents: number;
    totalAssets: number;
    activeAssets: number;
    staleAssets: number;
    lastSnapshotAt: string | null;
  };
  recentAgents: NetworkScannerAgent[];
  recentAssets: NetworkInventoryAsset[];
}

export interface NetworkAgentArtifact {
  platform: NetworkAgentPlatform;
  architecture: "amd64";
  version: string;
  downloadUrl: string;
  sha256: string;
  fileName: string;
  sizeBytes: number | null;
  signed: boolean | null;
  development: boolean;
}

export interface NetworkAgentConfiguration {
  serverUrl: string;
  stateDirectory: string;
  agentVersion: string;
  connectTimeoutSeconds: number;
  readTimeoutSeconds: number;
  maxResponseBytes: number;
  maxRequestBytes: number;
}

export interface NetworkAgentEnrollmentInput {
  clientId: string;
  /** Existing-site enrollment remains supported for older callers. */
  siteId?: string;
  /** Simple onboarding lets the server create and manage the internal site. */
  allowedNetworks?: string[];
  /** New agents can let the installed service detect a private local network. */
  autoDiscoverNetwork?: boolean;
  /** Required proof that an administrator authorized inventory on that LAN. */
  networkAuthorizationConfirmed?: boolean;
  agentName: string;
  platform?: NetworkAgentPlatform;
  architecture?: "amd64";
}

export interface NetworkAgentEnrollment {
  enrollmentId: string;
  activationKey: string;
  activationExpiresAt: string;
  licenseTier: string;
  licenseStatus: string;
  artifact: NetworkAgentArtifact;
  /** Legacy bootstrap metadata; universal agents no longer require a customer config file. */
  configuration?: NetworkAgentConfiguration;
}

export interface DownloadedNetworkAgent {
  blob: Blob;
  fileName: string;
  sha256: string;
}
