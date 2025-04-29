import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/utils/axios";

// Helper functions for common patterns
const createAuthThunk = (name, apiCall) =>
  createAsyncThunk(`auth/${name}`, async (data, { rejectWithValue }) => {
    try {
      const res = await apiCall(data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  });

const handleAuthSuccess = (state, action) => {
  const { tokens, first_name, last_name, email } =
    action.payload.data || action.payload;
  if (tokens) {
    state.accessToken = tokens.access;
    state.refreshToken = tokens.refresh;
  }
  if (first_name) state.first_name = first_name;
  if (last_name) state.last_name = last_name;
  if (email) state.email = email;
  state.isAuthenticated = true;
  state.loading = false;
  state.error = null;
};

const handlePendingState = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejectedState = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// Thunks
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleToken, thunkAPI) => {
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
        return thunkAPI.fulfillWithValue({
          status: "redirect",
          redirectUrl: error.response.data.redirect_next_url,
          tempAuthData,
        });
      }
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTempAuthData: (state, action) => {
      const { tokens, user } = action.payload;
      state.accessToken = tokens.access;
      state.refreshToken = tokens.refresh;
      state.first_name = user.first_name;
      state.last_name = user.last_name;
      state.email = user.email;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setforgottenPasswordRequest: (state, action) => {
      state.email = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.password = action.payload;
    },
    setPhoneNumbers: (state, action) => {
      state.phone_number = action.payload;
    },
    userState: (state, action) => {
      console.log("userState action payload", action.payload);
      const { first_name, last_name } = action.payload;
      state.first_name = first_name;
      state.last_name = last_name;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Common pending state for all async actions
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        handlePendingState
      )

      // Common rejected state for all async actions
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        handleRejectedState
      )

      // Google Login specific handling
      .addCase(googleLogin.fulfilled, (state, action) => {
        if (action.payload?.status === "redirect") {
          state.redirectUrl = action.payload.redirectUrl;
          const { tokens, user } = action.payload.tempAuthData;
          state.accessToken = tokens.access;
          state.refreshToken = tokens.refresh;
          state.first_name = user.first_name;
          state.last_name = user.last_name;
          state.email = user.email;
        } else {
          handleAuthSuccess(state, action);
        }
      })

      // Actions that set auth state on success
      .addMatcher(
        (action) =>
          [
            loginUser.fulfilled.type,
            verifyEmail.fulfilled.type,
            verifyPhoneNumberOTP.fulfilled.type,
            confirmPasswordRequest.fulfilled.type,
          ].includes(action.type),
        handleAuthSuccess
      )

      // Actions that just need to set loading to false on success
      .addMatcher(
        (action) =>
          [
            logoutUser.fulfilled.type,
            registerUser.fulfilled.type,
            verifyPhoneNumber.fulfilled.type,
            requestOTP.fulfilled.type,
            forgottenPasswordRequest.fulfilled.type,
          ].includes(action.type),
        (state) => {
          state.loading = false;
          state.error = null;
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
} = authSlice.actions;
export default authSlice.reducer;
