export function encodePasswordForTransport(password: string): string {
  const bytes = new TextEncoder().encode(password);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return globalThis.btoa(binary);
}
