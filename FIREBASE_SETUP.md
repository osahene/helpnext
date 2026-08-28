# Firebase Web Push Setup

The Titbit in-app notification bell/inbox works today with no Firebase
credentials at all — it's plain REST calls to the Django backend
(`/notifications/...`). Only **browser push notifications** need Firebase,
and that code currently ships with fake placeholder values so the app keeps
building and running normally.

Once you have created the Firebase project and added a **Web app** to it,
replace the placeholders below. There are two files, and their config
objects must **match exactly** (the service worker can't import from the
app code, so its config is duplicated).

## 1. `src/utils/push.js`

Near the top of the file, replace:

```js
const firebaseConfig = {
  apiKey: "PLACEHOLDER_FIREBASE_API_KEY",
  authDomain: "PLACEHOLDER_PROJECT_ID.firebaseapp.com",
  projectId: "PLACEHOLDER_PROJECT_ID",
  storageBucket: "PLACEHOLDER_PROJECT_ID.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
};
```

with the real config from **Firebase Console → Project settings → General →
Your apps → (Web app) → SDK setup and configuration → Config**.

Then replace:

```js
const VAPID_KEY = "PLACEHOLDER_VAPID_KEY_REPLACE_ME";
```

with the key from **Firebase Console → Project settings → Cloud Messaging →
Web configuration → Web Push certificates** (generate a key pair if none
exists yet — it's a single string).

## 2. `public/firebase-messaging-sw.js`

Replace the same `firebase.initializeApp({...})` block near the top with
the identical real config used in step 1 (same six fields, same values).
This file has to stay a plain script (no imports, no env vars) because it's
a raw service worker file served from `/public` — it is not processed by
Next.js's build.

## 3. Backend

No backend changes are needed. The Django `/notifications/register-device/`
endpoint already accepts `{"token": ..., "platform": "web"}` the same way
it accepts mobile FCM tokens — confirmed working before this web client
was built.

## Verifying it works

1. Fill in both files above with matching real values.
2. `npm run build && npm run start` (or `npm run dev`), then log in.
3. A one-time "Enable notifications" prompt appears in the bottom-left
   corner (once per browser tab session, only if you haven't already
   granted/denied permission). Click it.
4. Check the browser console for `[push]` warnings — if credentials are
   still wrong you'll see Firebase reject the request there.
5. Send a test message from **Firebase Console → Cloud Messaging → Send
   test message**, pasting in the registered token (visible in the Django
   admin for the `Notifications` device model, or logged in
   `requestPushPermissionAndRegister()`'s return value during testing).

Until the placeholders are replaced, every push-related call is wrapped in
try/catch and fails silently (logged as a `console.warn`) — the bell/inbox,
the rest of the site, and the build itself are unaffected either way.
