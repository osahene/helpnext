// Between a correct OTP and step 3 (a passkey), the auth slice holds the
// backend's enrollment token. The server honours it for 24h; past that it's
// treated as gone here too, so nobody is sent to a passkey screen that can
// only fail.
const ENROLLMENT_TTL_MS = 24 * 60 * 60 * 1000;

export const hasPendingEnrollment = (auth) =>
  !!auth?.enrollmentToken &&
  Date.now() - (auth.enrollmentIssuedAt || 0) < ENROLLMENT_TTL_MS;
