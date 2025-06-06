import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetAllSlices } from "./rootActions";
import apiService from "@/utils/axios";

export const createContact = createAsyncThunk(
  "contact/createcontact",
  async (data, thunkAPI) => {
    try {
      const response = await apiService.createRelation(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const approveContact = createAsyncThunk(
  "contact/approvecontact",
  async (data, thunkAPI) => {
    try {
      const response = await apiService.approveDependant({ id: data });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const rejectContact = createAsyncThunk(
  "contact/rejectcontact",
  async (data, thunkAPI) => {
    try {
      const response = await apiService.rejectDependant({ id: data });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const EditContactInfo = createAsyncThunk(
  "contact/editcontact",
  async (data, thunkAPI) => {
    try {
      const response = await apiService.updateContact(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const DeleteContact = createAsyncThunk(
  "contact/deletecontact",
  async (data, thunkAPI) => {
    try {
      await apiService.deleteContact(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const GetContact = createAsyncThunk(
  "contact/getcontact",
  async (_, thunkAPI) => {
    try {
      const response = await apiService.getMyContacts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const GetDependants = createAsyncThunk(
  "contact/getdependants",
  async (_, thunkAPI) => {
    try {
      const response = await apiService.getMyDependants();
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const ContactInfo = createAsyncThunk(
  "contact/contactinfo",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.contactInfo(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const Invite = createAsyncThunk(
  "contact/invite",
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
  "contact/trigger",
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
  contacts: [],
  contactDetails: [],
  dependants: [],
  error: null,
  loadData: "idle",
};

const ContactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Contact
      .addCase(createContact.pending, (state) => {
        state.loadData = "loading";
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loadData = "success";
        state.contacts = [...state.contacts, action.payload];
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })

      // Emergency List
      // Edit contact
      .addCase(EditContactInfo.pending, (state) => {
        state.loadData = "loading";
        state.error = null;
      })
      .addCase(EditContactInfo.fulfilled, (state, action) => {
        state.loadData = "success";
        state.contacts = state.contacts.map((contact) =>
          contact.pk === action.payload.pk ? action.payload : contact
        );
      })
      .addCase(EditContactInfo.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Delete contact
      .addCase(DeleteContact.pending, (state) => {
        state.loadData = "loading";
        state.error = null;
      })
      .addCase(DeleteContact.fulfilled, (state, action) => {
        state.loadData = "success";
        state.contacts = state.contacts.filter(
          (contact) => contact.pk !== action.payload
        );
      })
      .addCase(DeleteContact.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Get contact
      .addCase(GetContact.pending, (state) => {
        state.loadData = "loading";
      })
      .addCase(GetContact.fulfilled, (state, action) => {
        state.loadData = "success";
        state.contacts = action.payload.data.results;
      })
      .addCase(GetContact.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Dependants List
      // Get Dependants
      .addCase(GetDependants.pending, (state) => {
        state.loadData = "loading";
      })
      .addCase(GetDependants.fulfilled, (state, action) => {
        state.loadData = "success";
        state.dependants = action.payload;
      })
      .addCase(GetDependants.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Approve Contact
      .addCase(approveContact.pending, (state) => {
        state.loadData = "loading";
        state.error = null;
      })
      .addCase(approveContact.fulfilled, (state, action) => {
        state.loadData = "success";
        state.dependants = state.dependants.filter(
          (dependant) => dependant.pk !== action.payload
        );
      })
      .addCase(approveContact.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Reject contact
      .addCase(rejectContact.pending, (state) => {
        state.loadData = "loading";
        state.error = null;
      })
      .addCase(rejectContact.fulfilled, (state, action) => {
        state.loadData = "success";
        state.dependants = state.dependants.filter(
          (dependant) => dependant.pk !== action.payload
        );
      })
      .addCase(rejectContact.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Get contact info during invite
      .addCase(ContactInfo.pending, (state) => {
        state.loadData = "loading";
      })
      .addCase(ContactInfo.fulfilled, (state, action) => {
        state.loadData = "success";
        state.contactDetails = action.payload;
      })
      .addCase(ContactInfo.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Invitation process
      .addCase(Invite.pending, (state) => {
        state.loadData = "loading";
      })
      .addCase(Invite.fulfilled, (state) => {
        state.loadData = "success";
      })
      .addCase(Invite.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Trigger Alert
      .addCase(Trigger.pending, (state) => {
        state.loadData = "loading";
      })
      .addCase(Trigger.fulfilled, (state) => {
        state.loadData = "success";
      })
      .addCase(Trigger.rejected, (state, action) => {
        state.loadData = "failed";
        state.error = action.payload;
      })
      // Add this at the end
      .addCase(resetAllSlices, () => initialState);
  },
});

export default ContactSlice.reducer;
