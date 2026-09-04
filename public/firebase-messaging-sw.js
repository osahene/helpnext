importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

try {
  firebase.initializeApp({
  apiKey: "AIzaSyDxaw6iQnBUXAzbnuIKRXK9IonTVRxqPqM",
  authDomain: "helpoohelp-notification.firebaseapp.com",
  projectId: "helpoohelp-notification",
  storageBucket: "helpoohelp-notification.firebasestorage.app",
  messagingSenderId: "1005334547839",
  appId: "1:1005334547839:web:1752cb50697539c943de4a",
  measurementId: "G-8LPYSERZZG"
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
  console.warn("[firebase-messaging-sw] Firebase init failed:", error);
}

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
