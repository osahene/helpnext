"use client";
import { getCategoryMeta } from "@/utils/notificationCategory";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

// Shared row renderer for a single Titbit notification. Used both in the
// navbar dropdown (compact) and the full inbox page (compact=false, with
// expand-in-place support via `expanded`).
export default function NotificationListItem({
  notification,
  compact = false,
  expanded = false,
  onClick,
}) {
  const meta = getCategoryMeta(notification.category);
  const isUnread = !notification.read_at;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left transition-colors"
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: compact ? "10px 14px" : "16px",
        background: isUnread ? "#F7F9FF" : "#fff",
        borderBottom: "1px solid #EEF1FA",
        borderRadius: compact ? 0 : "16px",
        border: compact ? undefined : "1px solid #EEF1FA",
        marginBottom: compact ? 0 : "10px",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: compact ? "32px" : "40px",
          height: compact ? "32px" : "40px",
          borderRadius: "10px",
          background: meta.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: compact ? "15px" : "18px",
        }}
        aria-hidden="true"
      >
        {meta.icon}
      </span>

      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: compact ? "11px" : "11.5px",
              fontWeight: 700,
              color: meta.color,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {meta.label}
          </span>
          {isUnread && (
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#2C5FD4",
                flexShrink: 0,
              }}
              aria-label="Unread"
            />
          )}
          <span
            style={{
              marginLeft: "auto",
              fontSize: "11px",
              color: "#8A93B3",
              whiteSpace: "nowrap",
            }}
          >
            {formatRelativeTime(notification.created_at)}
          </span>
        </span>

        <span
          style={{
            display: "block",
            fontSize: compact ? "13px" : "14.5px",
            fontWeight: 700,
            color: "#14213D",
            marginTop: "2px",
          }}
        >
          {notification.title}
        </span>

        <span
          style={{
            display: "block",
            fontSize: compact ? "12.5px" : "13.5px",
            color: "#5B6483",
            marginTop: "2px",
            ...(expanded
              ? {}
              : {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: compact ? 2 : 2,
                  WebkitBoxOrient: "vertical",
                }),
          }}
        >
          {notification.body}
        </span>

        {expanded && notification.image && (
          // eslint-disable-next-line @next/next/no-img-element -- notification
          // images come from arbitrary admin/CDN URLs, not configured in
          // next.config's image remotePatterns, so next/image would 400.
          <img
            src={notification.image}
            alt=""
            style={{
              display: "block",
              marginTop: "10px",
              width: "100%",
              maxHeight: "260px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        )}

        {expanded && notification.source && (
          <span
            style={{
              display: "block",
              marginTop: "8px",
              fontSize: "11.5px",
              color: "#8A93B3",
              fontStyle: "italic",
            }}
          >
            Source: {notification.source}
          </span>
        )}
      </span>
    </button>
  );
}
