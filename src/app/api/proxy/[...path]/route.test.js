import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

process.env.BACKEND_API_URL = "https://backend.example.test";
process.env.FRONTEND_API_KEY = "server-only-secret";

// BACKEND_API_URL is read at module-load time, so the env vars above must
// be set before this import.
const { GET, POST } = await import("./route.js");

function requestFor(pathname, init = {}) {
  return new NextRequest(new URL(pathname, "https://helpnext.example.test"), init);
}

describe("api/proxy/[...path]", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards to the backend with the server-only X-API-KEY attached", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    await GET(requestFor("/api/proxy/account/my-contacts/"), {
      params: Promise.resolve({ path: ["account", "my-contacts"] }),
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.example.test/account/my-contacts/");
    expect(opts.headers.get("x-api-key")).toBe("server-only-secret");
  });

  it("ignores any X-API-KEY the caller supplies instead of trusting it", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    await GET(
      requestFor("/api/proxy/account/my-contacts/", {
        headers: { "x-api-key": "attacker-supplied-key" },
      }),
      { params: Promise.resolve({ path: ["account", "my-contacts"] }) }
    );

    const opts = fetchMock.mock.calls[0][1];
    expect(opts.headers.get("x-api-key")).toBe("server-only-secret");
  });

  it("preserves the query string and forwards the Authorization header", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));

    await GET(
      requestFor("/api/proxy/notifications/?category=alert", {
        headers: { authorization: "Bearer abc123" },
      }),
      { params: Promise.resolve({ path: ["notifications"] }) }
    );

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.example.test/notifications/?category=alert");
    expect(opts.headers.get("authorization")).toBe("Bearer abc123");
  });

  it("forwards a JSON body on POST", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response("{}", { status: 201 }));

    await POST(
      requestFor("/api/proxy/account/user-login/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "a@b.com" }),
      }),
      { params: Promise.resolve({ path: ["account", "user-login"] }) }
    );

    const opts = fetchMock.mock.calls[0][1];
    expect(opts.method).toBe("POST");
    expect(new TextDecoder().decode(opts.body)).toBe(JSON.stringify({ email: "a@b.com" }));
  });

  it("returns 502 instead of throwing when the backend is unreachable", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("ECONNREFUSED"));

    const response = await GET(requestFor("/api/proxy/account/my-contacts/"), {
      params: Promise.resolve({ path: ["account", "my-contacts"] }),
    });

    expect(response.status).toBe(502);
  });

  it("passes through the backend's response status and body", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      })
    );

    const response = await GET(requestFor("/api/proxy/account/does-not-exist/"), {
      params: Promise.resolve({ path: ["account", "does-not-exist"] }),
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ detail: "not found" });
  });
});
