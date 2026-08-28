// ─────────────────────────────────────────────────────────────────────────
// Firebase Cloud Messaging background service worker.
//
// This file is required by the Firebase Web SDK to display notifications
// when the site is NOT in the foreground (tab closed/backgrounded). It runs
// outside the Next.js bundle, so it can't use ES module imports or read
// process.env — it loads the Firebase "compat" SDK from Firebase's own CDN
// instead, which is the standard pattern for this file.
//
// ⚠️  PLACEHOLDER CREDENTIALS — see FIREBASE_SETUP.md at the project root.
// This config MUST exactly match the config in src/utils/push.js. Until
// real values are filled in, calls below will simply fail (Firebase will
// reject the fake API key) and no background notifications will show —
// this file does not run during normal page loads, so a failure here
// cannot break the rest of the site.
// ─────────────────────────────────────────────────────────────────────────

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

try {
  // PLACEHOLDER — must match firebaseConfig in src/utils/push.js
  firebase.initializeApp({
    apiKey: "PLACEHOLDER_FIREBASE_API_KEY",
    authDomain: "PLACEHOLDER_PROJECT_ID.firebaseapp.com",
    projectId: "PLACEHOLDER_PROJECT_ID",
    storageBucket: "PLACEHOLDER_PROJECT_ID.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000",
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    try {
      const title =
        payload?.notification?.title || payload?.data?.title || "HelpOoHelp";
      const options = {
        body: payload?.notification?.body || payload?.data?.body || "",
        icon: payload?.notification?.icon || payload?.data?.icon || "/favicon.ico",
        image: payload?.notification?.image || payload?.data?.image || undefined,
        data: payload?.data || {},
      };
      self.registration.showNotification(title, options);
    } catch (error) {
      // Never let a malformed payload crash the service worker.
      console.warn("[firebase-messaging-sw] Failed to show notification:", error);
    }
  });
} catch (error) {
  // Fake/placeholder credentials, or any other init failure — the service
  // worker simply won't deliver background notifications. It stays
  // installed and harmless otherwise.
  console.warn("[firebase-messaging-sw] Firebase init failed:", error);
}

// Clicking a background notification focuses/opens the site.
self.addEventListener("notificationclick", (event) => {
  try {
    event.notification.close();
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        for (const client of windowClients) {
          if ("focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow("/notifications");
      })
    );
  } catch (error) {
    // ignore
  }
});
