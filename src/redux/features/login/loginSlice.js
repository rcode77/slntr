import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  loginPopup: false,
  registerPopup: false,
  surveyPopup: Cookies.get("survey") ? false : true,
};

export const login = createSlice({
  name: "loginModal",
  initialState,
  reducers: {
    setLoginPopup: (state, { payload }) => {
      state.loginPopup = payload;
    },
    setRegisterPopup: (state, { payload }) => {
      state.registerPopup = payload;
    },
    setSurveyPopup: (state, { payload }) => {
      state.surveyPopup = payload;
    },
  },
});

export const { setLoginPopup, setRegisterPopup, setSurveyPopup } =
  login.actions;

export default login.reducer;
