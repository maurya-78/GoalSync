import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Load persisted user
const persistedUser = (() => {
  try { return JSON.parse(localStorage.getItem('gs_user')); } catch { return null; }
})();
const persistedToken = localStorage.getItem('gs_token');

// ─── Thunks 
export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.register(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.login(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try { await authService.logout(); } catch { /* ignore */ }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.updateProfile(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.changePassword(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to change password');
  }
});

// ─── Slice 
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedUser,
    token: persistedToken,
    isAuthenticated: !!(persistedUser && persistedToken),
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setInitialized: (state) => { state.initialized = true; },
  },
  extraReducers: (builder) => {
    const setAuth = (state, action) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('gs_user', JSON.stringify(action.payload.user));
      localStorage.setItem('gs_token', action.payload.token);
    };
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setError = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(registerUser.pending, setLoading)
      .addCase(registerUser.fulfilled, setAuth)
      .addCase(registerUser.rejected, setError)
      .addCase(loginUser.pending, setLoading)
      .addCase(loginUser.fulfilled, setAuth)
      .addCase(loginUser.rejected, setError)
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('gs_user');
        localStorage.removeItem('gs_token');
      })
      .addCase(fetchMe.pending, setLoading)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.initialized = true;
        localStorage.setItem('gs_user', JSON.stringify(action.payload.user));
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('gs_user');
        localStorage.removeItem('gs_token');
      })
      .addCase(updateProfile.pending, setLoading)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload.user };
        localStorage.setItem('gs_user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, setError)
      .addCase(changePassword.pending, setLoading)
      .addCase(changePassword.fulfilled, setAuth)
      .addCase(changePassword.rejected, setError);
  },
});

export const { clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
