const SHA256_INITIAL_STATE = new Uint32Array([
  0x6a09e667,
  0xbb67ae85,
  0x3c6ef372,
  0xa54ff53a,
  0x510e527f,
  0x9b05688c,
  0x1f83d9ab,
  0x5be0cd19,
]);

const SHA256_ROUND_CONSTANTS = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

export const SHA256_FALLBACK_CHUNK_BYTES = 1024 * 1024;

type Sha256DigestProvider = Pick<SubtleCrypto, "digest">;

type Sha256BlobOptions = {
  /** Pass null to force the incremental implementation, including in tests. */
  subtle?: Sha256DigestProvider | null;
};

function rotateRight(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

class IncrementalSha256 {
  private readonly state = new Uint32Array(SHA256_INITIAL_STATE);
  private readonly words = new Uint32Array(64);
  private readonly pending = new Uint8Array(64);
  private pendingLength = 0;
  private byteLength = 0;
  private finalized = false;

  update(input: Uint8Array): void {
    if (this.finalized) throw new Error("SHA-256 digest has already been finalized.");
    if (input.byteLength === 0) return;

    this.byteLength += input.byteLength;
    if (!Number.isSafeInteger(this.byteLength) || this.byteLength > Number.MAX_SAFE_INTEGER / 8) {
      throw new Error("SHA-256 input is too large to represent safely.");
    }

    let offset = 0;
    if (this.pendingLength > 0) {
      const copied = Math.min(64 - this.pendingLength, input.byteLength);
      this.pending.set(input.subarray(0, copied), this.pendingLength);
      this.pendingLength += copied;
      offset = copied;
      if (this.pendingLength === 64) {
        this.compress(this.pending, 0);
        this.pendingLength = 0;
      }
    }

    while (offset + 64 <= input.byteLength) {
      this.compress(input, offset);
      offset += 64;
    }

    if (offset < input.byteLength) {
      const remainder = input.subarray(offset);
      this.pending.set(remainder, 0);
      this.pendingLength = remainder.byteLength;
    }
  }

  digestHex(): string {
    if (this.finalized) throw new Error("SHA-256 digest has already been finalized.");
    this.finalized = true;

    const finalLength = this.pendingLength < 56 ? 64 : 128;
    const finalBlocks = new Uint8Array(finalLength);
    finalBlocks.set(this.pending.subarray(0, this.pendingLength));
    finalBlocks[this.pendingLength] = 0x80;

    const bitLengthHigh = Math.floor(this.byteLength / 0x20000000) >>> 0;
    const bitLengthLow = (this.byteLength * 8) >>> 0;
    const lengthOffset = finalBlocks.byteLength - 8;
    finalBlocks[lengthOffset] = bitLengthHigh >>> 24;
    finalBlocks[lengthOffset + 1] = bitLengthHigh >>> 16;
    finalBlocks[lengthOffset + 2] = bitLengthHigh >>> 8;
    finalBlocks[lengthOffset + 3] = bitLengthHigh;
    finalBlocks[lengthOffset + 4] = bitLengthLow >>> 24;
    finalBlocks[lengthOffset + 5] = bitLengthLow >>> 16;
    finalBlocks[lengthOffset + 6] = bitLengthLow >>> 8;
    finalBlocks[lengthOffset + 7] = bitLengthLow;

    for (let offset = 0; offset < finalBlocks.byteLength; offset += 64) {
      this.compress(finalBlocks, offset);
    }

    const digest = new Uint8Array(32);
    for (let index = 0; index < this.state.length; index += 1) {
      const value = this.state[index];
      const offset = index * 4;
      digest[offset] = value >>> 24;
      digest[offset + 1] = value >>> 16;
      digest[offset + 2] = value >>> 8;
      digest[offset + 3] = value;
    }
    return bytesToHex(digest);
  }

  private compress(input: Uint8Array, offset: number): void {
    for (let index = 0; index < 16; index += 1) {
      const wordOffset = offset + index * 4;
      this.words[index] = (
        (input[wordOffset] << 24)
        | (input[wordOffset + 1] << 16)
        | (input[wordOffset + 2] << 8)
        | input[wordOffset + 3]
      ) >>> 0;
    }

    for (let index = 16; index < 64; index += 1) {
      const previous15 = this.words[index - 15];
      const previous2 = this.words[index - 2];
      const sigma0 = rotateRight(previous15, 7) ^ rotateRight(previous15, 18) ^ (previous15 >>> 3);
      const sigma1 = rotateRight(previous2, 17) ^ rotateRight(previous2, 19) ^ (previous2 >>> 10);
      this.words[index] = (
        this.words[index - 16]
        + sigma0
        + this.words[index - 7]
        + sigma1
      ) >>> 0;
    }

    let a = this.state[0];
    let b = this.state[1];
    let c = this.state[2];
    let d = this.state[3];
    let e = this.state[4];
    let f = this.state[5];
    let g = this.state[6];
    let h = this.state[7];

    for (let index = 0; index < 64; index += 1) {
      const sigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choose = (e & f) ^ (~e & g);
      const temporary1 = (h + sigma1 + choose + SHA256_ROUND_CONSTANTS[index] + this.words[index]) >>> 0;
      const sigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temporary2 = (sigma0 + majority) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temporary1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temporary1 + temporary2) >>> 0;
    }

    this.state[0] = (this.state[0] + a) >>> 0;
    this.state[1] = (this.state[1] + b) >>> 0;
    this.state[2] = (this.state[2] + c) >>> 0;
    this.state[3] = (this.state[3] + d) >>> 0;
    this.state[4] = (this.state[4] + e) >>> 0;
    this.state[5] = (this.state[5] + f) >>> 0;
    this.state[6] = (this.state[6] + g) >>> 0;
    this.state[7] = (this.state[7] + h) >>> 0;
  }
}

function availableSubtleCrypto(): Sha256DigestProvider | undefined {
  try {
    return globalThis.crypto?.subtle;
  } catch {
    return undefined;
  }
}

/**
 * Hash a browser Blob with native Web Crypto when available. Browsers served over
 * plain LAN HTTP may omit SubtleCrypto, so the fallback processes one bounded
 * chunk at a time and still produces a complete SHA-256 digest.
 */
export async function sha256BlobHex(blob: Blob, options: Sha256BlobOptions = {}): Promise<string> {
  const subtle = options.subtle === null ? undefined : options.subtle ?? availableSubtleCrypto();
  if (subtle) {
    try {
      const digest = new Uint8Array(await subtle.digest("SHA-256", await blob.arrayBuffer()));
      if (digest.byteLength === 32) return bytesToHex(digest);
    } catch {
      // Continue with the deterministic implementation when native crypto is unavailable at runtime.
    }
  }

  const hasher = new IncrementalSha256();
  for (let offset = 0; offset < blob.size; offset += SHA256_FALLBACK_CHUNK_BYTES) {
    const end = Math.min(offset + SHA256_FALLBACK_CHUNK_BYTES, blob.size);
    const chunk = new Uint8Array(await blob.slice(offset, end).arrayBuffer());
    hasher.update(chunk);
  }
  return hasher.digestHex();
}
