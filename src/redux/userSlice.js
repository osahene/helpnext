import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@/utils/axios";

export const createContact = createAsyncThunk(
  "contact",
  async (data, thunkAPI) => {
    try {
      const res = await apiService.createRelation(data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const approveContact = createAsyncThunk(
  "contact",
  async (data, thunkAPI) => {
    try {
      const res = await apiService.approveDependant(data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const rejectContact = createAsyncThunk(
  "contact",
  async (data, thunkAPI) => {
    try {
      const res = await apiService.rejectDependant(data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const EditContact = createAsyncThunk(
  "contact",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.updateContact(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const DeleteContact = createAsyncThunk(
  "contact",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.deleteContact(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const GetContact = createAsyncThunk(
  "contact",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.getMyContacts(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const GetDependants = createAsyncThunk(
  "contact",
  async (userData, thunkAPI) => {
    try {
      const res = await apiService.getMyDependants(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.res.data);
    }
  }
);
export const ContactInfo = createAsyncThunk(
  "contact",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await apiService.contactInfo(userData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.res.data);
    }
  }
);
export const Invite = createAsyncThunk(
  "contact",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.inviteStatus(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const Trigger = createAsyncThunk(
  "contact",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.triggerAlert(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  first_name: null,
  last_name: null,
  email: null,
  phone_number: null,
  relation: null,
  status: null,
  error: null,
};

export const ContactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
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
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder;
    // Login User
    //   .addCase(loginUser.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(loginUser.fulfilled, (state, action) => {
    //     state.loading = false;
    //     const { access, refresh } = action.payload;
    //     state.accessToken = access;
    //     state.refreshToken = refresh;
    //   })
    //   .addCase(loginUser.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   // Register User
    //   .addCase(registerUser.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(registerUser.fulfilled, (state) => {
    //     state.loading = false;
    //   })
    //   .addCase(registerUser.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   // Verify Email
    //   .addCase(verifyEmail.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(verifyEmail.fulfilled, (state, action) => {
    //     state.loading = false;
    //     const { access, refresh } = action.payload;
    //     state.accessToken = access;
    //     state.refreshToken = refresh;
    //   })
    //   .addCase(verifyEmail.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   // Verify phone_number
    //   .addCase(verifyPhoneNumber.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(verifyPhoneNumber.fulfilled, (state) => {
    //     state.loading = false;
    //   })
    //   .addCase(verifyPhoneNumber.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   // Verify phone_number OTP
    //   .addCase(verifyPhoneNumberOTP.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(verifyPhoneNumberOTP.fulfilled, (state, action) => {
    //     state.loading = false;
    //     const { access, refresh } = action.payload;
    //     state.accessToken = access;
    //     state.refreshToken = refresh;
    //   })
    //   .addCase(verifyPhoneNumberOTP.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   })
    //   // request otp
    //   .addCase(requestOTP.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(requestOTP.fulfilled, (state) => {
    //     state.loading = false;
    //   })
    //   .addCase(requestOTP.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   });
  },
});

export const { logout, refreshToken, setEmail, setPhoneNumbers, userState } =
  ContactSlice.actions;
export default ContactSlice.reducer;
