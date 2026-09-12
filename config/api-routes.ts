export const AUTH_ROUTES = {
  csrf: "/auth/csrf/",
  login: "/auth/login/",
  logout: "/auth/logout/",
  me: "/auth/me/",
  register: "/auth/register/"
} as const;

export const BILLING_ROUTES = {
  checkout: "/billing/checkout/",
  checkoutStatus: "/billing/checkout/status/",
  plans: "/billing/plans/",
  portal: "/billing/portal/",
  subscription: "/billing/subscription/"
} as const;

export const DASHBOARD_ROUTES = {
  alerts: "/dashboard-alerts/",
  overview: "/overview/",
  scanQueue: "/scan-queue/"
} as const;

export const WEB_SCANNER_ROUTES = {
  clients: "/clients/sidebar/",
  scans: "/v1/webscanner/scans/",
  scan: (scanId: string) => `/v1/webscanner/scans/${encodeURIComponent(scanId)}/`,
  findings: (scanId: string) => `/v1/webscanner/scans/${encodeURIComponent(scanId)}/findings/`,
  report: (scanId: string) => `/v1/webscanner/scans/${encodeURIComponent(scanId)}/report/`,
  reportDownload: (scanId: string) => `/v1/webscanner/scans/${encodeURIComponent(scanId)}/report/download/`,
  target: (targetId: string) => `/v1/webscanner/targets/${encodeURIComponent(targetId)}/`,
  targets: "/v1/webscanner/targets/",
  verifyTarget: (targetId: string) => `/v1/webscanner/targets/${encodeURIComponent(targetId)}/verify/`
} as const;

export const OS_SCANNER_ROUTES = {
  assets: "/os-scans/assets/",
  cancel: (scanId: string) => `/os-scans/${encodeURIComponent(scanId)}/cancel/`,
  delete: (scanId: string) => `/os-scans/${encodeURIComponent(scanId)}/delete/`,
  download: (reportId: string, format: "json" | "pdf" | "xml" = "xml") => `/os-scans/reports/${encodeURIComponent(reportId)}/download/?export=${format}`,
  endpoints: "/os-scans/endpoints/",
  endpointInstaller: "/os-scans/endpoints/installer/",
  history: "/os-scans/history/",
  retry: (scanId: string) => `/os-scans/${encodeURIComponent(scanId)}/retry/`,
  start: "/os-scans/start/",
  summary: "/os-scans/summary/"
} as const;

export const API_SCANNER_ROUTES = {
  control: (scanId: string) => `/nuclei/scan/${encodeURIComponent(scanId)}/control`,
  create: "/nuclei/scan",
  detail: (scanId: string) => `/nuclei/scan/${encodeURIComponent(scanId)}`,
  health: "/nuclei/health",
  report: (scanId: string, format: "json" | "csv" | "pdf" = "json") => `/nuclei/report/${encodeURIComponent(scanId)}?report_format=${format}`,
  scans: "/nuclei/scans"
} as const;

export const NETWORK_SCANNER_ROUTES = {
  clients: "/clients/sidebar/",
  sites: "/v1/network-scanner/sites/",
  overview: "/v1/network-scanner/overview/",
  inventory: "/v1/network-scanner/inventory/",
  agents: "/v1/network-scanner/agents/",
  agentControl: (agentId: string) => `/v1/network-scanner/agents/${encodeURIComponent(agentId)}/control/`,
  enrollments: "/v1/network-scanner/enrollments/"
} as const;

export const AI_PENTEST_ROUTES = {
  launch: "/ai-scanner/launch/",
  reportsDashboard: "/ai-scanner/reports/dashboard/",
  scansDashboard: "/ai-scanner/scans/dashboard/",
  pipelineActive: "/ai-scanner/pipeline/active/",
  pipelineLive: (scanId: string) => `/ai-scanner/pipeline/${encodeURIComponent(scanId)}/live/`,
  pipelineAdvance: (scanId: string) => `/ai-scanner/pipeline/${encodeURIComponent(scanId)}/advance/`,
  pipelineControl: (scanId: string) => `/ai-scanner/pipeline/${encodeURIComponent(scanId)}/control/`,
  pipelineStageDetail: (scanId: string, stageKey: string) => `/ai-scanner/pipeline/${encodeURIComponent(scanId)}/stages/${encodeURIComponent(stageKey)}/`,
  generatedScriptRequests: "/ai-scanner/generated-scripts/requests/",
  knowledgeBase: "/ai-scanner/knowledge-base/",
  knowledgeBaseDetail: (cveId: string) => `/ai-scanner/knowledge-base/${encodeURIComponent(cveId)}/`,
  knowledgeBaseDownload: (cveId: string) => `/ai-scanner/knowledge-base/${encodeURIComponent(cveId)}/download/`,
  reportDetail: (reportId: string | number) => `/ai-scanner/reports/${encodeURIComponent(String(reportId))}/`,
  reportDownload: (reportId: string | number, format: "json" | "pdf") => `/ai-scanner/reports/${encodeURIComponent(String(reportId))}/download/?export=${format}`,
  evidenceBundle: (scanId: string) => `/ai-scanner/scans/${encodeURIComponent(scanId)}/evidence-bundle/?export=zip`
} as const;

export const API_ROUTES = {
  apiScanner: API_SCANNER_ROUTES,
  aiPentest: AI_PENTEST_ROUTES,
  auth: AUTH_ROUTES,
  billing: BILLING_ROUTES,
  dashboard: DASHBOARD_ROUTES,
  networkScanner: NETWORK_SCANNER_ROUTES,
  osScanner: OS_SCANNER_ROUTES,
  webScanner: WEB_SCANNER_ROUTES
} as const;
