import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetAllSlices } from "./rootActions";
import apiService from "@/utils/axios";

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (googleToken, thunkAPI) => {
    try {
      const cleanToken = googleToken.replace(/^"|"$/g, "");
      const res = await apiService.googleLog(
        JSON.stringify({
          id_token: cleanToken,
        })
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
      console.log("Google Login Error:", error);

      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.login(userData);
      return res.data;
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
      const res = await apiService.logout();
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.register(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.verifyEmail(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const verifyPhoneNumber = createAsyncThunk(
  "auth/verifyPhoneNumber",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.VerifyPhoneNumber(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const verifyPhoneNumberOTP = createAsyncThunk(
  "auth/verifyPhoneNumberOTP",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.VerifyPhoneNumberOTP(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const requestOTP = createAsyncThunk(
  "auth/requestOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.generateRegister(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const forgottenPasswordRequest = createAsyncThunk(
  "auth/forgottenPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.forgottenEmail(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const confirmPasswordRequest = createAsyncThunk(
  "auth/confirmPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.confirmPassword(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
  phone_number: "",
};

const authSlice = createSlice({
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
      state.phone_number = action.payload;
    },
    userState: (state, action) => {
      const { first_name, last_name } = action.payload;
      state.first_name = first_name;
      state.last_name = last_name;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.first_name = null;
      state.last_name = null;
      state.isAuthenticated = false;
      state.loading = false;
      return initialState;
    },
    refreshToken: (state, action) => {
      console.log("refreshToken action", action);
      state.accessToken = action.payload.data.accessToken;
      state.refreshToken = action.payload.data.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.status === "redirect") {
          state.redirectUrl = action.payload.redirectUrl;
          const { tokens, user } = action.payload.tempAuthData;
          state.accessToken = tokens.access;
          state.refreshToken = tokens.refresh;
          state.first_name = user.first_name;
          state.last_name = user.last_name;
          state.email = user.email;
        } else {
          const { tokens, first_name, last_name } = action.payload.data;
          state.accessToken = tokens.access;
          state.refreshToken = tokens.refresh;
          state.first_name = first_name;
          state.last_name = last_name;
          state.isAuthenticated = true;
        }
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
        const { access, refresh } = action.payload;
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
        const { access, refresh } = action.payload;
        state.accessToken = access;
        state.refreshToken = refresh;
      })
      .addCase(verifyPhoneNumberOTP.rejected, (state, action) => {
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
      })
      .addCase(resetAllSlices, () => initialState);
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
