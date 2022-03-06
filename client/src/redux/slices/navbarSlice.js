import { createSlice } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    loading: false,
    value: null,
    error: null,
  },
  reducers: {
    changeNavbar: (state, action) => {
      state.value = action.payload;
    },
  },
});
const { reducer } = navbarSlice;
export const { changeNavbar } = navbarSlice.actions;
export default reducer;
