export function sanitizeNetworkScannerServerMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const message = value.trim();
  if (!message || message.length > 1_000) return null;
  if (/^\s*<!doctype\s+html/i.test(message) || /^\s*<html(?:\s|>)/i.test(message)) return null;
  return message;
}
