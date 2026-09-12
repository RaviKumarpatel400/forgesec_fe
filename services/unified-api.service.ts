import { AUTH_ROUTES } from "../config/api-routes";
import { api } from "../lib/axios";
import { encodePasswordForTransport } from "../lib/password-obfuscation";

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = {
  email: string;
  password: string;
  tenant_name: string;
  username: string;
};
export type AuthUser = {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  username: string;
};
export type AuthTenant = { id?: number; name?: string; role?: string; slug?: string } | null;
export type LoginResponse = { message?: string; status: string; tenant?: AuthTenant; user?: AuthUser };
export type CurrentUserResponse = AuthUser & {
  permissions?: string[];
  roles?: string[];
  tenant?: AuthTenant;
};

export const UnifiedAPIService = {
  auth: {
    getCsrf: () => api.get<{ csrfToken: string }>(AUTH_ROUTES.csrf, {
      loaderMessage: "Securing your session..."
    }),
    login: ({ email, password }: LoginRequest) => api.post<LoginResponse>(
      AUTH_ROUTES.login,
      {
        email: email.trim().toLowerCase(),
        password_encoded: encodePasswordForTransport(password)
      },
      { loaderMessage: "Signing you in securely..." }
    ),
    register: ({ email, password, tenant_name, username }: RegisterRequest) => api.post<LoginResponse>(
      AUTH_ROUTES.register,
      {
        email: email.trim().toLowerCase(),
        password_encoded: encodePasswordForTransport(password),
        tenant_name: tenant_name.trim(),
        username: username.trim()
      },
      { loaderMessage: "Creating your secure workspace..." }
    ),
    logout: () => api.post(AUTH_ROUTES.logout, undefined, {
      loaderMessage: "Signing you out securely..."
    }),
    me: (skipGlobalLoader = false) => api.get<CurrentUserResponse>(
      AUTH_ROUTES.me,
      { skipGlobalLoader }
    )
  }
} as const;
