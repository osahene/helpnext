import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: { loading: false },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setGlobalLoading } = globalSlice.actions;
export default globalSlice.reducer;
