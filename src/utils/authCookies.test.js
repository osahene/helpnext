import { describe, it, expect, beforeEach } from "vitest";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "./authCookies";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./authCookieNames";

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

  // Regression guard: the cookie's own browser-side lifetime must never be
  // derived from the token's content (an earlier version decoded the JWT's
  // `exp` claim and used that as the cookie's Expires — see authCookies.js's
  // header comment for the incident that caused). A plain, arbitrary token
  // string — not a real JWT at all — must still be stored and read back
  // exactly as given, proving nothing here inspects the token's content.
  it("stores and returns an arbitrary token string unchanged, regardless of its content", () => {
    const notAJwt = "this-is-not-a-jwt-and-has-no-exp-claim";
    setAuthCookies({ accessToken: notAJwt, refreshToken: notAJwt });

    expect(getAccessToken()).toBe(notAJwt);
    expect(getRefreshToken()).toBe(notAJwt);
  });
});
