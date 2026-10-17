import $axios from "./axiosInstance";
import { getRefreshToken } from "./authCookies";

const apiService = {
  googleLog: (data) => $axios.post("/social/google/", data),
  register: (data) => $axios.post("/account/user-register/", data),
  verifyEmail: (data) => $axios.post("/account/verify-email/", data),
  VerifyPhoneNumber: (data) =>
    $axios.post("/account/verify-phone-number/", data),
  // `client: "web"` — the backend then asks for a passkey as step 3.
  VerifyPhoneNumberOTP: (data) =>
    $axios.post("/account/verify-otp/", { ...data, client: "web" }),
  // Passkeys (see src/utils/webauthn.js). enrollment_token is the step-3
  // pass verify-otp hands back before a passkey exists.
  passkeyRegisterOptions: (data) =>
    $axios.post("/account/passkey/register/options/", data),
  passkeyRegisterVerify: (data) =>
    $axios.post("/account/passkey/register/verify/", data),
  passkeyLoginOptions: () => $axios.post("/account/passkey/login/options/", {}),
  passkeyLoginVerify: (data) =>
    $axios.post("/account/passkey/login/verify/", data),
  login: (data) => $axios.post("/account/user-login/", data),
  // Sends the refresh token so the backend blacklists it — sessions are
  // long-lived, so a logout must actually revoke it server-side.
  logout: () =>
    $axios.post("/account/user-logout/", { refresh: getRefreshToken() }),
  // "delete" never deletes on the spot — it deactivates immediately and
  // schedules a hard delete 30 days out (account.tasks.purge_users_pending_deletion).
  // No way to self-undo via this endpoint on purpose: is_active=False blocks
  // authentication on every subsequent request, so there's no session left
  // to call it again with — see account.views.AccountStatusView.
  updateAccountStatus: (action, refreshToken, reason, reasonDetails) =>
    $axios.patch("/account/account-status/", {
      action,
      refresh: refreshToken,
      reason,
      reason_details: reasonDetails,
    }),
  getRequestHistory: () => $axios.get("/account/user-history/"),
  // Reset Password
  forgottenEmail: (data) => $axios.post("/account/request-reset-email/", data),
  confirmPassword: (data) => $axios.post("/account/password-reset/", data),
  // Generate OTP
  generateRegister: (data) =>
    $axios.post("/account/send-otp/", data),
  // Invitation accept / reject
  contactInfo: (code) => $axios.get(`/account/contacts/${code}/`),
  inviteStatus: (data) => $axios.post("/account/update-status/", data),
  // Create Relation
  createRelation: (data) => $axios.post("/account/create-relation/", data),
  getMyContacts: () => $axios.get("/account/my-contacts/"),
  getMyDependants: () => $axios.get("/account/my-dependants/"),
  // Actions by user on the card
  approveDependant: (data) => $axios.post("/account/approve-dependent/", data),
  rejectDependant: (data) => $axios.post("/account/reject-dependent/", data),
  deleteContact: (data) => $axios.post("/account/delete-contact/", data),
  updateContact: (data) => $axios.post("/account/update-contact/", data),
  // trigger Alert
  triggerAlert: (data) => $axios.post("/account/trigger-alert/", data),
  alertStatus: (id) => $axios.get(`/account/alert-status/${id}/`),
  // Live location — opt-in continuous sharing for up to 1 hour after a
  // trigger (off by default; see account.models.Emergency.start_live_location
  // on the backend). "stop" never deletes the alert, just the live window.
  startLiveLocation: (alertId) =>
    $axios.post(`/account/alert-live-location/${alertId}/`),
  // Background calls pass { silent: true } so they don't flash the
  // full-screen loader (see axiosInstance.js) every time they run.
  updateLiveLocation: (alertId, data) =>
    $axios.patch(`/account/alert-live-location/${alertId}/`, data, { silent: true }),
  stopLiveLocation: (alertId) =>
    $axios.delete(`/account/alert-live-location/${alertId}/`),
  // verify emergency
  verifyEmergency: (code, { silent = false } = {}) =>
    $axios.get(`/account/verify-alert/${code}/`, { silent }),
  decodeEmrgencyToken: (code) => $axios.get(`/account/decode-alert-token/${code}/`),
  // "on_my_way" / "cant_help" — see EmergencySystem/account/alert_responses.py
  respondToAlert: (code, response) =>
    $axios.post(`/account/verify-alert/${code}/respond/`, { response }),
  // Titbit notifications (in-app inbox + web push)
  getNotifications: (params) => $axios.get("/notifications/", { params }),
  getUnreadNotificationCount: () => $axios.get("/notifications/unread-count/", { silent: true }),
  markNotificationRead: (id) => $axios.patch(`/notifications/${id}/read/`),
  registerPushDevice: (data) => $axios.post("/notifications/register-device/", data),
  unregisterPushDevice: (token) =>
    $axios.delete("/notifications/register-device/", { data: { token } }),
};

export default apiService;
