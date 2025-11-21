import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  isLoggedIn: false,
};

export const accessSlice = createSlice({
  name: "accessSlice",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
    removeToken: (state) => {
      state.token = "";
      state.isLoggedIn = false;
    },
  },
});

export const { setToken, removeToken } = accessSlice.actions;

export default accessSlice.reducer;
