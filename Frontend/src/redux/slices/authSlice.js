import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/api';

// Async Thunk for Login
export const executeLogin = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {

      const response = await API.post('/auth/login', credentials);

      localStorage.setItem(
        'user_state',
        JSON.stringify(response.data)
      );

      return response.data;

    } catch (err) {

      return rejectWithValue(
        err.response?.data?.message || 'Login Failed'
      );

    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user_state'))?.user || null,
  token: JSON.parse(localStorage.getItem('user_state'))?.token || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {

    logoutUser: (state) => {

      state.user = null;
      state.token = null;

      localStorage.removeItem('user_state');

    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(executeLogin.pending, (state) => {

        state.loading = true;

      })

      .addCase(executeLogin.fulfilled, (state, action) => {

        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;

      })

      .addCase(executeLogin.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });

  },

});

export const { logoutUser } = authSlice.actions;

export default authSlice.reducer;