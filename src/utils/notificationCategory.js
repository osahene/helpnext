// Shared category → icon/color mapping for Titbit notifications.
// "general" uses the site's primary brand blue (#2C5FD4), matching the
// gradient already used across the navbars and account pages.
export const CATEGORY_META = {
  weather: { label: "Weather", color: "#2563EB", bg: "var(--hoh-bg-eff6ff)", icon: "🌦️" },
  hazard: { label: "Hazard", color: "#DC2626", bg: "var(--hoh-bg-fef2f2)", icon: "⚠️" },
  seasonal: { label: "Seasonal", color: "#D97706", bg: "var(--hoh-bg-fffbeb)", icon: "🍂" },
  general: { label: "General", color: "#2C5FD4", bg: "var(--hoh-bg-eef2ff)", icon: "📢" },
  system: { label: "System", color: "var(--hoh-text-6b7280)", bg: "var(--hoh-bg-f3f4f6)", icon: "⚙️" },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.general;
}
