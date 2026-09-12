type ApiErrorResponse = {
  data?: { code?: unknown; detail?: unknown; error?: unknown; message?: unknown };
};

export type ApiError = {
  code?: string;
  message?: string;
  request?: unknown;
  response?: ApiErrorResponse;
};

function textValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const apiError = error as ApiError;
  const responseData = apiError.response?.data;
  if (responseData) {
    if (String(responseData.code ?? "").toLowerCase() === "email_not_verified") {
      return "User verification is pending. Please contact your administrator.";
    }
    return textValue(responseData.error) ?? textValue(responseData.detail) ?? textValue(responseData.message) ?? fallback;
  }
  if (apiError.request || apiError.code === "ERR_NETWORK") {
    return "Unable to connect to the server. Please check that the backend is running.";
  }
  return textValue(apiError.message) ?? fallback;
}
