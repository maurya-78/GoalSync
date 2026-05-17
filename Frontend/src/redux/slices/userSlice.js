import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/authService';

export const fetchTeam = createAsyncThunk('users/fetchTeam', async () => {
  const response = await API.get('/management/dashboard');
  return response.data.teamMembers;
});

const userSlice = createSlice({
  name: 'users',
  initialState: { team: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTeam.fulfilled, (state, action) => {
      state.team = action.payload;
    });
  },
});

export default userSlice.reducer;