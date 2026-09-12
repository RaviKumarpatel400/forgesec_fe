import { AI_PENTEST_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";

export type KnowledgeBaseEntry = {
  id: number; cve_id: string; cve?: string; script_path: string; script_filename: string; script_type: string;
  is_enabled: boolean; is_safe_to_run: boolean; is_runnable?: boolean; default_timeout_seconds: number;
  default_args: Record<string, unknown>; metadata: Record<string, unknown>; compatibility_status?: string;
  compatibility_score?: number | null; compatibility_issues?: string[]; compatibility_warnings?: string[];
  title?: string | null; description?: string | null; cvss_score?: number | null; severity?: string | null;
  created_at: string | null; updated_at: string | null;
};
export type KnowledgeBaseSummary = { total: number; enabled: number; safe: number; python: number; compatibility_ready: number; compatibility_review: number; compatibility_disabled: number; runnable: number; runner_review: number; runner_disabled: number };
export type KnowledgeBaseResponse = { success: boolean; error?: string; data: KnowledgeBaseEntry[]; pagination: { total: number; page: number; page_size: number; total_pages: number }; summary?: Partial<KnowledgeBaseSummary> };
export type KnowledgeBaseParams = { page?: number; pageSize?: number; search?: string; scriptType?: string; enabled?: boolean | "all"; compatibility?: "ready" | "review" | "disabled" | "all" };

export const KnowledgeBaseService = {
  async list(params: KnowledgeBaseParams = {}, background = false): Promise<KnowledgeBaseResponse> {
    const response = await api.post<KnowledgeBaseResponse>(AI_PENTEST_ROUTES.knowledgeBase, {
      page: params.page ?? 1,
      page_size: params.pageSize ?? 12,
      ...(params.search ? { search: params.search } : {}),
      ...(params.scriptType ? { script_type: params.scriptType } : {}),
      ...(params.enabled !== undefined ? { is_enabled: params.enabled } : {}),
      ...(params.compatibility !== undefined ? { compatibility_status: params.compatibility } : {})
    }, { skipGlobalLoader: background, loaderMessage: "Loading AI knowledge base..." });
    if (response.data.success === false) throw new Error(response.data.error || "Unable to load the AI knowledge base.");
    return response.data;
  }
} as const;
