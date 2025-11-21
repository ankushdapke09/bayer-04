import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const staffsSlice = createSlice({
  name: "staffs",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    }
  },
});

export const { increment } = staffsSlice.actions;

export default staffsSlice.reducer;
