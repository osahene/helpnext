import $axios from "./axiosInstance";
import { getRefreshToken } from "./authCookies";

const apiService = {
  googleLog: (data) => $axios.post("/social/google/", data),
  register: (data) => $axios.post("/account/user-register/", data),
  verifyEmail: (data) => $axios.post("/account/verify-email/", data),
  VerifyPhoneNumber: (data) =>
    $axios.post("/account/verify-phone-number/", data),
  VerifyPhoneNumberOTP: (data) =>
    $axios.post("/account/verify-otp/", data),
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
  updateAccountStatus: (action, refreshToken) =>
    $axios.patch("/account/account-status/", { action, refresh: refreshToken }),
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
  updateLiveLocation: (alertId, data) =>
    $axios.patch(`/account/alert-live-location/${alertId}/`, data),
  stopLiveLocation: (alertId) =>
    $axios.delete(`/account/alert-live-location/${alertId}/`),
  // verify emergency
  verifyEmergency: (code) => $axios.get(`/account/verify-alert/${code}/`),
  decodeEmrgencyToken: (code) => $axios.get(`/account/decode-alert-token/${code}/`),
  // Titbit notifications (in-app inbox + web push)
  getNotifications: (params) => $axios.get("/notifications/", { params }),
  getUnreadNotificationCount: () => $axios.get("/notifications/unread-count/"),
  markNotificationRead: (id) => $axios.patch(`/notifications/${id}/read/`),
  registerPushDevice: (data) => $axios.post("/notifications/register-device/", data),
  unregisterPushDevice: (token) =>
    $axios.delete("/notifications/register-device/", { data: { token } }),
};

export default apiService;
