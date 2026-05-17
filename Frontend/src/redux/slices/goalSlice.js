import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/authService';

export const fetchMyGoals = createAsyncThunk('goals/fetch', async () => {
  const response = await API.get('/goals/sheet');
  return response.data;
});

const goalSlice = createSlice({
  name: 'goals',
  initialState: { items: [], status: 'idle', totalWeightage: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGoals.fulfilled, (state, action) => {
        state.items = action.payload.goals;
        state.totalWeightage = action.payload.goals.reduce((sum, g) => sum + g.weightage, 0);
      });
  },
});

export default goalSlice.reducer;