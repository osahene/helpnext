import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuthGate from "./AuthGate";

const replace = vi.fn();
let mockPathname = "/";
let mockIsAuthenticated = false;

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ replace }),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector) => selector({ auth: { isAuthenticated: mockIsAuthenticated } }),
}));

describe("AuthGate", () => {
  beforeEach(() => {
    replace.mockClear();
    mockPathname = "/";
    mockIsAuthenticated = false;
  });

  it("renders a public route for an unauthenticated visitor, no redirect", () => {
    mockPathname = "/emergencylines";
    render(
      <AuthGate>
        <div>public content</div>
      </AuthGate>
    );

    expect(screen.getByText("public content")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("renders the home page for an unauthenticated visitor, no redirect", () => {
    mockPathname = "/";
    render(
      <AuthGate>
        <div>home content</div>
      </AuthGate>
    );

    expect(screen.getByText("home content")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects an unauthenticated visitor away from a protected route, without flashing its content", async () => {
    mockPathname = "/contact";
    render(
      <AuthGate>
        <div>secret content</div>
      </AuthGate>
    );

    expect(screen.queryByText("secret content")).not.toBeInTheDocument();
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/auth/login?redirect=%2Fcontact")
    );
  });

  it("renders a protected route for an authenticated visitor", () => {
    mockIsAuthenticated = true;
    mockPathname = "/profile";
    render(
      <AuthGate>
        <div>secret content</div>
      </AuthGate>
    );

    expect(screen.getByText("secret content")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("renders /notifications for an authenticated visitor", () => {
    mockIsAuthenticated = true;
    mockPathname = "/notifications";
    render(
      <AuthGate>
        <div>secret content</div>
      </AuthGate>
    );

    expect(screen.getByText("secret content")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects an authenticated visitor away from the login page", async () => {
    mockIsAuthenticated = true;
    mockPathname = "/auth/login";
    render(
      <AuthGate>
        <div>login form</div>
      </AuthGate>
    );

    expect(screen.queryByText("login form")).not.toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/contact"));
  });

  it("lets an authenticated visitor stay on the registration page's sub-routes too", () => {
    mockIsAuthenticated = false;
    mockPathname = "/auth/register";
    render(
      <AuthGate>
        <div>register form</div>
      </AuthGate>
    );

    expect(screen.getByText("register form")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
