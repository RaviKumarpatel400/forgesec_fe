/** Explain the common 172.x misunderstanding before the server rejects it. */
export function privateNetworkRangeWarning(value: string): string | null {
  for (const candidate of value.split(/[\r\n,]+/).map((item) => item.trim()).filter(Boolean)) {
    const match = /^172\.(\d{1,3})\./.exec(candidate);
    if (!match) continue;
    const secondOctet = Number(match[1]);
    if (secondOctet < 16 || secondOctet > 31) {
      return `${candidate} is not a private network. Private 172 addresses run only from 172.16.x.x to 172.31.x.x.`;
    }
  }
  return null;
}

/**
 * Resolve an enrollment owner without ever picking an arbitrary client.
 * A server-returned site is authoritative, then an explicit page context, and
 * finally the only active client when the choice is unambiguous.
 */
export function resolveNetworkAgentClientId(
  activeClientIds: string[],
  selectedSiteClientId?: string | null,
  pageClientId?: string | null,
): string {
  const allowed = [...new Set(activeClientIds.map((id) => id.trim()).filter(Boolean))];
  const isAllowed = (value?: string | null): value is string => (
    typeof value === "string" && allowed.includes(value.trim())
  );

  if (isAllowed(selectedSiteClientId)) return selectedSiteClientId.trim();
  if (isAllowed(pageClientId)) return pageClientId.trim();
  return allowed.length === 1 ? allowed[0] ?? "" : "";
}
