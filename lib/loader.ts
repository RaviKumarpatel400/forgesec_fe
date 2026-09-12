export type LoaderEventDetail = { message?: string };

const LOADER_START_EVENT = "forgesec:loader:start";
const LOADER_STOP_EVENT = "forgesec:loader:stop";

export function startLoading(message?: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<LoaderEventDetail>(LOADER_START_EVENT, { detail: { message } }));
}

export function stopLoading(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOADER_STOP_EVENT));
}

export function onLoaderChange(
  onStart: (detail: LoaderEventDetail) => void,
  onStop: () => void
): () => void {
  if (typeof window === "undefined") return () => undefined;
  const startHandler = (event: Event) => onStart((event as CustomEvent<LoaderEventDetail>).detail ?? {});
  const stopHandler = () => onStop();
  window.addEventListener(LOADER_START_EVENT, startHandler);
  window.addEventListener(LOADER_STOP_EVENT, stopHandler);
  return () => {
    window.removeEventListener(LOADER_START_EVENT, startHandler);
    window.removeEventListener(LOADER_STOP_EVENT, stopHandler);
  };
}

export async function withLoader<T>(task: () => Promise<T>, message?: string): Promise<T> {
  startLoading(message);
  try {
    return await task();
  } finally {
    stopLoading();
  }
}
