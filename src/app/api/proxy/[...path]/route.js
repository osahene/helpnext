import { NextResponse } from "next/server";

const BACKEND_API_URL = (
  process.env.BACKEND_API_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

// Headers that are per-hop, not meaningful (or actively wrong) to forward
// in either direction.
const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "x-api-key", // never trust a client-supplied one; we set our own below
]);
const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "content-encoding",
  "content-length",
]);

async function handle(request) {
  const targetPath = request.nextUrl.pathname.replace(/^\/api\/proxy/, "");
  const targetUrl = `${BACKEND_API_URL}${targetPath}${request.nextUrl.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  headers.set("x-api-key", process.env.FRONTEND_API_KEY || "");

  const clientIp =
    request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
  if (clientIp) headers.set("x-forwarded-for", clientIp);

  const hasBody = !["GET", "HEAD"].includes(request.method);

  let backendResponse;
  try {
    backendResponse = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
      cache: "no-store",
    });
  } catch (error) {
    return NextResponse.json(
      { detail: "Unable to reach the backend service." },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers();
  backendResponse.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });
  if (typeof backendResponse.headers.getSetCookie === "function") {
    for (const cookie of backendResponse.headers.getSetCookie()) {
      responseHeaders.append("set-cookie", cookie);
    }
  }

  const body = await backendResponse.arrayBuffer();
  return new NextResponse(body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export const dynamic = "force-dynamic";

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
