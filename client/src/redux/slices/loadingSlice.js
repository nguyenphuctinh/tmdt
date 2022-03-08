import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    value: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.value = action.payload;
    },
  },
});
const { reducer } = loadingSlice;
export const { setLoading } = loadingSlice.actions;
export default reducer;
