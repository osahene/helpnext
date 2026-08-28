"use client";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import apiService from "@/utils/axios";
import $axios from "@/utils/axiosInstance";
import { CATEGORY_META } from "@/utils/notificationCategory";
import NotificationListItem from "./NotificationListItem";

const FILTERS = [
  { value: "", label: "All" },
  ...Object.entries(CATEGORY_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

export default function NotificationsInboxPage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const fetchPage = useCallback(async (selectedCategory) => {
    setLoading(true);
    setError(false);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      const res = await apiService.getNotifications(params);
      setResults(res?.data?.results ?? []);
      setNextUrl(res?.data?.next ?? null);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchPage(category);
  }, [isAuthenticated, category, fetchPage]);

  const loadMore = async () => {
    if (!nextUrl) return;
    setLoadingMore(true);
    try {
      // `next` is an absolute URL from DRF pagination; axios requests an
      // absolute URL as-is, ignoring baseURL, so this reuses the same
      // authenticated instance (interceptors, refresh, etc.) as everything else.
      const res = await $axios.get(nextUrl);
      setResults((prev) => [...prev, ...(res?.data?.results ?? [])]);
      setNextUrl(res?.data?.next ?? null);
    } catch (err) {
      // leave existing list intact on failure
    } finally {
      setLoadingMore(false);
    }
  };

  const handleItemClick = async (notification) => {
    const willExpand = expandedId !== notification.id;
    setExpandedId(willExpand ? notification.id : null);

    if (!notification.read_at) {
      try {
        const res = await apiService.markNotificationRead(notification.id);
        const updated = res?.data;
        setResults((prev) =>
          prev.map((n) =>
            n.id === notification.id
              ? { ...n, read_at: updated?.read_at || new Date().toISOString() }
              : n
          )
        );
      } catch (err) {
        // silent — interceptor already toasts API errors
      }
    }
  };

  return (
    <div style={{ background: "#F0F4FF", minHeight: "100vh" }} className="pt-24 pb-24">
      <div className="px-5 pb-4" style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
            borderRadius: "22px",
            padding: "20px",
            boxShadow: "0 8px 32px rgba(44,95,212,0.25)",
            marginBottom: "18px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "20px",
              }}
            >
              🔔
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 800, fontSize: "19px", letterSpacing: "-0.02em", marginBottom: "3px" }}>
                Notifications
              </p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Weather tips, hazard warnings, and updates
              </p>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "28px 20px",
              textAlign: "center",
              border: "1px solid #DDE3F5",
            }}
          >
            <p style={{ fontSize: "14px", color: "#5B6483", marginBottom: "14px" }}>
              Log in to see your notifications.
            </p>
            <Link
              href="/auth/login"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2C5FD4, #5B3FE8)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              Log in
            </Link>
          </div>
        ) : (
          <>
            {/* Category filter */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "4px",
                marginBottom: "16px",
              }}
            >
              {FILTERS.map((f) => {
                const active = category === f.value;
                return (
                  <button
                    key={f.value || "all"}
                    onClick={() => setCategory(f.value)}
                    style={{
                      flexShrink: 0,
                      padding: "8px 14px",
                      borderRadius: "999px",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      border: active ? "1px solid transparent" : "1px solid #DDE3F5",
                      background: active
                        ? "linear-gradient(135deg, #2C5FD4, #5B3FE8)"
                        : "#fff",
                      color: active ? "#fff" : "#5B6483",
                      cursor: "pointer",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* List */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#8A93B3", fontSize: "13.5px" }}>
                Loading notifications…
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#8A93B3", fontSize: "13.5px" }}>
                Couldn&apos;t load notifications right now. Please try again later.
              </div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#8A93B3", fontSize: "13.5px" }}>
                No notifications yet.
              </div>
            ) : (
              <>
                {results.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                    expanded={expandedId === notification.id}
                    onClick={() => handleItemClick(notification)}
                  />
                ))}

                {nextUrl && (
                  <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        background: "#fff",
                        border: "1px solid #DDE3F5",
                        color: "#2C5FD4",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: loadingMore ? "default" : "pointer",
                      }}
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
