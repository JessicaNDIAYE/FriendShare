import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action) {
      state.userId = action.payload.userId;
      state.loading = false;
      state.error = null;
    },
    registerFail(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { registerStart, registerSuccess, registerFail } = authSlice.actions;
export default authSlice.reducer;
