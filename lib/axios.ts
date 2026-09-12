import axios from "axios";
import { getApiBaseUrl, getCsrfToken } from "./api-utils";
import { startLoading, stopLoading } from "./loader";

declare module "axios" {
  export interface AxiosRequestConfig {
    loaderMessage?: string;
    skipGlobalLoader?: boolean;
  }
}

export const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  timeout: 30000,
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken"
});

api.interceptors.request.use((config) => {
  if (!config.skipGlobalLoader) startLoading(config.loaderMessage);
  const csrfToken = getCsrfToken();
  if (csrfToken && !config.headers["X-CSRFToken"]) config.headers["X-CSRFToken"] = csrfToken;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (!response.config.skipGlobalLoader) stopLoading();
    return response;
  },
  (error: unknown) => {
    const config = (error as { config?: { skipGlobalLoader?: boolean } }).config;
    if (!config?.skipGlobalLoader) stopLoading();
    return Promise.reject(error);
  }
);
