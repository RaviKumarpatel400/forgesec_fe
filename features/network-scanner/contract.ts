import type {
  NetworkActivity,
  NetworkAgentArtifact,
  NetworkAgentConfiguration,
  NetworkAgentEnrollment,
  NetworkAgentEnrollmentInput,
  NetworkAgentLicenseStatus,
  NetworkAgentPlatform,
  NetworkAgentStatus,
  NetworkInventoryAsset,
  NetworkInventoryPage,
  NetworkInventorySummary,
  NetworkInventoryService,
  NetworkDetectedNetwork,
  NetworkScannerAgent,
  NetworkScannerClient,
  NetworkScannerSite,
  NetworkScannerSiteInput,
  NetworkScannerOverview,
} from "./types";

type JsonObject = Record<string, unknown>;

function record(value: unknown): JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as JsonObject)
    : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function first(source: JsonObject, ...keys: string[]): unknown {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key];
  }
  return undefined;
}

function text(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function userFacingNetworkName(value: unknown, fallback = "Unknown network"): string {
  const name = text(value, fallback);
  return name.replace(/\s+\[[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\]$/i, "");
}

function nullableText(value: unknown): string | null {
  return text(value) || null;
}

function nonNegativeInteger(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function boundedConfidence(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.max(0, Math.min(1, parsed > 1 ? parsed / 100 : parsed));
}

function optionalNonNegativeInteger(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function stringList(value: unknown): string[] {
  return array(value).map((item) => text(item)).filter(Boolean);
}

function normalizeService(value: unknown): NetworkInventoryService | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 1 && value <= 65_535
      ? { port: value, protocol: "", name: "", product: "", version: "", state: "" }
      : null;
  }
  if (typeof value === "string") {
    const label = text(value);
    const parsedPort = Number(label);
    if (Number.isInteger(parsedPort) && parsedPort >= 1 && parsedPort <= 65_535) {
      return { port: parsedPort, protocol: "", name: "", product: "", version: "", state: "" };
    }
    return label ? { port: null, protocol: "", name: label, product: "", version: "", state: "" } : null;
  }
  const raw = record(value);
  const parsedPort = Number(first(raw, "port", "port_number", "portNumber"));
  const port = Number.isInteger(parsedPort) && parsedPort >= 1 && parsedPort <= 65_535 ? parsedPort : null;
  const name = text(first(raw, "name", "service", "service_name", "serviceName"));
  const product = text(first(raw, "product", "software", "banner"));
  if (port === null && !name && !product) return null;
  return {
    port,
    protocol: text(first(raw, "protocol", "transport")),
    name,
    product,
    version: text(first(raw, "version", "product_version", "productVersion")),
    state: text(first(raw, "state", "status")),
  };
}

function normalizeServices(value: unknown): NetworkInventoryService[] {
  const services = array(value).flatMap((item) => {
    const service = normalizeService(item);
    return service ? [service] : [];
  });
  return services.filter((service, index) => services.findIndex((candidate) => (
    service.port !== null && candidate.port === service.port
      ? !candidate.protocol || !service.protocol || candidate.protocol === service.protocol
      : candidate.port === service.port
        && candidate.protocol === service.protocol
        && candidate.name === service.name
  )) === index);
}

function normalizeDetectedNetworks(value: unknown): NetworkDetectedNetwork[] {
  return array(value).flatMap((item) => {
    if (typeof item === "string") {
      const cidr = text(item);
      return cidr ? [{ cidr, interfaceName: null, localAddress: null, gateway: null, isDefault: false, scopeStatus: "unknown" as const, authorized: false }] : [];
    }
    const raw = record(item);
    const cidr = text(first(raw, "cidr", "network", "network_cidr", "networkCidr"));
    if (!cidr) return [];
    const scopeStatus = enumValue(
      first(raw, "scope_status", "scopeStatus"),
      ["authorized", "partial", "not_authorized", "unknown"] as const,
      "unknown",
    );
    return [{
      cidr,
      interfaceName: nullableText(first(raw, "interface_name", "interfaceName")),
      localAddress: nullableText(first(raw, "local_address", "localAddress", "ip_address", "ipAddress")),
      gateway: nullableText(raw.gateway),
      isDefault: first(raw, "is_default", "isDefault") === true,
      scopeStatus,
      authorized: raw.authorized === true || scopeStatus === "authorized",
    }];
  });
}

function normalizedData(value: unknown): unknown {
  const envelope = record(value);
  if (envelope.success === false) {
    throw new Error(text(envelope.message) || text(envelope.error) || "The network scanner request failed.");
  }
  return Object.hasOwn(envelope, "data") ? envelope.data : value;
}

function listFrom(value: unknown, ...keys: string[]): unknown[] {
  const data = normalizedData(value);
  if (Array.isArray(data)) return data;
  const container = record(data);
  for (const key of ["results", ...keys]) {
    if (Array.isArray(container[key])) return container[key] as unknown[];
  }
  return [];
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const normalized = text(value).toLowerCase().replaceAll("-", "_");
  return allowed.includes(normalized as T) ? (normalized as T) : fallback;
}

export function normalizeNetworkClients(value: unknown): NetworkScannerClient[] {
  return listFrom(value, "clients").flatMap((item) => {
    const raw = record(item);
    const id = text(first(raw, "id", "client_id", "clientId"));
    const name = text(first(raw, "name", "client_name", "clientName"));
    if (!id || !name) return [];
    return [{ id, name, status: first(raw, "status", "is_active", "isActive") !== false }];
  });
}

export function normalizeNetworkSite(value: unknown): NetworkScannerSite | null {
    const raw = record(value);
    const client = record(raw.client);
    const id = text(first(raw, "id", "site_id", "siteId"));
    const clientId = text(first(raw, "client_id", "clientId", "client")) || text(client.id);
    const name = userFacingNetworkName(first(raw, "name", "site_name", "siteName"), "");
    if (!id || !clientId || !name) return null;
    return {
      id,
      clientId,
      name,
      allowedNetworks: stringList(first(raw, "allowed_networks", "allowedNetworks")),
      excludedNetworks: stringList(first(raw, "excluded_networks", "excludedNetworks")),
      isActive: first(raw, "is_active", "isActive", "status") !== false,
      maxHosts: nonNegativeInteger(first(raw, "max_hosts", "maxHosts"), 4096),
    };
}

export function normalizeNetworkSites(value: unknown): NetworkScannerSite[] {
  const data = normalizedData(value);
  const container = record(data);
  const items = container.site ? [container.site] : listFrom(value, "sites");
  return items.flatMap((item) => {
    const site = normalizeNetworkSite(item);
    return site ? [site] : [];
  });
}

export function serializeNetworkSite(input: NetworkScannerSiteInput): Record<string, string | number | string[]> {
  const name = input.name.trim();
  const allowedNetworks = input.allowedNetworks.map((network) => network.trim()).filter(Boolean);
  const excludedNetworks = input.excludedNetworks.map((network) => network.trim()).filter(Boolean);
  if (!input.clientId.trim() || !name || name.length > 160 || allowedNetworks.length === 0) {
    throw new Error("Select a client, name the site, and add at least one approved private CIDR.");
  }
  if (!Number.isInteger(input.maxHosts) || input.maxHosts < 1 || input.maxHosts > 10_000) {
    throw new Error("Maximum hosts must be between 1 and 10,000.");
  }
  return {
    client_id: /^\d+$/.test(input.clientId) ? Number(input.clientId) : input.clientId,
    name,
    allowed_networks: allowedNetworks,
    excluded_networks: excludedNetworks,
    max_hosts: input.maxHosts,
  };
}

export function normalizeNetworkAgent(value: unknown): NetworkScannerAgent | null {
  const raw = record(value);
  const site = record(raw.site);
  const client = record(raw.client);
  const runtime = record(first(raw, "runtime", "runtime_status", "runtimeStatus"));
  const collection = record(first(raw, "collection", "collection_status", "collectionStatus"));
  const telemetry = record(first(raw, "telemetry", "telemetry_status", "telemetryStatus"));
  const id = text(first(raw, "id", "agent_id", "agentId"));
  if (!id) return null;

  const status = enumValue<NetworkAgentStatus>(
    first(raw, "status", "health_status", "healthStatus"),
    ["online", "degraded", "offline", "pending"],
    "offline",
  );
  const rawLicenseStatus = text(first(raw, "license_status", "licenseStatus", "authorization_state", "authorizationState"))
    .toLowerCase()
    .replaceAll("-", "_");
  const licenseStatus = rawLicenseStatus === "pending_activation"
    ? "pending"
    : enumValue<NetworkAgentLicenseStatus>(
      rawLicenseStatus,
      ["active", "expiring", "pending", "disabled", "expired", "revoked"],
      "pending",
    );
  const rawServiceState = text(
    first(raw, "service_state", "serviceState") ?? first(runtime, "service_state", "serviceState", "state"),
  ).toLowerCase().replaceAll("-", "_");
  const serviceState = rawServiceState === "active" || rawServiceState === "up"
    ? "running"
    : rawServiceState === "inactive" || rawServiceState === "down"
      ? "stopped"
      : enumValue(rawServiceState, ["running", "degraded", "stopped", "starting", "stopping", "unknown"] as const, "unknown");
  const rawCollectionState = text(
    first(raw, "collection_state", "collectionState", "last_collection_status", "lastCollectionStatus")
      ?? first(collection, "state", "status"),
  ).toLowerCase().replaceAll("-", "_");
  const collectionState = ["running", "in_progress"].includes(rawCollectionState)
    ? "collecting"
    : ["completed", "succeeded", "ok"].includes(rawCollectionState)
      ? "success"
      : ["error", "errored"].includes(rawCollectionState)
        ? "failed"
        : ["waiting", "scheduled"].includes(rawCollectionState)
          ? "idle"
          : enumValue(rawCollectionState, ["collecting", "idle", "stopped", "success", "partial", "failed", "never", "unknown"] as const, "unknown");
  const rawTelemetryStatus = text(
    first(raw, "telemetry_status", "telemetryStatus") ?? first(telemetry, "state", "status"),
  ).toLowerCase().replaceAll("-", "_");
  const telemetryStatus = ["ok", "connected", "delivered"].includes(rawTelemetryStatus)
    ? "healthy"
    : ["pending", "backlog"].includes(rawTelemetryStatus)
      ? "queued"
      : ["failed", "disconnected"].includes(rawTelemetryStatus)
        ? "error"
        : enumValue(rawTelemetryStatus, ["healthy", "queued", "error", "unknown"] as const, "unknown");

  return {
    id,
    name: text(first(raw, "name", "agent_name", "agentName"), id),
    clientId: nullableText(first(raw, "client_id", "clientId")) ?? nullableText(client.id) ?? undefined,
    clientName: nullableText(first(raw, "client_name", "clientName")) ?? nullableText(first(client, "name", "client_name")) ?? undefined,
    siteId: nullableText(first(raw, "site_id", "siteId")) ?? nullableText(first(site, "id", "site_id", "siteId")) ?? undefined,
    site: userFacingNetworkName(
      first(raw, "site_name", "siteName") ?? first(site, "name", "site_name"),
      "Unassigned network",
    ),
    status,
    platform: text(first(raw, "platform_label", "platformLabel", "platform", "operating_system"), "Unknown"),
    version: text(first(raw, "version", "agent_version", "agentVersion"), "Unknown"),
    localAddress: text(first(raw, "local_address", "localAddress", "ip_address", "ipAddress"), "Not reported"),
    lastHeartbeatAt: nullableText(first(raw, "last_heartbeat_at", "lastHeartbeatAt", "last_heartbeat", "lastSeen")),
    discoveredAssets: nonNegativeInteger(first(raw, "discovered_assets", "discoveredAssets", "asset_count")),
    spoolDepth: nonNegativeInteger(first(raw, "spool_depth", "spoolDepth", "outbox_pending")),
    licenseStatus,
    certificateExpiresAt: nullableText(first(raw, "certificate_expires_at", "certificateExpiresAt")),
    createdAt: nullableText(first(raw, "created_at", "createdAt")),
    activatedAt: nullableText(first(raw, "activated_at", "activatedAt")),
    serviceState,
    collectionState,
    lastCollectionAt: nullableText(
      first(raw, "last_collection_at", "lastCollectionAt") ?? first(collection, "last_completed_at", "lastCompletedAt", "completed_at", "completedAt"),
    ),
    nextCollectionAt: nullableText(
      first(raw, "next_collection_at", "nextCollectionAt") ?? first(collection, "next_run_at", "nextRunAt"),
    ),
    collectionError: nullableText(
      first(raw, "collection_error", "collectionError", "last_collection_error", "lastCollectionError", "last_error", "lastError") ?? first(collection, "error", "last_error", "lastError"),
    ),
    collectionIntervalSeconds: (() => {
      const value = first(raw, "collection_interval_seconds", "collectionIntervalSeconds")
        ?? first(collection, "interval_seconds", "intervalSeconds");
      return value === undefined || value === null ? null : nonNegativeInteger(value);
    })(),
    lastCollectionObservations: (() => {
      const value = first(raw, "last_collection_observations", "lastCollectionObservations")
        ?? first(collection, "observations", "observation_count", "observationCount");
      return value === undefined || value === null ? null : nonNegativeInteger(value);
    })(),
    lastCollectionDurationMs: (() => {
      const value = first(raw, "last_collection_duration_ms", "lastCollectionDurationMs")
        ?? first(collection, "duration_ms", "durationMs");
      return value === undefined || value === null ? null : nonNegativeInteger(value);
    })(),
    deadLetterCount: nonNegativeInteger(
      first(raw, "dead_letter_count", "deadLetterCount") ?? first(telemetry, "dead_letter_count", "deadLetterCount"),
    ),
    detectedNetworks: normalizeDetectedNetworks(
      first(raw, "detected_networks", "detectedNetworks", "local_networks", "localNetworks")
        ?? first(runtime, "detected_networks", "detectedNetworks", "networks"),
    ),
    scopeState: (() => {
      const rawScopeState = text(
        first(raw, "scope_state", "scopeState") ?? first(runtime, "scope_state", "scopeState"),
      ).toLowerCase().replaceAll("-", "_");
      if (["awaiting_detection", "waiting", "detecting"].includes(rawScopeState)) return "pending" as const;
      if (rawScopeState === "configured") return "authorized" as const;
      if (["not_authorized", "denied", "needs_review"].includes(rawScopeState)) return "blocked" as const;
      return enumValue(rawScopeState, ["pending", "authorized", "partial", "blocked", "unknown"] as const, "unknown");
    })(),
    telemetryStatus,
    desiredCollectionState: enumValue(
      first(raw, "desired_collection_state", "desiredCollectionState"),
      ["running", "stopped"] as const,
      "running",
    ),
    controlRevision: nonNegativeInteger(first(raw, "control_revision", "controlRevision")),
    controlRevisionApplied: (() => {
      const value = first(raw, "control_revision_applied", "controlRevisionApplied");
      return value === undefined || value === null ? null : nonNegativeInteger(value);
    })(),
    collectRequestedRevision: nonNegativeInteger(
      first(raw, "collect_requested_revision", "collectRequestedRevision"),
    ),
    collectRevisionApplied: (() => {
      const value = first(raw, "collect_revision_applied", "collectRevisionApplied");
      return value === undefined || value === null ? null : nonNegativeInteger(value);
    })(),
  };
}

export function normalizeNetworkAgents(value: unknown): NetworkScannerAgent[] {
  return listFrom(value, "agents").flatMap((item) => {
    const agent = normalizeNetworkAgent(item);
    return agent ? [agent] : [];
  });
}

export function normalizeNetworkAsset(value: unknown): NetworkInventoryAsset | null {
  const raw = record(value);
  const site = record(raw.site);
  const agent = record(first(raw, "source_agent", "agent"));
  const details = record(first(raw, "details", "metadata", "fingerprint"));
  const ipAddress = text(first(raw, "ip_address", "ipAddress", "address"));
  const id = text(first(raw, "id", "asset_id", "assetId", "observation_id", "observationId"));
  if (!id || !ipAddress) return null;
  const confidence = boundedConfidence(first(raw, "confidence", "os_confidence", "osConfidence"));
  const lastSeenAt = text(first(raw, "last_seen_at", "lastSeenAt", "last_observed_at", "observed_at"));
  const firstSeenAt = text(first(raw, "first_seen_at", "firstSeenAt"), lastSeenAt);
  const observationSources = array(raw.sources)
    .map((source) => enumValue(source, ["local_interface", "neighbor_cache", "unknown"] as const, "unknown"))
    .filter((source, index, values) => values.indexOf(source) === index);
  const observationSource = enumValue(
    first(raw, "source", "observation_source"),
    ["local_interface", "neighbor_cache", "unknown"] as const,
    observationSources[0] ?? "unknown",
  );

  return {
    id,
    hostname: text(first(raw, "hostname", "host_name", "name"), ipAddress),
    ipAddress,
    macAddress: text(first(raw, "mac_address", "macAddress"), "Not reported"),
    sourceAgentId: text(first(raw, "source_agent_id", "sourceAgentId", "agent_id", "agentId")) || text(agent.id, "Unknown"),
    site: userFacingNetworkName(
      first(raw, "site_name", "siteName") ?? first(site, "name", "site_name"),
    ),
    firstSeenAt,
    lastSeenAt,
    observationSource,
    observationSources: observationSources.length ? observationSources : [observationSource],
    observationMethod: enumValue(first(raw, "detection_method", "method", "observation_method"), ["os_interface_table", "os_neighbor_cache", "unknown"] as const, "unknown"),
    confidence,
    interfaceName: nullableText(first(raw, "interface_name", "interfaceName")),
    state: nullableText(raw.state),
    freshness: enumValue(raw.freshness, ["active", "stale", "unknown"] as const, "unknown"),
    ageSeconds: optionalNonNegativeInteger(first(raw, "age_seconds", "ageSeconds")),
    vendor: text(
      first(raw, "vendor", "manufacturer", "mac_vendor", "macVendor")
        ?? first(details, "vendor", "manufacturer", "mac_vendor", "macVendor"),
      "Not identified",
    ),
    deviceType: text(
      first(raw, "device_type", "deviceType", "asset_type", "assetType", "category")
        ?? first(details, "device_type", "deviceType", "asset_type", "assetType", "category"),
      "Unclassified",
    ),
    operatingSystem: text(
      first(raw, "operating_system", "operatingSystem", "os", "os_name", "osName")
        ?? first(details, "operating_system", "operatingSystem", "os", "os_name", "osName"),
      "Not identified",
    ),
    services: normalizeServices([
      ...array(first(raw, "services", "open_services", "openServices") ?? first(details, "services", "open_services", "openServices")),
      ...array(first(raw, "open_ports", "openPorts") ?? first(details, "open_ports", "openPorts")),
    ]),
  };
}

export function normalizeNetworkInventory(value: unknown): NetworkInventoryAsset[] {
  return listFrom(value, "inventory", "assets", "observations").flatMap((item) => {
    const asset = normalizeNetworkAsset(item);
    return asset ? [asset] : [];
  });
}

export function normalizeNetworkInventoryPage(value: unknown): NetworkInventoryPage {
  const data = record(normalizedData(value));
  const assets = normalizeNetworkInventory(value);
  const total = nonNegativeInteger(first(data, "count", "total"), assets.length);
  const summary = normalizeNetworkInventorySummary(data.summary, total, assets);
  return {
    assets,
    total,
    page: Math.max(1, nonNegativeInteger(data.page, 1)),
    pageSize: Math.max(1, nonNegativeInteger(first(data, "page_size", "pageSize"), assets.length || 100)),
    summary,
  };
}

function normalizeNetworkInventorySummary(
  value: unknown,
  totalFallback: number,
  assets: NetworkInventoryAsset[] = [],
): NetworkInventorySummary {
  const raw = record(value);
  const activeFallback = assets.filter((asset) => asset.freshness === "active").length;
  const staleFallback = assets.filter((asset) => asset.freshness === "stale").length;
  return {
    totalAssets: nonNegativeInteger(first(raw, "total_assets", "totalAssets"), totalFallback),
    activeAssets: nonNegativeInteger(first(raw, "active_assets", "activeAssets"), activeFallback),
    staleAssets: nonNegativeInteger(first(raw, "stale_assets", "staleAssets"), staleFallback),
    newAssets24h: nonNegativeInteger(first(raw, "new_assets_24h", "newAssets24h")),
    macIdentified: nonNegativeInteger(first(raw, "mac_identified", "macIdentified")),
    hostnameIdentified: nonNegativeInteger(first(raw, "hostname_identified", "hostnameIdentified")),
    vendorIdentified: nonNegativeInteger(first(raw, "vendor_identified", "vendorIdentified")),
    servicesIdentified: nonNegativeInteger(first(raw, "services_identified", "servicesIdentified")),
    ipv4Assets: nonNegativeInteger(first(raw, "ipv4_assets", "ipv4Assets")),
    ipv6Assets: nonNegativeInteger(first(raw, "ipv6_assets", "ipv6Assets")),
  };
}

export function normalizeNetworkOverview(value: unknown): NetworkScannerOverview {
  const data = record(normalizedData(value));
  const summary = record(data.summary);
  return {
    summary: {
      sites: nonNegativeInteger(summary.sites),
      totalAgents: nonNegativeInteger(first(summary, "total_agents", "totalAgents")),
      onlineAgents: nonNegativeInteger(first(summary, "online_agents", "onlineAgents")),
      totalAssets: nonNegativeInteger(first(summary, "total_assets", "totalAssets")),
      activeAssets: nonNegativeInteger(first(summary, "active_assets", "activeAssets")),
      staleAssets: nonNegativeInteger(first(summary, "stale_assets", "staleAssets")),
      lastSnapshotAt: nullableText(first(summary, "last_snapshot_at", "lastSnapshotAt")),
    },
    recentAgents: normalizeNetworkAgents({ agents: data.recent_agents ?? data.recentAgents }),
    recentAssets: normalizeNetworkInventory({ assets: data.recent_assets ?? data.recentAssets }),
  };
}

function normalizeArtifact(value: unknown): NetworkAgentArtifact {
  const raw = record(value);
  const platform = enumValue<NetworkAgentPlatform>(raw.platform, ["windows", "linux"], "windows");
  const version = text(raw.version);
  const downloadUrl = text(first(raw, "download_url", "downloadUrl"));
  const sha256 = text(raw.sha256).toLowerCase();
  if (!version || !downloadUrl || !/^[a-f0-9]{64}$/.test(sha256)) {
    throw new Error("The server returned incomplete agent package metadata.");
  }
  return {
    platform,
    architecture: "amd64",
    version,
    downloadUrl,
    sha256,
    fileName: text(first(raw, "file_name", "fileName"), `ForgeSecNetworkAgent-${version}-${platform}-amd64${platform === "windows" ? ".exe" : ""}`),
    sizeBytes: first(raw, "size_bytes", "sizeBytes") === undefined ? null : nonNegativeInteger(first(raw, "size_bytes", "sizeBytes")),
    signed: typeof raw.signed === "boolean" ? raw.signed : null,
    development: raw.development === true || raw.signed !== true,
  };
}

function normalizeConfiguration(value: unknown): NetworkAgentConfiguration {
  const raw = record(value);
  const serverUrl = text(first(raw, "server_url", "serverUrl"));
  const stateDirectory = text(first(raw, "state_directory", "stateDirectory"));
  const agentVersion = text(first(raw, "agent_version", "agentVersion"));
  if (!serverUrl.startsWith("https://") || !stateDirectory || !agentVersion) {
    throw new Error("The server returned incomplete agent configuration.");
  }
  return {
    serverUrl,
    stateDirectory,
    agentVersion,
    connectTimeoutSeconds: nonNegativeInteger(first(raw, "connect_timeout_seconds", "connectTimeoutSeconds"), 5),
    readTimeoutSeconds: nonNegativeInteger(first(raw, "read_timeout_seconds", "readTimeoutSeconds"), 30),
    maxResponseBytes: nonNegativeInteger(first(raw, "max_response_bytes", "maxResponseBytes"), 1_048_576),
    maxRequestBytes: nonNegativeInteger(first(raw, "max_request_bytes", "maxRequestBytes"), 4_194_304),
  };
}

export function normalizeNetworkEnrollment(value: unknown): NetworkAgentEnrollment {
  const raw = record(normalizedData(value));
  const license = record(raw.license);
  const enrollmentId = text(first(raw, "enrollment_id", "enrollmentId"));
  const activationKey = text(first(raw, "license_key", "licenseKey", "activation_key", "activationKey"));
  const activationExpiresAt = text(first(raw, "activation_expires_at", "activationExpiresAt"));
  if (!enrollmentId || !activationKey || !activationExpiresAt) {
    throw new Error("The server returned an incomplete one-time enrollment.");
  }
  const rawConfiguration = record(raw.configuration);
  const configuredServerUrl = text(first(rawConfiguration, "server_url", "serverUrl"));
  const configurationRequired = raw.configuration_required === true || rawConfiguration.required === true;
  if (configurationRequired && !configuredServerUrl) {
    throw new Error("The server returned incomplete required agent configuration.");
  }
  const configuration = configuredServerUrl ? normalizeConfiguration(rawConfiguration) : undefined;
  return {
    enrollmentId,
    activationKey,
    activationExpiresAt,
    licenseTier: text(license.tier, "STANDARD"),
    licenseStatus: text(license.status, "pending_activation"),
    artifact: normalizeArtifact(raw.artifact),
    ...(configuration ? { configuration } : {}),
  };
}

export function networkAgentConfigJson(configuration: NetworkAgentConfiguration): string {
  return JSON.stringify({
    server_url: configuration.serverUrl,
    state_directory: configuration.stateDirectory,
    agent_version: configuration.agentVersion,
    connect_timeout_seconds: configuration.connectTimeoutSeconds,
    read_timeout_seconds: configuration.readTimeoutSeconds,
    max_response_bytes: configuration.maxResponseBytes,
    max_request_bytes: configuration.maxRequestBytes,
  }, null, 2);
}

export function serializeNetworkEnrollment(input: NetworkAgentEnrollmentInput): Record<string, string | number | boolean | string[]> {
  const agentName = input.agentName.trim();
  const siteId = input.siteId?.trim() ?? "";
  const allowedNetworks = (input.allowedNetworks ?? []).map((network) => network.trim()).filter(Boolean);
  if (!input.clientId.trim() || agentName.length < 3 || agentName.length > 120) {
    throw new Error("Select an organization and enter an agent name between 3 and 120 characters.");
  }
  return {
    client_id: /^\d+$/.test(input.clientId) ? Number(input.clientId) : input.clientId,
    ...(siteId
      ? { site_id: siteId }
      : allowedNetworks.length
        ? { allowed_networks: allowedNetworks }
        : {
          auto_discover_network: input.autoDiscoverNetwork !== false,
          network_authorization_confirmed: input.networkAuthorizationConfirmed === true,
        }),
    agent_name: agentName,
    platform: input.platform ?? "windows",
    architecture: input.architecture ?? "amd64",
  };
}

export function buildNetworkActivity(
  agents: NetworkScannerAgent[],
  assets: NetworkInventoryAsset[],
): NetworkActivity[] {
  const agentEvents: NetworkActivity[] = agents.flatMap((agent) => agent.lastHeartbeatAt ? [{
    id: `agent-${agent.id}-${agent.lastHeartbeatAt}`,
    type: "agent",
    title: agent.status === "online" ? "Agent heartbeat received" : "Agent needs attention",
    detail: `${agent.name}${agent.clientName ? ` for ${agent.clientName}` : ""} is ${agent.status}.`,
    occurredAt: agent.lastHeartbeatAt,
    tone: agent.status === "online" ? "success" : "warning",
  }] : []);
  const assetEvents: NetworkActivity[] = assets.slice(0, 20).flatMap((asset) => asset.lastSeenAt ? [{
    id: `asset-${asset.id}-${asset.lastSeenAt}`,
    type: "asset",
    title: "Asset observation received",
    detail: `${asset.hostname} (${asset.ipAddress}) was reported at ${asset.site}.`,
    occurredAt: asset.lastSeenAt,
    tone: "info",
  }] : []);
  return [...agentEvents, ...assetEvents]
    .sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt))
    .slice(0, 8);
}
