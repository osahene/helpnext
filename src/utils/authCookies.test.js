import { describe, it, expect, beforeEach } from "vitest";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "./authCookies";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./authCookieNames";

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fakeJwt(exp) {
  const header = base64url({ alg: "none", typ: "JWT" });
  const payload = base64url({ exp });
  return `${header}.${payload}.signature`;
}

describe("authCookies", () => {
  beforeEach(() => {
    clearAuthCookies();
  });

  it("returns null when no tokens are set", () => {
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it("round-trips both tokens through setAuthCookies", () => {
    setAuthCookies({ accessToken: "access-123", refreshToken: "refresh-456" });

    expect(getAccessToken()).toBe("access-123");
    expect(getRefreshToken()).toBe("refresh-456");
    expect(document.cookie).toContain(`${ACCESS_TOKEN_COOKIE}=access-123`);
    expect(document.cookie).toContain(`${REFRESH_TOKEN_COOKIE}=refresh-456`);
  });

  it("clears a cookie whose value is falsy while keeping the other", () => {
    setAuthCookies({ accessToken: "access-123", refreshToken: "refresh-456" });
    setAuthCookies({ accessToken: "access-789" }); // refreshToken omitted

    expect(getAccessToken()).toBe("access-789");
    expect(getRefreshToken()).toBeNull();
  });

  it("clearAuthCookies removes both tokens", () => {
    setAuthCookies({ accessToken: "access-123", refreshToken: "refresh-456" });
    clearAuthCookies();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  // Regression test for a real incident: the access-token cookie's browser
  // expiry was once keyed off the *access* token's own (short, ~15 minute)
  // exp claim. That made the cookie — and the token string inside it —
  // physically vanish from the browser shortly after login, which starves
  // the request interceptor and refresh scheduler of the very thing they
  // need to notice a refresh is due (both gate on `if (accessToken)` being
  // truthy at all). The fix keys both cookies off the refresh token's exp
  // instead, since that's the real session-lifetime bound.
  it("keeps the access-token cookie alive past the access token's own (already-expired) exp, as long as the refresh token is still valid", () => {
    const pastExp = Math.floor(Date.now() / 1000) - 60 * 60; // expired an hour ago
    const futureExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // valid for a day

    setAuthCookies({
      accessToken: fakeJwt(pastExp),
      refreshToken: fakeJwt(futureExp),
    });

    // The cookie must still be physically present — a past Expires value
    // would have the browser delete it immediately, which is exactly the
    // bug: the JWT being logically expired is not the same thing as the
    // cookie holding it being gone.
    expect(getAccessToken()).toBe(fakeJwt(pastExp));
    expect(getRefreshToken()).toBe(fakeJwt(futureExp));
  });
});
