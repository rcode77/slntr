import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setCount: (state, { payload }) => {
      state.count = payload;
    },
  },
});

export const { setCount } = testSlice.actions;

export default testSlice.reducer;
