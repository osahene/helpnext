import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RouteGuard from "./RouteGuard";

const replace = vi.fn();
const dispatch = vi.fn();
let mockIsAuthenticated = false;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

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
    replace.mockClear();
    dispatch.mockClear();
    authCookies.getAccessToken.mockReset();
    authCookies.getRefreshToken.mockReset();
    mockIsAuthenticated = false;
  });

  it("redirects to login and never renders children when there is no valid session", async () => {
    authCookies.getAccessToken.mockReturnValue(null);
    authCookies.getRefreshToken.mockReturnValue(null);

    render(
      <RouteGuard>
        <div>secret content</div>
      </RouteGuard>
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/auth/login"));
    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
  });

  it("logs out a stale Redux session that no longer has a valid token", async () => {
    mockIsAuthenticated = true;
    authCookies.getAccessToken.mockReturnValue(fakeJwt(pastExp()));
    authCookies.getRefreshToken.mockReturnValue(null);

    render(
      <RouteGuard>
        <div>secret content</div>
      </RouteGuard>
    );

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/auth/login"));
    expect(dispatch).toHaveBeenCalledWith({ type: "auth/logout" });
  });

  it("renders children once a valid session is confirmed", async () => {
    mockIsAuthenticated = true;
    authCookies.getAccessToken.mockReturnValue(fakeJwt(futureExp()));
    authCookies.getRefreshToken.mockReturnValue(null);

    render(
      <RouteGuard>
        <div>secret content</div>
      </RouteGuard>
    );

    await waitFor(() => expect(screen.getByText("secret content")).toBeInTheDocument());
    expect(replace).not.toHaveBeenCalled();
  });
});
