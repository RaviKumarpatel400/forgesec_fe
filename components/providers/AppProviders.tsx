"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { onLoaderChange } from "../../lib/loader";
import { onToast, type ToastPayload } from "../../lib/toast";

type ToastItem = ToastPayload & { id: number };
const toastTitles = {
  error: "Action unsuccessful",
  info: "Information",
  success: "Success",
  warning: "Attention"
} as const;

function GlobalLoader() {
  const [requests, setRequests] = useState(0);
  const [message, setMessage] = useState("Loading your workspace...");

  useEffect(() => onLoaderChange(
    (detail) => {
      setRequests((current) => current + 1);
      if (detail.message) setMessage(detail.message);
    },
    () => setRequests((current) => Math.max(0, current - 1))
  ), []);

  if (requests === 0) return null;
  return (
    <div className="global-loader" role="status" aria-live="polite" aria-label={message}>
      <div className="global-loader-backdrop" />
      <div className="global-loader-panel">
        <div className="global-loader-mark" aria-hidden="true"><span /><span /><i>FS</i></div>
        <strong>{message}</strong>
        <p>Protected connection in progress</p>
        <div className="global-loader-track" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}

function ToastIcon({ type }: { type: ToastPayload["type"] }) {
  if (type === "success") return <path d="m7 12 3 3 7-7" />;
  if (type === "error") return <><path d="m9 9 6 6M15 9l-6 6" /><circle cx="12" cy="12" r="9" /></>;
  if (type === "warning") return <><path d="M12 8v5M12 17h.01" /><path d="M10.3 4.8 3.1 18a1.5 1.5 0 0 0 1.3 2.2h15.2a1.5 1.5 0 0 0 1.3-2.2L13.7 4.8a1.9 1.9 0 0 0-3.4 0Z" /></>;
  return <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>;
}

function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  useEffect(() => onToast((payload) => {
    const item = { ...payload, id: nextId.current++ };
    setToasts((current) => [...current.slice(-3), item]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id));
    }, 4800);
  }), []);

  if (toasts.length === 0) return null;
  return (
    <div className="toast-region" aria-live="polite" aria-label="Notifications">
      {toasts.map((item) => (
        <div className={`app-toast app-toast-${item.type}`} key={item.id} role={item.type === "error" ? "alert" : "status"}>
          <span className="app-toast-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><ToastIcon type={item.type} /></svg></span>
          <span className="app-toast-content"><strong>{item.title ?? toastTitles[item.type]}</strong><span>{item.message}</span></span>
          <button aria-label="Dismiss notification" onClick={() => setToasts((current) => current.filter((toastItem) => toastItem.id !== item.id))} type="button">×</button>
          <i className="app-toast-progress" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

export default function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 10 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 5 * 60 * 1000
      }
    }
  }));

  return <QueryClientProvider client={queryClient}>{children}<GlobalLoader /><Toaster /></QueryClientProvider>;
}
