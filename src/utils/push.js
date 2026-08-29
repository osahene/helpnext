"use client";
// ─────────────────────────────────────────────────────────────────────────
// Web Push (Firebase Cloud Messaging) helper for Titbit notifications.
//
// Config comes from NEXT_PUBLIC_FIREBASE_* env vars (see FIREBASE_SETUP.md
// at the project root) the same way NEXT_PUBLIC_BASE_URL is read in
// src/utils/axiosInstance.js — Firebase's web config isn't a secret (it
// ships in every browser bundle regardless), env vars just make it
// per-environment instead of hardcoded.
//
// ⚠️  PLACEHOLDER DEFAULTS — every `|| "..."` fallback below is a
// syntactically valid but fake placeholder, used only when the env var
// isn't set. Until the real values are provided (via env vars), every
// function here will fail quietly (caught, logged as a warning, never
// thrown) and push notifications will simply stay unavailable — this must
// never break page render or any other part of the app.
// ─────────────────────────────────────────────────────────────────────────
import apiService from "./axios";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDxaw6iQnBUXAzbnuIKRXK9IonTVRxqPqM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "helpoohelp-notification.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "helpoohelp-notification",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "helpoohelp-notification.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1005334547839",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1005334547839:web:1752cb50697539c943de4a",
  measurementId: "G-8LPYSERZZG"
};

// From Firebase Console > Project settings > Cloud Messaging > Web Push
// certificates.
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BCjiDM_XxZt-lSx8FdqQ25n9BPuv_X7f2Sn2BVGCvH4k24xStRF7e6Mko2m7e_1uGhX20YmE61T7xMdKSJ3RBCI";

let firebaseAppPromise = null;
let messagingInstance = null;
let messagingChecked = false;

// Lazily load the firebase SDK + init the app. Returns null on any failure
// (fake credentials, unsupported browser, network error, etc).
async function getFirebaseApp() {
  if (typeof window === "undefined") return null;
  if (firebaseAppPromise) return firebaseAppPromise;

  firebaseAppPromise = (async () => {
    try {
      const { initializeApp, getApps, getApp } = await import("firebase/app");
      return getApps().length ? getApp() : initializeApp(firebaseConfig);
    } catch (error) {
      console.warn(
        "[push] Firebase app init failed — push notifications unavailable (this is expected until real Firebase credentials are set, see FIREBASE_SETUP.md):",
        error
      );
      return null;
    }
  })();

  return firebaseAppPromise;
}

// Feature-detects the current browser (service workers, Push API, and
// whatever additional checks Firebase's own `isSupported()` performs).
export async function isPushSupported() {
  try {
    if (typeof window === "undefined") return false;
    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      typeof Notification === "undefined"
    ) {
      return false;
    }
    const { isSupported } = await import("firebase/messaging");
    return await isSupported();
  } catch (error) {
    console.warn("[push] Browser support check failed:", error);
    return false;
  }
}

// Returns a cached Messaging instance, or null if unavailable for any reason.
async function getMessagingInstance() {
  if (messagingChecked) return messagingInstance;
  messagingChecked = true;

  try {
    const supported = await isPushSupported();
    if (!supported) return null;

    const app = await getFirebaseApp();
    if (!app) return null;

    const { getMessaging } = await import("firebase/messaging");
    messagingInstance = getMessaging(app);
    return messagingInstance;
  } catch (error) {
    console.warn("[push] Unable to initialize Firebase Messaging:", error);
    return null;
  }
}

// The current Notification permission state, or "unsupported" when the
// Notification API doesn't exist in this browser (or during SSR).
export function getNotificationPermission() {
  try {
    if (typeof window === "undefined" || typeof Notification === "undefined") {
      return "unsupported";
    }
    return Notification.permission; // "default" | "granted" | "denied"
  } catch (error) {
    return "unsupported";
  }
}

// Full opt-in flow, only ever called from a direct user action (a button
// click) — never automatically. Requests permission, registers the service
// worker, fetches an FCM token, and registers it with the backend.
// Always resolves (never throws) with a { success, reason } shaped result.
export async function requestPushPermissionAndRegister() {
  try {
    const supported = await isPushSupported();
    if (!supported) return { success: false, reason: "unsupported" };

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, reason: permission === "denied" ? "denied" : "dismissed" };
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const messaging = await getMessagingInstance();
    if (!messaging) return { success: false, reason: "unavailable" };

    const { getToken } = await import("firebase/messaging");
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) return { success: false, reason: "no-token" };

    await apiService.registerPushDevice({ token, platform: "web" });

    return { success: true, token };
  } catch (error) {
    console.warn(
      "[push] requestPushPermissionAndRegister failed (expected until real Firebase credentials are set, see FIREBASE_SETUP.md):",
      error
    );
    return { success: false, reason: "error" };
  }
}

// Subscribes to messages that arrive while the tab is open/foregrounded.
// Returns an unsubscribe function; safe to call even if push is unavailable
// (it just becomes a no-op).
export function listenForForegroundMessages(onMessageReceived) {
  let unsubscribed = false;
  let unsubscribeFn = null;

  (async () => {
    try {
      const messaging = await getMessagingInstance();
      if (!messaging || unsubscribed) return;

      const { onMessage } = await import("firebase/messaging");
      unsubscribeFn = onMessage(messaging, (payload) => {
        try {
          onMessageReceived?.(payload);
        } catch (error) {
          console.warn("[push] Error handling foreground message:", error);
        }
      });
    } catch (error) {
      console.warn("[push] Could not attach foreground message listener:", error);
    }
  })();

  return () => {
    unsubscribed = true;
    try {
      unsubscribeFn?.();
    } catch (error) {
      // ignore
    }
  };
}
