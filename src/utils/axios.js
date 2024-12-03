import $axios from "..";

const apiService = {
  register: (data) => $axios.post("/account/user-register/", data),
  verifyEmail: (data) => $axios.post("/account/verify-email/", data),
  VerifyPhoneNumber: (data) =>
    $axios.post("/account/verify-phone-number/", data),
  VerifyPhoneNumberOTP: (data) =>
    $axios.post("/account/verify-phone-number-otp/", data),
  login: (data) => $axios.post("/account/user-login/", data),
  generate: (data) => $axios.post("/account/user-generate-otp/", data),
  generateRegister: (data) =>
    $axios.post("/account/user-register-generate-otp/", data),
  otpRegisterValidate: (data) => $axios.post("/account/user-login-otp/", data),
  otpLogin: (data) => $axios.post("/account/user-login-otp/", data),
  // accept / reject
  contactInfo: (contactId) => $axios.get(`/account/contacts/${contactId}/`),
  inviteStatus: (data) => $axios.post("/account/update-status/", data),
  // Create Relation
  createRelation: (data) => $axios.post("/account/create-relation/", data),
  getMyContacts: () => $axios.get("/account/my-contacts/"),
  getMyDependants: () => $axios.get("/account/my-dependants/"),
  approveDependant: (data) => $axios.post("/account/approve-dependent/", data),
  rejectDependant: (data) => $axios.post("/account/reject-dependent/", data),
  deleteContact: (data) => $axios.post("/account/delete-contact/", data),
  updateContact: (data) => $axios.post("/account/update-contact/", data),
  // trigger Alert
  triggerAlert: (data) => $axios.post("/account/trigger-alert/", data),
};

export default apiService;
