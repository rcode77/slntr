import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  token: Cookies.get("user-token") ?? null,
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload.login.user;
      state.token = payload.login.token;

      Cookies.set("user", JSON.stringify(payload.login.user));
      Cookies.set("user-token", payload.login.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      Cookies.remove("user");
      Cookies.remove("user-token");
    },
  },
});

export const { setUser, logout } = counterSlice.actions;

export default counterSlice.reducer;
