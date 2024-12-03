import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/utils/axios";
import { redirect } from "next/navigation";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    const res = await apiService.register(userData);
    if (res.status === 200) {
      // return res.data;
      redirect("/auth/verifyEmail");
    } else {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (userData, thunkAPI) => {
    const res = await apiService.verifyEmail(userData);
    if (res.status === 200) {
      // return res.data;
      redirect("/auth/verifyPhoneNumber");
    } else {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const verifyPhoneNumber = createAsyncThunk(
  "auth/verifyPhoneNumber",
  async (userData, thunkAPI) => {
    const res = await apiService.VerifyPhoneNumber(userData);
    if (res.status === 200) {
      // return res.data;
      redirect("/auth/verifyPhoneNumberOTP");
    } else {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const verifyPhoneNumberOTP = createAsyncThunk(
  "auth/verifyPhoneNumberOTP",
  async (userData, thunkAPI) => {
    const res = await apiService.VerifyPhoneNumberOTP(userData);
    if (res.status === 200) {
      // return res.data;
      redirect("/");
    } else {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const requestOTP = createAsyncThunk(
  "auth/verifyEmail",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.generate(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);

const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { login, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
