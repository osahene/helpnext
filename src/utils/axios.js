import $axios from "./axiosInstance";

const apiService = {
  googleLog: (data) => $axios.post("/social/google/", data),
  register: (data) => $axios.post("/account/user-register/", data),
  verifyEmail: (data) => $axios.post("/account/verify-email/", data),
  VerifyPhoneNumber: (data) =>
    $axios.post("/account/verify-phone-number/", data),
  VerifyPhoneNumberOTP: (data) =>
    $axios.post("/account/verify-otp/", data),
  login: (data) => $axios.post("/account/user-login/", data),
  logout: () => $axios.post("/account/user-logout/"),
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
