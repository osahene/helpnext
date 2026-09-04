import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware, config } from "./middleware";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./utils/authCookieNames";

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fakeJwt({ exp }) {
  const header = base64url({ alg: "none", typ: "JWT" });
  const payload = base64url({ exp });
  return `${header}.${payload}.signature`;
}

const FUTURE = Math.floor(Date.now() / 1000) + 3600;
const PAST = Math.floor(Date.now() / 1000) - 3600;

function requestFor(pathname, cookies = {}) {
  const request = new NextRequest(new URL(pathname, "https://example.com"));
  for (const [name, value] of Object.entries(cookies)) {
    request.cookies.set(name, value);
  }
  return request;
}

describe("middleware", () => {
  it("protects both /contact and /notifications", () => {
    expect(config.matcher).toEqual(
      expect.arrayContaining(["/contact/:path*", "/notifications/:path*"])
    );
  });

  it("lets unprotected routes through with no cookies", () => {
    const response = middleware(requestFor("/emergencylines"));
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects to login when /contact is visited with no tokens", () => {
    const response = middleware(requestFor("/contact"));
    expect(response.headers.get("location")).toBe("https://example.com/auth/login");
  });

  it("redirects to login when /notifications is visited with an expired access token and no refresh token", () => {
    const response = middleware(
      requestFor("/notifications", { [ACCESS_TOKEN_COOKIE]: fakeJwt({ exp: PAST }) })
    );
    expect(response.headers.get("location")).toBe("https://example.com/auth/login");
  });

  it("allows /contact through with a valid access token", () => {
    const response = middleware(
      requestFor("/contact", { [ACCESS_TOKEN_COOKIE]: fakeJwt({ exp: FUTURE }) })
    );
    expect(response.headers.get("location")).toBeNull();
  });

  it("allows /notifications through on a valid refresh token even if the access token expired", () => {
    const response = middleware(
      requestFor("/notifications", {
        [ACCESS_TOKEN_COOKIE]: fakeJwt({ exp: PAST }),
        [REFRESH_TOKEN_COOKIE]: fakeJwt({ exp: FUTURE }),
      })
    );
    expect(response.headers.get("location")).toBeNull();
  });
});
