import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { resetAllSlices } from "./rootActions";
import apiService from "@/utils/axios";
import { createPasskey, getPasskey, isPasskeyCancelled } from "@/utils/webauthn";

const passkeyFailure = (error, fallback) =>
  isPasskeyCancelled(error)
    ? { cancelled: true }
    : error?.response?.data || { error: fallback };

// Never a session: the backend answers with the next step — an OTP sent to
// the account's phone ("verify_otp") or "add_phone" with a google_token for
// the registration form. Phone OTP and a passkey always follow.
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleToken, thunkAPI) => {
    try {
      const cleanToken = googleToken.replace(/^"|"$/g, "");
      const response = await apiService.googleLog(
        JSON.stringify({
          id_token: cleanToken,
        })
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await apiService.login(userData);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || error.data || error.message;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const response = await apiService.logout();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await apiService.register(userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (userData, thunkAPI) => {
    try {
      const response = await apiService.verifyEmail(userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const verifyPhoneNumber = createAsyncThunk(
  "auth/verifyPhoneNumber",
  async (userData, thunkAPI) => {
    try {
      const response = await apiService.VerifyPhoneNumber(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
export const verifyPhoneNumberOTP = createAsyncThunk(
  "auth/verifyPhoneNumberOTP",
  async (userData, thunkAPI) => {
    try {
      const response = await apiService.VerifyPhoneNumberOTP(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
// Step 3 on the web: create a passkey for this account. Uses the pending
// enrollment token from verify-otp (or the session, if already signed in).
export const registerPasskey = createAsyncThunk(
  "auth/registerPasskey",
  async (_, thunkAPI) => {
    const { enrollmentToken } = thunkAPI.getState().auth;
    const pass = enrollmentToken ? { enrollment_token: enrollmentToken } : {};
    try {
      const { data: options } = await apiService.passkeyRegisterOptions(pass);
      const credential = await createPasskey(options);
      const { data } = await apiService.passkeyRegisterVerify({ ...pass, credential });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        passkeyFailure(error, "We couldn't set up a passkey on this device. Please try again.")
      );
    }
  }
);
// Sign in with a passkey instead of an OTP (usernameless: the browser
// offers whichever Help OO Help passkeys it has).
export const loginWithPasskey = createAsyncThunk(
  "auth/loginWithPasskey",
  async (_, thunkAPI) => {
    try {
      const { data: start } = await apiService.passkeyLoginOptions();
      const credential = await getPasskey(start.options);
      const { data } = await apiService.passkeyLoginVerify({
        flow_id: start.flow_id,
        credential,
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        passkeyFailure(error, "We couldn't sign you in with a passkey. Please use your phone number.")
      );
    }
  }
);
export const requestOTP = createAsyncThunk(
  "auth/requestOTP",
  async (data, thunkAPI) => {
    try {
      const response = await apiService.generateRegister(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { error: error.message });
    }
  }
);
export const forgottenPasswordRequest = createAsyncThunk(
  "auth/forgottenPassword",
  async (data, thunkAPI) => {
    try {
      const response = await apiService.forgottenEmail(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const confirmPasswordRequest = createAsyncThunk(
  "auth/confirmPassword",
  async (data, thunkAPI) => {
    try {
      const response = await apiService.confirmPassword(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  accessToken: null,
  refreshToken: null,
  first_name: null,
  last_name: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  email: "",
  country_code: "",
  phone_number: "",
  // Set between a correct OTP and step 3 (passkey) — see hasPendingEnrollment.
  enrollmentToken: null,
  enrollmentIssuedAt: null,
};

// Every finished sign-in ({next_step: "complete", user, token, refresh}).
const completeSignIn = (state, { user, token, refresh }) => {
  state.accessToken = token;
  state.refreshToken = refresh;
  state.first_name = user.first_name;
  state.last_name = user.last_name;
  state.isAuthenticated = true;
  state.enrollmentToken = null;
  state.enrollmentIssuedAt = null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    setforgottenPasswordRequest(state, action) {
      state.email = action.payload;
    },
    setConfirmPassword(state, action) {
      state.password = action.payload;
    },
    setPhoneNumbers(state, action) {
      state.country_code = action.payload.country_code;
      state.phone_number = action.payload.phone_number;
    },
    userState: (state, action) => {
      const { first_name, last_name } = action.payload;
      state.first_name = first_name;
      state.last_name = last_name;
      state.isAuthenticated = true;
    },
    clearEnrollment: (state) => {
      state.enrollmentToken = null;
      state.enrollmentIssuedAt = null;
    },
    logout: (state) => {
      state.enrollmentToken = null;
      state.enrollmentIssuedAt = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.first_name = null;
      state.last_name = null;
      state.isAuthenticated = false;
      state.loading = false;
      // return initialState;
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const { access, refresh } = action.payload.data.tokens.tokens;
        state.accessToken = access;
        state.refreshToken = refresh;
        state.first_name = action.payload.data.first_name;
        state.last_name = action.payload.data.last_name;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.enrollmentToken = null;
        state.enrollmentIssuedAt = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.first_name = null;
        state.last_name = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        const { access, refresh } = action.payload.tokens;
        state.accessToken = access;
        state.refreshToken = refresh;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify phone_number
      .addCase(verifyPhoneNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhoneNumber.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyPhoneNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify phone_number OTP
      .addCase(verifyPhoneNumberOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhoneNumberOTP.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        if (data.next_step === "biometric_enrollment") {
          // Phone proven; no session until a passkey exists (step 3).
          state.enrollmentToken = data.enrollment_token;
          state.enrollmentIssuedAt = Date.now();
          state.first_name = data.user.first_name;
          state.last_name = data.user.last_name;
          return;
        }
        completeSignIn(state, data);
      })
      .addCase(verifyPhoneNumberOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Passkey: step 3, and passkey sign-in
      .addCase(registerPasskey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerPasskey.fulfilled, (state, action) => {
        state.loading = false;
        completeSignIn(state, action.payload);
      })
      .addCase(registerPasskey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload?.code === "enrollment_expired") {
          state.enrollmentToken = null;
          state.enrollmentIssuedAt = null;
        }
      })
      .addCase(loginWithPasskey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPasskey.fulfilled, (state, action) => {
        state.loading = false;
        completeSignIn(state, action.payload);
      })
      .addCase(loginWithPasskey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // request otp
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Request ForgottenPassword
      .addCase(forgottenPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgottenPasswordRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgottenPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Confirm Password
      .addCase(confirmPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPasswordRequest.fulfilled, (state) => {
        state.loading = false;
        const { access, refresh } = action.payload;
        state.accessToken = access;
        state.refreshToken = refresh;
      })
      .addCase(confirmPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // .addCase(resetAllSlices, () => initialState);
  },
});

export const {
  clearEnrollment,
  logout,
  refreshToken,
  setEmail,
  setConfirmPassword,
  setforgottenPasswordRequest,
  setPhoneNumbers,
  userState,
} = authSlice.actions;
export default authSlice.reducer;
