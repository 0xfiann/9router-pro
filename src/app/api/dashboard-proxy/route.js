import { NextResponse } from "next/server";
import { getInternalApiToken } from "@/lib/auth/internalToken.js";
import { getConsistentMachineId } from "@/shared/utils/machineId";
import { UPDATER_CONFIG } from "@/shared/constants/config";

export const dynamic = "force-dynamic";

const CLI_TOKEN_SALT = "9r-cli-auth";

// GET/POST /api/dashboard-proxy?path=/v1/... — dashboard-only relay to the
// router's own /v1 pipeline. Session-protected by the proxy guard
// (dashboardGuard.js denies /api/* by default, so this route requires a
// dashboard session or CLI token like every other dashboard route).
//
// Client API keys are hashed at rest and GET /api/keys returns only
// keyMasked/last4, so no dashboard surface can supply a Bearer token
// anymore. This route supplies the credential server-side instead — the
// same pattern as /api/models/test (ping.js getInternalHeaders): the
// internal service token (accepted by validateApiKey, never exposed via
// API) plus the machine CLI token. The upstream response (status,
// content-type, body — including SSE streams and binary payloads) passes
// through verbatim, so callers keep their existing response handling.
//
// The target is always this server's own /api/v1/* — the path allowlist
// below is the whole surface; nothing else is reachable through here.
function isAllowedPath(path) {
  if (typeof path !== "string" || !path.startsWith("/v1/")) return false;
  if (path.includes("..") || path.includes("\\") || path.includes("#")) return false;
  if (/\s/.test(path)) return false;
  return true;
}

async function handleProxy(request) {
  const path = new URL(request.url).searchParams.get("path") || "";
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: "Invalid or missing path" }, { status: 400 });
  }
  const method = request.method;
  if (method !== "GET" && method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // Forward only the headers a /v1 call needs from the client; auth is
  // server-side only and always overwritten below. Content-Type carries
  // the multipart boundary for audio uploads, so it must pass through.
  const headers = {};
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  const accept = request.headers.get("accept");
  if (accept) headers["Accept"] = accept;
  const connectionId = request.headers.get("x-connection-id");
  if (connectionId) headers["x-connection-id"] = connectionId;

  // Router keys are hashed at rest, so a stored user key is no longer a
  // usable plaintext credential. Use the server-side internal service
  // token (accepted by validateApiKey, never exposed via API).
  let apiKey = null;
  try {
    apiKey = await getInternalApiToken();
  } catch {}
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  headers["x-9r-cli-token"] = await getConsistentMachineId(CLI_TOKEN_SALT);

  const baseUrl = `http://127.0.0.1:${process.env.PORT || UPDATER_CONFIG.appPort}`;
  let body;
  if (method === "POST") {
    body = await request.arrayBuffer();
  }

  try {
    const upstream = await fetch(`${baseUrl}/api${path}`, {
      method,
      headers,
      body,
      signal: request.signal,
    });
    const resHeaders = new Headers();
    const upstreamType = upstream.headers.get("content-type");
    if (upstreamType) resHeaders.set("content-type", upstreamType);
    return new Response(upstream.body, { status: upstream.status, headers: resHeaders });
  } catch (err) {
    // Client went away (e.g. Basic Chat Stop) — nothing left to answer.
    if (err?.name === "AbortError") throw err;
    return NextResponse.json(
      { error: `Upstream request failed: ${err?.message || err}` },
      { status: 502 }
    );
  }
}

export async function GET(request) {
  return handleProxy(request);
}

export async function POST(request) {
  return handleProxy(request);
}
