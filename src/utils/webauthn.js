// Browser side of passkeys (step 3 of sign-up on the web, and passkey
// sign-in). The backend (EmergencySystem/account/passkeys.py) speaks the
// standard WebAuthn JSON shape — binary fields as base64url strings — and
// navigator.credentials wants ArrayBuffers, so this converts both ways.
// Any passkey works: the device's own (Windows Hello, Touch ID, Android
// screen lock) or one on a phone/security key.

const toBuffer = (base64url) => {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
};

const toBase64url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const descriptors = (list) =>
  (list || []).map((d) => ({ ...d, id: toBuffer(d.id) }));

export function isPasskeySupported() {
  return (
    typeof window !== "undefined" &&
    typeof window.PublicKeyCredential !== "undefined" &&
    !!navigator.credentials
  );
}

/** Creates a passkey from the server's registration options; returns the
 *  credential as JSON for /account/passkey/register/verify/. */
export async function createPasskey(options) {
  const credential = await navigator.credentials.create({
    publicKey: {
      ...options,
      challenge: toBuffer(options.challenge),
      user: { ...options.user, id: toBuffer(options.user.id) },
      excludeCredentials: descriptors(options.excludeCredentials),
    },
  });
  const response = credential.response;
  return {
    id: credential.id,
    rawId: toBase64url(credential.rawId),
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment ?? undefined,
    clientExtensionResults: credential.getClientExtensionResults?.() ?? {},
    response: {
      clientDataJSON: toBase64url(response.clientDataJSON),
      attestationObject: toBase64url(response.attestationObject),
      transports: response.getTransports?.() ?? [],
    },
  };
}

/** Signs the server's authentication challenge with one of this site's
 *  passkeys; returns the assertion as JSON for /account/passkey/login/verify/. */
export async function getPasskey(options) {
  const credential = await navigator.credentials.get({
    publicKey: {
      ...options,
      challenge: toBuffer(options.challenge),
      allowCredentials: descriptors(options.allowCredentials),
    },
  });
  const response = credential.response;
  return {
    id: credential.id,
    rawId: toBase64url(credential.rawId),
    type: credential.type,
    authenticatorAttachment: credential.authenticatorAttachment ?? undefined,
    clientExtensionResults: credential.getClientExtensionResults?.() ?? {},
    response: {
      clientDataJSON: toBase64url(response.clientDataJSON),
      authenticatorData: toBase64url(response.authenticatorData),
      signature: toBase64url(response.signature),
      userHandle: response.userHandle ? toBase64url(response.userHandle) : undefined,
    },
  };
}

/** True when the user just closed/cancelled the browser's passkey prompt —
 *  not worth an error message. */
export const isPasskeyCancelled = (error) =>
  error?.name === "NotAllowedError" || error?.name === "AbortError";
