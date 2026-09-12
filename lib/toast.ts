export type ToastType = "success" | "error" | "info" | "warning";
export type ToastPayload = { message: string; title?: string; type: ToastType };

const TOAST_EVENT = "forgesec:toast";

export function emitToast(message: string, type: ToastType = "info", title?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastPayload>(TOAST_EVENT, { detail: { message, title, type } }));
}

export const toast = {
  success: (message: string, title?: string) => emitToast(message, "success", title),
  error: (message: string, title?: string) => emitToast(message, "error", title),
  info: (message: string, title?: string) => emitToast(message, "info", title),
  warning: (message: string, title?: string) => emitToast(message, "warning", title)
};

export function onToast(callback: (payload: ToastPayload) => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  const handler = (event: Event) => callback((event as CustomEvent<ToastPayload>).detail);
  window.addEventListener(TOAST_EVENT, handler);
  return () => window.removeEventListener(TOAST_EVENT, handler);
}
