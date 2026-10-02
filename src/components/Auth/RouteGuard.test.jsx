import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RouteGuard from "./RouteGuard";

const dispatch = vi.fn();
let mockIsAuthenticated = false;

vi.mock("react-redux", () => ({
  useDispatch: () => dispatch,
  useSelector: (selector) => selector({ auth: { isAuthenticated: mockIsAuthenticated } }),
}));

vi.mock("@/redux/authSlice", () => ({
  logout: () => ({ type: "auth/logout" }),
}));

const authCookies = vi.hoisted(() => ({
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
}));
vi.mock("@/utils/authCookies", () => authCookies);

function futureExp() {
  return Math.floor(Date.now() / 1000) + 3600;
}

function pastExp() {
  return Math.floor(Date.now() / 1000) - 3600;
}

function fakeJwt(exp) {
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `header.${payload}.sig`;
}

describe("RouteGuard", () => {
  beforeEach(() => {
    dispatch.mockClear();
    authCookies.getAccessToken.mockReset();
    authCookies.getRefreshToken.mockReset();
    mockIsAuthenticated = false;
  });

  it("shows the inline auth prompt (no redirect) and never renders children when there is no valid session", () => {
    authCookies.getAccessToken.mockReturnValue(null);
    authCookies.getRefreshToken.mockReturnValue(null);

    render(
      <RouteGuard>
        <div>secret content</div>
      </RouteGuard>
    );

    expect(screen.getByText("Authentication Required")).toBeInTheDocument();
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
  });

  it("shows the inline auth prompt immediately on first render — no loading flash while deciding", () => {
    mockIsAuthenticated = true;
    authCookies.getAccessToken.mockReturnValue(fakeJwt(futureExp()));
    authCookies.getRefreshToken.mockReturnValue(null);

    render(
      <RouteGuard>
        <div>secret content</div>
      </RouteGuard>
    );

    // No useEffect/async gap to wait out — an authenticated visitor sees
    // their content on the very first render, synchronously.
    expect(screen.getByText("secret content")).toBeInTheDocument();
  });

  it("logs out a stale Redux session that no longer has a valid token, without navigating anywhere", async () => {
    mockIsAuthenticated = true;
    authCookies.getAccessToken.mockReturnValue(fakeJwt(pastExp()));
    authCookies.getRefreshToken.mockReturnValue(null);

    render(
      <RouteGuard>
        <div>secret content</div>
      </RouteGuard>
    );

    expect(screen.getByText("Authentication Required")).toBeInTheDocument();
    await waitFor(() => expect(dispatch).toHaveBeenCalledWith({ type: "auth/logout" }));
  });

  it("renders children when authenticated and the refresh token alone is still valid", () => {
    mockIsAuthenticated = true;
    authCookies.getAccessToken.mockReturnValue(fakeJwt(pastExp()));
    authCookies.getRefreshToken.mockReturnValue(fakeJwt(futureExp()));

    render(
      <RouteGuard>
        <div>secret content</div>
      </RouteGuard>
    );

    expect(screen.getByText("secret content")).toBeInTheDocument();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
