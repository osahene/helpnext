import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import apiService from "@/utils/axios";

// Helper function to handle common async thunk patterns
const createAuthThunk = (name, apiCall) =>
  createAsyncThunk(`auth/${name}`, async (data, { rejectWithValue }) => {
    try {
      const response = await apiCall(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  });

// Special case for googleLogin due to its unique requirements
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleToken, { fulfillWithValue, rejectWithValue }) => {
    try {
      const cleanToken = googleToken.replace(/^"|"$/g, "");
      const res = await apiService.googleLog(
        JSON.stringify({ id_token: cleanToken })
      );

      return res.data;
    } catch (error) {
      if (error.response?.status === 307) {
        const tempAuthData = {
          tokens: error.response.data.data.token,
          user: {
            email: error.response.data.data.email,
            first_name: error.response.data.data.first_name,
            last_name: error.response.data.data.last_name,
          },
        };
        return fulfillWithValue({
          status: "redirect",
          redirectUrl: error.response.data.redirect_next_url,
          tempAuthData,
        });
      }
      return rejectWithValue(error);
    }
  }
);

// Standard thunks using the helper function
export const loginUser = createAuthThunk("login", apiService.login);
export const logoutUser = createAuthThunk("logout", apiService.logout);
export const registerUser = createAuthThunk("register", apiService.register);
export const verifyEmail = createAuthThunk(
  "verifyEmail",
  apiService.verifyEmail
);
export const verifyPhoneNumber = createAuthThunk(
  "verifyPhoneNumber",
  apiService.VerifyPhoneNumber
);
export const verifyPhoneNumberOTP = createAuthThunk(
  "verifyPhoneNumberOTP",
  apiService.VerifyPhoneNumberOTP
);
export const requestOTP = createAuthThunk(
  "requestOTP",
  apiService.generateRegister
);
export const forgottenPasswordRequest = createAuthThunk(
  "forgottenPassword",
  apiService.forgottenEmail
);
export const confirmPasswordRequest = createAuthThunk(
  "confirmPassword",
  apiService.confirmPassword
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
  phone_number: "",
  redirectUrl: null,
};

// Helper functions for state updates
const handleAuthSuccess = (state, { tokens, user }) => {
  state.accessToken = tokens?.access || null;
  state.refreshToken = tokens?.refresh || null;
  state.isAuthenticated = true;

  if (user) {
    state.first_name = user.first_name;
    state.last_name = user.last_name;
    state.email = user.email;
  }
};

const resetAuthState = (state) => {
  state.accessToken = null;
  state.refreshToken = null;
  state.first_name = null;
  state.last_name = null;
  state.isAuthenticated = false;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTempAuthData: (state, { payload: { tokens, user } }) => {
      handleAuthSuccess(state, { tokens, user });
    },
    setEmail: (state, { payload }) => {
      state.email = payload;
    },
    setforgottenPasswordRequest: (state, { payload }) => {
      state.email = payload;
    },
    setConfirmPassword: (state, { payload }) => {
      state.password = payload;
    },
    setPhoneNumbers: (state, { payload }) => {
      state.phone_number = payload;
    },
    userState: (state, { payload: { first_name, last_name } }) => {
      state.first_name = first_name;
      state.last_name = last_name;
      state.isAuthenticated = true;
    },
    logout: resetAuthState,
    refreshToken: (state, { payload: { accessToken, refreshToken } }) => {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Common loading and error handling
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Google Login
      .addCase(googleLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload?.status === "redirect") {
          state.redirectUrl = payload.redirectUrl;
          handleAuthSuccess(state, payload.tempAuthData);
        } else {
          handleAuthSuccess(state, {
            tokens: payload.data?.tokens,
            user: {
              first_name: payload.data?.first_name,
              last_name: payload.data?.last_name,
            },
          });
        }
      })

      // Login User
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        handleAuthSuccess(state, { tokens: payload.data?.tokens });
      })

      // Logout User
      .addCase(logoutUser.fulfilled, resetAuthState)

      // Verify Email
      .addCase(verifyEmail.fulfilled, (state, { payload }) => {
        state.loading = false;
        handleAuthSuccess(state, { tokens: payload });
      })

      // Verify Phone Number OTP
      .addCase(verifyPhoneNumberOTP.fulfilled, (state, { payload }) => {
        state.loading = false;
        handleAuthSuccess(state, { tokens: payload });
      })

      // Confirm Password
      .addCase(confirmPasswordRequest.fulfilled, (state, { payload }) => {
        state.loading = false;
        handleAuthSuccess(state, { tokens: payload });
      })

      // Other fulfilled cases that just need to set loading to false
      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          ![
            "googleLogin",
            "loginUser",
            "verifyEmail",
            "verifyPhoneNumberOTP",
            "confirmPasswordRequest",
          ].some((type) => action.type.includes(type)),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const {
  logout,
  refreshToken,
  setEmail,
  setConfirmPassword,
  setforgottenPasswordRequest,
  setPhoneNumbers,
  userState,
  setTempAuthData,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
