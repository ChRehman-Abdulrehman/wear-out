import { createSlice, createAction } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    email: null,
  },
  reducers: {
    login: (state, action) => {
      const { token, email } = action.payload;
      state.token = token;
      state.email = email;
      localStorage.setItem('wearout_admin_token', token);
      localStorage.setItem('wearout_admin_email', email);
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      localStorage.removeItem('wearout_admin_token');
      localStorage.removeItem('wearout_admin_email');
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem('wearout_admin_token');
      const email = localStorage.getItem('wearout_admin_email');
      if (token) state.token = token;
      if (email) state.email = email;
    },
  },
});

export const { login, logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;