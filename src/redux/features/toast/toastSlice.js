import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  success: null,
  failed: null,
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    setSuccess: (state, { payload }) => {
      state.success = payload.message;
    },

    setFailed: (state, { payload }) => {
      state.failed = payload.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSuccess, setFailed } = toastSlice.actions;

export default toastSlice.reducer;
