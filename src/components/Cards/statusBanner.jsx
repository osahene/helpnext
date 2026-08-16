"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

/* ── Adjust these to match your actual routes ───────────────────────────── */
const ROUTES = {
  login: "/auth/login",
  contacts: "/contact",
  addContact: "/contact",
};

/* Mirrors the backend's subscription_limits in CreateRelation */
const PLAN_LIMITS = { free: 5, pro: 10, advance: 15 };

/* Accents borrowed from the emergency cards so the banner stays in family */
const ACCENT = {
  signedOut: "#7B22CE",
  empty: "#CC2222",
  pending: "#E8500A",
  declined: "#8B5C00",
  growing: "#0A72C4",
  complete: "#1A9E5C",
};

/* ── Pure state derivation — exported so it's easy to unit test ─────────── */
export function deriveBannerState({
  isAuthenticated,
  contacts,
  loadData,
  maxContacts,
}) {
  if (!isAuthenticated) {
    return {
      key: "signedOut",
      accent: ACCENT.signedOut,
      icon: "lock_person",
      title: "You're not signed in",
      body: "Sign in with the button above so your alerts reach the people who care about you.",
      cta: { label: "Login", href: ROUTES.login },
      showMeter: false,
    };
  }

  const total = contacts.length;
  const approved = contacts.filter((c) => c.status === "approved").length;
  const pending = contacts.filter((c) => c.status === "pending").length;
  const declined = contacts.filter((c) => c.status === "rejected").length;

  // Still fetching and we have nothing cached to show yet.
  if (loadData === "loading" && total === 0) {
    return {
      key: "loading",
      accent: ACCENT.growing,
      icon: "sync",
      title: "Checking your contacts",
      body: "One moment while we load the people on your list.",
      cta: null,
      showMeter: false,
      spin: true,
    };
  }

  if (loadData === "failed" && total === 0) {
    return {
      key: "error",
      accent: ACCENT.pending,
      icon: "cloud_off",
      title: "We couldn't load your contacts",
      body: "Check your connection and pull down to refresh. You can still send an alert.",
      cta: { label: "Try again", href: ROUTES.contacts },
      showMeter: false,
    };
  }

  if (total === 0) {
    return {
      key: "empty",
      accent: ACCENT.empty,
      icon: "group_add",
      title: "No trusted contacts yet",
      body: "An alert only helps if someone receives it. Add the people you'd want beside you in an emergency.",
      cta: { label: "Add your first contact", href: ROUTES.addContact },
      showMeter: false,
      urgent: true,
    };
  }

  if (pending > 0) {
    return {
      key: "pending",
      accent: ACCENT.pending,
      icon: "hourglass_top",
      title:
        pending === 1
          ? "1 contact hasn't accepted yet"
          : `${pending} contacts haven't accepted yet`,
      body: "They won't receive your alerts until they accept. Send a reminder, or remove the request and pick someone else.",
      cta: { label: "Review contacts", href: ROUTES.contacts },
      showMeter: true,
      counts: { approved, pending, declined, total, maxContacts },
    };
  }

  if (declined > 0 && approved < maxContacts) {
    return {
      key: "declined",
      accent: ACCENT.declined,
      icon: "person_off",
      title:
        declined === 1
          ? "1 person declined your request"
          : `${declined} people declined your request`,
      body: "Replace them so there's always someone ready to answer. You have room for more.",
      cta: { label: "Add someone else", href: ROUTES.addContact },
      showMeter: true,
      counts: { approved, pending, declined, total, maxContacts },
    };
  }

  if (approved < maxContacts) {
    const room = maxContacts - approved;
    return {
      key: "growing",
      accent: ACCENT.growing,
      icon: "person_add",
      title: `${approved} of ${maxContacts} contacts ready`,
      body:
        room === 1
          ? "Room for one more. The more people on your list, the better the odds someone is close by."
          : `Room for ${room} more. The more people on your list, the better the odds someone is close by.`,
      cta: { label: "Add another contact", href: ROUTES.addContact },
      showMeter: true,
      counts: { approved, pending, declined, total, maxContacts },
    };
  }

  return {
    key: "complete",
    accent: ACCENT.complete,
    icon: "verified_user",
    title: "Your circle is complete",
    body: `All ${approved} contacts have accepted. Tap any situation below and every one of them will know where you are.`,
    cta: { label: "Manage contacts", href: ROUTES.contacts },
    showMeter: true,
    counts: { approved, pending, declined, total, maxContacts },
  };
}

/* ── Readiness meter: one segment per available slot ────────────────────── */
function ReadinessMeter({ counts, accent }) {
  const { approved, pending, maxContacts } = counts;
  const slots = Math.max(maxContacts, approved + pending);

  return (
    <div
      style={{ display: "flex", gap: "4px", marginTop: "16px" }}
      role="img"
      aria-label={`${approved} of ${maxContacts} contacts accepted, ${pending} awaiting a reply`}
    >
      {Array.from({ length: slots }).map((_, i) => {
        let background = "rgba(255,255,255,0.12)";
        if (i < approved) background = accent;
        else if (i < approved + pending)
          background = "repeating-linear-gradient(90deg, rgba(255,255,255,0.38) 0 4px, transparent 4px 8px)";

        return (
          <span
            key={i}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "999px",
              background,
              transition: "background 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
}

/* ── Banner ─────────────────────────────────────────────────────────────── */
export default function StatusBanner() {
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const subscriptionLevel = useSelector(
    (s) => s.auth?.user?.subscription_level ?? "free"
  );
  const rawContacts = useSelector((s) => s.contact?.contacts);
  const loadData = useSelector((s) => s.contact?.loadData);

  // The reducer can end up holding a paginated object, or a stray API
  // message object, so normalise before counting anything.
  const contacts = useMemo(() => {
    const list = Array.isArray(rawContacts)
      ? rawContacts
      : rawContacts?.results ?? [];
    return list.filter((c) => c && typeof c === "object" && "status" in c);
  }, [rawContacts]);

  const maxContacts = PLAN_LIMITS[subscriptionLevel] ?? PLAN_LIMITS.free;

  const state = useMemo(
    () => deriveBannerState({ isAuthenticated, contacts, loadData, maxContacts }),
    [isAuthenticated, contacts, loadData, maxContacts]
  );

  return (
    <div className="px-5 pt-6 pb-2">
      <div
        style={{
          background: "linear-gradient(135deg, #3D0000, #6B0F0F)",
          borderRadius: "22px",
          padding: "20px",
          boxShadow: "0 8px 32px rgba(204,34,34,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bubble decoration */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15px",
            left: "-15px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />

        <div
          key={state.key}
          className="hoh-banner-body"
          aria-live="polite"
          style={{ position: "relative" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "18px",
                  letterSpacing: "-0.02em",
                  marginBottom: "4px",
                }}
              >
                {state.title}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.62)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {state.body}
              </p>
            </div>

            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: `${state.accent}26`,
                border: `1.5px solid ${state.accent}80`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 0 0 6px ${state.accent}12`,
              }}
            >
              <span
                className={`material-symbols-rounded${
                  state.spin ? " hoh-spin" : ""
                }`}
                style={{ color: state.accent, fontSize: "26px", lineHeight: 1 }}
                aria-hidden="true"
              >
                {state.icon}
              </span>
            </div>
          </div>

          {state.showMeter && state.counts && (
            <ReadinessMeter counts={state.counts} accent={state.accent} />
          )}

          {state.cta && (
            <Link
              href={state.cta.href}
              className="hoh-banner-cta"
              style={{
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 16px",
                borderRadius: "999px",
                background: state.accent,
                color: "#fff",
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              {state.cta.label}
              <span
                className="material-symbols-rounded"
                style={{ fontSize: "16px" }}
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </Link>
          )}
        </div>
      </div>

      <style jsx global>{`
        .hoh-banner-cta:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }
        .hoh-banner-cta:active {
          transform: scale(0.97);
        }
        @media (prefers-reduced-motion: no-preference) {
          .hoh-banner-body {
            animation: hohBannerIn 0.35s ease both;
          }
          .hoh-spin {
            animation: hohSpin 1.2s linear infinite;
          }
          .hoh-banner-cta {
            transition: transform 0.15s ease, filter 0.15s ease;
          }
          .hoh-banner-cta:hover {
            filter: brightness(1.1);
          }
        }
        @keyframes hohBannerIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes hohSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}