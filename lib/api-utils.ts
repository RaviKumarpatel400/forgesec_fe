function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configured && (
    (configured.startsWith("/") && !configured.startsWith("//"))
    || /^https?:\/\//i.test(configured)
  )) {
    return trimTrailingSlash(configured);
  }

  throw new Error("NEXT_PUBLIC_API_BASE_URL must be configured in .env.local.");
}

export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
