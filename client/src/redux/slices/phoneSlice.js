import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authorization } from "../../auth/auth";
import axios from "axios";
export const fetchPhone = createAsyncThunk("user/fetchPhone", async () => {
  const phones = await new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/phones`,
        authorization()
      );
      resolve(res.data);
    } catch (error) {
      reject(error.response.data);
    }
  });
  console.log(phones);
  return phones;
});
const phoneSlice = createSlice({
  name: "phones",
  initialState: {
    loading: false,
    data: [],
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchPhone.pending]: (state) => {
      state.loading = true;
    },
    [fetchPhone.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [fetchPhone.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
  },
});
const { actions, reducer } = phoneSlice;
export default reducer;
