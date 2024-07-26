import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./features/auth/authSlice";
import TestSlice from "./features/test/testSlice";
import LocationSlice from "./features/location/locationSlice";
import LoginSlice from "./features/login/loginSlice";
import toastSlice from "./features/toast/toastSlice";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    test: TestSlice,
    location: LocationSlice,
    popup: LoginSlice,
    toast: toastSlice,
  },
});
