import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuthGate from "./AuthGate";

const replace = vi.fn();
let mockPathname = "/";
let mockIsAuthenticated = false;
let mockEnrollment = {};

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ replace }),
}));

vi.mock("react-redux", () => ({
  useSelector: (selector) =>
    selector({ auth: { isAuthenticated: mockIsAuthenticated, ...mockEnrollment } }),
}));

describe("AuthGate", () => {
  beforeEach(() => {
    replace.mockClear();
    mockPathname = "/";
    mockIsAuthenticated = false;
    mockEnrollment = {};
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

  it("resumes at the passkey step when the OTP was passed but step 3 wasn't", async () => {
    mockEnrollment = { enrollmentToken: "tok", enrollmentIssuedAt: Date.now() };
    mockPathname = "/auth/login";
    render(
      <AuthGate>
        <div>login form</div>
      </AuthGate>
    );

    expect(screen.queryByText("login form")).not.toBeInTheDocument();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/auth/passkey"));
  });

  it("shows the passkey step itself while enrollment is pending", () => {
    mockEnrollment = { enrollmentToken: "tok", enrollmentIssuedAt: Date.now() };
    mockPathname = "/auth/passkey";
    render(
      <AuthGate>
        <div>passkey step</div>
      </AuthGate>
    );

    expect(screen.getByText("passkey step")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("ignores an enrollment token older than 24 hours", () => {
    mockEnrollment = {
      enrollmentToken: "tok",
      enrollmentIssuedAt: Date.now() - 25 * 60 * 60 * 1000,
    };
    mockPathname = "/auth/login";
    render(
      <AuthGate>
        <div>login form</div>
      </AuthGate>
    );

    expect(screen.getByText("login form")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
