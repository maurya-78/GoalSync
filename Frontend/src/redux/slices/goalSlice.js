import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import goalService from '../../services/goalService';

export const fetchGoals = createAsyncThunk('goals/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await goalService.getGoals(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch goals');
  }
});

export const createGoal = createAsyncThunk('goals/create', async (data, { rejectWithValue }) => {
  try {
    const res = await goalService.createGoal(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create goal');
  }
});

export const updateGoal = createAsyncThunk('goals/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await goalService.updateGoal(id, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update goal');
  }
});

export const deleteGoal = createAsyncThunk('goals/delete', async (id, { rejectWithValue }) => {
  try {
    await goalService.deleteGoal(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete goal');
  }
});

export const fetchAnalytics = createAsyncThunk('goals/analytics', async (_, { rejectWithValue }) => {
  try {
    const res = await goalService.getAnalytics();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const goalSlice = createSlice({
  name: 'goals',
  initialState: {
    goals: [],
    analytics: null,
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearGoalError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload.goals;
        state.totalCount = action.payload.count;
      })
      .addCase(fetchGoals.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.unshift(action.payload.goal);
        state.totalCount += 1;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const idx = state.goals.findIndex(g => g._id === action.payload.goal._id);
        if (idx !== -1) state.goals[idx] = action.payload.goal;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(g => g._id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload.analytics;
      });
  },
});

export const { clearGoalError } = goalSlice.actions;
export default goalSlice.reducer;
