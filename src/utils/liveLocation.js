import apiService from "./axios";
import { store } from "../redux/store";
import { liveLocationStarted, liveLocationStopped } from "../redux/liveLocationSlice";

// Browser-only, foreground-only, and tab-only: there is no background
// geolocation API on the web, and this stops the moment the tab is closed
// or reloaded (nothing persists it — see liveLocationSlice.js). That's a
// real, unavoidable platform limit, not a bug — unlike the Flutter app,
// which at least keeps running while merely backgrounded, not just while
// the specific screen is open.
const UPDATE_INTERVAL_MS = 20000;

let intervalId = null;
let expiryTimeoutId = null;

function pushUpdate(alertId) {
  if (typeof navigator === "undefined" || !navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        await apiService.updateLiveLocation(alertId, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      } catch (error) {
        // A single missed update isn't worth surfacing — the backend's own
        // 1-hour expiry is the real safety net regardless of how many
        // updates actually land.
        console.error("Live location update failed:", error);
      }
    },
    (error) => {
      console.error("Live location geolocation error:", error);
      // PERMISSION_DENIED here means the browser/OS permission was revoked
      // (or device location turned off) *after* sharing already started —
      // every subsequent tick would just fail the same way forever
      // otherwise. stopLiveLocation() re-reads alertId from the store
      // itself, so this plain function reference is already the right
      // shape to call directly.
      if (error.code === error.PERMISSION_DENIED) {
        stopLiveLocation();
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

function clearTimers() {
  if (intervalId) clearInterval(intervalId);
  if (expiryTimeoutId) clearTimeout(expiryTimeoutId);
  intervalId = null;
  expiryTimeoutId = null;
}

export async function startLiveLocation(alertId) {
  await stopLiveLocation();

  let expiresAt = null;
  try {
    const response = await apiService.startLiveLocation(alertId);
    expiresAt = response.data?.live_location_expires_at ?? null;
  } catch (error) {
    console.error("Failed to start live location:", error);
    return false;
  }

  store.dispatch(liveLocationStarted({ alertId, expiresAt }));
  pushUpdate(alertId); // don't wait a full interval for the first point
  intervalId = setInterval(() => pushUpdate(alertId), UPDATE_INTERVAL_MS);

  const remainingMs = expiresAt ? new Date(expiresAt).getTime() - Date.now() : 3600000;
  expiryTimeoutId = setTimeout(stopLiveLocation, Math.max(remainingMs, 0));
  return true;
}

export async function stopLiveLocation() {
  const { alertId } = store.getState().liveLocation;
  clearTimers();
  store.dispatch(liveLocationStopped());

  if (alertId) {
    try {
      await apiService.stopLiveLocation(alertId);
    } catch (error) {
      console.error("Failed to stop live location:", error);
    }
  }
}
