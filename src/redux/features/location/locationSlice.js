import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  lonLat: null,
  locationKab: null,
  locationProv: null,
  locationFilter: false,
  realCoordinate: null,
  savedLoc: false,
  defaultMap: false,
  locationParams: Cookies.get("_loc") ? JSON.parse(Cookies.get("_loc")) : null,
  loadingMap: false,
  utcProv: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLonLat: (state, { payload }) => {
      state.lonLat = payload;
    },
    setLocationKab: (state, { payload }) => {
      state.locationKab = payload;
    },
    setLocationProv: (state, { payload }) => {
      state.locationProv = payload;
    },
    setLocationFilter: (state, { payload }) => {
      state.locationFilter = payload;
    },
    setRealCoordinate: (state, { payload }) => {
      state.realCoordinate = payload;
    },
    setSavedLoc: (state, { payload }) => {
      state.savedLoc = payload;
    },
    setDefaultMap: (state, { payload }) => {
      state.defaultMap = payload;
    },
    setLocationParams: (state, { payload }) => {
      state.locationParams = payload;
      Cookies.set("_loc", JSON.stringify(payload));
    },
    setLoadingMap: (state, { payload }) => {
      state.loadingMap = payload;
    },
    setUtcProv: (state, { payload }) => {
      state.utcProv = payload;
    },
  },
});

export const {
  setLonLat,
  setLocationKab,
  setLocationProv,
  setLocationFilter,
  setRealCoordinate,
  setSavedLoc,
  setDefaultMap,
  setLocationParams,
  setLoadingMap,
  setUtcProv,
} = locationSlice.actions;

export default locationSlice.reducer;
