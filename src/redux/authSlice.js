import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/utils/axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.register(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
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
      return thunkAPI.rejectWithValue(error.res.data);
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
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const verifyPhoneNumberOTP = createAsyncThunk(
  "auth/verifyPhoneNumberOTP",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await apiService.VerifyPhoneNumberOTP(userData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.res.data);
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

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  email: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
    },
    login: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user or token
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
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        const { access, refresh } = action.payload;
        state.accessToken = access;
        state.refreshToken = refresh;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
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
      });
  },
});

export const { login, logout, refreshToken, setEmail } = authSlice.actions;
export default authSlice.reducer;
