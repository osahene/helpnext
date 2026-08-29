# Firebase Web Push Setup

The Titbit in-app notification bell/inbox works today with no Firebase
credentials at all — it's plain REST calls to the Django backend
(`/notifications/...`). Only **browser push notifications** need Firebase,
and that code currently ships with fake placeholder values (as env var
defaults) so the app keeps building and running normally with zero
configuration.

Once you have created the Firebase project and added a **Web app** to it,
set the env vars below. There's one exception — `public/firebase-messaging-sw.js`
— which needs a manual edit instead (explained in step 2), because it can't
read env vars at all.

## 1. `src/utils/push.js` — env vars

This file reads its Firebase config from `NEXT_PUBLIC_FIREBASE_*` env vars
(with the same fake placeholder values as before as fallback defaults, so
the app still degrades gracefully with zero env vars set). Add these to
your `.env` (or whatever env file/host your deployment uses):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

- The first six come from **Firebase Console → Project settings → General →
  Your apps → (Web app) → SDK setup and configuration → Config**.
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY` comes from **Firebase Console → Project
  settings → Cloud Messaging → Web configuration → Web Push certificates**
  (generate a key pair if none exists yet — it's a single string).

This Firebase web config is not actually secret — it ships in every
browser bundle regardless of how it's stored, the same way the API key for
any other web SDK does — so `NEXT_PUBLIC_` (client-exposed) env vars are
the right fit here, matching how `NEXT_PUBLIC_BASE_URL` is already used
elsewhere in this codebase.

## 2. `public/firebase-messaging-sw.js` — manual edit (the one exception)

This file **cannot** read `process.env` — it's a raw service worker file
served as-is from `/public`, with no bundler pass over it at all (that's
also why it loads the Firebase "compat" SDK from Firebase's own CDN via
`importScripts` instead of an ES import). Env vars are simply not
available to it.

So, unlike step 1, you edit this file directly. Open
`public/firebase-messaging-sw.js` and replace the `firebase.initializeApp({...})`
block with the same six config values (not the VAPID key — that one isn't
needed here) you set as env vars in step 1:

```js
firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
});
```

**This must be done every time those values change** (e.g. rotating
Firebase projects) — updating the env vars alone is not enough, since this
file won't pick them up. The file has a comment at the top explaining this
same thing, in case you land here first.

## 3. Backend

No backend changes are needed. The Django `/notifications/register-device/`
endpoint already accepts `{"token": ..., "platform": "web"}` the same way
it accepts mobile FCM tokens — confirmed working before this web client
was built.

## Verifying it works

1. Set the env vars in step 1, and manually edit the service worker in
   step 2 with the same config.
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

Until real values are provided, every push-related call is wrapped in
try/catch and fails silently (logged as a `console.warn`) — the bell/inbox,
the rest of the site, and the build itself are unaffected either way.
