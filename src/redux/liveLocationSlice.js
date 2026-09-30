import { createSlice } from "@reduxjs/toolkit";

// Pure UI state only — the actual polling/geolocation side effects live in
// src/utils/liveLocation.js (mirrors how scheduleTokenRefresh in
// axiosInstance.js keeps a plain setInterval outside Redux and only
// dispatches into it). A setInterval/setTimeout handle isn't serializable,
// so it can't live in this slice's state.
const initialState = {
  active: false,
  alertId: null,
  expiresAt: null, // ISO string
};

const liveLocationSlice = createSlice({
  name: "liveLocation",
  initialState,
  reducers: {
    liveLocationStarted(state, action) {
      state.active = true;
      state.alertId = action.payload.alertId;
      state.expiresAt = action.payload.expiresAt ?? null;
    },
    liveLocationStopped(state) {
      state.active = false;
      state.alertId = null;
      state.expiresAt = null;
    },
  },
});

export const { liveLocationStarted, liveLocationStopped } = liveLocationSlice.actions;
export default liveLocationSlice.reducer;
