// Safely fetches a user-supplied public URL and extracts readable text from it.
// Used by the "Full-System Compression" live demo — a visitor pastes a link to
// their AI product (site, docs, API response) and we compress the real content.
//
// Security: this endpoint accepts an arbitrary URL from an unauthenticated-feeling
// public demo, so it must not be usable to reach internal/private infrastructure
// (SSRF). We block loopback, private, link-local, and other reserved ranges,
// only allow http/https, cap response size, and enforce a hard timeout.

import dns from "dns/promises";
import net from "net";

const MAX_BYTES   = 300_000;  // stop reading after ~300KB
const FETCH_TIMEOUT_MS = 8000;
const MAX_TEXT_CHARS   = 8000; // trim extracted text before sending to Claude

export class UrlFetchError extends Error {}

function isBlockedIp(ip: string): boolean {
  if (net.isIP(ip) === 4) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    if (a === 127) return true;                         // loopback
    if (a === 10) return true;                           // private
    if (a === 169 && b === 254) return true;              // link-local
    if (a === 172 && b >= 16 && b <= 31) return true;     // private
    if (a === 192 && b === 168) return true;              // private
    if (a === 0) return true;                             // "this network"
    if (a >= 224) return true;                            // multicast/reserved
    return false;
  }
  if (net.isIP(ip) === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1") return true;                     // loopback
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
    if (lower.startsWith("fe80")) return true;             // link-local
    return false;
  }
  return true; // unknown format — fail closed
}

async function assertPublicHost(hostname: string): Promise<void> {
  const lower = hostname.toLowerCase();
  if (lower === "localhost" || lower.endsWith(".local") || lower.endsWith(".internal")) {
    throw new UrlFetchError("That host isn't reachable from the public demo.");
  }
  // If the hostname is already a literal IP, check it directly.
  if (net.isIP(hostname)) {
    if (isBlockedIp(hostname)) throw new UrlFetchError("That address isn't reachable from the public demo.");
    return;
  }
  let addresses: string[];
  try {
    const results = await dns.lookup(hostname, { all: true });
    addresses = results.map((r) => r.address);
  } catch {
    throw new UrlFetchError("Couldn't resolve that hostname.");
  }
  if (addresses.length === 0 || addresses.some(isBlockedIp)) {
    throw new UrlFetchError("That address isn't reachable from the public demo.");
  }
}

export function normalizeUrl(raw: string): URL {
  let candidate = raw.trim();
  if (!candidate) throw new UrlFetchError("Please enter a URL.");
  if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new UrlFetchError("That doesn't look like a valid URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new UrlFetchError("Only http/https links are supported.");
  }
  if (parsed.username || parsed.password) {
    throw new UrlFetchError("Credentials in the URL aren't supported.");
  }
  return parsed;
}

// Strips tags/scripts/styles and decodes the handful of entities that show up
// in real pages — enough to turn HTML into readable plain text for a demo.
export function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6])\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

export type FetchedSource = {
  url: string;
  hostname: string;
  contentType: string;
  text: string;
  bytesRead: number;
};

// Fetches the URL with a strict timeout + size cap, then extracts plain text.
export async function fetchPublicUrlAsText(rawUrl: string): Promise<FetchedSource> {
  const parsed = normalizeUrl(rawUrl);
  await assertPublicHost(parsed.hostname);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "CompressorAI-Demo/1.0 (+https://compressor.ai)" },
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new UrlFetchError("That page took too long to respond.");
    }
    throw new UrlFetchError("Couldn't reach that URL.");
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new UrlFetchError(`The page responded with HTTP ${res.status}.`);
  }

  // Re-validate the final host in case of redirects to a private address.
  await assertPublicHost(new URL(res.url).hostname);

  const contentType = res.headers.get("content-type") ?? "";
  const reader = res.body?.getReader();
  let received = 0;
  const chunks: Uint8Array[] = [];

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        received += value.byteLength;
        chunks.push(value);
        if (received >= MAX_BYTES) {
          await reader.cancel().catch(() => {});
          break;
        }
      }
    }
  }

  const buffer = Buffer.concat(chunks.map((c) => Buffer.from(c)));
  const raw = buffer.toString("utf-8");
  const isHtml = contentType.includes("html") || /<html/i.test(raw.slice(0, 500));
  const text = (isHtml ? htmlToText(raw) : raw).trim().slice(0, MAX_TEXT_CHARS);

  if (!text) {
    throw new UrlFetchError("Couldn't find any readable text at that link.");
  }

  return { url: parsed.toString(), hostname: parsed.hostname, contentType, text, bytesRead: received };
}
