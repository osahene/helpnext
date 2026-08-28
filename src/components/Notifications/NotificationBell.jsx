"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import toast from "react-hot-toast";
import apiService from "@/utils/axios";
import { listenForForegroundMessages } from "@/utils/push";
import NotificationListItem from "./NotificationListItem";

const POLL_INTERVAL_MS = 60000;
const DROPDOWN_LIMIT = 6;

// Bell icon + unread badge + dropdown preview, meant to live in the site
// navbars. Only ever renders when the user is logged in.
export default function NotificationBell() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await apiService.getUnreadNotificationCount();
      setUnreadCount(res?.data?.count ?? 0);
    } catch (error) {
      // Stay silent here — the axios interceptor already surfaces API
      // errors as a toast; the bell just keeps its last-known count.
    }
  }, []);

  // Poll unread count every ~60s while authenticated and the tab is visible.
  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    fetchUnreadCount();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchUnreadCount();
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchUnreadCount]);

  // Foreground push: show a toast + refresh the badge when a Titbit arrives
  // while the tab is open. Wrapped safely inside push.js — a no-op when
  // Firebase credentials are still placeholders or the browser is unsupported.
  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const unsubscribe = listenForForegroundMessages((payload) => {
      const title =
        payload?.notification?.title || payload?.data?.title || "New update";
      const body = payload?.notification?.body || payload?.data?.body || "";
      toast(body ? `${title}: ${body}` : title, { icon: "🔔" });
      fetchUnreadCount();
    });

    return unsubscribe;
  }, [isAuthenticated, fetchUnreadCount]);

  // Close the dropdown on outside click.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePanel = async () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setLoadingItems(true);
      setFetchFailed(false);
      try {
        const res = await apiService.getNotifications();
        setItems((res?.data?.results ?? []).slice(0, DROPDOWN_LIMIT));
      } catch (error) {
        setFetchFailed(true);
      } finally {
        setLoadingItems(false);
      }
    }
  };

  const markRead = async (notification) => {
    if (notification.read_at) return;
    try {
      await apiService.markNotificationRead(notification.id);
      setItems((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (error) {
      // silent — interceptor already toasts API errors
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        onClick={togglePanel}
        aria-label="Notifications"
        style={{
          position: "relative",
          width: "38px",
          height: "38px",
          borderRadius: "11px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <svg
          style={{ width: "18px", height: "18px", color: "#fff" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              minWidth: "18px",
              height: "18px",
              padding: "0 4px",
              borderRadius: "9px",
              background: "#DC2626",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #1A3A8F",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <div
        ref={panelRef}
        style={{
          position: "absolute",
          top: "46px",
          right: 0,
          width: "340px",
          maxWidth: "90vw",
          background: "#fff",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "1px solid #DDE3F5",
          transition: "all 0.2s ease",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: isOpen ? "auto" : "none",
          zIndex: 60,
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>
            Notifications
          </span>
          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 600 }}
          >
            See all
          </Link>
        </div>

        <div style={{ maxHeight: "360px", overflowY: "auto" }}>
          {loadingItems ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#8A93B3", fontSize: "13px" }}>
              Loading…
            </div>
          ) : fetchFailed ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#8A93B3", fontSize: "13px" }}>
              Couldn&apos;t load notifications right now.
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#8A93B3", fontSize: "13px" }}>
              You&apos;re all caught up.
            </div>
          ) : (
            items.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                compact
                onClick={() => markRead(notification)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
