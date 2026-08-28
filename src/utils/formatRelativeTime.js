import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// e.g. "5 minutes ago", "2 days ago" — falls back to the raw value if the
// date can't be parsed, so a malformed timestamp never throws in render.
export function formatRelativeTime(dateString) {
  try {
    if (!dateString) return "";
    const d = dayjs(dateString);
    if (!d.isValid()) return "";
    return d.fromNow();
  } catch (error) {
    return "";
  }
}
