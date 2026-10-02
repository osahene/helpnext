import { describe, it, expect, vi, beforeEach } from "vitest";

const authCookies = vi.hoisted(() => ({
  setAuthCookies: vi.fn(),
  clearAuthCookies: vi.fn(),
}));
vi.mock("../utils/authCookies", () => authCookies);

const { authCookieSyncMiddleware } = await import("./store");

function makeStoreAPI(initialAuth) {
  let auth = initialAuth;
  return {
    getState: () => ({ auth }),
    _setAuth: (next) => {
      auth = next;
    },
  };
}

describe("authCookieSyncMiddleware", () => {
  beforeEach(() => {
    authCookies.setAuthCookies.mockClear();
    authCookies.clearAuthCookies.mockClear();
  });

  it("writes cookies when a real action sets fresh tokens", () => {
    const storeAPI = makeStoreAPI({ accessToken: null, refreshToken: null });
    const next = (action) => {
      storeAPI._setAuth({ accessToken: "access-1", refreshToken: "refresh-1" });
      return action;
    };

    authCookieSyncMiddleware(storeAPI)(next)({ type: "auth/login/fulfilled" });

    expect(authCookies.setAuthCookies).toHaveBeenCalledWith({
      accessToken: "access-1",
      refreshToken: "refresh-1",
    });
    expect(authCookies.clearAuthCookies).not.toHaveBeenCalled();
  });

  it("still clears cookies on a real logout action", () => {
    const storeAPI = makeStoreAPI({ accessToken: "access-1", refreshToken: "refresh-1" });
    const next = (action) => {
      storeAPI._setAuth({ accessToken: null, refreshToken: null });
      return action;
    };

    authCookieSyncMiddleware(storeAPI)(next)({ type: "auth/logout" });

    expect(authCookies.clearAuthCookies).toHaveBeenCalled();
    expect(authCookies.setAuthCookies).not.toHaveBeenCalled();
  });

  // Regression test for a real incident: redux-persist's REHYDRATE replaces
  // `state.auth` wholesale with whatever was in localStorage. authTransform
  // (see store.js) strips accessToken/refreshToken before ever saving them,
  // so they're not merely `null` on the rehydrated object — the keys are
  // entirely absent, so reading them back gives `undefined`. The reducer's
  // own initialState has them as `null`. `undefined !== null`, so the
  // middleware's change-detection used to fire on every single rehydrate
  // (i.e. every page load), and since both were falsy it called
  // clearAuthCookies() — wiping out cookies that had just been written
  // correctly moments before, on every refresh. This is why a verify/login
  // flow could show the right cookies immediately, then lose them the
  // instant the page reloaded.
  it("does NOT touch cookies on persist/REHYDRATE, even though the rehydrated auth slice has no token keys at all", () => {
    const storeAPI = makeStoreAPI({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: true,
    });
    const next = (action) => {
      // Mirrors authTransform's outbound strip exactly: no accessToken/
      // refreshToken keys on the object at all, not even as null.
      storeAPI._setAuth({ isAuthenticated: true });
      return action;
    };

    authCookieSyncMiddleware(storeAPI)(next)({ type: "persist/REHYDRATE", payload: {} });

    expect(authCookies.clearAuthCookies).not.toHaveBeenCalled();
    expect(authCookies.setAuthCookies).not.toHaveBeenCalled();
  });

  it("also leaves cookies alone on persist/PERSIST", () => {
    const storeAPI = makeStoreAPI({ accessToken: "access-1", refreshToken: "refresh-1" });
    const next = (action) => action;

    authCookieSyncMiddleware(storeAPI)(next)({ type: "persist/PERSIST" });

    expect(authCookies.clearAuthCookies).not.toHaveBeenCalled();
    expect(authCookies.setAuthCookies).not.toHaveBeenCalled();
  });
});
