// Shared category → icon/color mapping for Titbit notifications.
// "general" uses the site's primary brand blue (#2C5FD4), matching the
// gradient already used across the navbars and account pages.
export const CATEGORY_META = {
  weather: { label: "Weather", color: "#2563EB", bg: "#EFF6FF", icon: "🌦️" },
  hazard: { label: "Hazard", color: "#DC2626", bg: "#FEF2F2", icon: "⚠️" },
  seasonal: { label: "Seasonal", color: "#D97706", bg: "#FFFBEB", icon: "🍂" },
  general: { label: "General", color: "#2C5FD4", bg: "#EEF2FF", icon: "📢" },
  system: { label: "System", color: "#6B7280", bg: "#F3F4F6", icon: "⚙️" },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.general;
}
